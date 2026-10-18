import * as React from "react";

import { cn } from "@/lib/utils";

// Long-form text, as the brand sets its legal pages (agentcard.sh/terms, /card-terms, /updates: .v7-about-sheet and
// .v7-prose): a 680px reading column; an optional head (a blue eyebrow, the 52px title and a small caps line, over a
// rule); then semantic HTML styled in place. Paragraphs and lists in 16px Inter at 28px and 82 percent ink, headings in
// the display face (24px h2, 16px h3), links in blue with an underline, tables in 14px rows ruled in ink, code in the
// display face on a sky chip. Pass markdown output or plain elements as children.

const BODY = [
  "text-body leading-7 text-fg",
  // Rhythm: 16px between blocks, more above a heading.
  "[&>*+*]:mt-4 [&>h2]:mt-11 [&>h3]:mt-7.5 [&>:first-child]:mt-0",
  // Paragraphs and lists read at 82 percent ink.
  "[&_p]:text-ink/82 [&_li]:text-ink/82",
  // Headings.
  "[&_h2]:font-display [&_h2]:text-h3 [&_h2]:[line-height:1.2] [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-fg",
  "[&_h3]:font-display [&_h3]:text-body [&_h3]:leading-display [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:text-fg",
  "[&_h4]:font-display [&_h4]:text-body-sm [&_h4]:font-medium [&_h4]:text-fg",
  // Lists.
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5.5 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5.5 [&_li>ul]:mt-2 [&_li>ol]:mt-2 [&_li]:marker:text-fg-brand",
  // Links: blue with the underline, a touch thicker on hover.
  "[&_a]:text-fg-brand [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-3 [&_a]:rounded-chip [&_a]:outline-none [&_a:hover]:decoration-2 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-focus-ring",
  // Emphasis stays medium: the brand is never bold.
  "[&_strong]:font-medium [&_strong]:text-fg [&_b]:font-medium",
  // Tables: 14px, every cell ruled, header cells on a faint wash.
  "[&_table]:my-4.5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-body-sm [&_table]:leading-relaxed",
  "[&_th]:border [&_th]:border-ink/18 [&_th]:bg-ink/5 [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:align-top [&_th]:font-medium",
  "[&_td]:border [&_td]:border-ink/18 [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-top",
  // Code: a sky chip inline, the ink window for blocks.
  "[&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:border [&_:not(pre)>code]:border-ring-tint [&_:not(pre)>code]:bg-sky-wash [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-body-sm [&_:not(pre)>code]:text-fg-brand [&_:not(pre)>code]:[overflow-wrap:anywhere]",
  "[&_pre]:overflow-x-auto [&_pre]:rounded-control [&_pre]:bg-code [&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:font-mono [&_pre]:text-caption [&_pre]:leading-4.5 [&_pre]:text-white/88 [&_pre]:shadow-code",
  // Quotes, rules and figures.
  "[&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:text-ink/70",
  "[&_hr]:my-11 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-ink/18",
  "[&_img]:h-auto [&_img]:max-w-full [&_figcaption]:mt-2 [&_figcaption]:text-body-sm [&_figcaption]:text-fg-muted",
].join(" ");

type ProseProps = React.ComponentProps<"article"> & {
  /** The blue eyebrow over the title (Compliance, Changelog). */
  eyebrow?: React.ReactNode;
  /** The page title, 52px in the display face (34px on phones). */
  title?: React.ReactNode;
  /** The small caps line under the title (Last updated July 10, 2026). */
  meta?: React.ReactNode;
  /** Wider column (820px) for a changelog. */
  wide?: boolean;
  /** Classes for the body (the styled HTML). */
  bodyClassName?: string;
};

function Prose({ eyebrow, title, meta, wide = false, className, bodyClassName, children, ...props }: ProseProps) {
  const head = eyebrow || title || meta;
  return (
    <article data-slot="prose" className={cn("mx-auto w-full", wide ? "max-w-205" : "max-w-(--ds-layout-text)", className)} {...props}>
      {head ? (
        <header className="border-b border-ink/18 pb-7">
          {eyebrow ? <p className="font-display text-caption leading-body tracking-label text-fg-label">{eyebrow}</p> : null}
          {title ? <h1 className="mt-2.5 font-display text-h1 leading-heading font-medium tracking-tight">{title}</h1> : null}
          {meta ? <p className="mt-3 font-display text-caption leading-body tracking-label text-ink/62 uppercase">{meta}</p> : null}
        </header>
      ) : null}
      <div className={cn(BODY, head && "mt-8.5", bodyClassName)}>{children}</div>
    </article>
  );
}

export { Prose };
export type { ProseProps };
