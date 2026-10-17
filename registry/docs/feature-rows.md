---
name: feature-rows
title: Feature rows
type: site
surface: site
description: "Product feature layouts with text and media."
kinds: [card-raised, card, chip, media-frame, card-title, body-text]
use_for: "Use FeatureRows for the main feature list and FeatureGrid for supporting details. Supply a screen or illustration for each feature."
never: [More than one blue key per row, Feature icons instead of screens, Stock photos in the panel, Rows without media]
source: "agentcard-website src/components/v7/feature-rows.tsx; agentcard.sh/vault and /issuing (computed: .v7-feat, .v7-feat-stage, .v7-feat-pill, .v7-feats.is-4)"
---

`FeatureRows` and `FeatureGrid` take the same props: `rows` (`{ tags?, title, description?, media?, align?, footnote?
}[]`), `product` (the blue key on every row: `Vault`) and `numbered` (the row's place, `01/08`; on by default). `align`
is `foot` (default: the media rises from the panel's foot and is cut off, as a phone) or `center` (a window or code).
Rows stack, copy first, below 1024px.

Helpers for the copy: `FeatureLogos` (`logos`, `more`: logos in small white keys, three to a row, and a dotted "and
more" key), `FeaturePowered` (`label` (default "Powered by"), `href`, children: the partner's mark) and `FeatureTag`
(`blue`, children: one small key).

The brand's panels carry a moving grain (a WebGL shader) on the blue and fluted glass on the pale panels; here they are
flat `bg-brand` and `bg-blue-mist`. Pass a backdrop inside `media` if you need the texture.
