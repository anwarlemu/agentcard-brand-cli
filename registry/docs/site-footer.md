---
name: site-footer
title: Site footer
type: site
surface: site
description: "Footer with navigation groups, logos and optional merchant list."
kinds: [footer, logo-strip, link]
use_for: "Provide link groups, description and optional backing content. Check that every link resolves. Add an id when NavDock uses hideAt."
never: [A white footer, Icons beside every link, More than six columns, Bold headings, A second wordmark]
source: agentcard-website src/components/v7/site-footer.tsx; src/app/globals.css:5049 (.v7-foot); agentcard.sh / (computed)
---

`SiteFooter` props: `groups` ({ title, links: { label, href, external }[] }[]), `merchants` (string[]),
`merchantsLabel`, `backing` (ReactNode: the sky line, with a small logo inside), `backingLabel`, `logo` (default the
white lockup), `logoHref`, `logoLabel`, `description`, `wordmark` (string or null, default "AGENTCARD"), `bandFrom` (the
ground above, default white; null for none), plus footer props. Give it an `id` to let the nav dock step aside.
