# Button
Buttons for primary, secondary, toolbar and on-blue actions.

Install: npx agentcard-ds add button
Requires: theme, utils
Packages: @radix-ui/react-slot, class-variance-authority
Exports: Button, buttonVariants
Client boundary: not required by this entry file
Reference: agentcard-website src/app/globals.css:4159 (V7 buttons and tabs, one bevel)


## Usage
Use one primary action per section. Use secondary for other actions, on-brand on blue backgrounds and ghost in toolbars. Wire an onClick handler, use type="submit" for forms, or use asChild with a link for navigation.
- Avoid: Rounded pill buttons
- Avoid: Bold labels
- Avoid: Two blue keys side by side for equal actions
- Avoid: A gradient or glow on a key


## Examples
Example components: npx agentcard-ds add button surface
[Site](https://agentcard-ds.vercel.app/preview/button/Site)

examples/button.tsx

```tsx
import { Button } from "@/components/ui/button";
import { Surface } from "@/lib/surface";

export function Site() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild><a href="https://app.agentcard.sh/" target="_blank" rel="noreferrer">Start free</a></Button>
        <Button variant="secondary" asChild><a href="https://www.agentcard.sh/pricing" target="_blank" rel="noreferrer">See pricing</a></Button>
        <Button variant="ghost" asChild><a href="https://docs.agentcard.sh" target="_blank" rel="noreferrer">Read the docs</a></Button>
        <Button size="sm" asChild><a href="https://www.agentcard.sh/vault" target="_blank" rel="noreferrer">Explore Vault</a></Button>
      </div>
      <Surface ground="blue" className="flex flex-wrap items-center gap-3 rounded-panel p-8">
        <Button variant="on-brand" asChild><a href="https://app.agentcard.sh/" target="_blank" rel="noreferrer">Get started</a></Button>
        <Button variant="on-brand" size="sm" asChild><a href="https://cal.com/team/agentcard/agentcard-call" target="_blank" rel="noreferrer">Talk to us</a></Button>
      </Surface>
    </div>
  );
}

```

## Source

components/ui/button.tsx

```tsx
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

```
