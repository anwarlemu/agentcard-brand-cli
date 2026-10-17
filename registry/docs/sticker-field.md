---
name: sticker-field
title: Sticker field
type: visual
surface: site
description: "Decorative floating objects positioned around section content."
kinds: [section]
use_for: "Use with Agentcard illustrations in section margins. Keep content and controls unobstructed. Motion stops for reduced-motion preferences."
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
