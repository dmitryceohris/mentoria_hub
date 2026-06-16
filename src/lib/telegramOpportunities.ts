import type { Opportunity } from "../data/content";

/** Loads ALL opportunities (unfiltered), sorted by relevance.
 *  Use filterActive() to get only the upcoming ones for catalog/recommendations.
 *  MentorLM gets the full list so it can answer about past events too. */
export async function loadTelegramOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch("/recsys/opportunities.json");
    if (!res.ok) return [];
    const raw: RawPost[] = await res.json();
    return sortByRelevance(raw.map(toOpportunity));
  } catch {
    return [];
  }
}

/** True if the opportunity's deadline/event date has not passed yet. */
export function isUpcoming(o: Opportunity): boolean {
  if (o.isRecurring) return true;
  const relevantDate = o.deadline || o.eventDate;
  if (!relevantDate) return true;
  const date = new Date(relevantDate);
  if (Number.isNaN(date.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

type RawPost = {
  id: string;
  title: string;
  category: string;
  direction: string;
  format: string;
  deadline: string | null;
  eventDate?: string | null;
  isRecurring?: boolean;
  grades: string[];
  location: string;
  description: string;
  requirements: string;
  tags: string[];
  applyUrl: string;
  postedAt?: string | null;
  views: number;
};

function toOpportunity(raw: RawPost): Opportunity {
  return {
    id: raw.id,
    title: raw.title,
    category: raw.category,
    direction: raw.direction,
    format: (["Online", "Offline", "Hybrid"].includes(raw.format) ? raw.format : "Online") as Opportunity["format"],
    deadline: raw.deadline ?? "",
    eventDate: raw.eventDate ?? null,
    isRecurring: raw.isRecurring ?? false,
    grades: raw.grades,
    location: raw.location,
    description: raw.description,
    requirements: raw.requirements,
    tags: raw.tags,
    applyUrl: raw.applyUrl,
    postedAt: raw.postedAt ?? null,
  };
}

/** Keep only opportunities that are still relevant (deadline today or later). */
export function filterActive(opps: Opportunity[]): Opportunity[] {
  return opps.filter(isUpcoming);
}

/** Sort: soonest deadline first, dateless items last. */
function sortByRelevance(opps: Opportunity[]): Opportunity[] {
  return [...opps].sort((a, b) => {
    const aDate = a.deadline || a.eventDate;
    const bDate = b.deadline || b.eventDate;
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });
}
