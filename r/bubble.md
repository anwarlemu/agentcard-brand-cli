# Bubble
A message bubble: the person's in the electric blue with white text, the agent's on the pale gray, 12px corners with a square tail corner.

Install: npx agentcard-ds add bubble
Requires: theme, utils
Packages: @radix-ui/react-slot, class-variance-authority
Exports: Bubble, BubbleContent, BubbleGroup, BubbleReactions, bubbleVariants
Client boundary: not required by this entry file
Reference: Extrapolated from Agentcard: the blue key (agentcard-website .v7-btn-primary), the quiet gray and paper grounds and the cards' 12px corners


## Usage
Use inside Message for a conversation with an agent: default (blue, align end) for what the person sends, secondary for the agent's replies, tinted for another agent, muted for a system note, outline for a quote, destructive for a message that failed, ghost for long output without a box. Group consecutive bubbles with BubbleGroup so only the last keeps its tail.
- Avoid: Bubbles that animate in
- Avoid: Gradients or glows
- Avoid: More than two bubble colors in one thread
- Avoid: Fully rounded pill bubbles


## Examples
Example components: npx agentcard-ds add bubble
[Site](https://agentcard-ds.vercel.app/preview/bubble/Site) | [Variants](https://agentcard-ds.vercel.app/preview/bubble/Variants)

examples/bubble.tsx

```tsx
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";

export function Site() {
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col gap-3">
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>I found two train tickets to Boston for Friday, $184 in total.</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Should I buy them with the travel card?</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Yes, go ahead. Keep it under $200.</BubbleContent>
        <BubbleReactions align="start">👍</BubbleReactions>
      </Bubble>
    </div>
  );
}

export function Variants() {
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col gap-3">
      <Bubble variant="tinted">
        <BubbleContent>Purchase Agent: the order is placed. Confirmation number 4182.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Travel card limit raised to $2,500 for this month.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Quoted: Card ending 7718, multi-use, $2,000 a month.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>Not sent. The card was paused before the purchase.</BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>A ghost bubble sets text without a box, for long agent output such as an order summary.</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent asChild>
          <button type="button">Retry the purchase</button>
        </BubbleContent>
      </Bubble>
    </div>
  );
}

```

## Source

components/ui/bubble.tsx

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A message bubble in an agent conversation, in the brand's colors (agentcard.sh): what the person sends is the blue,
// as the main key, with white text; what the agent or a merchant sends is the pale gray of the brand's quiet ground with
// ink text. 14px Inter on a 1.6 line, 14px by 10px of padding, the cards' 12px corners with the tail corner (bottom left
// for incoming, bottom right for outgoing) cut to 2px, as the brand's tags are square. In a BubbleGroup only the last
// bubble keeps the tail. Bubbles never animate in: a conversation is read all day.
function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="bubble-group" className={cn("flex min-w-0 flex-col gap-1 [&>[data-slot=bubble]:not(:last-child)>[data-slot=bubble-content]]:rounded-card", className)} {...props} />;
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[align=start]:*:data-[slot=bubble-content]:rounded-bl-chip data-[align=end]:*:data-[slot=bubble-content]:rounded-br-chip data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        // Outgoing: the blue, as the main key.
        default: "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-on-primary [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary-hover",
        // Incoming: the pale gray ground.
        secondary: "*:data-[slot=bubble-content]:bg-subtle *:data-[slot=bubble-content]:text-fg [&>[data-slot=bubble-content]:is(button,a):hover]:bg-wash-pill",
        // A system or quoted message: the warm paper.
        muted: "*:data-[slot=bubble-content]:bg-paper *:data-[slot=bubble-content]:text-fg-secondary [&>[data-slot=bubble-content]:is(button,a):hover]:bg-wash-pill",
        // Another agent: the sky wash of a window's sheet.
        tinted: "*:data-[slot=bubble-content]:border-line-window *:data-[slot=bubble-content]:bg-sky-wash *:data-[slot=bubble-content]:text-fg [&>[data-slot=bubble-content]:is(button,a):hover]:bg-sky",
        outline: "*:data-[slot=bubble-content]:border-hairline *:data-[slot=bubble-content]:bg-surface *:data-[slot=bubble-content]:text-fg [&>[data-slot=bubble-content]:is(button,a):hover]:bg-wash-hover",
        ghost: "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 *:data-[slot=bubble-content]:text-fg",
        // A message that failed to send.
        destructive: "*:data-[slot=bubble-content]:border-danger *:data-[slot=bubble-content]:bg-surface *:data-[slot=bubble-content]:text-danger [&>[data-slot=bubble-content]:is(button,a):hover]:bg-wash-hover",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Bubble({ variant = "default", align = "start", className, ...props }: React.ComponentProps<"div"> & VariantProps<typeof bubbleVariants> & { align?: "start" | "end" }) {
  return <div data-slot="bubble" data-variant={variant} data-align={align} className={cn(bubbleVariants({ variant }), className)} {...props} />;
}

function BubbleContent({ asChild = false, className, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="bubble-content"
      className={cn(
        "w-fit max-w-full min-w-0 overflow-hidden rounded-card border border-transparent px-3.5 py-2.5 font-sans text-body-sm leading-relaxed break-words group-data-[align=end]/bubble:self-end [button]:cursor-pointer [button]:text-left [button,a]:outline-none [button,a]:transition-colors [button,a]:duration-150 [button,a]:ease-out [button,a]:focus-visible:outline-2 [button,a]:focus-visible:outline-offset-2 [button,a]:focus-visible:outline-solid [button,a]:focus-visible:outline-focus-ring motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-sm border border-hairline bg-surface px-1.5 py-0.5 font-display text-caption leading-snug text-fg shadow-key-muted has-[button]:p-0",
  {
    variants: {
      side: { top: "top-0 -translate-y-3/4", bottom: "bottom-0 translate-y-3/4" },
      align: { start: "left-3", end: "right-3" },
    },
    defaultVariants: { side: "bottom", align: "end" },
  },
);

/** Reactions pinned to a bubble's edge: a small white key on the hairline. */
function BubbleReactions({ side = "bottom", align = "end", className, ...props }: React.ComponentProps<"div"> & { align?: "start" | "end"; side?: "top" | "bottom" }) {
  return <div data-slot="bubble-reactions" data-align={align} data-side={side} className={cn(bubbleReactionsVariants({ side, align }), className)} {...props} />;
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions, bubbleVariants };

```
