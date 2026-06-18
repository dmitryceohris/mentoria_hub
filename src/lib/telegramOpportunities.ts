import type { Opportunity } from "../data/content";
import { DEFAULT_LOCALE, containsCyrillic } from "./language";

/** Loads ALL opportunities (unfiltered), sorted by relevance.
 *  Use filterActive() to get only the upcoming ones for catalog/recommendations.
 *  MentorLM gets the full list so it can answer about past events too. */
export async function loadTelegramOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch("/recsys/opportunities.json");
    if (!res.ok) return [];
    const raw: RawPost[] = await res.json();
    // Drop noise (giveaways etc.), then sort by deadline. No date filter here —
    // MentorLM needs past events too; use filterActive() for catalog/recommendations.
    return sortByRelevance(raw.filter(isRelevantRawOpportunity).map(toOpportunity));
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
  sourceLanguage?: string | null;
  sourceTitle?: string | null;
  sourceDescription?: string | null;
  sourceRequirements?: string | null;
  translations?: {
    en?: {
      title?: string | null;
      description?: string | null;
      requirements?: string | null;
      summary?: string | null;
    };
  };
};

const emojiPattern =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F3FB}-\u{1F3FF}]/gu;

const tagRules: Array<[RegExp, string[]]> = [
  [/(stem|physics|science|research|experiment|\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434|\u043d\u0430\u0443\u0447|\u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d)/i, ["stem", "science", "research"]],
  [/(programming|code|coding|hackathon|developer|web|data|\u0445\u0430\u043a\u0430\u0442\u043e\u043d|\u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442)/i, ["programming", "technology", "hackathon"]],
  [/(business|startup|case|economics|finance|\u0441\u0442\u0430\u0440\u0442\u0430\u043f|\u0431\u0438\u0437\u043d\u0435\u0441|\u044d\u043a\u043e\u043d\u043e\u043c)/i, ["business", "finance"]],
  [/(scholarship|admission|university|essay|sat|ielts|nyuad|\u0433\u0440\u0430\u043d\u0442|\u0441\u0442\u0438\u043f\u0435\u043d\u0434|\u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442)/i, ["admissions", "scholarship", "english", "global"]],
  [/(volunteer|social|impact|community|\u0432\u043e\u043b\u043e\u043d\u0442|\u0441\u043e\u0446\u0438\u0430\u043b\u044c|\u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435)/i, ["social-impact", "volunteering"]],
  [/(competition|cup|championship|tournament|contest|\u043a\u043e\u043d\u043a\u0443\u0440\u0441|\u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442|\u0442\u0443\u0440\u043d\u0438\u0440|\u0441\u043e\u0440\u0435\u0432\u043d\u043e\u0432\u0430\u043d)/i, ["competition"]],
  [/(webinar|meeting|course|lesson|event|\u0432\u0435\u0431\u0438\u043d\u0430\u0440|\u0432\u0441\u0442\u0440\u0435\u0447|\u043a\u0443\u0440\u0441|\u0443\u0440\u043e\u043a|\u0438\u0432\u0435\u043d\u0442)/i, ["event", "online"]],
  [/(kazakhstan|almaty|astana|\u043a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d|\u0430\u043b\u043c\u0430\u0442\u044b|\u0430\u0441\u0442\u0430\u043d\u0430)/i, ["kazakhstan"]],
  [/(central asia|central-asia|\u0430\u0437\u0438\u044f)/i, ["central-asia"]],
  [/(global|international|world|\u043c\u0435\u0436\u0434\u0443\u043d\u0430\u0440\u043e\u0434)/i, ["global"]]
];

const relevancePattern =
  /(admission|business|case|championship|competition|contest|course|event|fellowship|hackathon|internship|lesson|olympiad|program|research|scholarship|school|startup|tournament|university|volunteer|webinar|\u0431\u0438\u0437\u043d\u0435\u0441|\u0432\u0435\u0431\u0438\u043d\u0430\u0440|\u0432\u043e\u043b\u043e\u043d\u0442|\u0432\u0441\u0442\u0440\u0435\u0447|\u0433\u0440\u0430\u043d\u0442|\u0438\u0432\u0435\u043d\u0442|\u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d|\u043a\u043e\u043d\u043a\u0443\u0440\u0441|\u043a\u0443\u0440\u0441|\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434|\u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c|\u0441\u0442\u0430\u0436|\u0441\u0442\u0430\u0440\u0442\u0430\u043f|\u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442|\u0445\u0430\u043a\u0430\u0442\u043e\u043d|\u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442)/i;

const noisePattern = /(telegram premium|premium.*free|\u0440\u043e\u0437\u044b\u0433\u0440\u044b\u0448.*premium|giveaway)/i;

function sanitizeText(value: string) {
  return value
    .replace(emojiPattern, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function clampText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function getEnglishDisplayText(value: string | null | undefined, fallback: string, maxLength?: number) {
  const sanitized = sanitizeText(value ?? "");
  const displayText = sanitized && !containsCyrillic(sanitized) ? sanitized : fallback;

  return maxLength ? clampText(displayText, maxLength) : displayText;
}

function inferSourceLanguage(...values: Array<string | null | undefined>) {
  return values.some((value) => containsCyrillic(value)) ? "ru" : DEFAULT_LOCALE;
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function inferTags(raw: RawPost) {
  const tags = new Set((raw.tags ?? []).map(normalizeTag).filter(Boolean));
  const searchableText = [raw.title, raw.description, raw.category, raw.direction, raw.format, raw.location].join(" ");

  [raw.category, raw.direction, raw.format, raw.location].forEach((field) => {
    if (field) {
      tags.add(normalizeTag(field));
    }
  });

  tagRules.forEach(([pattern, inferredTags]) => {
    if (pattern.test(searchableText)) {
      inferredTags.forEach((tag) => tags.add(tag));
    }
  });

  return [...tags];
}

function isRelevantRawOpportunity(raw: RawPost) {
  const searchableText = [raw.title, raw.description, raw.category].join(" ");
  return relevancePattern.test(searchableText) && !noisePattern.test(searchableText);
}

function toOpportunity(raw: RawPost): Opportunity {
  const sourceTitle = sanitizeText(raw.sourceTitle || raw.title || "");
  const sourceDescription = sanitizeText(raw.sourceDescription || raw.description || raw.title || "");
  const sourceRequirements = sanitizeText(raw.sourceRequirements || raw.requirements || "");
  const category = sanitizeText(raw.category || "Opportunity");
  const direction = sanitizeText(raw.direction || "Opportunity");
  const englishTranslation = raw.translations?.en;
  const title = getEnglishDisplayText(englishTranslation?.title || raw.title, `${category} opportunity`, 92);
  const description = getEnglishDisplayText(
    englishTranslation?.description || raw.description,
    "Details are available in the source announcement."
  );
  const requirements = getEnglishDisplayText(
    englishTranslation?.requirements || raw.requirements,
    "Review the source announcement for participation details.",
    180
  );
  const summary = getEnglishDisplayText(englishTranslation?.summary || englishTranslation?.description || raw.description, description);

  return {
    id: raw.id,
    title,
    category,
    direction,
    format: (["Online", "Offline", "Hybrid"].includes(raw.format) ? raw.format : "Online") as Opportunity["format"],
    deadline: raw.deadline || "",
    eventDate: raw.eventDate ?? null,
    isRecurring: raw.isRecurring ?? false,
    grades: raw.grades?.length ? raw.grades : ["8", "9", "10", "11", "12"],
    location: sanitizeText(raw.location || "Global"),
    description,
    requirements,
    tags: inferTags(raw),
    applyUrl: raw.applyUrl,
    postedAt: raw.postedAt ?? null,
    sourceLanguage: raw.sourceLanguage || inferSourceLanguage(sourceTitle, sourceDescription, sourceRequirements),
    sourceTitle,
    sourceDescription,
    sourceRequirements,
    translations: {
      ...raw.translations,
      en: {
        title,
        description,
        requirements,
        summary
      }
    }
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
