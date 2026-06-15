# Mentoria Hub Design System Rules

These rules guide implementation of Mentoria Hub UI, including any future Figma-to-code work.

## Product Direction

- The first viewport must feel like a working EdTech product, not a generic landing page.
- Current hero focus: one primary function only, opportunity search and matching.
- Main text stays left-shifted on desktop and mobile.
- Courses, MentorPet, mentors, and deadlines may appear only as supporting signals around the opportunity-matching workflow.
- Target audience is students in grades 8-11 from Kazakhstan and global contexts, while still looking credible to schools, partners, and sponsors.

## Visual System

- Use digital ethnofuturism and cybercore: precise geometric route nodes, woven-grid motifs, dark technical surfaces, and restrained luminous accents.
- Use Mentoria palette tokens: deep navy `#07131E`, near-black blue `#030B12`, cyan `#11C6CF`, light cyan `#58D9EF`, mint `#84E6EA`, teal-blue `#1594B9`, blue `#1676B8`, muted shadow blue `#315A75`.
- Avoid purple gradients, generic neon glow, beige-only palettes, stock-like atmospheric imagery, and decorative blobs.
- Use premium sans-serif stacks such as Geist, Satoshi, Outfit, Avenir Next, or system UI. Do not use Inter as the named project font.
- No emoji in UI copy, code, alt text, or labels.

## Layout And Components

- Use `min-height: 100dvh` for full-screen sections.
- Desktop hero uses an asymmetric grid: larger text area on the left, one product console on the right.
- Mobile hero collapses to: top rail, left-shifted headline, CTAs, opportunity console, bottom preview hint.
- Do not nest UI cards inside other cards. A product console may contain rows, chips, fields, and status modules, but avoid a pile of decorative cards.
- All fixed-format UI elements need stable dimensions or responsive constraints so labels, hover states, and dynamic content do not shift layout.

## Interaction And Motion

- Motion must use transform and opacity only.
- Intro order: top rail, wordmark, route/pattern nodes, opportunity console, bottom hint.
- Use tactile CTA and chip states with small translate/scale changes.
- Provide a visible empty state for searches with no matching opportunities.
- Respect `prefers-reduced-motion`.

## Figma MCP Rules

- If a Figma file is provided later, fetch design context and a screenshot before implementation.
- Treat Figma output as a visual reference, then translate it into this project's tokens and layout rules.
- Reuse existing tokens and components before adding new visual primitives.
- Do not install icon or animation packages for design polish unless the project already depends on them or the user approves it.
