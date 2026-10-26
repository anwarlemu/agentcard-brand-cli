---
name: alert-dialog
title: Alert Dialog
type: ui
surface: site
description: "A confirmation in the brand's window: the sky title bar, a 24px display title, then Cancel and the action over a rule."
use_for: "Use to confirm an action that cannot be undone or costs money (freezing a card, removing an agent). Give it a title that names the action and a description of the result. Put AlertDialogCancel first and AlertDialogAction last; use variant destructive on the action for removals. Pass name for the title bar and size sm for a short question."
never: [A red-filled key, Closing on an outside click, More than two actions, Long forms (use a dialog)]
source: "Extension from agentcard-website src/app/globals.css (.v7-windowbar), as the dialog"
---
