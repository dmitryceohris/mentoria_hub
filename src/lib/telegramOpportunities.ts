import type { Opportunity } from "../data/content";

export async function loadTelegramOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch("/recsys/opportunities.json");
    if (!res.ok) return [];
    const raw: RawPost[] = await res.json();
    return raw.filter(isRelevantRawOpportunity).map(toOpportunity);
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

const emojiPattern =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{1F3FB}-\u{1F3FF}]/gu;

const tagRules: Array<[RegExp, string[]]> = [
  [/(stem|physics|science|research|experiment|олимпиад|науч|исследован)/i, ["stem", "science", "research"]],
  [/(programming|code|coding|hackathon|developer|web|data|хакатон|разработ)/i, ["programming", "technology", "hackathon"]],
  [/(business|startup|case|economics|finance|стартап|бизнес|эконом)/i, ["business", "finance"]],
  [/(scholarship|admission|university|essay|sat|ielts|nyuad|грант|стипенд|университет)/i, ["admissions", "scholarship", "english", "global"]],
  [/(volunteer|social|impact|community|волонт|социаль|движение)/i, ["social-impact", "volunteering"]],
  [/(competition|cup|championship|tournament|contest|конкурс|чемпионат|турнир|соревнован)/i, ["competition"]],
  [/(webinar|meeting|course|lesson|event|вебинар|встреч|курс|урок|ивент)/i, ["event", "online"]],
  [/(kazakhstan|almaty|astana|казахстан|алматы|астана)/i, ["kazakhstan"]],
  [/(central asia|central-asia|азия)/i, ["central-asia"]],
  [/(global|international|world|международ)/i, ["global"]]
];

const relevancePattern =
  /(admission|business|case|championship|competition|contest|course|event|fellowship|hackathon|internship|lesson|olympiad|program|research|scholarship|school|startup|tournament|university|volunteer|webinar|бизнес|вебинар|волонт|встреч|грант|ивент|исследован|конкурс|курс|олимпиад|программ|стаж|стартап|университет|хакатон|чемпионат)/i;

const noisePattern = /(telegram premium|premium.*free|розыгрыш.*premium|giveaway)/i;

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
  const title = clampText(sanitizeText(raw.title), 92);
  const description = clampText(sanitizeText(raw.description || raw.title), 260);

  return {
    id: raw.id,
    title,
    category: sanitizeText(raw.category || "Opportunity"),
    direction: sanitizeText(raw.direction || "Opportunity"),
    format: (["Online", "Offline", "Hybrid"].includes(raw.format) ? raw.format : "Online") as Opportunity["format"],
    deadline: raw.deadline || "",
    grades: raw.grades?.length ? raw.grades : ["8", "9", "10", "11", "12"],
    location: sanitizeText(raw.location || "Global"),
    description,
    requirements: clampText(sanitizeText(raw.requirements || "Review the linked announcement for participation details."), 180),
    tags: inferTags(raw),
    applyUrl: raw.applyUrl,
  };
}
