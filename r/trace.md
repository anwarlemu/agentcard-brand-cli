# Trace
An agent's steps as quiet display-face lines with a glyph, a running step in ink with a spinner, a failed one in red, and steps that open to show their detail.

Install: npx agentcard-ds add trace
Requires: theme, collapse, utils
Packages: @radix-ui/react-collapsible, lucide-react
Exports: Trace, TraceCollapsible, TraceCollapsibleContent, TraceCollapsibleTrigger, TraceDescription, TraceIcon, TraceLine, TraceTitle
Client boundary: yes
Reference: Extrapolated from Agentcard: the updates page's display-face lines (agentcard.sh/updates), the FAQ's disclosure and the Collapse


## Usage
Use to show what an agent did or is doing during a purchase: one TraceLine per step with a TraceIcon, a TraceTitle and an optional TraceDescription (a duration or a count). Set status running (use Spinner as its glyph), pending or error. Wrap a step in TraceCollapsible with TraceCollapsibleTrigger and TraceCollapsibleContent when it has detail; wrap a line in a link or button to make it act.
- Avoid: Bold step titles
- Avoid: More than one running step
- Avoid: Steps that animate in one by one
- Avoid: Colors other than ink
- Avoid: red and the muted ink


## Examples
Example components: npx agentcard-ds add trace spinner
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/trace/Site) | [Failed](https://agentcard-ds.vercel.app/preview/trace/Failed) | [Linked](https://agentcard-ds.vercel.app/preview/trace/Linked)

examples/trace.tsx

```tsx
import { CircleAlert, CreditCard, Receipt, RotateCw, Search, ShoppingCart, Store } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { Trace, TraceCollapsible, TraceCollapsibleContent, TraceCollapsibleTrigger, TraceDescription, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace";

export function Site() {
  return (
    <Trace className="mx-auto max-w-120">
      <TraceLine>
        <TraceIcon>
          <Search strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Searched three stores for a 27 inch monitor</TraceTitle>
        <TraceDescription>2.1s</TraceDescription>
      </TraceLine>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Store strokeWidth={1.75} />
            </TraceIcon>
            <TraceTitle>Compared prices</TraceTitle>
            <TraceDescription>3 results</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>Best Buy has it for $229 with delivery on Friday; Amazon and B&amp;H are $15 more.</TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine status="running">
        <TraceIcon>
          <Spinner />
        </TraceIcon>
        <TraceTitle>Paying with the card ending 7718</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <Receipt strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Save the receipt to the office expenses</TraceTitle>
      </TraceLine>
    </Trace>
  );
}

export function Failed() {
  return (
    <Trace className="mx-auto max-w-120">
      <TraceLine>
        <TraceIcon>
          <ShoppingCart strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Added two train tickets to the cart</TraceTitle>
        <TraceDescription>0.4s</TraceDescription>
      </TraceLine>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <CircleAlert strokeWidth={1.75} />
            </TraceIcon>
            <TraceTitle>The card was declined</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>The purchase was $212, over the travel card’s $200 limit. Raise the limit or choose a cheaper fare.</TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine>
        <TraceIcon>
          <RotateCw strokeWidth={1.75} />
        </TraceIcon>
        <TraceTitle>Waiting for a new limit</TraceTitle>
        <TraceDescription>paused</TraceDescription>
      </TraceLine>
    </Trace>
  );
}

export function Linked() {
  return (
    <Trace className="mx-auto max-w-120">
      <a href="#receipt">
        <TraceLine>
          <TraceIcon>
            <Receipt strokeWidth={1.75} />
          </TraceIcon>
          <TraceTitle>Opened the receipt from Best Buy</TraceTitle>
        </TraceLine>
      </a>
      <button type="button">
        <TraceLine>
          <TraceIcon>
            <CreditCard strokeWidth={1.75} />
          </TraceIcon>
          <TraceTitle>Showed the card’s remaining limit</TraceTitle>
        </TraceLine>
      </button>
    </Trace>
  );
}

```

## Source

components/ui/trace.tsx

```tsx
"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";

import { Collapse } from "@/components/ui/collapse";
import { cn } from "@/lib/utils";

// An agent's steps as it works (extrapolated from agentcard.sh: the updates page's small display-face lines and the FAQ's
// disclosures). Each line is the 14px display face at 68 percent ink with a 16px glyph 8px before it; a line that is a
// link or a button turns ink under the pointer. A running step is set in ink (pair it with the Spinner as its glyph), a
// pending one is faded, a failed one is red. A step that can open shows a chevron after its title that turns a quarter
// when open; its detail hangs from an ink hairline 16px in, in 14px Inter at 80 percent ink, and opens with the brand's
// Collapse (its rows grow, 300ms ease-out; at once with reduced motion).
function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2 *:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:rounded-sm *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:outline-none *:has-[>[data-slot=trace-line]]:focus-visible:outline-2 *:has-[>[data-slot=trace-line]]:focus-visible:outline-offset-2 *:has-[>[data-slot=trace-line]]:focus-visible:outline-solid *:has-[>[data-slot=trace-line]]:focus-visible:outline-focus-ring",
        className,
      )}
      {...props}
    />
  );
}

function TraceLine({ className, status, ...props }: React.ComponentProps<"span"> & { status?: "running" | "error" | "pending" }) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "flex w-fit max-w-full min-w-0 items-center gap-2 font-display text-body-sm leading-snug text-fg-muted transition-colors duration-150 ease-out in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-fg data-[status=error]:text-danger data-[status=error]:in-[a:hover,button:hover]:text-danger data-[status=pending]:opacity-55 data-[status=running]:text-fg motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn("flex size-4 shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [[data-slot=trace-title]~&]:-ml-1", className)}
      {...props}
    />
  );
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="trace-title" className={cn("min-w-0 truncate", className)} {...props} />;
}

/** A step's quiet detail at its end: a duration or a count, at 45 percent ink with even figures. */
function TraceDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="trace-description" className={cn("shrink-0 text-fg-faint tabular-nums", className)} {...props} />;
}

const TraceCollapsibleContext = React.createContext(false);

function TraceCollapsible({ className, open: openProp, defaultOpen = false, onOpenChange, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  return (
    <TraceCollapsibleContext.Provider value={open}>
      <CollapsiblePrimitive.Root
        data-slot="trace-collapsible"
        open={open}
        onOpenChange={(next) => {
          if (openProp === undefined) setInner(next);
          onOpenChange?.(next);
        }}
        className={cn("flex w-full min-w-0 flex-col", className)}
        {...props}
      />
    </TraceCollapsibleContext.Provider>
  );
}

function TraceCollapsibleTrigger({ className, children, ...props }: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Trigger>, "asChild">) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-sm text-left text-fg-muted outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring has-[[data-status=error]]:text-danger motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
      <TraceIcon className="transition-transform duration-200 ease-out group-aria-expanded/trace-collapsible-trigger:rotate-90 motion-reduce:transition-none">
        <ChevronRight strokeWidth={1.75} className="size-3.5" />
      </TraceIcon>
    </CollapsiblePrimitive.Trigger>
  );
}

function TraceCollapsibleContent({ className, children, ...props }: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Content>, "asChild" | "forceMount">) {
  const open = React.useContext(TraceCollapsibleContext);
  return (
    <CollapsiblePrimitive.Content forceMount data-slot="trace-collapsible-content" className="min-w-0" {...props}>
      <Collapse open={open}>
        <div data-slot="trace-collapsible-content-inner" className={cn("mt-2 mb-1 ml-2 min-w-0 border-l border-line pr-1 pl-4 font-sans text-body-sm leading-relaxed [overflow-wrap:anywhere] text-fg-secondary", className)}>
          {children}
        </div>
      </Collapse>
    </CollapsiblePrimitive.Content>
  );
}

export { Trace, TraceCollapsible, TraceCollapsibleContent, TraceCollapsibleTrigger, TraceDescription, TraceIcon, TraceLine, TraceTitle };

```
