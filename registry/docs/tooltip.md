---
name: tooltip
title: Tooltip
type: ui
surface: site
description: "Short contextual label shown on hover or keyboard focus."
kinds: []
use_for: "Use to explain an icon control or add brief context. Keep a separate accessible name on the control; do not put essential instructions only in the tooltip."
never: [Tooltips for anything needed to finish a task, Long text (use a popover), Dark tooltips]
source: "Extension from agentcard-website src/app/globals.css (.v7-dock-card)"
---

Wrap adjacent tooltips in `TooltipProvider` to share the hover delay. A standalone `Tooltip` supplies its own provider.
