# Button Group
Keys joined into one bar with merged edges, with an optional sunken text segment.

Install: npx agentcard-ds add button-group
Requires: theme, utils
Packages: @radix-ui/react-slot, class-variance-authority
Exports: ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants
Client boundary: not required by this entry file
Reference: Extrapolated from the brand's keys (agentcard-website src/app/globals.css --bevel)


## Usage
Use for related actions that act on the same thing (Previous and Next, Copy and Download) or a field joined to its action. Use secondary keys inside, ButtonGroupText for a label segment, and ButtonGroupSeparator between blue keys.
- Avoid: Mixing primary and secondary keys in one group
- Avoid: More than five keys in a bar
- Avoid: Gaps between joined keys


## Examples
Example components: npx agentcard-ds add button-group button input
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/button-group/Site) | [WithText](https://agentcard-ds.vercel.app/preview/button-group/WithText)

examples/button-group.tsx

```tsx
import { ChevronLeft, ChevronRight, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export function Site() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonGroup aria-label="Pages">
        <Button variant="secondary" size="icon" aria-label="Previous page">
          <ChevronLeft />
        </Button>
        <Button variant="secondary" size="icon" aria-label="Next page">
          <ChevronRight />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Receipt">
        <Button variant="secondary">
          <Copy />
          Copy
        </Button>
        <Button variant="secondary">
          <Download />
          Download
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Approve">
        <Button>Approve</Button>
        <ButtonGroupSeparator />
        <Button aria-label="More options" size="icon">
          <ChevronRight />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function WithText() {
  return (
    <div className="grid w-full max-w-100 gap-4">
      <ButtonGroup className="w-full">
        <ButtonGroupText>https://</ButtonGroupText>
        <Input aria-label="Merchant site" defaultValue="shop.example.com" className="rounded-none" />
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Sort" className="w-40">
        <Button variant="secondary">Newest</Button>
        <Button variant="secondary">Largest</Button>
        <Button variant="secondary">Merchant</Button>
      </ButtonGroup>
    </div>
  );
}

```

## Source

components/ui/button-group.tsx

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Keys joined into one control (extrapolated from the brand's keys and its tab track): the inner corners square off and
// the shared edges merge into one hairline, so secondary keys read as one 40px bar with 8px outer corners; a field or a
// select can sit in the bar. ButtonGroupText is a sunken segment (the pale wash, a hairline) holding a label in the
// 14px display face; ButtonGroupSeparator is a 1px light rule between filled blue keys.
const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
);

function ButtonGroup({ className, orientation, ...props }: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return <div role="group" data-slot="button-group" data-orientation={orientation ?? "horizontal"} className={cn(buttonGroupVariants({ orientation }), className)} {...props} />;
}

function ButtonGroupText({ className, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="button-group-text"
      className={cn("flex items-center gap-2 rounded-control border border-hairline bg-subtle px-3.5 font-display text-body-sm leading-none whitespace-nowrap text-fg-muted shadow-well [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5", className)}
      {...props}
    />
  );
}

function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn("relative z-10 shrink-0 self-stretch bg-line-on-brand-strong", orientation === "vertical" ? "-mx-px w-px" : "-my-px h-px", className)}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };

```
