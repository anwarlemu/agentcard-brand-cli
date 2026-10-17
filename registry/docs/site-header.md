---
name: site-header
title: Site header
type: site
surface: site
description: "The bare header: the lockup at the left linking home and one Get started key (the white key, blue text) at the right, laid over the top of the page 20px down and 30px in. White lockup over the blue hero, ink on a white page."
kinds: [header, header-action, nav-link]
use_for: "Every page's top. Pair it with the nav dock for navigation; links in the header are optional and leave on phones. With the dock on a page, hide the header on phones (`className=\"max-md:hidden\"`), as the site does."
never: [A filled or sticky header bar, More than one key, A blue key in the header, Many links in the header]
source: agentcard-website src/components/v7/space-header.tsx; src/app/globals.css:4102 (.v7-space-header, .v7-get-started-face); agentcard.sh / and /pricing (computed)
---

`SiteHeader` props: `logo` (ReactNode, default the lockup), `href` (default "/"), `logoLabel` (default "Agentcard,
home"), `action` ({ label, href }), `links` ({ label, href, current }[]), `ground` ("blue" | "white", default blue),
`overlay` (default true: absolute over its positioned parent), plus header props.
