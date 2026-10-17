---
name: page-header
title: Page header
type: site
surface: site
description: "An inner page's opening on the 680px reading column: the blue eyebrow, the 52px title, a hairline 28px under it, and an optional lead in 24px text (18px on phones), left aligned, 150px from the top so it clears the bare header."
kinds: [eyebrow]
use_for: "The top of an inner page (about, a form, terms, a changelog), under a white site header. Short lines that belong to the title go in children."
never: [A blue ground behind it, Centered, A second title under it, More than one per page]
source: agentcard-website src/app/globals.css:1808 (.v7-about, .v7-about-head); agentcard.sh /about and /get-started (computed)
---

`PageHeader` props: `eyebrow`, `title`, `lead`, `rule` (default true), `children` (inside the head, under the title).
The live /about sets its lead at 24px (18px on phones), not 19px; the component follows the live page.
