---
name: secret-field
title: Secret field
type: ui
surface: site
description: "A key or a card number in the guides' search box (white, 8px corners, a pale ink edge, a faint inner shadow), masked to its first characters, with a show key and a copy key."
kinds: []
use_for: "Showing an API key or a card number that should stay hidden until asked for. `defaultRevealed` for the moment right after it is created."
never: [Showing a secret in full by default, Editable secrets (use an input), Secrets without a copy key]
source: "agentcard-website src/app/globals.css (.v7-guide-search, .v7-command button)"
---
