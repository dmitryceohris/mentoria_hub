from __future__ import annotations

import argparse
import json
from pathlib import Path

CYRILLIC_PATTERN = tuple(chr(code) for code in range(0x0400, 0x0500))
DEFAULT_TITLE = "Opportunity from source announcement"
DEFAULT_DESCRIPTION = "Details are available in the source announcement."
DEFAULT_REQUIREMENTS = "Review the source announcement for participation details."


def has_cyrillic(value: str | None) -> bool:
    return bool(value and any(ch in value for ch in CYRILLIC_PATTERN))


def safe_english(value: str | None, fallback: str) -> str:
    value = (value or "").strip()
    return value if value and not has_cyrillic(value) else fallback


def rendered_fields(record: dict) -> dict[str, str]:
    english = (record.get("translations") or {}).get("en") or {}

    return {
        "title": safe_english(english.get("title") or record.get("title"), DEFAULT_TITLE),
        "description": safe_english(english.get("description") or record.get("description"), DEFAULT_DESCRIPTION),
        "requirements": safe_english(english.get("requirements") or record.get("requirements"), DEFAULT_REQUIREMENTS),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("path", nargs="?", default="public/recsys/opportunities.json")
    args = parser.parse_args()
    path = Path(args.path)
    records = json.loads(path.read_text(encoding="utf-8"))
    failures: list[str] = []

    for record in records:
        for field, value in rendered_fields(record).items():
            if has_cyrillic(value):
                failures.append(f"{record.get('id', '<missing id>')}.{field}: {value[:80]}")

    if failures:
        print("Rendered opportunity fields contain Cyrillic:")
        for failure in failures[:20]:
            print(f"- {failure}")
        raise SystemExit(1)

    print(f"OK: {len(records)} opportunity records render without Cyrillic display fields.")


if __name__ == "__main__":
    main()
