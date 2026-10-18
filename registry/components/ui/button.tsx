import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Every button is a raised key (agentcard.sh, the v7 bevel): 8px corners, a border a shade darker than its fill, a
// light line inside the top, a darker one inside the bottom and a soft drop. Hover brightens a shade; a press sinks it
// a pixel and swaps the drop for the pressed well. `primary` is the blue key on white, `on-brand` the white key with
// blue text on the blue ground, `secondary` the white key with ink text on white, `ghost` a bare label that washes on
// hover.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-control border font-display font-normal leading-none outline-none select-none transition-[background-color,color,box-shadow,translate] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        primary: "border-line-brand-edge bg-primary text-on-primary shadow-key-brand hover:bg-primary-hover active:shadow-pressed",
        secondary: "border-hairline bg-surface text-fg shadow-key hover:bg-sky-wash active:shadow-pressed",
        "on-brand": "border-hairline bg-white text-fg-brand shadow-key hover:bg-sky-wash active:shadow-pressed",
        ghost: "border-transparent text-fg-muted hover:bg-wash-hover hover:text-fg data-[state=open]:bg-wash-hover data-[state=open]:text-fg",
      },
      size: {
        // The site's key: 40px, 22px of padding, 14px display face.
        md: "h-10 px-5.5 text-body-sm leading-body",
        sm: "h-8 px-3.5 text-caption",
        // The header's Get started and the pricing actions are md; a full-width action adds w-full.
        icon: "size-8 px-0 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" type={asChild ? type : (type ?? "button")} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
