---
name: page-header
title: Page header
type: site
surface: site
description: "Title, optional label and introduction for an inner page."
kinds: [eyebrow]
use_for: "Place below SiteHeader on company, form, legal or update pages. Put supporting title content in children."
never: [A blue ground behind it, Centered, A second title under it, More than one per page]
source: agentcard-website src/app/globals.css:1808 (.v7-about, .v7-about-head); agentcard.sh /about and /get-started (computed)
---

`PageHeader` props: `eyebrow`, `title`, `lead`, `rule` (default true), `children` (inside the head, under the title).
The live /about sets its lead at 24px (18px on phones), not 19px; the component follows the live page.
