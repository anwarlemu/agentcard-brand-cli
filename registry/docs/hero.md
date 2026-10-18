---
name: hero
title: Hero
type: site
surface: site
description: "Page opening with a blue background, heading, actions and optional media."
kinds: [hero, hero-title, hero-subtitle, button-on-brand]
use_for: "Use at the top of an Agentcard home or product page. Put SiteHeader in header and background imagery in background. Use titleClassName to adjust title sizing or wrapping."
never: [A gradient behind the title, A blue key on the blue, More than two keys, Long paragraphs in the hero, A smooth fade into the page instead of the bands]
source: "agentcard-website src/components/v7/immersive-hero.tsx; src/app/globals.css:4100 (.v7-immersive, .v7-pricing-scan); agentcard.sh / (computed)"
---

`Hero` props: `title`, `titleClassName`, `eyebrow`, `subtitle`, `actions` (the on-brand Button), `media` (in the flow under the actions),
`background` (full bleed behind), `header` (the site header), `tilt` (default false), `scan` (default true), `bandTo`
("white" | "paper" | "ink" | "blue" | null, default white), `fullScreen` (default true), plus section props. The section
carries `data-ds-hero`.

The live title is drawn in WebGL with real depth among the objects; `tilt` approximates it with a CSS 3D transform and a
short extrusion.
