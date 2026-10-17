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
