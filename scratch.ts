import fs from "fs";
import { courses, opportunities } from "./src/data/content";

const courseIds = ["english-academic-success", "physics-basics", "biology-basics"];
const oppIds = [
  "almaty-physics-battles",
  "iypt-2026",
  "beamline-for-schools",
  "online-physics-olympiad"
];

const previewCourses = courses
  .filter(c => courseIds.includes(c.id))
  .map(c => ({ ...c, id: `preview-${c.id}` }));

const previewOpportunities = opportunities
  .filter(o => oppIds.includes(o.id))
  .map(o => ({ ...o, id: `preview-${o.id}` }));

const output = `import type { Course, Opportunity } from "./content";

export const previewCourses: Course[] = ${JSON.stringify(previewCourses, null, 2)};

export const previewOpportunities: Opportunity[] = ${JSON.stringify(previewOpportunities, null, 2)};
`;

fs.writeFileSync("src/data/previewContent.ts", output);
