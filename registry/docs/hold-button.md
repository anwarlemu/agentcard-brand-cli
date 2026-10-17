---
name: hold-button
title: Hold button
type: ui
surface: site
description: "Hold to confirm, as a white key with red text that fills red from the left over two seconds while held and snaps back on release."
kinds: [button-secondary]
use_for: "An action that cannot be undone (close a card, delete a key), where a confirm dialog would be too heavy."
never: [Hold for actions that can be undone, Hiding how long to hold, A blue fill for a destructive action]
source: "agentcard-website src/app/globals.css (--bevel-white); principles (keys sink on press)"
---
