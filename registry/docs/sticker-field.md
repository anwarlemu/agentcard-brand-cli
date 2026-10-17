---
name: sticker-field
title: Sticker field
type: visual
surface: site
description: "Floating 3D stickers in a section's margins, as beside the products and around the FAQ: cut-out objects tilted a little with a soft drop shadow, under the content, each drifting very slowly on its own long, gentle loop. They still with reduced motion and only show from a width where the margins can hold them."
kinds: [section]
use_for: "A playful section on a site page (the FAQ, a features list) with the brand's 3D objects in its margins. Two or three stickers a side, 130 to 250px."
never: [Stickers over text or controls, Fast or bouncy motion, Stickers on phones over the column, More than eight in one section]
source: "agentcard-website src/components/v7/sticker-rails.tsx, src/components/faq-stickers.tsx; src/app/globals.css:899 (.faq-sticker), 1605 (.v7-sticker-rails); agentcard.sh / and /pricing (computed)"
---

`StickerField` props: `stickers` (`{ src, x, y, size?, rotate? }[]`: `src` is an image URL or a node; `x` and `y` are a
percent of the field or any CSS length; `size` is the width in px, default 200; `rotate` the resting tilt in degrees),
`from` (`lg` | `xl` | `wide`: the width the stickers show from, default `wide` (1440px), where the brand's rails show),
`layerClassName`, and children (the section).

On the brand's page the stickers are a WebGL scene that can be picked up and dragged, and they travel in with the scroll.
This version keeps them still apart from the drift: each moves a few pixels and a degree or two over 9 to 15 seconds,
transform only, with its own pace so neighbors never move together. The layer is hidden from readers and takes no
pointer.
