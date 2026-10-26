# Sheet
Side panel with a title, close control and focus management.

Install: npx agentcard-ds add sheet
Requires: theme, window, surface, utils
Packages: @radix-ui/react-dialog, lucide-react
Exports: Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
Client boundary: yes
Reference: Extension from agentcard-website src/app/globals.css (.v7-guide-nav, .v7-windowbar); live https://www.agentcard.sh (.v7-gate::backdrop)


## Usage
Use for item details, activity logs or longer forms. Choose right, left or bottom with side. Set modal={false} when the rest of the page must remain interactive.
- Avoid: Sheets for a quick confirmation (use a dialog)
- Avoid: Full-screen sheets on desktop
- Avoid: Two sheets at once


## Examples
Example components: npx agentcard-ds add sheet badge button
[Site](https://agentcard-ds.vercel.app/preview/sheet/Site) | [Open](https://agentcard-ds.vercel.app/preview/sheet/Open)

examples/sheet.tsx

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const PURCHASES = [
  { merchant: "Delta", amount: "$412.00", status: "Approved" },
  { merchant: "Marriott", amount: "$238.40", status: "Approved" },
  { merchant: "Uber", amount: "$31.75", status: "Declined" },
];

function PurchaseLog({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Purchase log</Button>
      </SheetTrigger>
      <SheetContent name="purchase.log">
        <SheetHeader>
          <SheetTitle>Travel agent</SheetTitle>
          <SheetDescription>Every purchase this card made, newest first.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <ul>
            {PURCHASES.map((p) => (
              <li key={p.merchant} className="flex items-center justify-between gap-4 border-b border-line py-3.5">
                <span className="font-display text-body-sm">{p.merchant}</span>
                <span className="flex items-center gap-3">
                  <span className="text-body-sm tabular-nums">{p.amount}</span>
                  <Badge variant={p.status === "Approved" ? "success" : "destructive"}>{p.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export function Site() {
  return <PurchaseLog />;
}

export function Open() {
  return (
    <div className="h-130">
      <PurchaseLog defaultOpen />
    </div>
  );
}

```

## Source

components/ui/sheet.tsx

```tsx
"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { WindowBar } from "@/components/ui/window";
import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A side panel that is one of the brand's windows (the guides' panel, .v7-guide-nav, which closes to its bar over the page): white, a 16 percent ink hairline, 12px corners, the 32px sky title bar
// (`name`) with a close mark where the [*] sits, floating 8px in from the screen's edge over the ink scrim, blurred 4px as behind the get-started dialog (.v7-gate::backdrop). It
// slides in from its side as it fades (260ms ease-out, on transform); reduced motion keeps the fade. Pass
// `modal={false}` to Sheet to keep the page behind it usable (no scrim then).
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

const SIDES = {
  right: "inset-y-2 right-2 w-[min(28rem,calc(100vw-1rem))] starting:translate-x-full",
  left: "inset-y-2 left-2 w-[min(28rem,calc(100vw-1rem))] starting:-translate-x-full",
  bottom: "inset-x-2 bottom-2 max-h-[85dvh] starting:translate-y-full",
} as const;

function SheetContent({
  className,
  children,
  side = "right",
  name = "panel",
  tone,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: keyof typeof SIDES;
  /** The title bar's label, file-like: `purchase.log`, `card.detail`. */
  name?: React.ReactNode;
  tone?: React.ComponentProps<typeof WindowBar>["tone"];
}) {
  const container = usePortalContainer();
  return (
    <SheetPrimitive.Portal container={container}>
      <SheetPrimitive.Overlay data-slot="sheet-overlay" className="fixed inset-0 z-50 bg-scrim backdrop-blur-xs transition-opacity duration-260 ease-out starting:opacity-0" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden rounded-card border border-hairline bg-surface text-fg shadow-code outline-none transition-[opacity,translate] duration-260 ease-out starting:opacity-0 motion-reduce:starting:translate-x-0 motion-reduce:starting:translate-y-0",
          SIDES[side],
          className,
        )}
        {...props}
      >
        <WindowBar
          name={name}
          tone={tone}
          actions={
            <SheetPrimitive.Close
              aria-label="Close"
              className="-mr-1.5 grid size-7 shrink-0 place-items-center rounded-sm opacity-60 outline-none transition-[opacity,background-color] duration-150 ease-out hover:bg-wash-selected hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-focus-ring [&_svg]:size-3.5"
            >
              <X strokeWidth={1.5} />
            </SheetPrimitive.Close>
          }
        />
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-2 px-6 pt-6", className)} {...props} />;
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-6 text-body text-fg", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("truncate font-display text-h3 leading-display font-medium tracking-tight text-fg", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-body-sm leading-relaxed text-fg-muted", className)} {...props} />;
}

export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger };

```
