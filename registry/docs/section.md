---
name: section
title: Section
type: site
surface: site
description: "A band of the page on the 1200px column (80px above and 110px below; 50px and 65px on phones), its centered heading (36px display title, 19px description at 70 percent, 14px apart) and the small display-face eyebrow."
kinds: [section, column, section-heading, section-description, eyebrow]
use_for: "Every content band of a page. `SectionHeading` opens each band; `Eyebrow` labels a block (blue on white, sky on the blue). Grounds: white by default, paper for the warm page, blue for a lit band."
never: [Two blue sections in a row, Left-aligned section titles over centered content, Bold titles, Eyebrows in caps, A ground change without a band divider]
source: agentcard-website src/app/globals.css:1520 (.v7-section), :1585 (.v7-heading-center), :1509 (.v7-eyebrow); agentcard.sh / and /about (computed)
---

`SiteSection` props: `ground` ("white" | "paper" | "blue"), `contained` (default true: the 1200px column),
`innerClassName`, plus section props. `SectionHeading` props: `title`, `description`, `eyebrow`, `as` ("h1" | "h2" |
"h3", default h2), `align` ("center" | "start"). `Eyebrow` takes paragraph props.
