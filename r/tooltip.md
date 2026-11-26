# Tooltip
Short contextual label shown on hover or keyboard focus.

Install: npx agentcard-ds add tooltip
Requires: theme, surface, utils
Packages: @radix-ui/react-tooltip
Exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (.v7-dock-card)


## Usage
Use to explain an icon control or add brief context. Keep a separate accessible name on the control; do not put essential instructions only in the tooltip.
- Avoid: Tooltips for anything needed to finish a task
- Avoid: Long text (use a popover)
- Avoid: Dark tooltips
Wrap adjacent tooltips in `TooltipProvider` to share the hover delay. A standalone `Tooltip` supplies its own provider.

## Examples
Example components: npx agentcard-ds add tooltip field input button
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/tooltip/Site) | [Open](https://agentcard-ds.vercel.app/preview/tooltip/Open)

examples/tooltip.tsx

```tsx
"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pause, Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ACTIONS = [
  { label: "New card", icon: Plus },
  { label: "Pause card", icon: Pause },
  { label: "Card settings", icon: Settings },
];

export function Site() {
  const [nickname, setNickname] = useState("Travel agent");
  const [cards, setCards] = useState(1);
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState(false);
  return (
    <TooltipProvider>
    <div className="flex gap-2 pt-10">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" aria-label={label === "Pause card" && paused ? "Resume card" : label} onClick={() => { if (label === "New card") setCards(cards + 1); else if (label === "Pause card") setPaused(!paused); else setSettings(!settings); }}>
              <Icon strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label === "Pause card" && paused ? "Resume card" : label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
    <p role="status" className="mt-3 text-body-sm text-fg-muted">{cards} {cards === 1 ? "card" : "cards"}. {nickname || "Unnamed card"} {paused ? "paused" : "active"}.</p>
    {settings && <Field label="Card nickname"><Input value={nickname} onChange={(event) => setNickname(event.target.value)} /></Field>}
    </TooltipProvider>
  );
}

export function Open() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="flex gap-2 pt-10">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" aria-label={paused ? "Resume card" : "Pause card"} onClick={() => setPaused(!paused)}>
            <Pause strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{paused ? "Resume card" : "Pause card"}</TooltipContent>
      </Tooltip>
      <p role="status" className="text-body-sm text-fg-muted">{paused ? "Card paused." : "Card active."}</p>
    </div>
  );
}

```

## Source

components/ui/tooltip.tsx

```tsx
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

const HasTooltipProvider = React.createContext(false);

// Hovering waits a beat before the label appears, so passing over a control doesn't flash it; once one is showing,
// the next one within the warm window appears at once (Radix's skip delay), so sweeping a row of keys doesn't wait.
function TooltipProvider({ delayDuration = 600, skipDelayDuration = 300, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <HasTooltipProvider.Provider value={true}><TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} /></HasTooltipProvider.Provider>;
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const provided = React.useContext(HasTooltipProvider);
  if (provided) return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

// The brand's floating label: white, a 16 percent ink hairline, 8px corners and the tooltip shadow, in the 12px display
// face, on one line unless `wrap`. The first one hovered grows from its trigger (scale 0.97 and a fade, 160ms ease-out);
// the next ones in the warm window (Radix's instant open) appear at once. Reduced motion keeps only the fade.
function TooltipContent({ className, side, sideOffset, collisionPadding = 8, wrap = false, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content> & { wrap?: boolean }) {
  return (
    <TooltipPrimitive.Portal container={usePortalContainer()}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        side={side}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset ?? (side === "left" || side === "right" ? 8 : 6)}
        className={cn(
          "z-50 origin-(--radix-tooltip-content-transform-origin) rounded-control border border-hairline bg-surface px-2 py-1.5 font-display text-caption leading-snug text-fg shadow-tooltip motion-safe:data-[state=delayed-open]:animate-pop-in motion-reduce:animate-none",
          wrap ? "w-max max-w-[min(16rem,var(--radix-tooltip-content-available-width))] text-pretty" : "w-max max-w-(--radix-tooltip-content-available-width) break-words",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

```
