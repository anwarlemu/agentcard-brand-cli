---
name: marquee
title: Marquee
type: visual
surface: site
description: "Scrolling row of names that pauses on hover and respects reduced motion."
kinds: [logo-strip]
use_for: "Use for a merchant, customer or partner list. Use at most one per page."
never: [Logos in color on the line, A fast loop (under 30s a lap), Two running lines on one page, Text a reader must read to act]
source: agentcard-website src/components/v7/site-footer.tsx (.v7-foot-line); src/app/globals.css:5073; agentcard.sh / (computed)
---

`Marquee` props: `items` (ReactNode[]), `label` (what a screen reader hears; defaults to the names joined), `separator`
(default ✳), `duration` (seconds a lap, default 48), `ground` ("blue" | "white", default blue).
