---
name: site-header
title: Site header
type: site
surface: site
description: "Page header with the Agentcard logo and a primary link."
kinds: [header, header-action, nav-link]
use_for: "Use at the top of a page. Pair with NavDock for navigation. Hide the header on phones when the dock already provides the mobile header."
never: [A filled or sticky header bar, More than one key, A blue key in the header, Many links in the header]
source: agentcard-website src/components/v7/space-header.tsx; src/app/globals.css:4102 (.v7-space-header, .v7-get-started-face); agentcard.sh / and /pricing (computed)
---

`SiteHeader` props: `logo` (ReactNode, default the lockup), `href` (default "/"), `logoLabel` (default "Agentcard,
home"), `action` ({ label, href }), `links` ({ label, href, current }[]), `ground` ("blue" | "white", default blue),
`overlay` (default true: absolute over its positioned parent), plus header props.
