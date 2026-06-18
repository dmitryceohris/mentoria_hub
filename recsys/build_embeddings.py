"""
Build a semantic search index ("train the assistant") from opportunities.json.

This is NOT fine-tuning. For a small, frequently-changing dataset like the
Mentoria Telegram opportunities, fine-tuning is the wrong tool — it teaches a
model style/format, not changing facts, and the data goes stale immediately.

Instead we precompute an embedding (a numeric vector capturing meaning) for each
opportunity using OpenAI's text-embedding-3-small. At query time the frontend can
embed the student's question, compare it to these vectors (cosine similarity), and
send only the few most relevant opportunities to MentorLM — better answers AND far
fewer tokens than stuffing all 50 posts into every message.

Run:
    python build_embeddings.py
Output:
    opportunities_embeddings.json           (next to this script)
    ../public/recsys/opportunities_embeddings.json   (served to the frontend)
"""

import json
import os
import shutil
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).parent.parent / ".env")
load_dotenv(Path(__file__).parent / ".env")

OPENAI_KEY = os.environ.get("OPENAI_API_KEY") or os.environ.get("VITE_OPENAI_API_KEY")
MODEL = "text-embedding-3-small"   # cheap, 1536 dims, multilingual (RU/EN/KZ)

IN_FILE = Path(__file__).parent / "opportunities.json"
OUT_FILE = Path(__file__).parent / "opportunities_embeddings.json"
PUBLIC_COPY = Path(__file__).parent.parent / "public" / "recsys" / "opportunities_embeddings.json"

client = OpenAI(api_key=OPENAI_KEY) if OPENAI_KEY else None


def embedding_text(opp: dict) -> str:
    """The text we turn into a vector — what the search matches against."""
    english = (opp.get("translations") or {}).get("en") or {}
    parts = [
        english.get("title", ""),
        english.get("description", ""),
        english.get("requirements", ""),
        opp.get("title", ""),
        opp.get("category", ""),
        opp.get("direction", ""),
        " ".join(opp.get("tags", [])),
        opp.get("description", ""),
        opp.get("sourceTitle", ""),
        opp.get("sourceDescription", ""),
        opp.get("sourceRequirements", ""),
    ]
    return "\n".join(p for p in parts if p).strip()


def main() -> None:
    opportunities = json.loads(IN_FILE.read_text(encoding="utf-8"))
    texts = [embedding_text(o) for o in opportunities]

    if client is None:
        if not OUT_FILE.exists():
            raise SystemExit("OPENAI_API_KEY or VITE_OPENAI_API_KEY is required to create embeddings from scratch.")

        existing_payload = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        existing_by_id = {item["id"]: item for item in existing_payload.get("items", [])}
        dimensions = existing_payload.get("dimensions", 1536)
        items = []
        missing = []

        for opp in opportunities:
            existing = existing_by_id.get(opp["id"])
            if existing:
                items.append({
                    "id": opp["id"],
                    "title": opp.get("title", ""),
                    "embedding": existing["embedding"],
                })
            else:
                missing.append(opp["id"])
                items.append({
                    "id": opp["id"],
                    "title": opp.get("title", ""),
                    "embedding": [0.0] * dimensions,
                })

        payload = {
            "model": existing_payload.get("model", MODEL),
            "dimensions": dimensions,
            "items": items,
        }
        OUT_FILE.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(OUT_FILE, PUBLIC_COPY)
        print("OPENAI_API_KEY or VITE_OPENAI_API_KEY is not set; reused existing embeddings for matching IDs.")
        if missing:
            print(f"Warning: wrote zero-vector placeholders for missing IDs: {', '.join(missing)}")
        print(f"Saved {len(items)} vectors -> {OUT_FILE}")
        print(f"Copied -> {PUBLIC_COPY}")
        return

    print(f"Embedding {len(texts)} opportunities with {MODEL}...")
    # The embeddings endpoint accepts a batch, so this is a single API call.
    response = client.embeddings.create(model=MODEL, input=texts)

    index = []
    for opp, item in zip(opportunities, response.data):
        index.append({
            "id": opp["id"],
            "title": opp.get("title", ""),
            "embedding": item.embedding,   # list[float], length 1536
        })

    payload = {"model": MODEL, "dimensions": len(index[0]["embedding"]), "items": index}
    OUT_FILE.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")

    PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(OUT_FILE, PUBLIC_COPY)

    print(f"Saved {len(index)} vectors -> {OUT_FILE}")
    print(f"Copied -> {PUBLIC_COPY}")


def search_demo(query: str, top_k: int = 5) -> None:
    """Quick local test: python -c 'import build_embeddings as b; b.search_demo("physics olympiad")'"""
    import math

    if client is None:
        raise SystemExit("OPENAI_API_KEY or VITE_OPENAI_API_KEY is required for search_demo.")

    data = json.loads(OUT_FILE.read_text(encoding="utf-8"))
    q_vec = client.embeddings.create(model=MODEL, input=[query]).data[0].embedding

    def cosine(a, b):
        dot = sum(x * y for x, y in zip(a, b))
        na = math.sqrt(sum(x * x for x in a))
        nb = math.sqrt(sum(y * y for y in b))
        return dot / (na * nb) if na and nb else 0.0

    ranked = sorted(
        data["items"],
        key=lambda it: cosine(q_vec, it["embedding"]),
        reverse=True,
    )
    print(f'Top {top_k} for: "{query}"')
    for it in ranked[:top_k]:
        print(f'  {cosine(q_vec, it["embedding"]):.3f}  {it["title"]}')


if __name__ == "__main__":
    main()
