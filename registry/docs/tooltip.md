---
name: tooltip
title: Tooltip
type: ui
surface: site
description: "A short floating label: white, a hairline, 8px corners and the tooltip shadow, in the 12px display face, growing from its trigger after a beat."
kinds: []
use_for: "Naming an icon key or adding a few words to a control. Next ones in a row appear at once."
never: [Tooltips for anything needed to finish a task, Long text (use a popover), Dark tooltips]
source: "agentcard-website src/app/globals.css (.v7-dock-card)"
---

Wrap adjacent tooltips in `TooltipProvider` to share the hover delay. A standalone `Tooltip` supplies its own provider.
