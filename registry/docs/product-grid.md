---
name: product-grid
title: Product grid
type: site
surface: site
description: "Large raised product cards (20px corners, a hairline and the hard 7px offset shadow), each a blue stage for the product's picture plus its copy: a 36px display title at 400, a 19px line at 60 percent ink and the blue key. A lead card spans the row (stage beside copy, alternating sides); half cards pair up, stage above copy, lined up across the pair."
kinds: [card-raised, media-frame, button-primary]
use_for: "A product overview: lead, two halves, lead. Pass `products` (title, description, action as {label, href, icon} or an element, media, layout lead or half). The media is yours: a screen, a window, a 3D object."
never: [An odd number of half cards, A card without media, Two keys in one card, Media on a white ground instead of the stage]
source: "agentcard-website src/components/v7/products-showcase.tsx (SolutionCard); agentcard.sh / (.v7-sol, .v7-sol-lead, .v7-sol-half, computed)"
---
