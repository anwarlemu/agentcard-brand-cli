"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

// A control's name: 16px Inter in ink, beside a checkbox or a switch. Field sets it above an input in the brand's form
// style, the 12px display face at 68 percent ink.
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("flex items-center gap-2 text-body leading-snug text-fg select-none peer-disabled:opacity-50 group-data-[disabled=true]:opacity-50", className)}
      {...props}
    />
  );
}

export { Label };
