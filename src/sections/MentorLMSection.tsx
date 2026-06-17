import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Opportunity } from "../data/content";
import type { StudentProfile } from "./AuthFlowSections";
import {
  createSession,
  loadSessions,
  saveSessions,
  sendMessage,
} from "../lib/mentorLM";
import type { ChatMessage, ChatSession } from "../lib/mentorLM";

type Props = {
  profile: StudentProfile;
  opportunities: Opportunity[];
  onLogout: () => void;
};

export function MentorLMSection({ profile, opportunities, onLogout }: Props) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const loaded = loadSessions();
    return loaded.length > 0 ? loaded : [createSession()];
  });
  const [activeId, setActiveId] = useState<string>(() => {
    const loaded = loadSessions();
    return loaded.length > 0 ? loaded[0].id : "";
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  useEffect(() => {
    if (!activeId && sessions.length > 0) setActiveId(sessions[0].id);
  }, [sessions, activeId]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages.length]);

  function newChat() {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
  }

  function deleteSession(id: string) {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? "");
      return next.length > 0 ? next : [createSession()];
    });
    setMenuOpenId(null);
  }

  async function submit() {
    const text = input.trim();
    if (!text || streaming || !activeSession) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: "" };
    const title = activeSession.messages.length === 0 ? text.slice(0, 40) : activeSession.title;
    const historyForAPI = [...activeSession.messages, userMsg];

    // Add both messages in one update — prevents double render
    setSessions((prev) =>
      prev.map((s) =>
        s.id !== activeId
          ? s
          : { ...s, title, messages: [...s.messages, userMsg, assistantPlaceholder] }
      )
    );
    setInput("");
    setStreaming(true);

    try {
      await sendMessage(
        historyForAPI,
        {
          name: profile.name,
          grade: profile.grade,
          interests: profile.interests,
          academicDirection: profile.academicDirection,
        },
        opportunities,
        (chunk) => {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== activeId) return s;
              const msgs = [...s.messages];
              const last = msgs[msgs.length - 1];
              msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
              return { ...s, messages: msgs };
            })
          );
        }
      );
    } catch (err) {
      const errorText = err instanceof Error ? err.message : "Неизвестная ошибка";
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeId) return s;
          const msgs = [...s.messages];
          msgs[msgs.length - 1] = { role: "assistant", content: `Ошибка: ${errorText}` };
          return { ...s, messages: msgs };
        })
      );
    } finally {
      setStreaming(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="mentorlm-root" onClick={() => setMenuOpenId(null)}>
      {/* Sidebar */}
      <aside className={`mentorlm-sidebar${sidebarOpen ? " mentorlm-sidebar-open" : ""}`}>
        <div className="mentorlm-sidebar-header">
          <button className="mentorlm-burger" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            ✕
          </button>
          <button className="mentorlm-new-chat" type="button" onClick={newChat}>
            + New chat
          </button>
        </div>

        <nav className="mentorlm-session-list">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`mentorlm-session-row${s.id === activeId ? " mentorlm-session-active" : ""}`}
            >
              <button
                type="button"
                className="mentorlm-session-item"
                onClick={() => setActiveId(s.id)}
              >
                {s.title}
              </button>
              <button
                type="button"
                className="mentorlm-session-menu-btn"
                aria-label="Chat options"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === s.id ? null : s.id);
                }}
              >
                ···
              </button>
              {menuOpenId === s.id && (
                <div className="mentorlm-session-menu" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="mentorlm-menu-delete" onClick={() => deleteSession(s.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mentorlm-sidebar-footer">
          <button type="button" className="flow-link-button" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <button type="button" className="flow-link-button" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div className="mentorlm-main">
        <header className="mentorlm-topbar">
          {!sidebarOpen && (
            <button className="mentorlm-burger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              ☰
            </button>
          )}
          <span className="mentorlm-brand">MentorLM</span>
          <span className="mentorlm-subtitle">Your AI study companion</span>
        </header>

        <div className="mentorlm-messages">
          {activeSession?.messages.length === 0 && (
            <div className="mentorlm-empty">
              <h2>Привет, {profile.name} 👋</h2>
              <p>Спроси меня про конкурсы, стипендии, или как подготовиться к поступлению.</p>
              <div className="mentorlm-suggestions">
                {[
                  "Какие конкурсы подходят для моего профиля?",
                  "Помоги написать мотивационное письмо",
                  "Что делать в 10 классе для поступления?",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="mentorlm-suggestion"
                    onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSession?.messages.map((msg, i) => (
            <div key={i} className={`mentorlm-msg mentorlm-msg-${msg.role}`}>
              <div className="mentorlm-msg-bubble">
                {msg.content || (streaming && msg.role === "assistant" && i === activeSession.messages.length - 1
                  ? <span className="mentorlm-cursor" />
                  : null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mentorlm-input-row">
          <textarea
            ref={textareaRef}
            className="mentorlm-input"
            rows={1}
            placeholder="Напиши вопрос… (Enter — отправить, Shift+Enter — новая строка)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={streaming}
          />
          <button
            className="mentorlm-send"
            type="button"
            onClick={submit}
            disabled={streaming || !input.trim()}
          >
            {streaming ? "..." : "↑"}
          </button>
        </div>
      </div>
    </div>
  );
}
