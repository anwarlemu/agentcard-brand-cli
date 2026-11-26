# Stats
A row of numbers with a line under each, on a section band.

Install: npx agentcard-ds add stats
Requires: theme, section, utils
Packages: none
Exports: Stats, Stat
Client boundary: not required by this entry file
Reference: Derived from agentcard.sh's own parts (the section band and heading, the pricing prices' display type, the hairline rule); the site has no stats section.


## Usage
Use for two to four numbers a page wants to show (customers, uptime, purchases). Pass your own numbers; never invent them.
- Avoid: Invented numbers
- Avoid: More than four numbers in a row
- Avoid: Icons beside the numbers


## Examples
Example components: npx agentcard-ds add stats
[Site](https://agentcard-ds.vercel.app/preview/stats/Site)

examples/stats.tsx

```tsx
import { Stats } from "@/components/site/stats";

export function Site() {
  return <Stats title="Acme, in numbers" stats={[{ value: "40%", label: "fewer abandoned carts" }, { value: "12k", label: "purchases approved a week" }, { value: "0", label: "card numbers in a chat" }]} />;
}

```

## Source

components/site/stats.tsx

```tsx
import * as React from "react";

import { SectionHeading, SiteSection, type SectionGround } from "@/components/site/section";
import { cn } from "@/lib/utils";

// A row of numbers: the site has none as a section, so this is built from its own parts: the section band and its
// heading, the 36px display numbers of the pricing page's prices in the brand blue (white on the blue band) and the
// muted 16px line under each, separated by the hairline rule.

type Stat = { value: React.ReactNode; label: React.ReactNode };

function Stats({ title, description, eyebrow, stats, ground = "white", className }: { title?: React.ReactNode; description?: React.ReactNode; eyebrow?: React.ReactNode; stats: Stat[]; ground?: SectionGround; className?: string }) {
  return (
    <SiteSection ground={ground} className={className}>
      {title ? <SectionHeading title={title} description={description} eyebrow={eyebrow} className="mb-10 md:mb-14" /> : null}
      <dl className={cn("grid list-none grid-cols-1 gap-y-8 sm:grid-cols-2", stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : "")}>
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col-reverse gap-2 border-t border-line-rule pt-5 in-data-[ground=blue]:border-line-on-brand sm:px-5">
            <dt className="text-body leading-6 text-fg-muted in-data-[ground=blue]:text-fg-on-brand-muted">{s.label}</dt>
            <dd className="m-0 font-display text-h1 leading-none font-medium tracking-tighter text-fg-brand in-data-[ground=blue]:text-on-brand">{s.value}</dd>
          </div>
        ))}
      </dl>
    </SiteSection>
  );
}

export { Stats };
export type { Stat };

```
