import { ConsoleShell } from "../components/ConsoleShell";

export function SavedOpportunitiesSection() {
  return (
    <section className="product-section" id="features" aria-labelledby="saved-title">
      <div className="match-copy product-copy">
        <h2 id="saved-title">Keep every next step visible</h2>
        <p>
          Save programs from search, watch deadlines, and keep course preparation attached to the same student workspace.
        </p>
      </div>

      <div className="product-console" aria-label="Saved opportunities dashboard preview">
        <ConsoleShell
          title="Student dashboard"
          intro="A quiet workspace for saved programs, prep tasks, and mentor handoff."
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
              <span>Physics fundamentals, academic English, and writing support stay linked to saved opportunities.</span>
            </article>
          </div>
          <div className="dashboard-note">Shortlists grow around deadlines, prep notes, and mentor review.</div>
        </ConsoleShell>
      </div>
    </section>
  );
}
