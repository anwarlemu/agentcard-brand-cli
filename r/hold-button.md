# Hold button
Button that confirms an action after a continuous hold.

Install: npx agentcard-ds add hold-button
Requires: theme, use-hold, utils
Packages: none
Exports: HoldButton
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (--bevel-white); principles (keys sink on press)


## Usage
Use for destructive actions such as closing a card. Connect onConfirm to the action. Releasing early, leaving the control or losing focus cancels the hold.
- Avoid: Hold for actions that can be undone
- Avoid: Hiding how long to hold
- Avoid: A blue fill for a destructive action


## Examples
Example components: npx agentcard-ds add hold-button button
[Site](https://agentcard-ds.vercel.app/preview/hold-button/Site)

examples/hold-button.tsx

```tsx
"use client";

import { useState } from "react";
import { HoldButton } from "@/components/ui/hold-button";
import { Button } from "@/components/ui/button";

export function Site() {
  const [closed, setClosed] = useState(false);
  return <div className="grid justify-items-start gap-3">
    <HoldButton label="Hold to close card" disabled={closed} onConfirm={() => setClosed(true)} />
    <p role="status" className="text-body-sm text-fg-muted">{closed ? "Card closed. It can no longer make purchases." : "Card active. Release early to cancel."}</p>
    {closed && <Button variant="secondary" size="sm" onClick={() => setClosed(false)}>Reset demo</Button>}
  </div>;
}

```

## Source

components/ui/hold-button.tsx

```tsx
"use client";

import * as React from "react";

import { useHold } from "@/hooks/use-hold";
import { cn } from "@/lib/utils";

// Hold to confirm a destructive action, as one of the brand's keys: a white key with red text and the bevel, which fills
// red from the left while held. The fill carries a white copy of the label and is revealed by clip-path, so the label
// reads red on white ahead of the fill and white on red behind it at every moment. The reveal runs at a constant rate
// while held (2s, linear) and snaps back in 200ms ease-out on release; the key sinks a pixel while pressed.
function HoldButton({ label, onConfirm, holdMs = 2000, className, disabled = false }: { label: string; onConfirm: () => void; holdMs?: number; className?: string; disabled?: boolean }) {
  const { isHolding, handlers } = useHold(holdMs, onConfirm, disabled);
  const text = isHolding ? "Keep holding" : label;
  return (
    <button
      type="button"
      disabled={disabled}
      data-slot="hold-button"
      data-holding={isHolding || undefined}
      {...handlers}
      className={cn(
        "disabled:opacity-50 disabled:pointer-events-none relative inline-flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-control border border-hairline bg-surface px-5 font-display text-body-sm leading-none whitespace-nowrap text-danger shadow-key outline-none transition-[box-shadow,translate] duration-150 ease-out select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-holding:translate-y-px data-holding:shadow-pressed motion-reduce:transition-none motion-reduce:data-holding:translate-y-0",
        className,
      )}
    >
      <span>{text}</span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-danger text-white transition-[clip-path] motion-reduce:transition-none",
          isHolding ? "[clip-path:inset(0_0_0_0)] ease-linear" : "[clip-path:inset(0_100%_0_0)] duration-200 ease-out",
        )}
        style={isHolding ? { transitionDuration: `${holdMs}ms` } : undefined}
      >
        {text}
      </span>
    </button>
  );
}

export { HoldButton };

```
