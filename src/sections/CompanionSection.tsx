import { ConsoleShell } from "../components/ConsoleShell";

export function CompanionSection() {
  return (
    <section className="product-section companion-section" id="companion" aria-labelledby="companion-title">
      <div className="match-copy product-copy">
        <h2 id="companion-title">MentorPet keeps context close</h2>
        <p>
          MentorPet can add personal notes to course programs, remind students what to do next, and notify them through a
          Telegram add-on.
        </p>
      </div>

      <div className="product-console" aria-label="MentorPet notes and Telegram reminders preview">
        <ConsoleShell title="Notes and reminders" intro="Course notes and timely nudges stay attached to the student path." coreClassName="product-core">
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
