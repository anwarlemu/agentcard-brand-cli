---
name: band-divider
title: Band divider
type: visual
surface: site
description: "Stepped divider between page backgrounds."
kinds: []
use_for: "Use where blue sections meet white or paper. Hero, SiteFooter and Cta already include their dividers."
never: [A smooth gradient between grounds, A divider between two sections on the same ground, Steps of other heights, Grain anywhere else on the page]
source: agentcard-website src/components/band-divider.tsx; src/app/globals.css:527 (.band-divider, .band-step); agentcard.sh / (computed)
---

`BandDivider` props: `from` and `to` ("blue" | "white" | "paper" | "ink", defaults blue to white), `grain` (default
true). The file also exports `Scan`, the scanlines and vignette the blue grounds wear (`sides` adds the hero's darker
side shades); place it inside a positioned, isolated blue box.
