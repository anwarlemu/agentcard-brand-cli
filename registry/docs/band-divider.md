---
name: band-divider
title: Band divider
type: visual
surface: site
description: "The seam between two grounds: four 9px steps walking from the ground above to the ground below, a staircase rather than a gradient, under a moving film grain (soft-light, stepped, still with reduced motion)."
kinds: []
use_for: "Every place a blue band meets white or paper: under the hero, above the footer, around a blue section. The hero, footer and CTA draw their own."
never: [A smooth gradient between grounds, A divider between two sections on the same ground, Steps of other heights, Grain anywhere else on the page]
source: agentcard-website src/components/band-divider.tsx; src/app/globals.css:527 (.band-divider, .band-step); agentcard.sh / (computed)
---

`BandDivider` props: `from` and `to` ("blue" | "white" | "paper" | "ink", defaults blue to white), `grain` (default
true). The file also exports `Scan`, the scanlines and vignette the blue grounds wear (`sides` adds the hero's darker
side shades); place it inside a positioned, isolated blue box.
