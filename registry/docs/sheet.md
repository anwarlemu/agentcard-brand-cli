---
name: sheet
title: Sheet
type: ui
surface: site
description: "One of the brand's windows as a side panel: the sky title bar with a file-like name and a close mark, floating 8px in from the edge over the ink scrim, sliding in from its side."
kinds: [window, window-bar]
use_for: "Detail about one item while the list stays in view (a card's purchase log), or a longer form. `side` right (default), left or bottom; `modal={false}` on Sheet keeps the page usable."
never: [Sheets for a quick confirmation (use a dialog), Full-screen sheets on desktop, Two sheets at once]
source: "agentcard-website src/app/globals.css (.v7-guide-nav, .v7-windowbar); live https://www.agentcard.sh (.v7-gate::backdrop)"
---
