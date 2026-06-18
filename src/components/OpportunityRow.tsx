import type { Opportunity } from "../data/content";
import { MatchButton } from "./MatchButton";
import { getOpportunityTranslation } from "../lib/opportunityText";
import { useLocale, useT } from "../lib/i18n";

type OpportunityRowProps = {
  opportunity: Opportunity;
};

export function OpportunityRow({ opportunity }: OpportunityRowProps) {
  const { locale } = useLocale();
  const t = useT();
  const displayOpportunity = getOpportunityTranslation(opportunity, locale);

  return (
    <article className="opportunity-row">
      <div className="opportunity-row-main">
        <h3>{displayOpportunity.title}</h3>
        <p>{displayOpportunity.description}</p>
      </div>
      <MatchButton label={t.workspace.matchLabel(displayOpportunity.title)} />
    </article>
  );
}
