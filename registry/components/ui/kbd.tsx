import * as React from "react";

import { cn } from "@/lib/utils";

// A keyboard key, drawn as the brand's key in small: 20px, a white face on a 16 percent ink edge with the pale key's bevel
// (a light line inside the top, a darker one inside the bottom), the label in the 12px display face.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn("inline-grid h-5 min-w-5 place-items-center rounded-[calc(var(--ds-radius-control)/2)] border border-hairline bg-surface px-1 font-display text-caption leading-none text-fg-muted shadow-key-muted", className)}
      {...props}
    />
  );
}

export { Kbd };
