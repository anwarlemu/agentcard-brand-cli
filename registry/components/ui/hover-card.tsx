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
