---
name: section
title: Section
type: site
surface: site
description: "Page section, section heading and optional label."
kinds: [section, column, section-heading, section-description, eyebrow]
use_for: "Use SiteSection for content layout, SectionHeading for the title and description, and Eyebrow for an optional label. Choose white, paper or blue backgrounds as needed."
never: [Two blue sections in a row, Left-aligned section titles over centered content, Bold titles, Eyebrows in caps, A ground change without a band divider]
source: agentcard-website src/app/globals.css:1520 (.v7-section), :1585 (.v7-heading-center), :1509 (.v7-eyebrow); agentcard.sh / and /about (computed)
---

`SiteSection` props: `ground` ("white" | "paper" | "blue"), `contained` (default true: the 1200px column),
`innerClassName`, plus section props. `SectionHeading` props: `title`, `description`, `eyebrow`, `as` ("h1" | "h2" |
"h3", default h2), `align` ("center" | "start"). `Eyebrow` takes paragraph props.
