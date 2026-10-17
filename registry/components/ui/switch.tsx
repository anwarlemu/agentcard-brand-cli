"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

// The brand's track and key, in small: off, a sunken track (pale, a hairline, the inner shadow) with a white key at the
// left; on, the track turns blue and the key slides right (200ms ease-out, on transform). The key sits 2px inside the
// track, its corners concentric with the track's 8px. Reduced motion moves it at once.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-control border outline-none transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-line-brand-edge data-[state=checked]:bg-primary data-[state=checked]:shadow-pressed data-[state=unchecked]:border-hairline data-[state=unchecked]:bg-subtle data-[state=unchecked]:shadow-well motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4.5 translate-x-0.5 rounded-sm border border-hairline bg-white shadow-key transition-[translate] duration-200 ease-out data-[state=checked]:translate-x-5.5 motion-reduce:transition-none"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
