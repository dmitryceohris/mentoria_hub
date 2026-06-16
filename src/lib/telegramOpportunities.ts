import type { Opportunity } from "../data/content";

export async function loadTelegramOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch("/recsys/opportunities.json");
    if (!res.ok) return [];
    const raw: RawPost[] = await res.json();
    return raw.map(toOpportunity);
  } catch {
    return [];
  }
}

type RawPost = {
  id: string;
  title: string;
  category: string;
  direction: string;
  format: string;
  deadline: string;
  grades: string[];
  location: string;
  description: string;
  requirements: string;
  tags: string[];
  applyUrl: string;
  views: number;
};

function toOpportunity(raw: RawPost): Opportunity {
  return {
    id: raw.id,
    title: raw.title,
    category: raw.category,
    direction: raw.direction,
    format: (["Online", "Offline", "Hybrid"].includes(raw.format) ? raw.format : "Online") as Opportunity["format"],
    deadline: raw.deadline || "2026-12-31",
    grades: raw.grades,
    location: raw.location,
    description: raw.description,
    requirements: raw.requirements,
    tags: raw.tags,
    applyUrl: raw.applyUrl,
  };
}
