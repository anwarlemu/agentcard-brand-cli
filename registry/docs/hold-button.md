---
name: hold-button
title: Hold button
type: ui
surface: site
description: "Button that confirms an action after a continuous hold."
kinds: [button-secondary]
use_for: "Use for destructive actions such as closing a card. Connect onConfirm to the action. Releasing early, leaving the control or losing focus cancels the hold."
never: [Hold for actions that can be undone, Hiding how long to hold, A blue fill for a destructive action]
source: "Extension from agentcard-website src/app/globals.css (--bevel-white); principles (keys sink on press)"
---
