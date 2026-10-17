---
name: command
title: Command
type: ui
surface: site
description: "The guides' search palette: a white panel on a 35 percent ink edge with the sky window bar, a 19px display field over a dotted rule, groups headed in blue, rows with a title and a line on a pale sky wash when highlighted, and the sky keys row. The dialog sits 12vh down over the scan-line scrim. Nothing animates."
kinds: []
use_for: "Searching pages, guides or actions from the keyboard (CommandDialog bound to Cmd K, `name` labels the bar, `hint=\"Esc\"` on the input), or a searchable list inside a page (Command). Give each CommandItem a `description` (the page it is on)."
never: [Animating the palette open, A drop shadow on the panel, Rows without keyboard support, Icons in every row instead of a title and a line]
source: "agentcard-website src/components/v7/guide-search.tsx; src/app/globals.css (.v7-guide-search-layer, .v7-guide-search-panel, .v7-guide-search-field, .v7-guide-search-results, .v7-guide-search-group, .v7-guide-search-keys)"
---
