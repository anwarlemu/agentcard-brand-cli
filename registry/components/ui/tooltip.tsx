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
