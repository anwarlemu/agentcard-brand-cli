# Illustration: toon objects

Agentcard's illustrations are toon objects: everyday things of buying and paying (a card, a cart, coins, a gift, a
receipt) rendered as glossy 3D toys, each a cut-out with its own thickness, set on the brand's grounds. The
`illustrate` command draws them; `image`, `deck` and `video` place them the same way. Each rule names its source.

## The objects

1. Use the brand's fifteen objects (`illustrate --list`): card, cart, coins, gift, wallet, bag, sale-tag, phone, cash,
   parcel, terminal, purse, cardholder, receipt, checkout. Source: the image editor's stickers, served on agentcard.sh
   (agd-playground `public/agentcard-og/*.webp`, `src/components/agentcard-og/draw.ts` STICKERS), kept in
   `brand/illustration/objects` as PNG.
2. An object is never recolored, outlined, stretched or cropped; it is placed whole, scaled and turned. Source: the
   editor draws each sticker with `drawImage` at its own aspect, rotated about its center (`draw.ts` drawStickers).
3. Tilt objects a little: between -16 and 16 degrees (the editor's scatter, `draw.ts` scatter), -6 degrees for one
   large object (`draw.ts` underneath, the social hero).
4. Objects never cover the words or the lockup, and never sit on top of each other: a scatter keeps 14 units clear of
   both. Source: `draw.ts` scatter (`pad = 14 * unit`, `keep` rectangles for the words and the logo).

## Making a new object

5. Any picture becomes a toon object through the toon treatment, step for step as the editor does it: the background
   taken away (a fill from the border through colors near the border's, in OKLab), colors smoothed and pulled toward six
   flat bands with saturation up by a third, the shape puffed into a pillow from its edges, lit from the upper left
   (diffuse plus a tight Blinn-Phong shine), and a thickness of 3.5 percent of the short side stacked down and to the
   right in the silhouette's color mixed 55 percent toward deep blue ink. Source: agd-playground
   `src/components/agentcard-og/toon.ts` (toonify), `src/components/context-og/shader.ts` (cutout), ported to
   `src/assets/toon.ts` and `src/assets/cutout.ts`.
6. Use a picture of one thing on a plain or simple background; the treatment keys out a flat background, including
   inside holes, when the border is one even color. Source: `toon.ts` keyFlatBackground.

## Arrangements

7. preset: the hero's seven objects in the margins, at the editor's positions, sizes and tilts. Source: agd-playground
   `Editor.tsx` HERO_STICKERS (stored in `brand/assets/image.json` stickers.preset).
8. under: one object, large (up to 0.62 of the short side), in the room under the words. Source: `draw.ts` underneath.
9. scatter: a seeded scatter (count 1 to 14, default 7; sizes 0.13 to 0.24 of the short side). The same seed gives the
   same picture. Source: `draw.ts` scatter and random, `Editor.tsx` StickersSection (count 7).
10. single, row and object are plain arrangements of the same rules: one object centered, several side by side with
    alternating tilts, or the object alone on a clear ground cropped to its edges.

## Grounds

11. Grounds are the brand's: blue, paper, white or ink, or none (clear). Source: `brand/tokens.css` (--ds-color-brand,
    --ds-color-paper, --ds-color-white, --ds-color-ink); the editor's GROUNDS in `draw.ts`.
12. The blue ground wears its scanlines and vignette: ink at 16 percent every 3px, a vignette to 38 percent from 55
    percent out, and on a hero the darker sides at 34 percent. Source: `registry/components/visuals/band-divider.tsx`
    (Scan), the editor's drawScan.
13. A ground meets the next with the stepped band: four flat steps mixing 24, 48, 70 and 88 percent toward the ground
    below, never a gradient, with the grain laid over in soft light. Source: `brand/tokens.css` (--ds-band-step,
    --ds-band-mix-1 to 4), `band-divider.tsx`.

## Output

14. SVG and PNG. The ground, scanlines and band are vector shapes; each object is its rendered art, embedded as a
    picture, because the style is a 3D render and has no vector form. The same inputs give the same bytes.

## Not sourced, left out

- Vector versions of the objects: the brand has none (the editor and agentcard.sh use rendered pictures).
- New objects beyond the fifteen: make them from a picture with the toon treatment (rule 5), not by hand.
- The site's WebGL sticker scene (objects that can be picked up): `video` uses the sticker field's drift instead.
