import type { Course, Opportunity } from "../data/content";

/**
 * AI-built development roadmap (grades 9–12) grounded in Mentoria's real courses
 * and opportunities. The model only sequences and explains — every step points at
 * a real course/opportunity id, so it looks smart but stays factual.
 * Falls back to a heuristic roadmap if the OpenAI key is missing.
 */

export type RoadmapStepType = "course" | "opportunity" | "action";

export type RoadmapStep = {
  grade: "9" | "10" | "11" | "12";
  title: string;
  description: string;
  type: RoadmapStepType;
  refId?: string | null;
};

export type Roadmap = {
  summary: string;
  steps: RoadmapStep[];
};

export type RoadmapProfile = {
  name: string;
  grade: string;
  interests: string[];
  academicDirection: string;
  directions: string[];
};

const STORAGE_PREFIX = "mentoria.roadmap.";

function profileKey(p: RoadmapProfile): string {
  return STORAGE_PREFIX + [p.grade, p.academicDirection, [...p.interests].sort().join(","), [...p.directions].sort().join(",")].join("|");
}

export function loadCachedRoadmap(p: RoadmapProfile): Roadmap | null {
  try {
    const raw = localStorage.getItem(profileKey(p));
    return raw ? (JSON.parse(raw) as Roadmap) : null;
  } catch {
    return null;
  }
}

function cacheRoadmap(p: RoadmapProfile, roadmap: Roadmap): void {
  try {
    localStorage.setItem(profileKey(p), JSON.stringify(roadmap));
  } catch {
    // ignore quota errors
  }
}

export function clearCachedRoadmap(p: RoadmapProfile): void {
  try {
    localStorage.removeItem(profileKey(p));
  } catch {
    // ignore
  }
}

function buildPrompt(profile: RoadmapProfile, opportunities: Opportunity[], courses: Course[]): string {
  const courseList = courses
    .map((c) => `course | id:${c.id} | ${c.title} | difficulty:${c.difficulty} | tags:${c.tags.join(",")}`)
    .join("\n");

  const oppList = opportunities
    .slice(0, 30)
    .map(
      (o) =>
        `opportunity | id:${o.id} | ${o.title} | ${o.category}/${o.direction} | grades:${o.grades.join(",")} | deadline:${o.deadline || "n/a"} | tags:${o.tags.join(",")}`
    )
    .join("\n");

  return `Student profile:
- Name: ${profile.name}
- Current grade: ${profile.grade}
- Interests: ${profile.interests.join(", ")}
- Academic direction: ${profile.academicDirection}
- Chosen directions: ${profile.directions.join(", ")}

Available Mentoria courses:
${courseList}

Available Mentoria opportunities:
${oppList}

Build a step-by-step development roadmap from grade 9 to grade 12 for this student, using ONLY the courses and opportunities listed above plus generic preparation actions.

Rules:
- 6 to 9 steps total, ordered by grade (start at the student's current grade or grade 9, end at grade 12).
- Each step must be concrete and tied to the student's interests/direction.
- Prefer steps of type "course" or "opportunity" with a real "refId" from the lists. Use type "action" (refId null) only for generic prep like building a portfolio or taking a language test.
- description: one short sentence (in Russian) explaining what to do and why it helps.

Respond with ONLY this JSON:
{"summary":"one motivating sentence in Russian","steps":[{"grade":"9","title":"...","description":"...","type":"course|opportunity|action","refId":"id-or-null"}]}`;
}

export async function generateRoadmap(
  profile: RoadmapProfile,
  opportunities: Opportunity[],
  courses: Course[]
): Promise<Roadmap> {
  const cached = loadCachedRoadmap(profile);
  if (cached) return cached;

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    return fallbackRoadmap(profile, opportunities, courses);
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You design grade 9–12 development roadmaps for Mentoria Hub students. You respond only with valid JSON, no markdown.",
          },
          { role: "user", content: buildPrompt(profile, opportunities, courses) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content) as Roadmap;
    if (!parsed.steps?.length) throw new Error("empty roadmap");
    cacheRoadmap(profile, parsed);
    return parsed;
  } catch {
    return fallbackRoadmap(profile, opportunities, courses);
  }
}

/** Heuristic roadmap when AI is unavailable — still grounded in real data. */
function fallbackRoadmap(profile: RoadmapProfile, opportunities: Opportunity[], courses: Course[]): Roadmap {
  const tags = new Set([profile.academicDirection, ...profile.interests, ...profile.directions]);
  const score = (t: string[]) => t.filter((x) => tags.has(x)).length;

  const topCourses = [...courses].sort((a, b) => score(b.tags) - score(a.tags)).slice(0, 2);
  const topOpps = [...opportunities].sort((a, b) => score(b.tags) - score(a.tags)).slice(0, 3);

  const grades: RoadmapStep["grade"][] = ["9", "10", "11", "12"];
  const steps: RoadmapStep[] = [];

  topCourses.forEach((c, i) => {
    steps.push({
      grade: grades[i] ?? "9",
      title: c.title,
      description: "Пройди этот курс Mentoria, чтобы заложить базу по своему направлению.",
      type: "course",
      refId: c.id,
    });
  });

  topOpps.forEach((o, i) => {
    steps.push({
      grade: grades[Math.min(i + 1, 3)] ?? "11",
      title: o.title,
      description: "Подай заявку — это усилит твой профиль для поступления.",
      type: "opportunity",
      refId: o.id,
    });
  });

  steps.push({
    grade: "12",
    title: "Собери портфолио и список достижений",
    description: "К 12 классу оформи всё, что прошёл, в сильную заявку в университет.",
    type: "action",
    refId: null,
  });

  return {
    summary: "Твой персональный путь развития с Mentoria — шаг за шагом до 12 класса.",
    steps,
  };
}
