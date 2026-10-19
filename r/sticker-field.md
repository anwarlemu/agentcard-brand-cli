# Sticker field
Decorative floating objects positioned around section content.

Install: npx agentcard-ds add sticker-field
Requires: theme, utils
Packages: none
Exports: StickerField, Sticker, StickerFieldProps
Client boundary: not required by this entry file
Reference: agentcard-website src/components/v7/sticker-rails.tsx, src/components/faq-stickers.tsx; src/app/globals.css:899 (.faq-sticker), 1605 (.v7-sticker-rails); agentcard.sh / and /pricing (computed)


## Usage
Use with Agentcard illustrations in section margins. Keep content and controls unobstructed. Motion stops for reduced-motion preferences.
- Avoid: Stickers over text or controls
- Avoid: Fast or bouncy motion
- Avoid: Stickers on phones over the column
- Avoid: More than eight in one section
`StickerField` props: `stickers` (`{ src, x, y, size?, rotate? }[]`: `src` is an image URL or a node; `x` and `y` are a
percent of the field or any CSS length; `size` is the width in px, default 200; `rotate` the resting tilt in degrees),
`from` (`lg` | `xl` | `wide`: the width the stickers show from, default `wide` (1440px), where the brand's rails show),
`layerClassName`, and children (the section).

On the brand's page the stickers are a WebGL scene that can be picked up and dragged, and they travel in with the scroll.
This version keeps them still apart from the drift: each moves a few pixels and a degree or two over 9 to 15 seconds,
transform only, with its own pace so neighbors never move together. The layer is hidden from readers and takes no
pointer.

## Examples
Example components: npx agentcard-ds add sticker-field
[Site](https://agentcard-ds.vercel.app/preview/sticker-field/Site)

examples/sticker-field.tsx

```tsx
import { StickerField, type Sticker } from "@/components/visuals/sticker-field";

// Neutral stand-ins for the brand's 3D objects: small token-colored shapes (a card, a coin, a tag, a parcel).
const card = (bg: string) => <div className={`aspect-[1.6] w-full rounded-card border border-ink/12 ${bg} shadow-key`} />;
const coin = <div className="size-full rounded-pill border-4 border-white bg-tint-butter shadow-key" />;
const parcel = <div className="size-full rounded-control border border-ink/12 bg-tint-peach shadow-key" />;
const tag = <div className="size-full rounded-shell bg-heart shadow-key-brand" />;

const STICKERS: Sticker[] = [
  { src: card("bg-brand"), x: 4, y: 8, size: 170, rotate: -12 },
  { src: coin, x: 9, y: 46, size: 110, rotate: 8 },
  { src: parcel, x: 3, y: 76, size: 140, rotate: -6 },
  { src: card("bg-sky"), x: "calc(100% - 15rem)", y: 10, size: 160, rotate: 10 },
  { src: tag, x: "calc(100% - 12rem)", y: 44, size: 104, rotate: -16 },
  { src: card("bg-tint-sage"), x: "calc(100% - 14rem)", y: 74, size: 150, rotate: 6 },
];

export function Site() {
  return (
    <StickerField stickers={STICKERS} from="xl" className="bg-paper">
      <div className="mx-auto max-w-(--ds-layout-text) px-5 py-44 text-center">
        <h2 className="font-display text-h2 leading-heading font-medium tracking-tighter">Frequently asked questions</h2>
        <p className="mt-3.5 text-body-lg text-ink/70">The stickers drift in the margins and never cover the column. They hide where the margins are too narrow.</p>
        <div className="mt-10 rounded-card border border-hairline bg-surface p-7 text-left shadow-card">
          <p className="font-display text-h5 font-medium tracking-tight">What does an agent need to buy something?</p>
          <p className="mt-2 text-body text-fg-muted">A card it can use, and your approval when the amount is over your limit.</p>
        </div>
      </div>
    </StickerField>
  );
}

```

## Source

components/visuals/sticker-field.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// The 3D stickers that float in a section's margins (agentcard.sh, .v7-sticker-rails beside the products and
// .faq-stickers around the FAQ): cut-out objects, each tilted a little and dropping a soft shadow, sitting under the
// content. On the brand's page they are a WebGL scene you can pick up; here each one drifts very slowly on a long,
// gentle loop (a few pixels and a degree or two, 9 to 15 seconds), so the section breathes without pulling the eye.
// Reduced motion stills them. They are decorative (hidden from readers, take no pointer) and only show from a width
// where the margins can hold them, so they never cover the column.

type Sticker = {
  /** An image URL (a transparent cut-out) or any node (an <img>, an SVG, a shape). */
  src: string | React.ReactNode;
  /** Left edge, as a percent of the field's width (0 to 100) or any CSS length (calc(50% + 640px)). */
  x: number | string;
  /** Top edge, as a percent of the field's height or any CSS length. */
  y: number | string;
  /** Width in px (height follows; nodes get a square box). */
  size?: number;
  /** Resting tilt in degrees. */
  rotate?: number;
};

const FROM = {
  lg: "hidden lg:block",
  xl: "hidden xl:block",
  wide: "hidden min-[90rem]:block",
} as const;

const pos = (v: number | string) => (typeof v === "number" ? `${v}%` : v);

// One keyframe for every sticker; each sets its own reach and pace through custom properties, so neighbors never move
// in step. Transform only, so it stays on the compositor.
const KEYFRAMES = `@keyframes ds-sticker-drift {
  0% { transform: translate3d(0, 0, 0) rotate(var(--ds-sticker-r)); }
  50% { transform: translate3d(var(--ds-sticker-dx), var(--ds-sticker-dy), 0) rotate(calc(var(--ds-sticker-r) + var(--ds-sticker-dr))); }
  100% { transform: translate3d(0, 0, 0) rotate(var(--ds-sticker-r)); }
}`;

type StickerFieldProps = React.ComponentProps<"div"> & {
  stickers: Sticker[];
  /** The width the stickers appear from: lg (1024px), xl (1280px) or wide (1440px, the brand's rails). Default wide. */
  from?: keyof typeof FROM;
  /** Classes for the sticker layer (to clip it differently). */
  layerClassName?: string;
};

function StickerField({ stickers, from = "wide", className, layerClassName, children, ...props }: StickerFieldProps) {
  return (
    <div data-slot="sticker-field" className={cn("relative isolate", className)} {...props}>
      <style>{KEYFRAMES}</style>
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-x-clip", FROM[from], layerClassName)}>
        {stickers.map((s, i) => {
          const size = s.size ?? 200;
          // A small, deterministic spread per sticker: reach 4 to 9px, tilt 1 to 2.5 degrees, 9 to 15 seconds, and a
          // negative delay so they start mid-loop rather than together.
          const dx = ((i * 37) % 11) - 5;
          const dy = -4 - ((i * 53) % 6);
          const dr = (i % 2 ? 1 : -1) * (1 + ((i * 29) % 4) * 0.5);
          const duration = 9 + ((i * 41) % 7);
          const style = {
            left: pos(s.x),
            top: pos(s.y),
            width: size,
            height: typeof s.src === "string" ? undefined : size,
            "--ds-sticker-r": `${s.rotate ?? 0}deg`,
            "--ds-sticker-dx": `${dx}px`,
            "--ds-sticker-dy": `${dy}px`,
            "--ds-sticker-dr": `${dr}deg`,
            transform: `rotate(${s.rotate ?? 0}deg)`,
            animationDuration: `${duration}s`,
            animationDelay: `-${(i * 2.3) % duration}s`,
          } as React.CSSProperties;
          return (
            <div
              key={i}
              className="absolute [animation-name:ds-sticker-drift] [animation-iteration-count:infinite] [animation-timing-function:var(--ds-easing-in-out)] [filter:drop-shadow(0_10px_14px_color-mix(in_srgb,var(--ds-color-ink)_22%,transparent))] will-change-transform motion-reduce:[animation-name:none]"
              style={style}
            >
              {typeof s.src === "string" ? <img src={s.src} alt="" draggable={false} className="block h-auto w-full object-contain select-none" /> : s.src}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

export { StickerField };
export type { Sticker, StickerFieldProps };

```
