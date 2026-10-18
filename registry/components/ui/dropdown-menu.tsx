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
