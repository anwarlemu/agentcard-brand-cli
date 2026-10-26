# Kbd
Keyboard key or shortcut label.

Install: npx agentcard-ds add kbd
Requires: theme, utils
Packages: class-variance-authority
Exports: Kbd, kbdVariants
Client boundary: not required by this entry file
Reference: Repository reference; public guide pages currently unavailable. agentcard-website src/app/globals.css (.v7-guide-search-keys kbd, .v7-guide-search kbd)


## Usage
Use in control hints, menu items and command palette instructions. The bare variant is for compact search hints.
- Avoid: Keys for things that are not keys
- Avoid: Dark keys
- Avoid: Keys in body copy larger than the text around them


## Examples
Example components: npx agentcard-ds add kbd
[Site](https://agentcard-ds.vercel.app/preview/kbd/Site) | [Bare](https://agentcard-ds.vercel.app/preview/kbd/Bare)

examples/kbd.tsx

```tsx
import { Kbd } from "@/components/ui/kbd";

// The guides' search footer: keys on the sky strip, each followed by what it does.
export function Site() {
  return (
    <div className="grid max-w-160 gap-6">
      <div className="flex flex-wrap items-center gap-x-4.5 gap-y-2 rounded-control border border-line-window bg-sky px-3.5 py-2 font-display text-micro text-fg-brand">
        <span className="inline-flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd>↵</Kbd> to open
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd>Esc</Kbd> to close
        </span>
      </div>
      <p className="flex flex-wrap items-center gap-1 text-body-sm text-fg-muted">
        Press <Kbd>⌘</Kbd>
        <Kbd>K</Kbd> to search the guides.
      </p>
    </div>
  );
}

// The hint at the end of the guides' search box.
export function Bare() {
  return (
    <div className="flex h-9 max-w-95 items-center gap-2.5 rounded-control border border-line-field bg-surface px-3 text-body-sm text-fg-muted shadow-inset">
      <span className="flex-1">Search...</span>
      <Kbd variant="bare">⌘K</Kbd>
    </div>
  );
}

```

## Source

components/ui/kbd.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A keyboard key, as the brand draws them (agentcard-website globals.css). `key` (the default) is .v7-guide-search-keys
// kbd, the keys in the guides' search footer: a white face on a pale blue edge, 4px corners, the label in the 10px
// display face in blue, at least 18px wide. `bare` is .v7-guide-search kbd, the hint at the end of the search box: the
// 12px display face at 45 percent ink, no face at all.
const kbdVariants = cva("inline-grid shrink-0 place-items-center font-display leading-none whitespace-nowrap", {
  variants: {
    variant: {
      key: "h-5 min-w-4.5 rounded-[calc(var(--ds-radius-control)/2)] border border-line-window bg-surface px-1 text-micro text-fg-brand",
      bare: "text-caption text-fg-faint",
    },
  },
  defaultVariants: { variant: "key" },
});

function Kbd({ className, variant, ...props }: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return <kbd data-slot="kbd" className={cn(kbdVariants({ variant }), className)} {...props} />;
}

export { Kbd, kbdVariants };

```
