---
name: striped-wordmark
title: Striped wordmark
type: visual
surface: site
description: "The footer's giant word, one letter per cell between vertical rules, each drawn in horizontal paper bars like type on a tube, fading a little toward the foot. SVG, so it spans the width it is given."
kinds: []
use_for: "The foot of the site footer, full width, on the blue. Short words in capitals (A to Z)."
never: [More than one per page, Long words or sentences, On a white ground, Set in a font instead of the bars]
source: agentcard-website src/components/v7/site-footer.tsx (BarGlyph, .v7-foot-glyphs); src/app/globals.css:5085; agentcard.sh / (computed)
---

`StripedWordmark` props: `text` (default "AGENTCARD"), `label` (the accessible name, defaults to the text).
