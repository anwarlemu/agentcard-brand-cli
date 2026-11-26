# Page header
Title, optional label and introduction for an inner page.

Install: npx agentcard-ds add page-header
Requires: theme, section, utils
Packages: none
Exports: PageHeader
Client boundary: not required by this entry file
Reference: agentcard-website src/app/globals.css:1808 (.v7-about, .v7-about-head); agentcard.sh /about and /get-started (computed)


## Usage
Place below SiteHeader on company, form, legal or update pages. Put supporting title content in children.
- Avoid: A blue ground behind it
- Avoid: Centered
- Avoid: A second title under it
- Avoid: More than one per page
`PageHeader` props: `eyebrow`, `title`, `lead`, `rule` (default true), `children` (inside the head, under the title).
The live /about sets its lead at 24px (18px on phones), not 19px; the component follows the live page.

## Examples
Example components: npx agentcard-ds add page-header site-header
[Site](https://agentcard-ds.vercel.app/preview/page-header/Site) | [Short](https://agentcard-ds.vercel.app/preview/page-header/Short)

examples/page-header.tsx

```tsx
import { PageHeader } from "@/components/site/page-header";
import { SiteHeader } from "@/components/site/site-header";

export function Site() {
  return (
    <div className="relative bg-surface pb-24">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
      <PageHeader
        eyebrow="The company"
        title="About"
        lead="We are building Agentcard because we believe agents should have full autonomy to pay for things online. We want to give agents the freedom to operate in the world as it is today, not someday."
      />
    </div>
  );
}

export function Short() {
  return (
    <div className="relative bg-surface pb-24">
      <SiteHeader href="https://www.agentcard.sh/" ground="white" action={{ label: "Get started", href: "https://app.agentcard.sh/" }} />
      <PageHeader eyebrow="Get started" title="Let your agent buy">
        <p className="mt-3 font-display text-caption text-fg-muted">A few answers, then a call</p>
      </PageHeader>
    </div>
  );
}

```

## Source

components/site/page-header.tsx

```tsx
import * as React from "react";

import { Eyebrow } from "@/components/site/section";
import { cn } from "@/lib/utils";

// An inner page's opening (agentcard.sh /about and /get-started, .v7-about-head): on the 680px reading column, left
// aligned, 150px from the top of the page (140px on phones) so it clears the bare header: the blue eyebrow, the 52px
// title 10px under it (34px on phones), anything short that belongs to the title (`children`), then a hairline 28px
// below. The lead, when given, opens the page 32px under the rule in 24px text (18px on phones), as /about does.
function PageHeader({
  eyebrow,
  title,
  lead,
  rule = true,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** The hairline under the title. */
  rule?: boolean;
}) {
  return (
    <div data-slot="page-header" className={cn("mx-auto w-(--ds-frame-column) max-w-(--ds-layout-text) pt-35 md:pt-37.5", className)} {...props}>
      <header className={cn(rule && "border-b border-hairline pb-7")}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className={cn("font-display text-h1 leading-heading font-medium tracking-tight text-balance", eyebrow && "mt-2.5")}>{title}</h1>
        {children}
      </header>
      {lead && <p className="mt-8 text-h5 leading-6.75 text-pretty md:text-h3 md:leading-9">{lead}</p>}
    </div>
  );
}

export { PageHeader };

```
