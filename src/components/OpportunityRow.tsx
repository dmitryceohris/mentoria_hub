import type { Opportunity } from "../data/content";
import { MatchButton } from "./MatchButton";
import { getOpportunityTranslation } from "../lib/opportunityText";

type OpportunityRowProps = {
  opportunity: Opportunity;
};

export function OpportunityRow({ opportunity }: OpportunityRowProps) {
  const displayOpportunity = getOpportunityTranslation(opportunity);

  return (
    <article className="opportunity-row">
      <div className="opportunity-row-main">
        <h3>{displayOpportunity.title}</h3>
        <p>{displayOpportunity.description}</p>
      </div>
      <MatchButton label={`Match ${displayOpportunity.title}`} />
    </article>
  );
}
