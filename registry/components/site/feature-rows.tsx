import * as React from "react";

import { cn } from "@/lib/utils";

// The product pages' features (agentcard.sh/vault and /issuing, .v7-feat). FeatureRows: one feature to a row, each a
// white 20px card with the hard offset shadow, the copy on one side and on the other a blue panel holding the
// feature's screen (a phone rising from the panel's foot and cut off by it, or a window). Rows alternate sides. The
// copy opens with small keys (the product's name in blue, then the row's place, 01/08), a 36px title, a muted 19px
// line, and optionally card logos or a "Powered by" mark. FeatureGrid: the lighter list under it ("Safety comes
// first"): tiles in a dotted outline on the page, two to a row at alternating widths, the copy over a pale panel.

type FeatureRow = {
  /** Extra keys after the product key and the count (a status, a plan). */
  tags?: React.ReactNode[];
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The feature's screen: a phone, a window, a code window. */
  media?: React.ReactNode;
  /** `foot` (default) lets the media rise from the panel's foot and be cut off by it, as a phone; `center` centers it. */
  align?: "foot" | "center";
  /** Under the line: FeatureLogos, FeaturePowered or any node. */
  footnote?: React.ReactNode;
};

const two = (n: number) => String(n).padStart(2, "0");

/** A small raised key above a feature's title: blue for the product, white with blue text otherwise. */
function FeatureTag({ blue = false, className, children }: { blue?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-sm border px-3 font-display text-caption leading-none",
        blue ? "border-line-brand-edge bg-primary text-on-primary shadow-key-brand" : "border-hairline bg-surface text-fg-brand shadow-key",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Tags({ product, index, total, tags, className }: { product?: React.ReactNode; index: number; total?: number; tags?: React.ReactNode[]; className?: string }) {
  if (!product && !total && !tags?.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {product ? <FeatureTag blue>{product}</FeatureTag> : null}
      {total ? (
        <FeatureTag>
          <span className="sr-only">Feature </span>
          {two(index + 1)}
          <span className="text-ink/35">
            <span className="sr-only"> of </span>
            <span aria-hidden>/</span>
            {two(total)}
          </span>
        </FeatureTag>
      ) : null}
      {tags?.map((t, i) => (
        <FeatureTag key={i}>{t}</FeatureTag>
      ))}
    </div>
  );
}

/** Logos in small white keys, three to a row, with an optional dotted "and more" key. */
function FeatureLogos({ logos, more, className }: { logos: React.ReactNode[]; more?: React.ReactNode; className?: string }) {
  return (
    <ul className={cn("mt-6.5 flex max-w-61 list-none flex-wrap gap-2 p-0", className)}>
      {logos.map((logo, i) => (
        <li key={i} className="flex h-12 w-19 items-center justify-center rounded-control border border-hairline bg-surface px-2.25 shadow-key [&_img]:max-h-6 [&_img]:w-auto [&_svg]:max-h-6 [&_svg]:max-w-full">
          {logo}
        </li>
      ))}
      {more ? (
        <li className="flex h-12 w-19 items-center justify-center rounded-control border-2 border-dotted border-ink/22 px-2.25 font-display text-caption text-ink/70">{more}</li>
      ) : null}
    </ul>
  );
}

/** "Powered by" and a partner's mark, under a feature's line. */
function FeaturePowered({ label = "Powered by", href, children, className }: { label?: React.ReactNode; href?: string; children: React.ReactNode; className?: string }) {
  const inner = (
    <>
      <span className="text-ink/60">{label}</span>
      {children}
    </>
  );
  const box = cn("mt-6.5 inline-flex items-center gap-2.5 text-body-sm leading-relaxed text-fg", className);
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cn(box, "rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring")}>
      {inner}
    </a>
  ) : (
    <div className={box}>{inner}</div>
  );
}

type FeatureRowsProps = Omit<React.ComponentProps<"ol">, "children"> & {
  rows: FeatureRow[];
  /** The product's name, as the blue key on every row (Vault). */
  product?: React.ReactNode;
  /** Shows each row's place (01/08). On by default. */
  numbered?: boolean;
};

function FeatureRows({ rows, product, numbered = true, className, ...props }: FeatureRowsProps) {
  return (
    <ol data-slot="feature-rows" className={cn("mx-auto grid w-full max-w-270 list-none gap-6 p-0", className)} {...props}>
      {rows.map((row, i) => {
        const flip = i % 2 === 1;
        return (
          <li
            key={i}
            className={cn(
              "grid grid-cols-1 gap-5 rounded-shell border border-ink/12 bg-surface px-3 pt-6 pb-3 shadow-raised lg:items-center lg:gap-14 lg:py-3",
              flip ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.68fr)] lg:pr-10 lg:pl-3" : "lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] lg:pr-3 lg:pl-10",
            )}
          >
            <div className={cn("px-3 lg:px-0", flip && "lg:order-2")}>
              <Tags product={product} index={i} total={numbered ? rows.length : undefined} tags={row.tags} className="mb-5" />
              <h3 className="mb-3.5 font-display text-h2 leading-heading font-medium tracking-tighter">{row.title}</h3>
              {row.description ? <p className="max-w-102 text-body-lg leading-snug tracking-tight text-ink/70">{row.description}</p> : null}
              {row.footnote}
            </div>
            <div
              className={cn(
                "relative flex justify-center overflow-hidden rounded-panel bg-brand px-3.5 lg:px-6",
                row.align === "center" ? "h-105 items-center lg:h-100" : "h-105 items-start pt-8 lg:h-120 lg:pt-11",
                flip && "lg:order-1",
              )}
            >
              {row.media}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

type FeatureGridProps = FeatureRowsProps;

// Tiles two to a row on a 12-column grid, wide then narrow, then narrow then wide, so the list reads as a bento.
const SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

function FeatureGrid({ rows, product, numbered = true, className, ...props }: FeatureGridProps) {
  return (
    <ol data-slot="feature-grid" className={cn("mx-auto grid w-full max-w-270 list-none grid-cols-1 gap-4 p-0 lg:grid-cols-12", className)} {...props}>
      {rows.map((row, i) => (
        <li key={i} className={cn("grid grid-cols-1 content-start gap-5 rounded-shell border-2 border-dotted border-ink/22 px-3 pt-6 pb-3 lg:gap-7 lg:pt-8", SPAN[i % 4])}>
          <div className="px-3 lg:px-5">
            <Tags product={product} index={i} total={numbered ? rows.length : undefined} tags={row.tags} className="mb-3.5" />
            <h3 className="mb-3.5 font-display text-h3 leading-display font-medium tracking-tighter">{row.title}</h3>
            {row.description ? <p className="max-w-101 text-body leading-6 tracking-tight text-ink/70">{row.description}</p> : null}
            {row.footnote}
          </div>
          <div className={cn("relative flex h-105 justify-center overflow-hidden rounded-panel bg-blue-mist px-4", row.align === "center" ? "items-center" : "items-start pt-9")}>{row.media}</div>
        </li>
      ))}
    </ol>
  );
}

export { FeatureRows, FeatureGrid, FeatureTag, FeatureLogos, FeaturePowered };
export type { FeatureRow, FeatureRowsProps, FeatureGridProps };
