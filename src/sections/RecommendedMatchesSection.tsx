import { ConsoleShell } from "../components/ConsoleShell";

export function RecommendedMatchesSection() {
  return (
    <section className="product-section" id="features" aria-labelledby="matches-title">
      <div className="match-copy product-copy">
        <h2 id="matches-title">Keep every next step visible</h2>
        <p>
          Review matched programs, watch valid deadlines, and keep course preparation attached to the same student
          workspace.
        </p>
      </div>

      <div className="product-console" aria-label="Recommended matches dashboard preview">
        <ConsoleShell
          title="Student dashboard"
          intro="A quiet workspace for recommended programs, prep tasks, and mentor handoff."
          coreClassName="product-core"
        >
          <div className="dashboard-grid">
            <article className="dashboard-row">
              <strong>International Young Physicists&apos; Tournament 2026</strong>
              <span>Research outline and national selection prep</span>
            </article>
            <article className="dashboard-row">
              <strong>Beamline for Schools 2026</strong>
              <span>Draft experiment proposal with mentor review</span>
            </article>
            <article className="dashboard-row dashboard-row-soft">
              <strong>Course prep</strong>
              <span>Physics fundamentals, academic English, and writing support stay linked to recommended matches.</span>
            </article>
          </div>
          <div className="dashboard-note">Recommended matches stay connected to deadlines, prep notes, and mentor review.</div>
        </ConsoleShell>
      </div>
    </section>
  );
}
