# Dropdown menu
Action menu with standard and glass panels, submenus and selection controls.

Install: npx agentcard-ds add dropdown-menu
Requires: theme, use-hold, surface, utils
Packages: @radix-ui/react-dropdown-menu, lucide-react
Exports: DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuHoldItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
Client boundary: yes
Reference: https://agentcard.com/ (.v7-dock-card); white menu and extra item types are extensions


## Usage
Use for actions on an item or a compact navigation menu. Set variant="glass" on blue backgrounds. Use onSelect for actions and DropdownMenuHoldItem for destructive actions that require a hold.
- Avoid: Menus for navigation that should be visible
- Avoid: More than one level of submenu
- Avoid: A destructive row that fires on one click


## Examples
Example components: npx agentcard-ds add dropdown-menu button field input copy-button surface
[Site](https://agentcard-ds.vercel.app/preview/dropdown-menu/Site) | [Open](https://agentcard-ds.vercel.app/preview/dropdown-menu/Open) | [Glass](https://agentcard-ds.vercel.app/preview/dropdown-menu/Glass) | [Choices](https://agentcard-ds.vercel.app/preview/dropdown-menu/Choices)

examples/dropdown-menu.tsx

```tsx
"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuHoldItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { Surface } from "@/lib/surface";

function CardMenu({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [paused, setPaused] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
  const [limit, setLimit] = React.useState(250);
  const [balance, setBalance] = React.useState(500);
  const [editing, setEditing] = React.useState<"limit" | "funds" | null>(null);
  const [message, setMessage] = React.useState("");
  return (
    <div className="grid justify-items-start gap-3">
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" disabled={closed}>Card actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onOpenAutoFocus={defaultOpen ? (event) => event.preventDefault() : undefined} onCloseAutoFocus={defaultOpen ? (event) => event.preventDefault() : undefined}>
        <DropdownMenuLabel>Travel agent</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setEditing("limit")}>
          Edit limits
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setEditing("funds")}>
          Add funds
          <DropdownMenuShortcut>F</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { setPaused(!paused); setMessage(paused ? "Card resumed." : "Card paused."); }}>{paused ? "Resume card" : "Pause card"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuHoldItem onConfirm={() => { setClosed(true); setOpen(false); setEditing(null); setMessage("Card closed."); }}>Close card</DropdownMenuHoldItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {editing && <form key={editing} className="grid gap-3" onSubmit={(event) => {
      event.preventDefault();
      const amount = Number(new FormData(event.currentTarget).get("amount"));
      if (editing === "limit") { setLimit(amount); setMessage(`Purchase limit updated to $${amount.toFixed(2)}.`); }
      else { setBalance(balance + amount); setMessage(`Balance updated to $${(balance + amount).toFixed(2)}.`); }
      setEditing(null);
    }}>
      <Field label={editing === "limit" ? "Purchase limit (USD)" : "Amount to add (USD)"} required>
        <Input name="amount" type="number" min="0.01" step="0.01" defaultValue={editing === "limit" ? limit : 100} />
      </Field>
      <div className="flex gap-2"><Button type="submit">{editing === "limit" ? "Save limit" : "Add funds"}</Button><Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button></div>
    </form>}
    <p role="status" className="text-body-sm text-fg-muted empty:hidden">{message}</p>
    {closed && <Button variant="secondary" size="sm" onClick={() => { setClosed(false); setPaused(false); setMessage("Card active."); }}>Reset demo</Button>}
    </div>
  );
}

export function Site() {
  return <CardMenu />;
}

export function Open() {
  return (
    <div className="h-64">
      <CardMenu defaultOpen />
    </div>
  );
}

// The dock's menu: glass over whatever is behind it.
export function Glass() {
  const [product, setProduct] = React.useState("");
  return (
    <Surface ground="blue" className="flex h-80 flex-col items-start gap-4 rounded-panel p-8">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="on-brand">Products</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="glass" align="start" className="w-64" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()}>
          <DropdownMenuItem onSelect={() => setProduct("Vault")}>Vault</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setProduct("Issuing")}>Issuing</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setProduct("Voice")}>Voice</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setProduct("Updates")}>
            Updates
            <DropdownMenuShortcut>New</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {product && <p role="status" className="text-body-sm">{product === "Vault" ? "Vault stores cards for your agents." : product === "Issuing" ? "Issuing creates a card for each agent." : product === "Voice" ? "Voice lets customers approve purchases by speaking." : "You’re viewing the latest product updates."}</p>}
    </Surface>
  );
}

// A working glass submenu and a persistent preference; the submenu inherits its parent panel's treatment.
export function Choices() {
  const [exported, setExported] = React.useState("");
  const [notifications, setNotifications] = React.useState(true);
  return (
    <Surface ground="blue" className="min-h-80 rounded-panel p-8">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild><Button variant="on-brand">Preferences</Button></DropdownMenuTrigger>
        <DropdownMenuContent variant="glass" align="start">
          <DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>Notifications</DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Exports</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={() => setExported(`notifications\n${notifications}`)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setExported(JSON.stringify({ notifications }, null, 2))}>JSON</DropdownMenuItem>
              <DropdownMenuItem disabled>PDF (coming soon)</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {exported && <div className="mt-4 flex items-start gap-3"><pre aria-label="Export preview" className="text-body-sm">{exported}</pre><CopyButton value={exported} label="Copy export" /></div>}
      <p className="mt-56 font-display text-caption" role="status">Notifications {notifications ? "on" : "off"}</p>
    </Surface>
  );
}

```

## Source

components/ui/dropdown-menu.tsx

```tsx
"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";

import { useHold } from "@/hooks/use-hold";
import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// The brand's menu: the floating panel (white, a 16 percent ink hairline, 8px corners, the tooltip shadow) with 4px of
// padding, rows in the 14px display face that take a faint wash when highlighted, with no transition, since menus are
// worked from the keyboard. It grows from its trigger (scale 0.97 and a fade, 160ms ease-out). `glass` is the dock's
// menu: ink at 42 percent under a light sheen and a blur, a white hairline, white rows that wash white when highlighted.
// Destructive rows can require a hold (DropdownMenuHoldItem) so a stray click can't delete anything.
const PANEL = {
  default: "border-hairline bg-surface text-fg shadow-tooltip",
  glass: "border-line-on-brand bg-glass bg-(image:--ds-glass-sheen) text-on-brand shadow-floating [backdrop-filter:var(--ds-glass-blur)]",
} as const;

const MenuVariant = React.createContext<keyof typeof PANEL>("default");

const ROW =
  "relative flex w-full cursor-default items-center gap-2 rounded-menu px-2.5 py-2 font-display text-body-sm leading-snug text-fg-secondary outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-wash-hover data-[highlighted]:text-fg group-data-[variant=glass]/menu:text-on-brand group-data-[variant=glass]/menu:leading-none group-data-[variant=glass]/menu:text-caption group-data-[variant=glass]/menu:rounded-sm group-data-[variant=glass]/menu:px-2.75 group-data-[variant=glass]/menu:py-3 group-data-[variant=glass]/menu:data-[highlighted]:bg-wash-glass-hover group-data-[variant=glass]/menu:data-[highlighted]:shadow-glass-hover group-data-[variant=glass]/menu:data-[highlighted]:text-on-brand [&_svg]:size-3.5 [&_svg]:shrink-0";
const DANGER = "text-danger data-[highlighted]:bg-danger/6 data-[highlighted]:text-danger group-data-[variant=glass]/menu:text-danger group-data-[variant=glass]/menu:data-[highlighted]:text-danger";
const QUIET = "text-fg-muted group-data-[variant=glass]/menu:text-fg-on-brand-muted";

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({ className, sideOffset = 6, collisionPadding = 8, align = "end", variant = "default", ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & { variant?: keyof typeof PANEL; onOpenAutoFocus?: (event: Event) => void }) {
  return (
    <DropdownMenuPrimitive.Portal container={usePortalContainer()}>
      <MenuVariant.Provider value={variant}>
        <DropdownMenuPrimitive.Content
          data-slot="dropdown-menu-content"
          data-variant={variant}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          align={align}
          className={cn("group/menu z-50 flex min-w-[min(12rem,var(--radix-dropdown-menu-content-available-width))] max-w-(--radix-dropdown-menu-content-available-width) max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto overscroll-contain origin-(--radix-dropdown-menu-content-transform-origin) animate-pop-in motion-reduce:animate-none flex-col gap-0.5 rounded-control border p-1 outline-none", PANEL[variant], className)}
          {...props}
        />
      </MenuVariant.Provider>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({ className, variant = "default", ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" className={cn(ROW, variant === "destructive" && DANGER, className)} {...props} />;
}

/** A row that fires only after being held (destructive by default), its fill running across as the hint. The fill runs
 * at a constant rate while held and snaps back in 200ms ease-out on release. */
function DropdownMenuHoldItem({
  holdMs = 2000,
  onConfirm,
  variant = "destructive",
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Item>, "onSelect"> & { holdMs?: number; onConfirm: () => void; variant?: "default" | "destructive" }) {
  const { isHolding, handlers } = useHold(holdMs, onConfirm, props.disabled);
  const danger = variant === "destructive";
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-hold-item"
      onSelect={(event) => event.preventDefault()}
      className={cn(ROW, "overflow-hidden", danger && DANGER, className)}
      {...props}
      {...handlers}
      onPointerDown={(event) => { props.onPointerDown?.(event); handlers.onPointerDown(event); }}
      onKeyDown={(event) => { props.onKeyDown?.(event); handlers.onKeyDown(event); }}
      onPointerUp={(event) => { handlers.onPointerUp(); props.onPointerUp?.(event); }}
      onPointerLeave={(event) => { handlers.onPointerLeave(); props.onPointerLeave?.(event); }}
      onPointerCancel={(event) => { handlers.onPointerCancel(); props.onPointerCancel?.(event); }}
      onKeyUp={(event) => { handlers.onKeyUp(event); props.onKeyUp?.(event); }}
      onBlur={(event) => { handlers.onBlur(); props.onBlur?.(event); }}
    >
      <span
        aria-hidden
        className={cn("absolute inset-0 origin-left transition-transform motion-reduce:transition-none", danger ? "bg-danger/12" : "bg-wash-pill", isHolding ? "scale-x-100 ease-linear" : "scale-x-0 duration-200 ease-out")}
        style={isHolding ? { transitionDuration: `${holdMs}ms` } : undefined}
      />
      <span className="relative flex flex-1 items-center gap-2">{isHolding ? "Keep holding" : children}</span>
      <span className={cn("relative ml-4 text-caption", QUIET)}>Hold {holdMs / 1000}s</span>
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" checked={checked} className={cn(ROW, "pr-8", className)} {...props}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator className="absolute right-2.5 text-fg-brand group-data-[variant=glass]/menu:text-on-brand">
        <Check strokeWidth={1.75} />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn(ROW, "pr-8 data-[state=checked]:text-fg", className)} {...props}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator className="absolute right-2.5 text-fg-brand group-data-[variant=glass]/menu:text-on-brand">
        <Check strokeWidth={1.75} />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" className={cn("px-2.5 pt-2 pb-1 font-display text-caption", QUIET, className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-line group-data-[variant=glass]/menu:bg-line-on-brand", className)} {...props} />;
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ml-auto pl-4 text-caption", QUIET, className)} {...props} />;
}

function DropdownMenuSub(props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" className={cn(ROW, "data-[state=open]:bg-wash-hover group-data-[variant=glass]/menu:data-[state=open]:bg-wash-glass-hover group-data-[variant=glass]/menu:data-[state=open]:shadow-glass-hover", className)} {...props}>
      {children}
      <ChevronRight className="ml-auto" strokeWidth={1.5} />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, variant: variantProp, collisionPadding = 8, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & { variant?: keyof typeof PANEL }) {
  const inheritedVariant = React.useContext(MenuVariant);
  const variant = variantProp ?? inheritedVariant;
  return (
    <DropdownMenuPrimitive.Portal container={usePortalContainer()}>
      <MenuVariant.Provider value={variant}>
        <DropdownMenuPrimitive.SubContent
          data-slot="dropdown-menu-sub-content"
          collisionPadding={collisionPadding}
          data-variant={variant}
          className={cn("group/menu z-50 flex min-w-[min(10rem,var(--radix-dropdown-menu-content-available-width))] max-w-(--radix-dropdown-menu-content-available-width) max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto overscroll-contain origin-(--radix-dropdown-menu-content-transform-origin) animate-pop-in motion-reduce:animate-none flex-col gap-0.5 rounded-control border p-1", PANEL[variant], className)}
          {...props}
        />
      </MenuVariant.Provider>
    </DropdownMenuPrimitive.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuHoldItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};

```
