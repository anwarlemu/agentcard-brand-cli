---
name: site-footer
title: Site footer
type: site
surface: site
description: "The blue footer: the stepped band in, the brand block (backing line in sky, the white lockup, a two-line description), the sitemap in 12px display-face columns with sky headings, the running merchant line between rules, and the striped wordmark across the full width, under scanlines."
kinds: [footer, logo-strip, link]
use_for: "The foot of every page. All content comes through props: the link groups, the merchants, the backing, the description, the word."
never: [A white footer, Icons beside every link, More than six columns, Bold headings, A second wordmark]
source: agentcard-website src/components/v7/site-footer.tsx; src/app/globals.css:5049 (.v7-foot); agentcard.sh / (computed)
---

`SiteFooter` props: `groups` ({ title, links: { label, href, external }[] }[]), `merchants` (string[]),
`merchantsLabel`, `backing` (ReactNode: the sky line, with a small logo inside), `backingLabel`, `logo` (default the
white lockup), `logoHref`, `logoLabel`, `description`, `wordmark` (string or null, default "AGENTCARD"), `bandFrom` (the
ground above, default white; null for none), plus footer props. Give it an `id` to let the nav dock step aside.
