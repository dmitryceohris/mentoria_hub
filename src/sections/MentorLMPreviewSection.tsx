import { ConsoleShell } from "../components/ConsoleShell";
import { ChatCircleDots, NotePencil } from "@phosphor-icons/react";

function MentorLMBadge() {
  return (
    <div className="mentorlm-preview-badge" aria-label="MentorLM study assistant mark" role="img">
      <ChatCircleDots aria-hidden="true" size={27} weight="light" />
      <span>LM</span>
    </div>
  );
}

export function MentorLMPreviewSection() {
  return (
    <section className="product-section mentorlm-preview-section" id="mentorlm" aria-labelledby="mentorlm-preview-title">
      <div className="match-copy product-copy">
        <h2 id="mentorlm-preview-title">MentorLM keeps lesson context close</h2>
        <p>
          When a student gets stuck, MentorLM turns the question into a small note that stays attached to the exact
          course lesson.
        </p>
      </div>

      <div className="product-console" aria-label="MentorLM notes and Telegram reminders preview">
        <ConsoleShell
          title="Course support"
          intro="MentorLM appears inside the lesson workflow, beside the video and lesson list."
          coreClassName="product-core"
        >
          <div className="mentorlm-preview-course-board">
            <article className="mentorlm-preview-video-player" aria-labelledby="mentorlm-preview-video-title">
              <div className="mentorlm-preview-video-topbar">
                <span>Physics Basics</span>
                <span>Lesson 2 of 4</span>
              </div>
              <div className="mentorlm-preview-video-screen" aria-hidden="true">
                <span className="mentorlm-preview-video-route" />
                <span className="mentorlm-preview-video-node mentorlm-preview-video-node-a" />
                <span className="mentorlm-preview-video-node mentorlm-preview-video-node-b" />
                <span className="mentorlm-preview-video-node mentorlm-preview-video-node-c" />
                <span className="mentorlm-preview-play-button" />
              </div>
              <div className="mentorlm-preview-video-copy">
                <span>Now playing</span>
                <h3 id="mentorlm-preview-video-title">Newton&apos;s 2nd Law</h3>
                <p>How does it work?</p>
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
              <ol className="lesson-list" aria-label="Physics Basics lesson list">
                <li className="lesson-item lesson-item-complete">
                  <span className="lesson-index">01</span>
                  <div className="lesson-content">
                    <span className="lesson-title">Forces and useful models</span>
                    <span className="lesson-duration">22 min</span>
                  </div>
                  <span className="lesson-state">Done</span>
                </li>
                <li className="lesson-item lesson-item-active">
                  <span className="lesson-index">02</span>
                  <div className="lesson-content">
                    <span className="lesson-title">Newton&apos;s 2nd Law</span>
                    <span className="lesson-duration">24 min · unclear concept</span>
                    <div className="lesson-note-inline">
                      <span>MentorLM note</span>
                      <p>Net force changes motion. More force increases acceleration; more mass needs more force.</p>
                    </div>
                  </div>
                  <span className="lesson-state lesson-state-live">Note saved</span>
                </li>
                <li className="lesson-item">
                  <span className="lesson-index">03</span>
                  <div className="lesson-content">
                    <span className="lesson-title">Energy methods</span>
                    <span className="lesson-duration">25 min</span>
                  </div>
                </li>
                <li className="lesson-item">
                  <span className="lesson-index">04</span>
                  <div className="lesson-content">
                    <span className="lesson-title">From problem to research question</span>
                    <span className="lesson-duration">20 min</span>
                  </div>
                </li>
              </ol>

              <aside className="mentorlm-popup-chat" aria-label="MentorLM note popup for Lesson 2">
                <span className="mentorlm-popup-anchor" aria-hidden="true" />
                <div className="mentorlm-popup-head">
                  <div className="mentorlm-badge-shell">
                    <MentorLMBadge />
                  </div>
                  <div className="mentorlm-copy">
                    <strong>
                      MentorLM <span aria-hidden="true">&middot;</span> Course note mode
                    </strong>
                    <span>Next step: Finish Lesson 2</span>
                  </div>
                  <span className="mentorlm-status">Saved</span>
                </div>
                <div className="chat-message chat-message-student">
                  I didn&apos;t understand Lesson 2. Please leave a note for this lesson.
                </div>
                <div className="chat-message chat-message-mentor">
                  Added under Lesson 2 as a small course note.
                </div>
              </aside>
            </div>
          </div>
          <div className="mentorlm-preview-notes">
            <article>
              <NotePencil aria-hidden="true" size={16} weight="light" />
              <strong>Beginner IELTS</strong>
              <p>Add a personal note: practice listening before school on Tuesday and Thursday.</p>
            </article>
            <article>
              <NotePencil aria-hidden="true" size={16} weight="light" />
              <strong>Physics prep</strong>
              <p>Telegram reminder: review experiment notes two days before the mentor session.</p>
            </article>
            <article id="mentors">
              <NotePencil aria-hidden="true" size={16} weight="light" />
              <strong>Human mentor handoff</strong>
              <p>When an application needs judgment, MentorLM keeps the context ready for a mentor.</p>
            </article>
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}
