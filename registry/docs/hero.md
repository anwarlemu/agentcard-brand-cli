---
name: hero
title: Hero
type: site
surface: site
description: "The blue hero, full bleed and the first screen tall: the 72px white display title (tracking -0.055em, leading 1), an optional eyebrow, a 19px line at 72 percent white, the white key, the site's imagery behind under scanlines, and the stepped band into the page. `tilt` sets the title in perspective like the live 3D title."
kinds: [hero, hero-title, hero-subtitle, button-on-brand]
use_for: "The home page's opening (one per site), and a product page's. Put the site header in `header` and the imagery (3D objects, a scene) in `background`."
never: [A gradient behind the title, A blue key on the blue, More than two keys, Long paragraphs in the hero, A smooth fade into the page instead of the bands]
source: agentcard-website src/components/v7/immersive-hero.tsx; src/app/globals.css:4100 (.v7-immersive, .v7-pricing-scan); agentcard.sh / (computed)
---

`Hero` props: `title`, `eyebrow`, `subtitle`, `actions` (the on-brand Button), `media` (in the flow under the actions),
`background` (full bleed behind), `header` (the site header), `tilt` (default false), `scan` (default true), `bandTo`
("white" | "paper" | "ink" | "blue" | null, default white), `fullScreen` (default true), plus section props. The section
carries `data-ds-hero`.

The live title is drawn in WebGL with real depth among the objects; `tilt` approximates it with a CSS 3D transform and a
short extrusion.
