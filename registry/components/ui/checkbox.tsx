"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

// A small key: a 20px white box on a 35 percent ink edge with the pale key's bevel; checked, it becomes the blue key
// (a darker blue edge, the light line inside the top) with a white check. The fill changes in 150ms ease-out.
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-sm border border-line-strong bg-surface text-on-primary shadow-key-muted outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger data-[state=checked]:border-line-brand-edge data-[state=checked]:bg-primary data-[state=checked]:shadow-key-brand data-[state=indeterminate]:border-line-brand-edge data-[state=indeterminate]:bg-primary data-[state=indeterminate]:shadow-key-brand motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-items-center [&_svg]:size-3.5">
        {props.checked === "indeterminate" ? <Minus strokeWidth={2.25} /> : <Check strokeWidth={2.25} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
