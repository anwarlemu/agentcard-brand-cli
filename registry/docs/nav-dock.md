---
name: nav-dock
title: Nav dock
type: site
surface: site
description: "Floating navigation that becomes a top bar and menu on phones."
kinds: [nav-dock, nav-link]
use_for: "Use with SiteHeader. Mark the current page and provide working destinations. Set hideAt to the footer’s id to hide the dock while the footer is visible."
never: [Two docks, More than six entries, Icons instead of labels, Animating the dock on every scroll]
source: agentcard-website src/components/v7/section-dock.tsx; src/app/globals.css:4048 (.v7-dock-nav, .v7-dock-card, .v7-dock-go, .v7-mbar); agentcard.sh / (computed)
---

`NavDock` props: `links` ((DockLink | DockMenu)[]; DockLink = { label, href, current }, DockMenu = { label, items:
{ title, description, href }[], current }), `menu` (a DockMenu placed after the first link), `action` ({ label, href }),
`logo`, `logoHref`, `logoLabel` (the phone bar's mark), `center` (a short line in the phone bar), `hideAt` (an element
id), `label` (the landmark's name, default "Main"), `defaultOpen` (a menu's label).

Motion: the bar and the key fade and rise 16px in (240ms, ease-out; only the fade with reduced motion); the card and the
phone sheet pop from their trigger (scale 0.97 and fade, 160ms; only the fade with reduced motion); links wash on hover
and shrink to 0.96 on press.
