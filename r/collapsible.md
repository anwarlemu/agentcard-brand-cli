# Collapsible
A disclosure that grows open and shut with the brand's 300ms ease-out.

Install: npx agentcard-ds add collapsible
Requires: theme, collapse, utils
Packages: none
Exports: Collapsible, CollapsibleContent, CollapsibleTrigger
Client boundary: yes
Reference: collapse.tsx (agentcard-website plan details)


## Usage
Use to hide secondary detail under a row (more card settings, a purchase's line items). Put a CollapsibleTrigger (often asChild on a button) and CollapsibleContent inside Collapsible; control it with open and onOpenChange when needed.
- Avoid: Hiding required fields
- Avoid: Nesting collapsibles deeply
- Avoid: A trigger without a visible state


## Examples
Example components: npx agentcard-ds add collapsible
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/collapsible/Site) | [Open](https://agentcard-ds.vercel.app/preview/collapsible/Open)

examples/collapsible.tsx

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ITEMS = [
  { name: "Two adult fares, Boston to New York", price: "$72.00" },
  { name: "Seat reservation", price: "$8.00" },
  { name: "Booking fee", price: "$6.40" },
];

export function Site() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mx-auto w-full max-w-110 rounded-card border border-hairline bg-surface shadow-guide">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div>
          <p className="font-display text-body-sm font-medium text-fg">Amtrak, $86.40</p>
          <p className="text-caption text-fg-muted">Travel agent, Oct 21</p>
        </div>
        <CollapsibleTrigger className="group inline-flex items-center gap-1 rounded-sm px-2 py-1.5 font-display text-caption text-fg-brand outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-selected focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring">
          {open ? "Hide items" : "Show items"}
          <ChevronDown aria-hidden strokeWidth={1.75} className="size-3.5 transition-[rotate] duration-200 ease-in-out group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="grid gap-2 border-t border-line px-4 py-3.5">
          {ITEMS.map((i) => (
            <li key={i.name} className="flex justify-between gap-4 text-body-sm">
              <span className="text-fg-secondary">{i.name}</span>
              <span className="text-fg tabular-nums">{i.price}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Open() {
  return (
    <Collapsible defaultOpen className="mx-auto grid w-full max-w-110 gap-2">
      <CollapsibleTrigger className="group flex items-center justify-between rounded-control px-3.5 py-3 text-left font-display text-body-sm font-medium text-fg outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-hover focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus-ring">
        Advanced card settings
        <ChevronDown aria-hidden strokeWidth={1.75} className="size-3.5 text-fg-muted transition-[rotate] duration-200 ease-in-out group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="px-3.5 text-body-sm leading-relaxed text-fg-muted">Merchant categories, currency and the hour of day this card can be used. Every change applies to the next checkout.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

```

## Source

components/ui/collapsible.tsx

```tsx
"use client";

import * as React from "react";

import { Collapse } from "@/components/ui/collapse";
import { cn } from "@/lib/utils";

// shadcn's Collapsible in the brand's own disclosure (collapse.tsx, as the plan details and the guides' panels open):
// the content grows from nothing to its height and back over 300ms ease-out with a fade, so what sits below glides
// rather than jumps, and stays mounted but inert while shut. The trigger carries aria-expanded and aria-controls.
// Reduced motion opens and closes at once.
type CollapsibleContextValue = { open: boolean; setOpen: (open: boolean) => void; contentId: string; disabled?: boolean };
const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);
function useCollapsible() {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error("Collapsible parts must be used within <Collapsible />");
  return ctx;
}

function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; disabled?: boolean }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const contentId = React.useId();
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  return (
    <CollapsibleContext.Provider value={{ open, setOpen, contentId, disabled }}>
      <div data-slot="collapsible" data-state={open ? "open" : "closed"} data-disabled={disabled ? "" : undefined} className={className} {...props} />
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ onClick, asChild = false, children, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, setOpen, contentId, disabled } = useCollapsible();
  const shared = {
    "data-slot": "collapsible-trigger",
    "data-state": open ? "open" : "closed",
    "aria-expanded": open,
    "aria-controls": contentId,
    disabled: disabled || props.disabled,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    },
  };
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, { ...props, ...shared, onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      (child.props.onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(event);
      shared.onClick(event);
    } });
  }
  return (
    <button type="button" {...props} {...shared}>
      {children}
    </button>
  );
}

function CollapsibleContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { open, contentId } = useCollapsible();
  return (
    <Collapse open={open} id={contentId} className={cn(className)}>
      <div data-slot="collapsible-content" data-state={open ? "open" : "closed"}>
        {children}
      </div>
    </Collapse>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };

```
