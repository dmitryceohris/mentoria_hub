from __future__ import annotations

import argparse
import json
import os
import re
import shutil
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).parent.parent / ".env")
load_dotenv(Path(__file__).parent / ".env")

OPENAI_KEY = os.environ.get("OPENAI_API_KEY") or os.environ.get("VITE_OPENAI_API_KEY")
IN_FILE = Path(__file__).parent / "opportunities.json"
PUBLIC_COPY = Path(__file__).parent.parent / "public" / "recsys" / "opportunities.json"

CYRILLIC_PATTERN = tuple(chr(code) for code in range(0x0400, 0x0500))
EMOJI_PATTERN = re.compile(r"[\U0001F000-\U0001FAFF\u2600-\u27BF\ufe0f\u200d]")
DEFAULT_TITLE = "Opportunity from source announcement"
DEFAULT_DESCRIPTION = "Details are available in the source announcement."
DEFAULT_REQUIREMENTS = "Review the source announcement for participation details."

HARD_NOISE_PATTERNS = (
    "telegram premium",
    "giveaway",
    "розыгрыш",
    "chat for communication",
    "communication chat",
    "faq",
    "site update",
    "website update",
    "чат для коммуникации",
    "обновление веб-сайта",
    "заполнение ячеек",
    "капитанов команды",
    "остаются считанные минуты",
    "дизлайки не ставим",
)

RESOURCE_PATTERNS = (
    "portfolio lab",
    "shineyourcv",
    "goglobal",
    "next step uni",
    "nextyou",
    "chotamoffer",
    "caass",
    "study resources",
    "study blog",
    "harvard university: overview",
    "sat exam overview",
    "free resources",
    "ivy league application essays",
    "канал для",
    "учёба за границей",
    "платформа для роста",
    "конкурсы и возможности для студентов",
)

GENERIC_TITLE_PATTERNS = (
    "opportunity opportunity",
    "competition opportunity",
    "event opportunity",
    "course opportunity",
    "scholarship opportunity",
    "volunteering opportunity",
    "test preparation resource",
)

SYSTEM_PROMPT = """You normalize educational opportunity records for Mentoria Hub.

Return STRICT JSON with this shape:
{
  "sourceLanguage": "en|ru|kk|unknown",
  "translations": {
    "en": {
      "title": "concise English display title, max 80 chars",
      "description": "concise English student-facing summary, 1-2 sentences",
      "requirements": "concise English eligibility/action details, 1 sentence",
      "summary": "concise English summary, 1 sentence"
    }
  }
}

Rules:
- Do not invent dates, prizes, organizations, links, or eligibility.
- Translate and summarize from the source text into English.
- If a detail is unclear, say to review the source announcement.
- Respond only with JSON, no markdown."""


def has_cyrillic(value: str | None) -> bool:
    return bool(value and any(ch in value for ch in CYRILLIC_PATTERN))


def has_emoji(value: str | None) -> bool:
    return bool(value and EMOJI_PATTERN.search(value))


def clean(value: str | None) -> str:
    return (value or "").strip()


def classify_source_kind(record: dict) -> str:
    existing = record.get("sourceKind")
    searchable = "\n".join(
        clean(record.get(field))
        for field in ("sourceTitle", "sourceDescription", "title", "description", "category", "direction")
    ).lower()

    if existing == "noise" or any(pattern in searchable for pattern in HARD_NOISE_PATTERNS):
        return "noise"
    if existing == "resource" or any(pattern in searchable for pattern in RESOURCE_PATTERNS):
        return "resource"
    return "actionable"


def display_fields(record: dict) -> dict:
    english = (record.get("translations") or {}).get("en") or {}
    return {
        "title": english.get("title") or record.get("title") or "",
        "description": english.get("description") or record.get("description") or "",
        "requirements": english.get("requirements") or record.get("requirements") or "",
        "summary": english.get("summary") or record.get("summary") or "",
    }


def needs_normalization(record: dict) -> bool:
    fields = display_fields(record)
    title = fields["title"].strip().lower()
    return (
        not fields["title"]
        or not fields["description"]
        or fields["description"] == DEFAULT_DESCRIPTION
        or fields["requirements"] == DEFAULT_REQUIREMENTS
        or len(fields["description"]) > 260
        or "\n" in fields["description"]
        or title in GENERIC_TITLE_PATTERNS
        or any(has_cyrillic(value) for value in fields.values())
        or any(has_emoji(value) for value in fields.values())
    )


def source_payload(record: dict) -> str:
    payload = {
        "id": record.get("id"),
        "sourceTitle": record.get("sourceTitle") or record.get("title"),
        "sourceDescription": record.get("sourceDescription") or record.get("description"),
        "sourceRequirements": record.get("sourceRequirements") or record.get("requirements"),
        "category": record.get("category"),
        "direction": record.get("direction"),
        "deadline": record.get("deadline"),
        "eventDate": record.get("eventDate"),
        "applyUrl": record.get("applyUrl"),
        "sourceKind": record.get("sourceKind"),
    }
    return json.dumps(payload, ensure_ascii=False)


def source_search_text(record: dict) -> str:
    return "\n".join(
        clean(record.get(field))
        for field in ("sourceTitle", "sourceDescription", "title", "description", "category", "direction")
    ).lower()


def fallback_title(record: dict, source_kind: str) -> str:
    searchable = source_search_text(record)
    category = clean(record.get("category")) or "Opportunity"
    direction = clean(record.get("direction")) or "General"
    if category == "Volunteering":
        return "International volunteering opportunity"
    if category == "Scholarship":
        return "Scholarship preparation opportunity"
    if category == "Research":
        return f"Research opportunity in {direction}"
    if "хакатон" in searchable or "hackathon" in searchable:
        return "Mentoria hackathon registration"
    if "nyu" in searchable or "nyuad" in searchable:
        return "NYUAD scholarship admissions webinar"
    if "ielts" in searchable or "toefl" in searchable or "sat" in searchable:
        return "Test preparation resource"
    if "волонт" in searchable or "volunteer" in searchable:
        return "International volunteering opportunity"
    if "grant" in searchable or "грант" in searchable:
        return "Grant and scholarship webinar"
    if "стипенд" in searchable or "scholarship" in searchable:
        return "Scholarship preparation opportunity"
    if "математ" in searchable or "math" in searchable:
        return "Mentoria mathematics stream"
    if source_kind == "resource":
        return f"Mentoria resource: {direction}"
    if category == "Opportunity" and direction == "General":
        return "Mentoria opportunity announcement"
    if category == "Opportunity":
        return f"Mentoria opportunity in {direction}"
    return f"{category} in {direction}"


def fallback_description(record: dict, source_kind: str) -> str:
    searchable = source_search_text(record)
    direction = clean(record.get("direction")) or "student development"
    category = clean(record.get("category")) or "opportunity"
    if category == "Volunteering":
        return "A volunteering listing for students who want to build community impact experience and strengthen their activity profile."
    if category == "Scholarship":
        return "A scholarship-related listing for students preparing applications, essays, and supporting materials."
    if category == "Research":
        return f"A research listing for students interested in {direction.lower()} projects, writing, and academic exploration."
    if "хакатон" in searchable or "hackathon" in searchable:
        return "A Mentoria hackathon listing for students interested in team projects, programming, and practical problem solving."
    if "nyu" in searchable or "nyuad" in searchable:
        return "An admissions webinar about scholarship pathways and application preparation for students targeting NYUAD or similar universities."
    if "волонт" in searchable or "volunteer" in searchable:
        return "A volunteering listing for students who want to build community impact experience and strengthen their activity profile."
    if "ielts" in searchable or "toefl" in searchable or "sat" in searchable:
        return "A test preparation resource for students working on English, SAT, IELTS, TOEFL, or university application readiness."
    if "grant" in searchable or "грант" in searchable or "стипенд" in searchable or "scholarship" in searchable:
        return "A scholarship or grant-related listing for students preparing applications, essays, and supporting materials."
    if "математ" in searchable or "math" in searchable:
        return "A Mentoria learning stream for students strengthening mathematics foundations for future academic opportunities."
    if source_kind == "resource":
        return "A Mentoria feed resource with more details available in the original announcement."
    return f"A Mentoria {category.lower()} listing for students interested in {direction.lower()} opportunities and preparation."


def fallback_requirements(source_kind: str) -> str:
    if source_kind == "resource":
        return "Open the source announcement to review how the resource can be used."
    return "Open the source announcement to confirm eligibility and application steps."


def is_generic_title(value: str) -> bool:
    return value.strip().lower() in GENERIC_TITLE_PATTERNS


def is_bad_body_text(value: str) -> bool:
    return (
        not value
        or has_cyrillic(value)
        or has_emoji(value)
        or len(value) > 260
        or "\n" in value
        or value in (DEFAULT_DESCRIPTION, DEFAULT_REQUIREMENTS)
    )


def ensure_english(value: str | None, fallback: str) -> str:
    value = clean(value)
    return value if value and not has_cyrillic(value) else fallback


def normalize_record(client: OpenAI | None, record: dict) -> dict:
    if client is None:
        return enrich_without_llm(record, force_body_fallback=True)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": source_payload(record)[:5000]},
        ],
    )
    normalized = json.loads(response.choices[0].message.content)
    english = (normalized.get("translations") or {}).get("en") or {}
    source_language = normalized.get("sourceLanguage") or record.get("sourceLanguage") or "unknown"
    source_kind = classify_source_kind(record)
    title = ensure_english(english.get("title"), fallback_title(record, source_kind))
    description = ensure_english(english.get("description"), fallback_description(record, source_kind))
    requirements = ensure_english(english.get("requirements"), fallback_requirements(source_kind))
    summary = ensure_english(english.get("summary") or english.get("description"), description)

    return {
        **record,
        "sourceLanguage": source_language,
        "sourceTitle": record.get("sourceTitle") or record.get("title") or "",
        "sourceDescription": record.get("sourceDescription") or record.get("description") or "",
        "sourceRequirements": record.get("sourceRequirements") or record.get("requirements") or "",
        "sourceKind": source_kind,
        "recommendationEligible": source_kind == "actionable",
        "title": title,
        "description": description,
        "requirements": requirements,
        "summary": summary,
        "translations": {
            **(record.get("translations") or {}),
            "en": {
                "title": title,
                "description": description,
                "requirements": requirements,
                "summary": summary,
            },
        },
    }


def enrich_without_llm(record: dict, force_body_fallback: bool = False) -> dict:
    source_kind = classify_source_kind(record)
    english = (record.get("translations") or {}).get("en") or {}
    raw_title = clean(english.get("title") or record.get("title"))
    raw_description = clean(english.get("description") or record.get("description"))
    raw_requirements = clean(english.get("requirements") or record.get("requirements"))
    raw_summary = clean(english.get("summary") or english.get("description") or record.get("summary"))
    title = (
        fallback_title(record, source_kind)
        if not raw_title or has_cyrillic(raw_title) or has_emoji(raw_title) or is_generic_title(raw_title)
        else raw_title
    )
    description = (
        fallback_description(record, source_kind)
        if force_body_fallback or is_bad_body_text(raw_description)
        else raw_description
    )
    requirements = (
        fallback_requirements(source_kind)
        if force_body_fallback or is_bad_body_text(raw_requirements)
        else raw_requirements
    )
    summary = fallback_description(record, source_kind) if force_body_fallback or is_bad_body_text(raw_summary) else raw_summary

    return {
        **record,
        "sourceKind": source_kind,
        "recommendationEligible": source_kind == "actionable",
        "title": title,
        "description": description,
        "requirements": requirements,
        "summary": summary,
        "translations": {
            **(record.get("translations") or {}),
            "en": {
                "title": title,
                "description": description,
                "requirements": requirements,
                "summary": summary,
            },
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=str(IN_FILE))
    parser.add_argument("--output", default=str(IN_FILE))
    parser.add_argument("--copy-public", action="store_true")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    opportunities = json.loads(input_path.read_text(encoding="utf-8"))
    client = OpenAI(api_key=OPENAI_KEY) if OPENAI_KEY else None
    if client is None:
        print("OPENAI_API_KEY or VITE_OPENAI_API_KEY is not set; using deterministic normalization fallback.")

    normalized = []
    for index, record in enumerate(opportunities, start=1):
        source_kind = classify_source_kind(record)
        if source_kind == "noise":
            print(f"[{index}/{len(opportunities)}] dropping noise {record.get('id')}")
            continue

        record = {**record, "sourceKind": source_kind, "recommendationEligible": source_kind == "actionable"}
        if needs_normalization(record):
            print(f"[{index}/{len(opportunities)}] normalizing {record.get('id')}")
            normalized.append(normalize_record(client, record))
        else:
            normalized.append(enrich_without_llm(record))

    output_path.write_text(json.dumps(normalized, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.copy_public:
        PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(output_path, PUBLIC_COPY)
        print(f"Copied -> {PUBLIC_COPY}")


if __name__ == "__main__":
    main()
