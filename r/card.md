# Card
Container for related content, with default and raised variants.

Install: npx agentcard-ds add card
Requires: theme, utils
Packages: class-variance-authority
Exports: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, cardVariants
Client boundary: not required by this entry file
Reference: agentcard-website src/app/globals.css (.v7-trail li, .v7-sol); live https://www.agentcard.sh/


## Usage
Use default for features, plans or quotes. Use raised for product content with a preview. Use Window when the container needs a title bar.
- Avoid: Gray card backgrounds
- Avoid: Heavy blurred shadows
- Avoid: Cards inside cards
- Avoid: Corners other than 12px or 20px


## Examples
Example components: npx agentcard-ds add card button
[Site](https://agentcard-ds.vercel.app/preview/card/Site) | [Raised](https://agentcard-ds.vercel.app/preview/card/Raised)

examples/card.tsx

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Site() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Vault</CardTitle>
          <CardDescription>Store a card once. Your agent pays with a token that never leaves the vault.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" asChild><a href="https://www.agentcard.sh/vault" target="_blank" rel="noreferrer">Explore Vault</a></Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Issuing</CardTitle>
          <CardDescription>Give each agent its own card, with a limit, a list of merchants and a log of every purchase.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" asChild><a href="https://www.agentcard.sh/issuing" target="_blank" rel="noreferrer">Explore Issuing</a></Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function Raised() {
  return (
    <Card variant="raised" className="mr-2 mb-2 grid gap-6 md:grid-cols-2 md:gap-12">
      {/* The product's screen or object goes here; a tinted block holds its place. */}
      <div aria-hidden className="aspect-[4/3] rounded-card bg-brand" />
      <CardContent className="flex flex-col justify-center gap-4 p-3 md:p-6">
        <CardTitle className="text-h2 font-normal tracking-tighter">Prepaid cards for every agent</CardTitle>
        <CardDescription className="text-body-lg">Fund a card, choose what it can buy, and hand it to your agent.</CardDescription>
        <div>
          <Button asChild><a href="https://app.agentcard.sh/" target="_blank" rel="noreferrer">Start free</a></Button>
        </div>
      </CardContent>
    </Card>
  );
}

```

## Source

components/ui/card.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// The brand's cards (agentcard.sh). `default` is the white card of the quotes and features (.v7-trail li): a 16 percent
// ink hairline, 12px corners, a light line inside the top and the soft drop. `raised` is the large product card
// (.v7-sol): 20px corners, a 12px inset frame around its media, and the hard 7px offset shadow at 10 percent ink.
const cardVariants = cva("flex flex-col border border-hairline bg-surface text-fg", {
  variants: {
    variant: {
      default: "gap-3 rounded-card p-6 shadow-card",
      raised: "gap-3 rounded-shell p-3 shadow-raised",
    },
  },
  defaultVariants: { variant: "default" },
});

function Card({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto]", className)} {...props} />;
}

// 24px display at 500, tracked tight.
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-display text-h3 leading-display font-medium tracking-tight text-fg", className)} {...props} />;
}

// 14px Inter at 68 percent ink.
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-body-sm leading-relaxed text-fg-muted", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("text-body-sm text-fg", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex items-center gap-3 pt-3", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, cardVariants };

```
