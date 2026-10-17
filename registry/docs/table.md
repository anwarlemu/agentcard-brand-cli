---
name: table
title: Table
type: ui
surface: site
description: "The brand's table (the guides' ruled tables): a white frame with 12px corners, the head on sky with blue labels in the 12px display face, 14px Inter rows ruled above and between columns; on a phone each row stacks under its column names."
kinds: [table]
use_for: "Comparing rows of the same kind: purchases, cards, plans, a comparison of two products. Pass `label` to each TableCell after the first so a phone can stack the row; status in a Badge."
never: [Zebra stripes, Bold headers, Caps headers, Tables nested in a card or window (the table is its own frame)]
source: "agentcard-website src/app/globals.css (.v7-guide-table), rendered from the source at /guides/getting-started"
---
