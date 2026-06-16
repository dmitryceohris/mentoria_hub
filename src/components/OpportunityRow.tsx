import type { Opportunity } from "../data/content";
import { SaveButton } from "./SaveButton";

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
      <SaveButton label={`Save ${opportunity.title}`} />
    </article>
  );
}
