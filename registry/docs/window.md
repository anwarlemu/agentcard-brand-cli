---
name: window
title: Window
type: ui
surface: site
description: "A card with a 32px title bar: an arrow, a file-like name (pricing.plan, team.dir) and the [*] mark. Sky bar with blue marks, the blue bar for the featured window, or a tint: the home page's customer windows, a 26px pale bar lit across its middle."
kinds: [window, window-bar, card]
use_for: "Plans, customer cases, directories, the FAQ: anything that reads as a small app or file. One blue-bar window per group at most (the plan that matters)."
never: [A window bar on every card of a page, Colored bars other than sky blue and the five tints, Rounded corners above 12px]
source: "agentcard.sh /pricing (.v7-offer-card .v7-windowbar) and / (.v7-customer), computed; agentcard-website src/components/v7/window-mark.tsx"
---
