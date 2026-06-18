import { ConsoleShell } from "../components/ConsoleShell";
import { useT } from "../lib/i18n";

export function RecommendedMatchesSection() {
  const t = useT();

  return (
    <section className="product-section" id="features" aria-labelledby="matches-title">
      <div className="match-copy product-copy">
        <h2 id="matches-title">{t.public.matchesTitle}</h2>
        <p>{t.public.matchesCopy}</p>
      </div>

      <div className="product-console" aria-label={t.public.dashboardPreview}>
        <ConsoleShell
          title={t.public.studentDashboard}
          intro={t.public.dashboardIntro}
          coreClassName="product-core"
        >
          <div className="dashboard-grid">
            <article className="dashboard-row">
              <strong>International Young Physicists&apos; Tournament 2026</strong>
              <span>{t.public.researchPrep}</span>
            </article>
            <article className="dashboard-row">
              <strong>Beamline for Schools 2026</strong>
              <span>{t.public.proposalPrep}</span>
            </article>
            <article className="dashboard-row dashboard-row-soft">
              <strong>{t.public.coursePrep}</strong>
              <span>{t.public.coursePrepCopy}</span>
            </article>
          </div>
          <div className="dashboard-note">{t.public.dashboardNote}</div>
        </ConsoleShell>
      </div>
    </section>
  );
}
