---
name: marquee
title: Marquee
type: visual
surface: site
description: "The running line: names in the 12px display face, each followed by a small star, between two rules, sliding sideways in a 48s linear loop. Stops under the pointer; stands still with reduced motion."
kinds: [logo-strip]
use_for: "The footer's line of merchants, a strip of customer or partner names. One per page."
never: [Logos in color on the line, A fast loop (under 30s a lap), Two running lines on one page, Text a reader must read to act]
source: agentcard-website src/components/v7/site-footer.tsx (.v7-foot-line); src/app/globals.css:5073; agentcard.sh / (computed)
---

`Marquee` props: `items` (ReactNode[]), `label` (what a screen reader hears; defaults to the names joined), `separator`
(default ✳), `duration` (seconds a lap, default 48), `ground` ("blue" | "white", default blue).
