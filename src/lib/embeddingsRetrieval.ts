import type { Opportunity } from "../data/content";

/**
 * Semantic retrieval over the precomputed opportunity embeddings
 * (built by recsys/build_embeddings.py → public/recsys/opportunities_embeddings.json).
 *
 * Instead of stuffing all ~50 opportunities into every MentorLM message, we embed
 * the student's question and send only the few most relevant posts. Better answers,
 * far fewer tokens. Falls back to the full list if the index is missing.
 */

const EMBED_MODEL = "text-embedding-3-small";

type EmbeddingItem = {
  id: string;
  title: string;
  embedding: number[];
};

type EmbeddingIndex = {
  model: string;
  dimensions: number;
  items: EmbeddingItem[];
};

let cachedIndex: EmbeddingIndex | null = null;
let indexLoadFailed = false;

async function loadIndex(): Promise<EmbeddingIndex | null> {
  if (cachedIndex) return cachedIndex;
  if (indexLoadFailed) return null;
  try {
    const res = await fetch("/recsys/opportunities_embeddings.json");
    if (!res.ok) {
      indexLoadFailed = true;
      return null;
    }
    cachedIndex = (await res.json()) as EmbeddingIndex;
    return cachedIndex;
  } catch {
    indexLoadFailed = true;
    return null;
  }
}

async function embedQuery(text: string): Promise<number[] | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: EMBED_MODEL, input: text }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data[0].embedding as number[];
  } catch {
    return null;
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

/**
 * Returns the top-K opportunities most relevant to `query`, ranked by semantic
 * similarity. If the index or query embedding is unavailable, returns the full
 * list unchanged so MentorLM still works (just less token-efficient).
 */
export async function retrieveRelevant(
  query: string,
  opportunities: Opportunity[],
  k = 8
): Promise<Opportunity[]> {
  const [index, queryVec] = await Promise.all([loadIndex(), embedQuery(query)]);
  if (!index || !queryVec) return opportunities;

  const byId = new Map(opportunities.map((o) => [o.id, o]));

  const ranked = index.items
    .map((item) => ({ id: item.id, score: cosineSimilarity(queryVec, item.embedding) }))
    .sort((a, b) => b.score - a.score);

  const top: Opportunity[] = [];
  for (const { id } of ranked) {
    const opp = byId.get(id);
    if (opp) top.push(opp);
    if (top.length >= k) break;
  }

  // If the index didn't cover anything we have (e.g. stale index), fall back.
  return top.length > 0 ? top : opportunities;
}
