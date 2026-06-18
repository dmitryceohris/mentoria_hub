import type { OnboardingProfile, Opportunity, Course } from "../data/content";
import { DEFAULT_LOCALE, languageNames } from "./language";
import { getOpportunityTranslation } from "./opportunityText";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;

type AIRecommendation = {
  ids: string[];
  explanation: string;
};

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a recommendation engine for Mentoria Hub, an EdTech platform for students in grades 8–12. " +
            `All user-visible text must be in ${languageNames[DEFAULT_LOCALE]}. ` +
            "You respond only with valid JSON. No markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

export async function getAIRecommendedOpportunities(
  profile: OnboardingProfile,
  opportunities: Opportunity[],
  limit = 3
): Promise<AIRecommendation> {
  const profileSummary = `
Grade: ${profile.grade}
Interests: ${profile.interests.join(", ")}
Academic direction: ${profile.academicDirection}
Preferred directions: ${profile.directions.join(", ")}
Formats: ${profile.formats.join(", ")}
Locations: ${profile.locations.join(", ")}
  `.trim();

  const today = new Date().toISOString().slice(0, 10);

  const opportunityList = opportunities
    .map((o) => {
      const display = getOpportunityTranslation(o);

      return `ID: ${o.id} | Title: ${display.title} | Direction: ${o.direction} | Deadline: ${o.deadline || "N/A"} | Tags: ${o.tags.join(", ")} | Grades: ${o.grades.join(", ")}`;
    })
    .join("\n");

  const prompt = `
Today's date is ${today}.

Student profile:
${profileSummary}

Available opportunities:
${opportunityList}

Return the ${limit} most suitable opportunity IDs for this student. Prefer opportunities with an upcoming deadline (on or after ${today}); never pick ones whose deadline has already passed. Add a short explanation (1–2 sentences) in ${languageNames[DEFAULT_LOCALE]}.

Respond with this exact JSON shape:
{"ids": ["id1", "id2", "id3"], "explanation": "..."}
  `.trim();

  const raw = await callOpenAI(prompt);
  return JSON.parse(raw) as AIRecommendation;
}

export async function getAIRecommendedCourses(
  profile: OnboardingProfile,
  courses: Course[],
  limit = 3
): Promise<AIRecommendation> {
  const profileSummary = `
Grade: ${profile.grade}
Interests: ${profile.interests.join(", ")}
Academic direction: ${profile.academicDirection}
  `.trim();

  const courseList = courses
    .map((c) => `ID: ${c.id} | Title: ${c.title} | Difficulty: ${c.difficulty} | Tags: ${c.tags.join(", ")}`)
    .join("\n");

  const prompt = `
Student profile:
${profileSummary}

Available courses:
${courseList}

Return the ${limit} most suitable course IDs for this student and a short explanation (1–2 sentences) in ${languageNames[DEFAULT_LOCALE]}.

Respond with this exact JSON shape:
{"ids": ["id1", "id2", "id3"], "explanation": "..."}
  `.trim();

  const raw = await callOpenAI(prompt);
  return JSON.parse(raw) as AIRecommendation;
}
