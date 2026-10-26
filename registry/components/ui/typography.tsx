import * as React from "react";

import { cn } from "@/lib/utils";

// The brand's type as components (agentcard.sh). Headings are Neue Haas Grotesk Display (Helvetica Neue where it is not
// installed) at 500, tracked tight: -0.035em at the 36px H2, -0.02em below; never bold, never caps. Body copy is Inter at
// 16px on a 1.6 line in ink; a lead is 19px at 68 percent ink; Small is the 12px display face; Muted the 14px line at 68
// percent ink. A quote hangs behind a blue rule; inline code is the guides' sky chip.
function TypographyH1({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 data-slot="typography-h1" className={cn("font-display text-h1 leading-heading font-medium tracking-tight text-balance text-fg", className)} {...props} />;
}

function TypographyH2({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="typography-h2" className={cn("font-display text-h2 leading-display font-medium tracking-tighter text-balance text-fg", className)} {...props} />;
}

function TypographyH3({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="typography-h3" className={cn("font-display text-h3 leading-display font-medium tracking-tight text-fg", className)} {...props} />;
}

function TypographyH4({ className, ...props }: React.ComponentProps<"h4">) {
  return <h4 data-slot="typography-h4" className={cn("font-display text-h4 leading-snug font-medium tracking-tight text-fg", className)} {...props} />;
}

function TypographyP({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-p" className={cn("font-sans text-body leading-body text-pretty text-fg [&:not(:first-child)]:mt-5", className)} {...props} />;
}

function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-lead" className={cn("font-sans text-body-lg leading-snug tracking-tight text-pretty text-fg-muted [&:not(:first-child)]:mt-3.5", className)} {...props} />;
}

function TypographyLarge({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="typography-large" className={cn("font-display text-h5 leading-snug font-medium tracking-tight text-fg", className)} {...props} />;
}

function TypographySmall({ className, ...props }: React.ComponentProps<"small">) {
  return <small data-slot="typography-small" className={cn("font-display text-caption leading-snug text-fg", className)} {...props} />;
}

function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-muted" className={cn("font-sans text-body-sm leading-relaxed text-fg-muted", className)} {...props} />;
}

/** A quote: indented behind a 2px blue rule, at 68 percent ink. */
function TypographyBlockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return <blockquote data-slot="typography-blockquote" className={cn("mt-5 border-l-2 border-line-brand pl-5 font-sans text-body leading-body text-fg-secondary", className)} {...props} />;
}

function TypographyList({ className, ordered = false, ...props }: Omit<React.ComponentProps<"ul">, "ref"> & { ordered?: boolean }) {
  const classes = cn("my-5 ml-5 grid gap-2.5 font-sans text-body leading-body text-fg marker:text-fg-brand", ordered ? "list-decimal" : "list-disc", className);
  return ordered ? <ol data-slot="typography-list" className={classes} {...props} /> : <ul data-slot="typography-list" className={classes} {...props} />;
}

/** A name or a value inside text: the guides' sky chip, blue in the system monospace with a faint blue edge. */
function TypographyInlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="typography-inline-code"
      className={cn("rounded-sm border border-[color-mix(in_srgb,var(--ds-color-brand)_14%,transparent)] bg-sky-wash px-1.5 py-px font-code text-body-sm text-fg-brand [box-decoration-break:clone] [overflow-wrap:anywhere]", className)}
      {...props}
    />
  );
}

/** A plain table in running text: the sky head with blue labels in the display face, ink rules between rows. For data, use Table. */
function TypographyTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="typography-table" className="my-5 w-full overflow-x-auto rounded-card border border-hairline">
      <table
        className={cn(
          "w-full border-collapse font-sans text-body-sm leading-normal text-fg [&_td]:border-t [&_td]:border-line [&_td]:px-3.5 [&_td]:py-2.5 [&_th]:bg-sky [&_th]:px-3.5 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-display [&_th]:text-caption [&_th]:font-normal [&_th]:text-fg-brand",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { TypographyBlockquote, TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyInlineCode, TypographyLarge, TypographyLead, TypographyList, TypographyMuted, TypographyP, TypographySmall, TypographyTable };
