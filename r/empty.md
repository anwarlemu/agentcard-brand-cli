# Empty
An empty list as a quiet window: the sky bar, a centered key glyph, a display title, one muted line and one action on the pale ground.

Install: npx agentcard-ds add empty
Requires: theme, window, utils
Packages: class-variance-authority
Exports: Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle
Client boundary: not required by this entry file
Reference: Extrapolated from Agentcard: the EmptyState (agentcard-website src/app/globals.css .v7-windowbar) and the white key (.v7-btn)


## Usage
Use when a list, a search or a view has nothing to show: say what is missing and give the one next action (New card, Clear search). Name the bar like a file (cards.list, search.results) or pass name={null}. It is shadcn's Empty API in the EmptyState look; use EmptyMedia variant icon for a lucide glyph.
- Avoid: Illustrations that shout
- Avoid: More than one action
- Avoid: Empty states that blame the reader
- Avoid: A drop shadow


## Examples
Example components: npx agentcard-ds add empty button input
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/empty/Site) | [NoResults](https://agentcard-ds.vercel.app/preview/empty/NoResults) | [Bare](https://agentcard-ds.vercel.app/preview/empty/Bare)

examples/empty.tsx

```tsx
"use client";

import * as React from "react";
import { CreditCard, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

export function Site() {
  const [created, setCreated] = React.useState(false);
  return (
    <Empty name="cards.list" className="max-w-2xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CreditCard strokeWidth={1.5} />
        </EmptyMedia>
        <EmptyTitle>{created ? "Travel agent card created" : "No cards yet"}</EmptyTitle>
        <EmptyDescription>{created ? "It is ready to use, with a $500 limit." : "Give your first agent a card, with a limit and a list of places it can buy."}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {created ? (
          <Button variant="secondary" onClick={() => setCreated(false)}>
            Reset demo
          </Button>
        ) : (
          <Button onClick={() => setCreated(true)}>
            <Plus />
            New card
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}

export function NoResults() {
  const [query, setQuery] = React.useState("Hotel booking");
  const cards = ["Travel agent", "Office supplies"].filter((name) => name.toLowerCase().includes(query.toLowerCase().trim()));
  return (
    <div className="grid max-w-2xl gap-4">
      <Input variant="search" aria-label="Search cards" value={query} onChange={(event) => setQuery(event.target.value)} />
      {cards.length ? (
        <ul aria-live="polite">
          {cards.map((name) => (
            <li key={name} className="border-b border-line py-3 text-body-sm">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <Empty name="search.results">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search strokeWidth={1.5} />
            </EmptyMedia>
            <EmptyTitle>Nothing matches</EmptyTitle>
            <EmptyDescription>Try a merchant’s name or a card’s nickname.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}

export function Bare() {
  return (
    <Empty name={null} className="max-w-md">
      <EmptyHeader>
        <EmptyTitle>No purchases this week</EmptyTitle>
        <EmptyDescription>Purchases your agents make appear here as they happen.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

```

## Source

components/ui/empty.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { WindowBar } from "@/components/ui/window";
import { cn } from "@/lib/utils";

// shadcn's Empty in the look of the brand's empty state: a quiet window with a 16 percent ink hairline, 12px corners and
// no drop, the 32px sky bar labeled like a file (`name`: cards.list, search.results; null drops it), over a centered
// body on the pale ground. The media is a small white key (`icon`: 40px, the key's bevel, a blue glyph); the title the
// 20px display face at 500, tracked tight; the description 14px Inter at 68 percent ink; then at most one action.
// Nothing moves.
function Empty({ className, name = "empty", tone, children, ...props }: React.ComponentProps<"div"> & { name?: React.ReactNode | null; tone?: React.ComponentProps<typeof WindowBar>["tone"] }) {
  return (
    <div data-slot="empty" className={cn("flex min-w-0 flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg", className)} {...props}>
      {name !== null && <WindowBar name={name} tone={tone} />}
      <div data-slot="empty-body" className="flex flex-1 flex-col items-center justify-center gap-5 bg-subtle px-6 py-12 text-center text-balance md:py-16">
        {children}
      </div>
    </div>
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("flex max-w-sm flex-col items-center gap-3", className)} {...props} />;
}

const emptyMediaVariants = cva("flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "mb-1 size-10 rounded-control border border-hairline bg-surface text-fg-brand shadow-key [&_svg:not([class*='size-'])]:size-4.5",
    },
  },
  defaultVariants: { variant: "default" },
});

function EmptyMedia({ className, variant = "default", ...props }: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return <div data-slot="empty-media" data-variant={variant} aria-hidden={variant === "icon" || undefined} className={cn(emptyMediaVariants({ variant }), className)} {...props} />;
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("font-display text-h4 leading-snug font-medium tracking-tight text-fg", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="empty-description" className={cn("max-w-sm text-body-sm leading-relaxed text-pretty text-fg-muted [&>a]:text-fg-brand [&>a]:underline [&>a]:underline-offset-4", className)} {...props} />;
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-content" className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-body-sm text-balance", className)} {...props} />;
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };

```
