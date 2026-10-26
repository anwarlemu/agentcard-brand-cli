"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

// The checkbox's small key made round (extrapolated from the brand's checkbox and its --bevel-blue): a 20px white circle
// on a 35 percent ink edge with the pale key's bevel; chosen, it becomes the blue key (a darker blue edge, the light line
// inside the top) with a white 8px dot. The fill changes in 150ms ease-out. Options stack 12px apart; pair each with a
// Label variant="control".
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-pill border border-line-strong bg-surface shadow-key-muted outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger data-[state=checked]:border-line-brand-edge data-[state=checked]:bg-primary data-[state=checked]:shadow-key-brand motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="size-2 rounded-pill bg-white" />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
