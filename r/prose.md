# Prose
Typography and layout for long-form content.

Install: npx agentcard-ds add prose
Requires: theme, utils
Packages: none
Exports: Prose, ProseProps
Client boundary: not required by this entry file
Reference: agentcard-website src/app/globals.css:1808 (.v7-about-sheet), 2199 (.v7-guide-prose); agentcard.sh/terms and /card-terms (computed: .v7-about-head, .v7-prose)


## Usage
Use for documentation, guides, legal content and release notes. Pass semantic HTML or rendered Markdown. Use wide for a wider content column.
- Avoid: Bold headings or table headers
- Avoid: Body text wider than 680px
- Avoid: Links without the underline
- Avoid: Centered long text
`Prose` props: `eyebrow`, `title`, `meta` (the head; any of them renders it), `wide` (820px instead of 680px),
`bodyClassName`, and children (the HTML to style). It styles `p`, `h2` (24px), `h3` (16px), `h4`, `ul`, `ol`, `a`,
`strong`, `table` with `th` and `td`, inline `code`, `pre`, `blockquote`, `hr`, `img` and `figcaption`.

The brand's tables set headers and `strong` in 700 and its h3 in 600; here they are medium (500), as the brand's rules
say nothing is bold.

## Examples
Example components: npx agentcard-ds add prose
[Site](https://agentcard-ds.vercel.app/preview/prose/Site)

examples/prose.tsx

```tsx
import { Prose } from "@/components/site/prose";

export function Site() {
  return (
    <div className="px-5 py-16 sm:px-0">
      <Prose eyebrow="Compliance" title="Terms of Use" meta="Last updated July 10, 2026">
        <p>
          Welcome to the service (the “Service”). These terms govern your use of the website, the cards and the tools for agents. By using the Service you agree to them and to our{" "}
          <a href="https://legal.raincards.xyz/legal/privacy-policy">Privacy Policy</a>.
        </p>
        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years old and able to form a binding contract. Cards are issued under the <a href="https://agentcard.sh/card-terms">Cardholder Agreement</a>.
        </p>
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the services for any unlawful purpose.</li>
          <li>Attempt unauthorized access to any account or system.</li>
          <li>Interfere with or disrupt the services.</li>
        </ul>
        <h3>Additional definitions</h3>
        <ol>
          <li>The issuing bank is an express third-party beneficiary of these terms.</li>
          <li>
            An API key such as <code>sk_live_…</code> is yours to keep secret.
          </li>
        </ol>
        <h2>Fees</h2>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Annual fees</th>
              <td>None</td>
            </tr>
            <tr>
              <th>International transaction</th>
              <td>1% of each transaction in U.S. dollars</td>
            </tr>
            <tr>
              <th>Late payment</th>
              <td>
                <strong>None.</strong> Learn more at <a href="https://www.consumerfinance.gov">consumerfinance.gov</a>.
              </td>
            </tr>
          </tbody>
        </table>
        <pre>
          <code>{`npx agent-cards setup`}</code>
        </pre>
      </Prose>
    </div>
  );
}

```

## Source

components/site/prose.tsx

```tsx
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

```
