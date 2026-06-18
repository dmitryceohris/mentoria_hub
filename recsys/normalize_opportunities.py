from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).parent / ".env")

OPENAI_KEY = os.environ.get("OPENAI_API_KEY") or os.environ.get("VITE_OPENAI_API_KEY")
IN_FILE = Path(__file__).parent / "opportunities.json"
PUBLIC_COPY = Path(__file__).parent.parent / "public" / "recsys" / "opportunities.json"

CYRILLIC_PATTERN = tuple(chr(code) for code in range(0x0400, 0x0500))

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
    return not fields["title"] or not fields["description"] or any(has_cyrillic(value) for value in fields.values())


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
    }
    return json.dumps(payload, ensure_ascii=False)


def normalize_record(client: OpenAI, record: dict) -> dict:
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

    return {
        **record,
        "sourceLanguage": source_language,
        "sourceTitle": record.get("sourceTitle") or record.get("title") or "",
        "sourceDescription": record.get("sourceDescription") or record.get("description") or "",
        "sourceRequirements": record.get("sourceRequirements") or record.get("requirements") or "",
        "title": english.get("title") or record.get("title") or "Opportunity from source announcement",
        "description": english.get("description") or "Details are available in the source announcement.",
        "requirements": english.get("requirements") or "Review the source announcement for participation details.",
        "summary": english.get("summary") or english.get("description") or "Details are available in the source announcement.",
        "translations": {
            **(record.get("translations") or {}),
            "en": {
                "title": english.get("title") or "Opportunity from source announcement",
                "description": english.get("description") or "Details are available in the source announcement.",
                "requirements": english.get("requirements") or "Review the source announcement for participation details.",
                "summary": english.get("summary") or english.get("description") or "Details are available in the source announcement.",
            },
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=str(IN_FILE))
    parser.add_argument("--output", default=str(IN_FILE))
    parser.add_argument("--copy-public", action="store_true")
    args = parser.parse_args()

    if not OPENAI_KEY:
        raise SystemExit("OPENAI_API_KEY or VITE_OPENAI_API_KEY is required to normalize opportunities.")

    input_path = Path(args.input)
    output_path = Path(args.output)
    opportunities = json.loads(input_path.read_text(encoding="utf-8"))
    client = OpenAI(api_key=OPENAI_KEY)

    normalized = []
    for index, record in enumerate(opportunities, start=1):
      if needs_normalization(record):
          print(f"[{index}/{len(opportunities)}] normalizing {record.get('id')}")
          normalized.append(normalize_record(client, record))
      else:
          normalized.append(record)

    output_path.write_text(json.dumps(normalized, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.copy_public:
        PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(output_path, PUBLIC_COPY)
        print(f"Copied -> {PUBLIC_COPY}")


if __name__ == "__main__":
    main()
