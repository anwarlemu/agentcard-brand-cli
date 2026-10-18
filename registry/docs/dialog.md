---
name: dialog
title: Dialog
type: ui
surface: site
description: "Modal dialog with a title bar, focus trap and close control."
kinds: [window, window-bar]
use_for: "Use for a short form or confirmation. Provide a title and description. Set name for the title bar and size for wider content. Connect form submission and validation to the application."
never: [Dialogs for long reading, A dialog opened from another dialog, Blurring the page behind, Sliding in from an edge (use a sheet)]
source: "Extension from agentcard-website src/app/globals.css (.v7-windowbar); src/components/v7/window-mark.tsx"
---
