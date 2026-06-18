import { ChatCircleDots, NotePencil } from "@phosphor-icons/react";
import { ConsoleShell } from "../components/ConsoleShell";
import { useT } from "../lib/i18n";

function MentorLMBadge() {
  const t = useT();

  return (
    <div className="mentorlm-preview-badge" aria-label={t.public.mentorPreview} role="img">
      <ChatCircleDots aria-hidden="true" size={27} weight="light" />
      <span>LM</span>
    </div>
  );
}

export function MentorLMPreviewSection() {
  const t = useT();

  return (
    <section className="product-section mentorlm-preview-section" id="mentorlm" aria-labelledby="mentorlm-preview-title">
      <div className="match-copy product-copy">
        <h2 id="mentorlm-preview-title">{t.public.mentorTitle}</h2>
        <p>{t.public.mentorCopy}</p>
      </div>

      <div className="product-console" aria-label={t.public.mentorPreview}>
        <ConsoleShell title={t.public.courseSupport} intro={t.public.courseSupportIntro} coreClassName="product-core">
          <div className="mentorlm-preview-course-board">
            <article className="mentorlm-preview-video-player" aria-labelledby="mentorlm-preview-video-title">
              <div className="mentorlm-preview-video-topbar">
                <span>{t.public.physicsBasics}</span>
                <span>{t.public.lesson2of4}</span>
              </div>
              <div className="mentorlm-preview-video-screen" aria-hidden="true">
                <span className="mentorlm-preview-video-route" />
                <span className="mentorlm-preview-video-node mentorlm-preview-video-node-a" />
                <span className="mentorlm-preview-video-node mentorlm-preview-video-node-b" />
                <span className="mentorlm-preview-video-node mentorlm-preview-video-node-c" />
                <span className="mentorlm-preview-play-button" />
              </div>
              <div className="mentorlm-preview-video-copy">
                <span>{t.public.nowPlaying}</span>
                <h3 id="mentorlm-preview-video-title">{t.public.newton}</h3>
                <p>{t.public.howWorks}</p>
              </div>
              <div className="mentorlm-preview-video-controls" aria-hidden="true">
                <span>08:14</span>
                <span className="mentorlm-preview-video-track">
                  <span />
                </span>
                <span>24:00</span>
              </div>
            </article>

            <div className="mentorlm-preview-learning-area">
              <ol className="lesson-list" aria-label={t.public.lessonList}>
                <li className="lesson-item lesson-item-complete">
                  <span className="lesson-index">01</span>
                  <div className="lesson-content">
                    <span className="lesson-title">{t.public.forces}</span>
                    <span className="lesson-duration">22 min</span>
                  </div>
                  <span className="lesson-state">{t.public.done}</span>
                </li>
                <li className="lesson-item lesson-item-active">
                  <span className="lesson-index">02</span>
                  <div className="lesson-content">
                    <span className="lesson-title">{t.public.newton}</span>
                    <span className="lesson-duration">{t.public.unclearConcept}</span>
                    <div className="lesson-note-inline">
                      <span>{t.public.mentorNote}</span>
                      <p>{t.public.noteText}</p>
                    </div>
                  </div>
                  <span className="lesson-state lesson-state-live">{t.public.noteSaved}</span>
                </li>
                <li className="lesson-item">
                  <span className="lesson-index">03</span>
                  <div className="lesson-content">
                    <span className="lesson-title">{t.public.energyMethods}</span>
                    <span className="lesson-duration">25 min</span>
                  </div>
                </li>
                <li className="lesson-item">
                  <span className="lesson-index">04</span>
                  <div className="lesson-content">
                    <span className="lesson-title">{t.public.researchQuestion}</span>
                    <span className="lesson-duration">20 min</span>
                  </div>
                </li>
              </ol>

              <aside className="mentorlm-popup-chat" aria-label={t.public.popupLabel}>
                <span className="mentorlm-popup-anchor" aria-hidden="true" />
                <div className="mentorlm-popup-head">
                  <div className="mentorlm-badge-shell">
                    <MentorLMBadge />
                  </div>
                  <div className="mentorlm-copy">
                    <strong>
                      MentorLM <span aria-hidden="true">&middot;</span> {t.public.courseNoteMode}
                    </strong>
                    <span>{t.public.nextStepLesson}</span>
                  </div>
                  <span className="mentorlm-status">{t.actions.saved}</span>
                </div>
                <div className="chat-message chat-message-student">{t.public.studentMessage}</div>
                <div className="chat-message chat-message-mentor">{t.public.assistantMessage}</div>
              </aside>
            </div>
          </div>
          <div className="mentorlm-preview-notes">
            <article>
              <NotePencil aria-hidden="true" size={16} weight="light" />
              <strong>{t.public.beginnerIelts}</strong>
              <p>{t.public.ieltsNote}</p>
            </article>
            <article>
              <NotePencil aria-hidden="true" size={16} weight="light" />
              <strong>{t.public.physicsPrep}</strong>
              <p>{t.public.telegramReminder}</p>
            </article>
            <article id="mentors">
              <NotePencil aria-hidden="true" size={16} weight="light" />
              <strong>{t.public.humanHandoff}</strong>
              <p>{t.public.handoffCopy}</p>
            </article>
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}
