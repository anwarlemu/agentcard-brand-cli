---
name: secret-field
title: Secret field
type: ui
surface: site
description: "A key or a card number on a sunken well, masked to its first characters in the display face, with a show key and a copy key."
kinds: []
use_for: "Showing an API key or a card number that should stay hidden until asked for. `defaultRevealed` for the moment right after it is created."
never: [Showing a secret in full by default, Editable secrets (use an input), Secrets without a copy key]
source: "agentcard-website src/app/globals.css (.plan-tabs well, --bevel-white)"
---
