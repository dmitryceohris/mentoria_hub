import { courses, getLessonAssignmentPrompt } from "../data/content";
import type { Course, Lesson, Opportunity } from "../data/content";
import { retrieveRelevant } from "./embeddingsRetrieval";
import { DEFAULT_LOCALE, languageNames } from "./language";
import { getOpportunitySourceText, getOpportunityTranslation } from "./opportunityText";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
};

export type MentorLMLessonContext = {
  course: Course;
  lesson: Lesson;
};

const STORAGE_KEY = "mentorLM.chats";

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    createdAt: new Date().toISOString(),
  };
}

function buildSystemPrompt(
  profile: { name: string; grade: string; interests: string[]; academicDirection: string },
  opportunities: Opportunity[],
  lessonContext?: MentorLMLessonContext
): string {
  const today = new Date().toISOString().slice(0, 10);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const oppList = opportunities
    .map((o) => {
      const display = getOpportunityTranslation(o);
      const date = o.deadline || o.eventDate || "NOT SPECIFIED";
      const recurring = o.isRecurring ? " (recurring)" : "";
      const refDate = o.deadline || o.eventDate;
      const isPast = refDate ? new Date(refDate) < todayDate && !o.isRecurring : false;
      const status = isPast ? "CLOSED" : "OPEN";
      const posted = o.postedAt ? `, posted: ${o.postedAt}` : "";
      const sourceEvidence = getOpportunitySourceText(o);

      return `### [${status}] ${display.title} (${o.category}, deadline: ${date}${posted})${recurring}
English display summary: ${display.summary}
English participation details: ${display.requirements}
Source evidence for reasoning only, may be non-English: ${sourceEvidence}
Source link: ${o.applyUrl}`;
    })
    .join("\n\n");
  const courseCatalog = courses.map(buildCourseSummary).join("\n");
  const activeLessonContext = lessonContext ? buildActiveLessonContext(lessonContext) : "";

  return `You are MentorLM, an AI assistant for Mentoria Hub — an EdTech platform for students in grades 8–11 from Kazakhstan and Central Asia.

Today's date is ${today}.

Student profile:
- Name: ${profile.name}
- Grade: ${profile.grade}
- Interests: ${profile.interests.join(", ")}
- Academic direction: ${profile.academicDirection}

Available Mentoria courses:
${courseCatalog}
${activeLessonContext}

Here are opportunities from the Mentoria channel. Each is tagged [OPEN] or [CLOSED]:
${oppList}

Rules:
- Always answer in ${languageNames[DEFAULT_LOCALE]}, even if the student writes in another language.
- Translate or summarize any non-English source evidence into ${languageNames[DEFAULT_LOCALE]} before presenting it to the student.
- Be concise, friendly, and specific.
- You may ANSWER questions about ANY opportunity, including [CLOSED] ones (prizes, what it was, dates) — you have source evidence above.
- But only RECOMMEND opportunities tagged [OPEN]. If the best match is [CLOSED], say it already passed and suggest a similar [OPEN] one.
- IMPORTANT: a single event is often spread across SEVERAL posts with different titles, such as an announcement post, a registration post, and an extension post. These describe the SAME event when they share the same registration link (e.g. mentoria-hackathon.vercel.app) or clearly the same hackathon. Before answering about registration status, look across ALL related posts and use the MOST RECENT one to judge whether registration is open.
- When a deadline is "NOT SPECIFIED", use the publish date and the post wording to reason about whether it is still open. If any related post says registration is closing soon, in its final hours, or extended by one day and was published several days before ${today}, the registration has most likely CLOSED — tell the student that and suggest they verify on the official link. Do not present a clearly-expired registration as open.
- If genuinely unsure whether something is still open, say so honestly rather than guessing it is open.
- If the student names an opportunity that is not an EXACT match, do a fuzzy search by similar titles (e.g. "Central Asia Student Lab" ≈ "Central Asia Business & Economics Case Championship"). Never say you found nothing without first offering the closest matches.
- When a current lesson context is provided, use the course and lesson material directly. You may draft concise lesson notes for the student, but the app saves a note only when the student chooses to save your latest answer.
- Always end by giving the student at least one concrete next step or option.`;
}

function buildCourseSummary(course: Course) {
  const lessons = course.lessons.map((lesson) => lesson.title).join("; ");

  return `- ${course.title} | id:${course.id} | difficulty:${course.difficulty} | tags:${course.tags.join(", ")} | lessons:${lessons}`;
}

function buildActiveLessonContext({ course, lesson }: MentorLMLessonContext) {
  const materials = lesson.materials
    .map((material) => `${material.title} (${material.kind}${material.downloadable ? ", downloadable" : ""})`)
    .join("; ");
  const selfCheck = lesson.selfCheck.questions.map((question) => question.prompt).join("; ");

  return `
Current lesson context:
- Course: ${course.title} (id:${course.id})
- Course description: ${course.description}
- Lesson: ${lesson.title} (id:${lesson.id})
- Lesson description: ${lesson.description ?? "not provided"}
- Duration: ${lesson.duration}
- Video: ${lesson.video.label}; source type: ${lesson.video.sourceType}; url: ${lesson.video.url ?? "not added"}
- Assignment: ${getLessonAssignmentPrompt(lesson)}
- Materials: ${materials || "not added"}
- Self-check questions: ${selfCheck}
`;
}

export async function sendMessage(
  messages: ChatMessage[],
  profile: { name: string; grade: string; interests: string[]; academicDirection: string },
  opportunities: Opportunity[],
  onChunk: (chunk: string) => void,
  options: { lessonContext?: MentorLMLessonContext } = {}
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;

  // Retrieve only the opportunities relevant to the latest question (semantic
  // search over the embeddings index) instead of sending all ~50 every time.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const relevant = lastUser
    ? await retrieveRelevant(lastUser.content, opportunities)
    : opportunities;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(profile, relevant, options.lessonContext) },
        ...messages,
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
      try {
        const delta = JSON.parse(line.slice(6)).choices[0].delta.content as string | undefined;
        if (delta) {
          full += delta;
          onChunk(delta);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return full;
}
