---
name: dialog
title: Dialog
type: ui
surface: site
description: "One of the brand's windows as a modal: white, a hairline, 12px corners, the sky title bar with a file-like name and a close mark, centered over the ink scrim, popping in from scale 0.97."
kinds: [window, window-bar]
use_for: "A short task or a confirmation that needs the reader's full attention: create a card, confirm a change. `name` labels the bar (card.new); `tone=\"blue\"` for the one that matters; `size` for wider content."
never: [Dialogs for long reading, A dialog opened from another dialog, Blurring the page behind, Sliding in from an edge (use a sheet)]
source: "agentcard-website src/app/globals.css (.v7-windowbar); src/components/v7/window-mark.tsx"
---
