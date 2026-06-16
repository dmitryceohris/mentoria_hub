import type { Opportunity } from "../data/content";
import { MatchButton } from "./MatchButton";

type OpportunityRowProps = {
  opportunity: Opportunity;
};

export function OpportunityRow({ opportunity }: OpportunityRowProps) {
  return (
    <article className="opportunity-row">
      <div className="opportunity-row-main">
        <h3>{opportunity.title}</h3>
        <p>{opportunity.description}</p>
      </div>
      <MatchButton label={`Match ${opportunity.title}`} />
    </article>
  );
}
