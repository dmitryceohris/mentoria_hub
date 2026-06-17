import { ConsoleShell } from "../components/ConsoleShell";

function MentorPetOwl() {
  return (
    <svg className="mentorpet-owl" viewBox="0 0 96 96" role="img" aria-label="MentorPet owl helper">
      <path
        className="owl-body"
        d="M23 42c0-18 10.6-30 25-30s25 12 25 30v19.5C73 77 62.8 86 48 86s-25-9-25-24.5V42Z"
      />
      <path className="owl-wing" d="M30 54c-5.8 4.8-7.4 12.7-3.8 19.2 7.1-1.4 11.5-6.5 12.8-14.9" />
      <path className="owl-wing" d="M66 54c5.8 4.8 7.4 12.7 3.8 19.2-7.1-1.4-11.5-6.5-12.8-14.9" />
      <path className="owl-face" d="M30 36c3.5-10.2 12.6-13.2 18-5.9 5.4-7.3 14.5-4.3 18 5.9-2 13.3-8.5 22-18 22s-16-8.7-18-22Z" />
      <circle className="owl-eye-ring" cx="39" cy="40" r="10" />
      <circle className="owl-eye-ring" cx="57" cy="40" r="10" />
      <circle className="owl-eye-core" cx="39" cy="40" r="4.2" />
      <circle className="owl-eye-core" cx="57" cy="40" r="4.2" />
      <path className="owl-beak" d="M48 48l-5.2 7h10.4L48 48Z" />
      <path className="owl-feather" d="M39 66h18" />
      <path className="owl-feather" d="M42 73h12" />
      <circle className="owl-node" cx="27" cy="30" r="3.2" />
      <circle className="owl-node" cx="69" cy="30" r="3.2" />
    </svg>
  );
}

export function CompanionSection() {
  return (
    <section className="product-section companion-section" id="companion" aria-labelledby="companion-title">
      <div className="match-copy product-copy">
        <h2 id="companion-title">MentorPet keeps lesson context close</h2>
        <p>
          When a student gets stuck, MentorPet turns the question into a small note that stays attached to the exact
          course lesson.
        </p>
      </div>

      <div className="product-console" aria-label="MentorPet notes and Telegram reminders preview">
        <ConsoleShell
          title="Course support"
          intro="MentorPet appears inside the lesson workflow, beside the video and lesson list."
          coreClassName="product-core"
        >
          <div className="companion-course-board">
            <article className="companion-video-player" aria-labelledby="companion-video-title">
              <div className="companion-video-topbar">
                <span>Physics Basics</span>
                <span>Lesson 2 of 4</span>
              </div>
              <div className="companion-video-screen" aria-hidden="true">
                <span className="companion-video-route" />
                <span className="companion-video-node companion-video-node-a" />
                <span className="companion-video-node companion-video-node-b" />
                <span className="companion-video-node companion-video-node-c" />
                <span className="companion-play-button" />
              </div>
              <div className="companion-video-copy">
                <span>Now playing</span>
                <h3 id="companion-video-title">Newton&apos;s 2nd Law</h3>
                <p>How does it work?</p>
              </div>
              <div className="companion-video-controls" aria-hidden="true">
                <span>08:14</span>
                <span className="companion-video-track">
                  <span />
                </span>
                <span>24:00</span>
              </div>
            </article>

            <div className="companion-learning-area">
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
                      <span>MentorPet note</span>
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

              <aside className="mentorpet-popup-chat" aria-label="MentorPet note popup for Lesson 2">
                <span className="mentorpet-popup-anchor" aria-hidden="true" />
                <div className="mentorpet-popup-head">
                  <div className="mentorpet-avatar">
                    <MentorPetOwl />
                  </div>
                  <div className="mentorpet-copy">
                    <strong>
                      MentorPet <span aria-hidden="true">&middot;</span> Level 3 Explorer
                    </strong>
                    <span>Next step: Finish Lesson 2</span>
                  </div>
                  <span className="mentorpet-status">Done</span>
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
          <div className="companion-notes">
            <article>
              <strong>Beginner IELTS</strong>
              <p>Add a personal note: practice listening before school on Tuesday and Thursday.</p>
            </article>
            <article>
              <strong>Physics prep</strong>
              <p>Telegram reminder: review experiment notes two days before the mentor session.</p>
            </article>
            <article id="mentors">
              <strong>Human mentor handoff</strong>
              <p>When an application needs judgment, MentorPet keeps the context ready for a mentor.</p>
            </article>
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}
