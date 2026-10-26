# Context Menu
A right-click menu drawn as the brand's menu: a white floating panel with display-face rows.

Install: npx agentcard-ds add context-menu
Requires: theme, surface, utils
Packages: @radix-ui/react-context-menu, lucide-react
Exports: ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger
Client boundary: yes
Reference: Extrapolated from Agentcard (dropdown-menu.tsx)


## Usage
Use for shortcuts on a row or an object (a purchase, a card) that are also reachable elsewhere. Group rows with separators and labels, mark the destructive row with variant destructive, and show shortcuts with ContextMenuShortcut.
- Avoid: Actions found only here
- Avoid: Animating the highlight
- Avoid: Deep nesting beyond one submenu


## Examples
Example components: npx agentcard-ds add context-menu
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/context-menu/Site)

examples/context-menu.tsx

```tsx
"use client";

import { useState } from "react";
import { Copy, Download, Flag, Receipt, Trash2 } from "lucide-react";

import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";

function Purchase() {
  return (
    <div className="grid gap-1 rounded-control border border-hairline bg-surface p-4 select-none">
      <p className="font-display text-body-sm font-medium text-fg">Amtrak, $86.40</p>
      <p className="text-caption text-fg-muted">Travel agent, Oct 21. Right-click for actions.</p>
    </div>
  );
}

export function Site() {
  const [receipts, setReceipts] = useState(true);
  const [card, setCard] = useState("travel");
  const [last, setLast] = useState("");
  return (
    <div className="mx-auto grid w-full max-w-96 gap-3">
      <ContextMenu>
        <ContextMenuTrigger>
          <Purchase />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-60">
          <ContextMenuLabel>Purchase</ContextMenuLabel>
          <ContextMenuItem onSelect={() => setLast("Receipt opened")}>
            <Receipt strokeWidth={1.5} />
            Open receipt
            <ContextMenuShortcut>⏎</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setLast("Order number copied")}>
            <Copy strokeWidth={1.5} />
            Copy order number
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Download strokeWidth={1.5} />
              Export as
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => setLast("Exported as PDF")}>PDF</ContextMenuItem>
              <ContextMenuItem onSelect={() => setLast("Exported as CSV")}>CSV</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={receipts} onCheckedChange={(on) => setReceipts(on === true)}>
            Email receipts
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Charge to</ContextMenuLabel>
          <ContextMenuRadioGroup value={card} onValueChange={setCard}>
            <ContextMenuRadioItem value="travel">Travel card</ContextMenuRadioItem>
            <ContextMenuRadioItem value="team">Team card</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem disabled>
            <Flag strokeWidth={1.5} />
            Dispute (after it settles)
          </ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={() => setLast("Purchase hidden")}>
            <Trash2 strokeWidth={1.5} />
            Hide purchase
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p role="status" className="text-body-sm text-fg-muted empty:hidden">
        {last}
      </p>
    </div>
  );
}

```

## Source

components/ui/context-menu.tsx

```tsx
"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight } from "lucide-react";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A right-click menu, drawn as the brand's menu (dropdown-menu.tsx): the floating panel (white, a 16 percent ink
// hairline, 8px corners, the tooltip shadow) with 4px of padding, rows in the 14px display face at 68 percent ink that
// turn ink on a faint wash when highlighted, with no transition (menus are worked from the keyboard). It grows from the
// pointer (scale 0.97 and a fade, 160ms ease-out). Labels and shortcuts are the 12px display face, separators a 14
// percent ink rule, checks and the radio mark blue, destructive rows red. The trigger is any area; it takes no style.
const PANEL =
  "z-50 flex min-w-48 max-w-(--radix-context-menu-content-available-width) max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) animate-pop-in flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-control border border-hairline bg-surface p-1 text-fg shadow-tooltip outline-none motion-reduce:animate-none";
const ROW =
  "relative flex w-full cursor-default items-center gap-2 rounded-menu px-2.5 py-2 font-display text-body-sm leading-snug text-fg-secondary outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-wash-hover data-[highlighted]:text-fg data-[inset]:pl-8 [&_svg]:size-3.5 [&_svg]:shrink-0";
const DANGER = "text-danger data-[highlighted]:bg-danger/6 data-[highlighted]:text-danger";
const QUIET = "text-fg-muted";

function ContextMenu(props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger(props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

function ContextMenuContent({ className, collisionPadding = 8, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal container={usePortalContainer()}>
      <ContextMenuPrimitive.Content data-slot="context-menu-content" collisionPadding={collisionPadding} className={cn(PANEL, className)} {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuPortal(props: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" container={usePortalContainer()} {...props} />;
}

function ContextMenuSub(props: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuItem({ className, inset, variant = "default", ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  return <ContextMenuPrimitive.Item data-slot="context-menu-item" data-inset={inset ? "" : undefined} data-variant={variant} className={cn(ROW, variant === "destructive" && DANGER, className)} {...props} />;
}

function ContextMenuCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" checked={checked} className={cn(ROW, "pr-8", className)} {...props}>
      {children}
      <ContextMenuPrimitive.ItemIndicator className="absolute right-2.5 text-fg-brand">
        <Check strokeWidth={1.75} />
      </ContextMenuPrimitive.ItemIndicator>
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn(ROW, "pr-8 data-[state=checked]:text-fg", className)} {...props}>
      {children}
      <ContextMenuPrimitive.ItemIndicator className="absolute right-2.5 text-fg-brand">
        <Check strokeWidth={1.75} />
      </ContextMenuPrimitive.ItemIndicator>
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
  return <ContextMenuPrimitive.Label data-slot="context-menu-label" data-inset={inset ? "" : undefined} className={cn("px-2.5 pt-2 pb-1 font-display text-caption data-[inset]:pl-8", QUIET, className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="context-menu-shortcut" className={cn("ml-auto pl-4 text-caption", QUIET, className)} {...props} />;
}

function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" data-inset={inset ? "" : undefined} className={cn(ROW, "data-[state=open]:bg-wash-hover data-[state=open]:text-fg", className)} {...props}>
      {children}
      <ChevronRight className="ml-auto" strokeWidth={1.5} />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, collisionPadding = 8, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.Portal container={usePortalContainer()}>
      <ContextMenuPrimitive.SubContent data-slot="context-menu-sub-content" collisionPadding={collisionPadding} className={cn(PANEL, "min-w-40", className)} {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};

```
