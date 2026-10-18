"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

// Form labels follow .v7-gate-field > span: 12px display type on an 18px line.
// The control variant pairs a body-size label with an inline checkbox or switch.
function Label({ className, variant = "form", ...props }: React.ComponentProps<typeof LabelPrimitive.Root> & { variant?: "form" | "control" }) {
  return <LabelPrimitive.Root data-slot="label" className={cn(
    "flex items-center gap-2 select-none peer-disabled:opacity-50 group-data-[disabled=true]:opacity-50 font-display text-caption leading-normal text-fg-muted",
    variant === "control" && "font-sans text-body leading-snug text-fg",
    className,
  )} {...props} />;
}

export { Label };
