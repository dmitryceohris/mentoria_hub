import { ConsoleShell } from "../components/ConsoleShell";
import { OpportunityRow } from "../components/OpportunityRow";
import { SearchIcon } from "../components/SearchIcon";
import { previewOpportunities } from "../data/previewContent";

const criteria = [
  ["Direction", "Physics"],
  ["Format", "Any"],
  ["Location", "Global"],
  ["Grade", "Grade 10"],
  ["Type", "Competition"]
];

export function OpportunitySearchSection() {
  return (
    <section className="match-section" id="match-console" aria-labelledby="match-section-title">
      <div className="match-copy">
        <h2 id="match-section-title">Find programs that fit your profile</h2>
        <p>
          Search competitions, scholarships, internships, summer schools, and courses from one focused Mentoria
          workspace.
        </p>
      </div>

      <div className="match-console match-console-dock" aria-labelledby="console-title">
        <ConsoleShell title="Opportunity Search" titleId="console-title">
          <div className="showcase-search" aria-label="Search query">
            <SearchIcon />
            <span>physics competitions</span>
          </div>

          <div className="criteria-grid" aria-label="Selected opportunity filters">
            {criteria.map(([label, value]) => (
              <div className="criteria-select" key={label}>
                <span className="criteria-label">{label}</span>
                <span className="criteria-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="result-panel" aria-label="Opportunity showcase">
            <p className="result-heading">4 matched opportunities</p>
            {previewOpportunities[0] ? <OpportunityRow opportunity={previewOpportunities[0]} /> : null}
            <div className="iypt-popover-anchor">
              {previewOpportunities[1] ? <OpportunityRow opportunity={previewOpportunities[1]} /> : null}
              <aside
                className="opportunity-popover"
                aria-label="More information about International Young Physicists' Tournament 2026"
              >
                <strong>International Young Physicists&apos; Tournament</strong>
                <p>
                  Teams prepare original research and discuss their solutions through Physics Fights. The 2026
                  tournament is hosted in Zurich.
                </p>
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
