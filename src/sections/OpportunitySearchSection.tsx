import { ConsoleShell } from "../components/ConsoleShell";
import { OpportunityRow } from "../components/OpportunityRow";
import { SearchIcon } from "../components/SearchIcon";
import { previewOpportunities } from "../data/previewContent";
import { useT } from "../lib/i18n";

export function OpportunitySearchSection() {
  const t = useT();
  const criteria = [
    [t.public.criteria.direction, t.public.criteria.physics],
    [t.public.criteria.format, t.public.criteria.any],
    [t.public.criteria.location, t.public.criteria.global],
    [t.public.criteria.grade, t.public.criteria.grade10],
    [t.public.criteria.type, t.public.criteria.competition]
  ];

  return (
    <section className="match-section" id="match-console" aria-labelledby="match-section-title">
      <div className="match-copy">
        <h2 id="match-section-title">{t.public.searchTitle}</h2>
        <p>{t.public.searchCopy}</p>
      </div>

      <div className="match-console match-console-dock" aria-labelledby="console-title">
        <ConsoleShell title={t.public.searchConsole} titleId="console-title">
          <div className="showcase-search" aria-label={t.public.searchQuery}>
            <SearchIcon />
            <span>physics competitions</span>
          </div>

          <div className="criteria-grid" aria-label={t.public.selectedFilters}>
            {criteria.map(([label, value]) => (
              <div className="criteria-select" key={label}>
                <span className="criteria-label">{label}</span>
                <span className="criteria-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="result-panel" aria-label={t.public.showcase}>
            <p className="result-heading">{t.public.matchedCount}</p>
            {previewOpportunities[0] ? <OpportunityRow opportunity={previewOpportunities[0]} /> : null}
            <div className="iypt-popover-anchor">
              {previewOpportunities[1] ? <OpportunityRow opportunity={previewOpportunities[1]} /> : null}
              <aside
                className="opportunity-popover"
                aria-label={t.public.iyptLabel}
              >
                <strong>{t.public.iyptTitle}</strong>
                <p>{t.public.iyptCopy}</p>
                <a href="https://www.iypt.org/" target="_blank" rel="noreferrer">
                  https://www.iypt.org/
                </a>
              </aside>
            </div>
            {previewOpportunities[2] ? <OpportunityRow opportunity={previewOpportunities[2]} /> : null}
            {previewOpportunities[3] ? <OpportunityRow opportunity={previewOpportunities[3]} /> : null}
          </div>
        </ConsoleShell>
      </div>
    </section>
  );
}
