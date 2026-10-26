# Hover Card
A preview in the brand's floating panel that appears while the pointer rests on a link.

Install: npx agentcard-ds add hover-card
Requires: theme, surface, utils
Packages: @radix-ui/react-hover-card
Exports: HoverCard, HoverCardContent, HoverCardTrigger
Client boundary: yes
Reference: Extrapolated from Agentcard (the popover panel)


## Usage
Use to preview what a link points to (an agent, a merchant, a card) without leaving the page. Keep the content short and repeat anything essential on the destination: touch and keyboard users may never see it.
- Avoid: Actions only reachable inside it
- Avoid: Long text
- Avoid: Opening on every passing hover (keep the delay)


## Examples
Example components: npx agentcard-ds add hover-card
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/hover-card/Site) | [Open](https://agentcard-ds.vercel.app/preview/hover-card/Open)

examples/hover-card.tsx

```tsx
import { CreditCard } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

function AgentPreview() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-control bg-sky text-fg-brand">
          <CreditCard strokeWidth={1.5} className="size-4.5" />
        </span>
        <div>
          <p className="font-display text-body-sm font-medium text-fg">Travel agent</p>
          <p className="text-caption text-fg-muted">3 cards, $250 per purchase</p>
        </div>
      </div>
      <p className="text-body-sm leading-relaxed text-fg-secondary">Books flights and hotels for the team. Last purchase: a train to Boston for $86.40.</p>
    </div>
  );
}

export function Site() {
  return (
    <p className="text-center text-body-sm text-fg-secondary">
      Paid by{" "}
      <HoverCard>
        <HoverCardTrigger href="#travel-agent" className="text-fg-brand underline decoration-line-brand underline-offset-4">
          Travel agent
        </HoverCardTrigger>
        <HoverCardContent>
          <AgentPreview />
        </HoverCardContent>
      </HoverCard>{" "}
      on Oct 21.
    </p>
  );
}

export function Open() {
  return (
    <div className="flex h-60 justify-center">
      <HoverCard defaultOpen>
        <HoverCardTrigger href="#travel-agent" className="h-fit text-body-sm text-fg-brand underline decoration-line-brand underline-offset-4">
          Travel agent
        </HoverCardTrigger>
        <HoverCardContent side="bottom">
          <AgentPreview />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

```

## Source

components/ui/hover-card.tsx

```tsx
"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A preview that appears while the pointer rests on a link (a card, a merchant, a teammate): the brand's floating panel
// (popover.tsx: white, a 16 percent ink hairline, 8px corners, the tooltip shadow), 16px inside, 6px off its trigger.
// It waits 500ms before opening so passing over a link does not flash it, and grows out of the side nearest the
// trigger (scale 0.97 and a fade, 160ms ease-out). Reduced motion keeps only the fade.
function HoverCard({ openDelay = 500, closeDelay = 200, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

function HoverCardTrigger(props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({ className, align = "center", sideOffset = 6, collisionPadding = 8, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal container={usePortalContainer()} data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 w-72 max-w-(--radix-hover-card-content-available-width) origin-(--radix-hover-card-content-transform-origin) animate-pop-in rounded-control border border-hairline bg-surface p-4 text-body-sm text-fg shadow-tooltip outline-none motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };

```
