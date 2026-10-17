---
name: input
title: Input
type: ui
surface: site
description: "The brand's form field: square, a 35 percent ink border, 18px Inter, 10px by 12px of padding, a 2px blue outline on focus; and the guides' search box (`search`): 36px, 8px corners, a pale edge that darkens under the pointer, a search mark."
kinds: [input]
use_for: "Every single-line text entry, inside a Field so it has its 12px display label above. `aria-invalid` with the Field's error for a value that will not do. `variant=\"search\"` for a search or filter box (the guides' search: 36px, 8px corners, a pale edge, an icon), with an aria-label."
never: [Rounded form fields (only the search box has corners), Gray filled inputs, Placeholder text as the only label, A glow or ring on focus (the brand draws the outline)]
source: "agentcard-website src/app/globals.css (.v7-gate-field input, .v7-guide-search); live https://www.agentcard.sh/get-started (computed)"
---
