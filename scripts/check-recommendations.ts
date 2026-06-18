import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

type Opportunity = {
  id: string;
  title: string;
  category: string;
  direction: string;
  format: "Online" | "Offline" | "Hybrid";
  deadline: string;
  eventDate?: string | null;
  isRecurring?: boolean;
  grades: string[];
  location: string;
  description: string;
  requirements: string;
  tags: string[];
  applyUrl: string;
  sourceKind?: "actionable" | "resource" | "noise";
  recommendationEligible?: boolean;
  translations?: {
    en?: {
      title?: string | null;
      description?: string | null;
      requirements?: string | null;
      summary?: string | null;
    };
  };
};

type Profile = {
  grade: string;
  interests: string[];
  academicDirection: string;
  directions: string[];
  formats: string[];
  locations: string[];
};

const repoRoot = resolve(import.meta.dirname, "..");
const fallbackDescription = "Details are available in the source announcement.";
const genericFallbackTitlePattern =
  /^(opportunity|competition|event|course|scholarship|volunteering|internship|research|summer school) opportunity$/i;
const cyrillicPattern = /[\u0400-\u04FF]/;
const weakRecommendationTags = new Set([
  "8",
  "9",
  "10",
  "11",
  "12",
  "online",
  "offline",
  "hybrid",
  "global",
  "general",
  "opportunity",
  "event",
  "course"
]);

const tagExpansions: Record<string, string[]> = {
  "science-research": ["science", "stem", "research", "competition"],
  "business-economics": ["business", "finance", "economics", "case"],
  technology: ["programming", "technology", "stem", "hackathon"],
  "global-admissions": ["admissions", "scholarship", "english", "global"],
  "language-tests": ["english", "ielts", "sat", "admissions"],
  online: ["online"],
  offline: ["offline"],
  hybrid: ["hybrid"],
  kazakhstan: ["kazakhstan"],
  global: ["global"],
  "central-asia": ["central-asia", "central asia"]
};

const opportunityKeywordTags: Array<[RegExp, string[]]> = [
  [/(stem|physics|science|research|experiment|олимпиад|науч|исследован)/i, ["stem", "science", "research"]],
  [/(programming|code|coding|hackathon|хакатон|developer|web|data)/i, ["programming", "technology", "hackathon"]],
  [/(business|startup|case|economics|finance|стартап|бизнес|эконом)/i, ["business", "finance"]],
  [/(scholarship|admission|university|essay|sat|ielts|nyuad|грант|стипенд|университет)/i, ["admissions", "scholarship", "english", "global"]],
  [/(volunteer|social|impact|community|волонт|социаль)/i, ["social-impact", "volunteering"]],
  [/(competition|cup|championship|tournament|contest|конкурс|чемпионат|турнир)/i, ["competition"]],
  [/(webinar|вебинар|meeting|мит|course|курс|lesson)/i, ["event", "online"]],
  [/(kazakhstan|almaty|astana|казахстан|алматы|астана)/i, ["kazakhstan"]],
  [/(central asia|central-asia|asia|азия)/i, ["central-asia"]],
  [/(global|international|world|международ)/i, ["global"]]
];

const profiles: Record<string, Profile> = {
  science: {
    grade: "10",
    interests: ["stem", "science"],
    academicDirection: "science-research",
    directions: ["stem", "science"],
    formats: ["online", "hybrid"],
    locations: ["global", "kazakhstan"]
  },
  programming: {
    grade: "10",
    interests: ["programming"],
    academicDirection: "technology",
    directions: ["programming"],
    formats: ["online"],
    locations: ["global"]
  },
  business: {
    grade: "10",
    interests: ["business", "finance"],
    academicDirection: "business-economics",
    directions: ["business", "finance"],
    formats: ["online", "hybrid"],
    locations: ["global", "central-asia"]
  },
  admissions: {
    grade: "10",
    interests: ["english", "admissions"],
    academicDirection: "global-admissions",
    directions: ["admissions", "english"],
    formats: ["online"],
    locations: ["global"]
  },
  social: {
    grade: "10",
    interests: ["social-impact"],
    academicDirection: "global-admissions",
    directions: ["social-impact"],
    formats: ["hybrid"],
    locations: ["kazakhstan", "global"]
  }
};

function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function parseCuratedOpportunities(): Opportunity[] {
  const contentPath = resolve(repoRoot, "src/data/content.ts");
  const source = readFileSync(contentPath, "utf8");
  const start = source.indexOf("export const opportunities");
  const end = source.indexOf("const courseSeeds", start);

  if (start === -1 || end === -1) {
    throw new Error("Could not locate curated opportunities in src/data/content.ts");
  }

  const code = source
    .slice(start, end)
    .replace("export const opportunities: Opportunity[] =", "const opportunities =");
  const sandbox: { curated?: Opportunity[] } = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}\nthis.curated = opportunities;`, sandbox);

  return sandbox.curated ?? [];
}

function parsePublicOpportunities(): Opportunity[] {
  const raw = JSON.parse(readFileSync(resolve(repoRoot, "public/recsys/opportunities.json"), "utf8")) as Array<
    Opportunity & { deadline?: string | null }
  >;

  return raw.map((opportunity) => ({ ...opportunity, deadline: opportunity.deadline ?? "" }));
}

function getOpportunityPool() {
  const byId = new Map<string, Opportunity>();
  parseCuratedOpportunities().forEach((opportunity) => byId.set(opportunity.id, opportunity));
  parsePublicOpportunities().forEach((opportunity) => byId.set(opportunity.id, opportunity));

  return [...byId.values()];
}

function expandProfileTags(values: string[]) {
  const tags = new Set<string>();

  values.forEach((value) => {
    if (!value) return;
    const normalized = normalizeTag(value);
    tags.add(normalized);
    tagExpansions[normalized]?.forEach((tag) => tags.add(normalizeTag(tag)));
  });

  return [...tags].filter((tag) => !weakRecommendationTags.has(tag));
}

function getOpportunityTags(opportunity: Opportunity) {
  const tags = new Set<string>();
  const fields = [
    opportunity.category,
    opportunity.direction,
    opportunity.format,
    opportunity.location,
    opportunity.title,
    opportunity.description,
    opportunity.requirements,
    ...opportunity.tags
  ];

  fields.forEach((field) => {
    if (!field) return;
    const normalized = normalizeTag(field);
    tags.add(normalized);
    tagExpansions[normalized]?.forEach((tag) => tags.add(normalizeTag(tag)));
  });

  const searchableText = fields.join(" ");
  opportunityKeywordTags.forEach(([pattern, inferredTags]) => {
    if (pattern.test(searchableText)) {
      inferredTags.forEach((tag) => tags.add(normalizeTag(tag)));
    }
  });

  return [...tags];
}

function displayFields(opportunity: Opportunity) {
  const english = opportunity.translations?.en;

  return {
    title: (english?.title ?? opportunity.title).trim(),
    description: (english?.description ?? opportunity.description).trim()
  };
}

function hasCleanDisplay(opportunity: Opportunity) {
  const display = displayFields(opportunity);

  return (
    Boolean(display.title) &&
    Boolean(display.description) &&
    !cyrillicPattern.test(display.title) &&
    !cyrillicPattern.test(display.description) &&
    !genericFallbackTitlePattern.test(display.title) &&
    display.description !== fallbackDescription
  );
}

function parseDeadline(deadline: string) {
  if (!deadline) return null;
  const date = new Date(`${deadline}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function hasUpcomingDeadline(opportunity: Opportunity) {
  const deadline = parseDeadline(opportunity.deadline);
  if (!deadline) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return deadline >= today;
}

function isPastDeadline(opportunity: Opportunity) {
  const deadline = parseDeadline(opportunity.deadline);
  if (!deadline) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return deadline < today;
}

function isEligible(opportunity: Opportunity) {
  return (
    (opportunity.sourceKind ?? "actionable") === "actionable" &&
    (opportunity.recommendationEligible ?? true) &&
    hasCleanDisplay(opportunity)
  );
}

function score(profile: Profile, opportunity: Opportunity) {
  const priorityProfileTags = expandProfileTags([...profile.interests, ...profile.directions]);
  const academicProfileTags = expandProfileTags([profile.academicDirection]).filter((tag) => !priorityProfileTags.includes(tag));
  const opportunityTags = new Set(getOpportunityTags(opportunity).filter((tag) => !weakRecommendationTags.has(tag)));
  const matchedPriorityTags = priorityProfileTags.filter((tag) => opportunityTags.has(tag));
  const matchedAcademicTags = academicProfileTags.filter((tag) => opportunityTags.has(tag));
  const directionTag = normalizeTag(opportunity.direction);
  const categoryTag = normalizeTag(opportunity.category);
  const directionScore = priorityProfileTags.includes(directionTag) ? 4.4 : academicProfileTags.includes(directionTag) ? 1.2 : 0;
  const categoryScore = priorityProfileTags.includes(categoryTag) ? 1.2 : academicProfileTags.includes(categoryTag) ? 0.4 : 0;
  const domainScore = Math.min(matchedPriorityTags.length * 2.4 + matchedAcademicTags.length * 0.85, 11);
  const gradeScore = opportunity.grades.includes(profile.grade) ? 1.9 : 0;
  const formatScore = profile.formats.some((format) => normalizeTag(format) === normalizeTag(opportunity.format)) ? 1.1 : 0;
  const locationScore = profile.locations.some((location) => normalizeTag(location) === normalizeTag(opportunity.location)) ? 1.1 : 0;
  const deadlineScore = hasUpcomingDeadline(opportunity) ? 1.35 : 0.2;
  const pastPenalty = isPastDeadline(opportunity) ? -12 : 0;
  const actionQualityScore = opportunity.applyUrl && opportunity.description.length > 48 ? 0.6 : 0;

  return directionScore + categoryScore + domainScore + gradeScore + formatScore + locationScore + deadlineScore + pastPenalty + actionQualityScore;
}

function topFive(profile: Profile, pool: Opportunity[]) {
  return pool
    .map((opportunity, index) => ({ opportunity, index, score: isEligible(opportunity) ? score(profile, opportunity) : null }))
    .filter((item): item is { opportunity: Opportunity; index: number; score: number } => item.score !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 5)
    .map((item) => item.opportunity);
}

function fail(message: string) {
  throw new Error(message);
}

const pool = getOpportunityPool();
const publicOpportunities = parsePublicOpportunities();

publicOpportunities.forEach((opportunity) => {
  if ((opportunity.sourceKind ?? "actionable") !== "noise" && !hasCleanDisplay(opportunity)) {
    const display = displayFields(opportunity);
    fail(`Bad public display text for ${opportunity.id}: ${display.title} / ${display.description}`);
  }
});

const snapshots = Object.entries(profiles).map(([name, profile]) => {
  const recommendations = topFive(profile, pool);
  if (recommendations.length < 5) {
    fail(`${name} produced only ${recommendations.length} recommendations`);
  }

  recommendations.forEach((opportunity) => {
    const display = displayFields(opportunity);
    if (!isEligible(opportunity)) {
      fail(`${name} top-5 includes ineligible ${opportunity.id}`);
    }
    if (display.title === "Opportunity opportunity" || genericFallbackTitlePattern.test(display.title)) {
      fail(`${name} top-5 includes generic title ${opportunity.id}: ${display.title}`);
    }
    if (display.description === fallbackDescription) {
      fail(`${name} top-5 includes fallback description ${opportunity.id}`);
    }
  });

  return { name, ids: recommendations.map((opportunity) => opportunity.id) };
});

for (let i = 0; i < snapshots.length; i += 1) {
  for (let j = i + 1; j < snapshots.length; j += 1) {
    const first = snapshots[i];
    const second = snapshots[j];
    const overlap = first.ids.filter((id) => second.ids.includes(id));
    if (overlap.length > 3) {
      fail(`${first.name} and ${second.name} top-5 overlap too much: ${overlap.join(", ")}`);
    }
  }
}

console.log("Recommendation diagnostics OK");
snapshots.forEach((snapshot) => {
  console.log(`${snapshot.name}: ${snapshot.ids.join(", ")}`);
});
