# Empty state
Message and optional action for an empty list or search result.

Install: npx agentcard-ds add empty-state
Requires: theme, window, utils
Packages: none
Exports: EmptyState
Client boundary: not required by this entry file
Reference: Extension from agentcard-website src/app/globals.css (.v7-windowbar)


## Usage
Explain what is missing and provide the next action. Set name for the title bar or null to hide it. Connect actions such as creating an item or clearing a search.
- Avoid: Illustrations that shout
- Avoid: More than one action
- Avoid: Empty states that blame the reader


## Examples
Example components: npx agentcard-ds add empty-state button input
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/empty-state/Site) | [NoResults](https://agentcard-ds.vercel.app/preview/empty-state/NoResults)

examples/empty-state.tsx

```tsx
"use client";

import { useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";

export function Site() {
  const [created, setCreated] = useState(false);
  return created ? <div className="grid gap-3"><p role="status">Travel agent card created.</p><Button variant="secondary" onClick={() => setCreated(false)}>Reset demo</Button></div> :
    <EmptyState className="max-w-2xl" name="cards.list" icon={<CreditCard strokeWidth={1.5} />} title="No cards yet"
      description="Give your first agent a card, with a limit and a list of places it can buy." action={<Button onClick={() => setCreated(true)}>New card</Button>} />;
}
export function NoResults() {
  const [query, setQuery] = useState("No matching card");
  const results = ["Travel agent", "Office supplies"].filter((name) => name.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="grid max-w-2xl gap-4">
    <Input variant="search" aria-label="Search cards" value={query} onChange={(event) => setQuery(event.target.value)} />
    {results.length ? <ul aria-live="polite">{results.map((name) => <li key={name} className="border-b border-line py-3">{name}</li>)}</ul> :
      <EmptyState name="search.results" icon={<Search strokeWidth={1.5} />} title="Nothing matches" description="Try a merchant’s name or a card’s nickname." action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>} />}
  </div>;
}

```

## Source

components/ui/empty-state.tsx

```tsx
import * as React from "react";

import { WindowBar } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// An empty list or a search with no results, as a quiet window: a 16 percent ink hairline and 12px corners with no drop,
// the 32px sky title bar (`name`, file-like: `cards.list`, `search.results`), and a centered body on the pale ground: an
// optional mark, a title in the 20px display face at 500, one line in Inter at 68 percent ink, and an optional key.
function EmptyState({
  title,
  description,
  action,
  icon,
  name = "empty",
  tone,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The one thing to do next, usually a Button. */
  action?: React.ReactNode;
  /** A small mark above the title (an icon or an illustration passed in). */
  icon?: React.ReactNode;
  /** The title bar's label; pass null to drop the bar. */
  name?: React.ReactNode;
  tone?: React.ComponentProps<typeof WindowBar>["tone"];
}) {
  return (
    <div data-slot="empty-state" className={cn("flex flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg", className)} {...props}>
      {name !== null && <WindowBar name={name} tone={tone} />}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-subtle px-6 py-12 text-center md:py-16">
        {icon && (
          <div aria-hidden className="mb-1 grid size-10 place-items-center rounded-control border border-hairline bg-surface text-fg-brand shadow-key [&_svg]:size-4.5">
            {icon}
          </div>
        )}
        <p className="font-display text-h4 leading-snug font-medium tracking-tight text-fg">{title}</p>
        {description && <p className="max-w-sm text-body-sm leading-relaxed text-fg-muted">{description}</p>}
        {children}
        {action && <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div>}
      </div>
    </div>
  );
}

export { EmptyState };

```
