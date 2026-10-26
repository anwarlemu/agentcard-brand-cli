# Menubar
An app's menu bar: the brand's sunken tab track with quiet triggers, the open one a white key.

Install: npx agentcard-ds add menubar
Requires: theme, surface, utils
Packages: @radix-ui/react-menubar, lucide-react
Exports: Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger
Client boundary: yes
Reference: Extrapolated from Agentcard (tabs.tsx track, dropdown-menu.tsx)


## Usage
Use at the top of a dense tool (a statement viewer, an editor) where menus group many commands. Keep three to six menus, each a MenubarMenu with a trigger and its content.
- Avoid: A menubar for site navigation (use navigation menu)
- Avoid: A blue key for the open menu
- Avoid: Nested menus deeper than one level


## Examples
Example components: npx agentcard-ds add menubar
[Site](https://agentcard-ds.vercel.app/preview/menubar/Site) | [Open](https://agentcard-ds.vercel.app/preview/menubar/Open)

examples/menubar.tsx

```tsx
"use client";

import { useState } from "react";

import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";

function StatementBar({ defaultValue }: { defaultValue?: string }) {
  const [declined, setDeclined] = useState(true);
  const [group, setGroup] = useState("agent");
  return (
    <Menubar defaultValue={defaultValue}>
      <MenubarMenu value="statement">
        <MenubarTrigger>Statement</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New statement <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Download PDF <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email to finance</MenubarItem>
              <MenubarItem>Copy link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem disabled>Close the month</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={declined} onCheckedChange={(on) => setDeclined(on === true)}>
            Show declined purchases
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Group by</MenubarLabel>
          <MenubarRadioGroup value={group} onValueChange={setGroup}>
            <MenubarRadioItem value="agent">Agent</MenubarRadioItem>
            <MenubarRadioItem value="merchant">Merchant</MenubarRadioItem>
            <MenubarRadioItem value="day">Day</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="cards">
        <MenubarTrigger>Cards</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New card</MenubarItem>
          <MenubarItem>Set limits</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Freeze all cards</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function Site() {
  return (
    <div className="flex justify-center">
      <StatementBar />
    </div>
  );
}

export function Open() {
  return (
    <div className="flex h-80 justify-center">
      <StatementBar defaultValue="view" />
    </div>
  );
}

```

## Source

components/ui/menubar.tsx

```tsx
"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight } from "lucide-react";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// An app's menu bar, extrapolated from the brand's tabs (tabs.tsx, .plan-tabs): the sunken track (pale, a hairline,
// 12px corners, 4px inset, the inner shadow) holding 32px triggers in the 14px display face at 68 percent ink; the open
// one is the white key (a hairline, the light line inside the top, the soft drop) in ink. Its menus are the brand's
// menu (dropdown-menu.tsx): the floating panel with 4px of padding and display-face rows that wash when highlighted.
// A menu grows from its trigger (scale 0.97 and a fade, 160ms ease-out) and closes at once, so moving along the bar
// with the arrows or the pointer never waits on a closing panel. Highlighting a row is instant.
const PANEL =
  "z-50 flex min-w-48 max-w-(--radix-menubar-content-available-width) max-h-(--radix-menubar-content-available-height) origin-(--radix-menubar-content-transform-origin) animate-pop-in flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-control border border-hairline bg-surface p-1 text-fg shadow-tooltip outline-none motion-reduce:animate-none";
const ROW =
  "relative flex w-full cursor-default items-center gap-2 rounded-menu px-2.5 py-2 font-display text-body-sm leading-snug text-fg-secondary outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-wash-hover data-[highlighted]:text-fg data-[inset]:pl-8 [&_svg]:size-3.5 [&_svg]:shrink-0";
const DANGER = "text-danger data-[highlighted]:bg-danger/6 data-[highlighted]:text-danger";
const QUIET = "text-fg-muted";

function Menubar({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return <MenubarPrimitive.Root data-slot="menubar" className={cn("flex h-10 w-fit items-center gap-1 rounded-card border border-hairline bg-subtle p-1 shadow-well", className)} {...props} />;
}

function MenubarMenu(props: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-control border border-transparent px-3 font-display text-body-sm leading-none text-fg-muted outline-none select-none transition-[background-color,color] duration-150 ease-out hover:bg-wash-pill hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-[state=open]:border-hairline data-[state=open]:bg-surface data-[state=open]:text-fg data-[state=open]:shadow-key motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({ className, align = "start", alignOffset = -4, sideOffset = 8, collisionPadding = 8, ...props }: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal container={usePortalContainer()}>
      <MenubarPrimitive.Content data-slot="menubar-content" align={align} alignOffset={alignOffset} sideOffset={sideOffset} collisionPadding={collisionPadding} className={cn(PANEL, className)} {...props} />
    </MenubarPrimitive.Portal>
  );
}

function MenubarGroup(props: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal(props: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" container={usePortalContainer()} {...props} />;
}

function MenubarSub(props: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarRadioGroup(props: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarItem({ className, inset, variant = "default", ...props }: React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean; variant?: "default" | "destructive" }) {
  return <MenubarPrimitive.Item data-slot="menubar-item" data-inset={inset ? "" : undefined} data-variant={variant} className={cn(ROW, variant === "destructive" && DANGER, className)} {...props} />;
}

function MenubarCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem data-slot="menubar-checkbox-item" checked={checked} className={cn(ROW, "pr-8", className)} {...props}>
      {children}
      <MenubarPrimitive.ItemIndicator className="absolute right-2.5 text-fg-brand">
        <Check strokeWidth={1.75} />
      </MenubarPrimitive.ItemIndicator>
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem data-slot="menubar-radio-item" className={cn(ROW, "pr-8 data-[state=checked]:text-fg", className)} {...props}>
      {children}
      <MenubarPrimitive.ItemIndicator className="absolute right-2.5 text-fg-brand">
        <Check strokeWidth={1.75} />
      </MenubarPrimitive.ItemIndicator>
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
  return <MenubarPrimitive.Label data-slot="menubar-label" data-inset={inset ? "" : undefined} className={cn("px-2.5 pt-2 pb-1 font-display text-caption data-[inset]:pl-8", QUIET, className)} {...props} />;
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return <MenubarPrimitive.Separator data-slot="menubar-separator" className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="menubar-shortcut" className={cn("ml-auto pl-4 text-caption", QUIET, className)} {...props} />;
}

function MenubarSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <MenubarPrimitive.SubTrigger data-slot="menubar-sub-trigger" data-inset={inset ? "" : undefined} className={cn(ROW, "data-[state=open]:bg-wash-hover data-[state=open]:text-fg", className)} {...props}>
      {children}
      <ChevronRight className="ml-auto" strokeWidth={1.5} />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({ className, collisionPadding = 8, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.Portal container={usePortalContainer()}>
      <MenubarPrimitive.SubContent data-slot="menubar-sub-content" collisionPadding={collisionPadding} className={cn(PANEL, "min-w-40", className)} {...props} />
    </MenubarPrimitive.Portal>
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};

```
