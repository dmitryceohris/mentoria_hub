"""Python semantic retrieval over the precomputed opportunity embeddings
(built by recsys/build_embeddings.py). Mirrors the old frontend retrieval so the
bot sends only the most relevant opportunities to the model.
"""

import json
import math
from pathlib import Path

from openai import OpenAI

from config import EMBED_MODEL, OPENAI_API_KEY

BASE = Path(__file__).parent.parent / "public" / "recsys"

_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
_opps: dict | None = None
_index: list | None = None


def _load() -> tuple[dict, list]:
    global _opps, _index
    if _opps is None:
        try:
            data = json.loads((BASE / "opportunities.json").read_text(encoding="utf-8"))
            _opps = {o["id"]: o for o in data}
        except Exception:
            _opps = {}
    if _index is None:
        try:
            _index = json.loads((BASE / "opportunities_embeddings.json").read_text(encoding="utf-8")).get("items", [])
        except Exception:
            _index = []
    return _opps, _index


def _cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    return dot / (na * nb) if na and nb else 0.0


def retrieve(query: str, k: int = 6) -> list[dict]:
    """Return the k most relevant opportunities for a query.
    Falls back to the first k opportunities if embeddings/AI are unavailable."""
    opps, index = _load()
    if not opps:
        return []
    if not _client or not index:
        return list(opps.values())[:k]

    try:
        q_vec = _client.embeddings.create(model=EMBED_MODEL, input=query).data[0].embedding
    except Exception:
        return list(opps.values())[:k]

    ranked = sorted(index, key=lambda it: _cosine(q_vec, it["embedding"]), reverse=True)
    out: list[dict] = []
    for it in ranked:
        opp = opps.get(it["id"])
        if opp:
            out.append(opp)
        if len(out) >= k:
            break
    return out or list(opps.values())[:k]
