import type { Opportunity } from "../data/content";

export async function loadTelegramOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch("/recsys/opportunities.json");
    if (!res.ok) return [];
    const raw: RawPost[] = await res.json();
    const mapped = raw.map(toOpportunity);
    return sortByRelevance(filterActive(mapped));
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

/**
 * Keep only opportunities that are still relevant:
 * - recurring events always pass (annual olympiads etc.)
 * - if it has a deadline or event date, keep only if that date is today or later
 * - if it has no date at all, keep it (don't guess away real opportunities)
 */
function filterActive(opps: Opportunity[]): Opportunity[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return opps.filter((o) => {
    if (o.isRecurring) return true;

    const relevantDate = o.deadline || o.eventDate;
    if (!relevantDate) return true; // no date → keep

    const date = new Date(relevantDate);
    if (Number.isNaN(date.getTime())) return true; // unparseable → keep

    return date >= today;
  });
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
