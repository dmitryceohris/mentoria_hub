import type { Opportunity } from "../data/content";

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
  opportunities: Opportunity[]
): string {
  const today = new Date().toISOString().slice(0, 10);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const oppList = opportunities
    .map((o) => {
      const date = o.deadline || o.eventDate || "не указан";
      const recurring = o.isRecurring ? " (ежегодное)" : "";
      const refDate = o.deadline || o.eventDate;
      const isPast = refDate ? new Date(refDate) < todayDate && !o.isRecurring : false;
      const status = isPast ? "ПРОШЛО" : "АКТУАЛЬНО";
      // Full post text so the model can answer about prizes, certificates, dates, links.
      return `### [${status}] ${o.title} (${o.category}, дедлайн: ${date})${recurring}\n${o.description}\nИсточник: ${o.applyUrl}`;
    })
    .join("\n\n");

  return `You are MentorLM, an AI assistant for Mentoria Hub — an EdTech platform for students in grades 8–12 from Kazakhstan and Central Asia.

Today's date is ${today}.

Student profile:
- Name: ${profile.name}
- Grade: ${profile.grade}
- Interests: ${profile.interests.join(", ")}
- Academic direction: ${profile.academicDirection}

Here are opportunities from the Mentoria channel. Each is tagged [АКТУАЛЬНО] (still open) or [ПРОШЛО] (already passed):
${oppList}

Rules:
- Answer in the same language the student uses (Russian or English).
- Be concise, friendly, and specific.
- You may ANSWER questions about ANY opportunity, including [ПРОШЛО] ones (prizes, what it was, dates) — you have full info above.
- But only RECOMMEND opportunities tagged [АКТУАЛЬНО]. If the best match is [ПРОШЛО], say it already passed and suggest a similar [АКТУАЛЬНО] one.
- When a deadline is "не указан", treat the opportunity as still open; mention that the exact deadline is unconfirmed.
- If the student names an opportunity that is not an EXACT match, do a fuzzy search by similar titles (e.g. "Central Asia Student Lab" ≈ "Central Asia Business & Economics Case Championship"). Never say you found nothing without first offering the closest matches.
- Always end by giving the student at least one concrete next step or option.`;
}

export async function sendMessage(
  messages: ChatMessage[],
  profile: { name: string; grade: string; interests: string[]; academicDirection: string },
  opportunities: Opportunity[],
  onChunk: (chunk: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;

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
        { role: "system", content: buildSystemPrompt(profile, opportunities) },
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
