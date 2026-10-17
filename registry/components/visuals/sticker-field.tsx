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
