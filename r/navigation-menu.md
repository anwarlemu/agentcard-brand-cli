# Navigation Menu
The header's links with panels that open below in the brand's floating panel.

Install: npx agentcard-ds add navigation-menu
Requires: theme, utils
Packages: @radix-ui/react-navigation-menu, class-variance-authority, lucide-react
Exports: NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle
Client boundary: yes
Reference: agentcard-website site header links (site-header.tsx); panel extrapolated from the popover


## Usage
Use in a site header when a section has several destinations worth previewing (Product, Developers). Put plain links beside triggers with navigationMenuTriggerStyle. Call navigationMenuTriggerStyle from a client component.
- Avoid: More than one row of panels
- Avoid: Hiding the only path to a page inside a panel
- Avoid: Hover-only panels on touch


## Examples
Example components: npx agentcard-ds add navigation-menu
Example packages: lucide-react
[Site](https://agentcard-ds.vercel.app/preview/navigation-menu/Site) | [Open](https://agentcard-ds.vercel.app/preview/navigation-menu/Open)

examples/navigation-menu.tsx

```tsx
"use client";

import { Bot, CreditCard, ShieldCheck, Terminal } from "lucide-react";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const PRODUCT = [
  { icon: CreditCard, title: "Cards", text: "A card for every agent, with its own limits.", href: "#cards" },
  { icon: Bot, title: "Agents", text: "Give an agent a card in one call.", href: "#agents" },
  { icon: ShieldCheck, title: "Controls", text: "Approve, freeze and audit every purchase.", href: "#controls" },
];

function Menu({ defaultValue }: { defaultValue?: string }) {
  return (
    <NavigationMenu defaultValue={defaultValue}>
      <NavigationMenuList>
        <NavigationMenuItem value="product">
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(22rem,calc(100vw-3rem))] gap-0.5">
              {PRODUCT.map(({ icon: Icon, title, text, href }) => (
                <li key={title}>
                  <NavigationMenuLink href={href}>
                    <span className="flex items-center gap-2 font-medium">
                      <Icon strokeWidth={1.5} />
                      {title}
                    </span>
                    <span className="font-sans text-caption text-fg-muted">{text}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="developers">
          <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(16rem,calc(100vw-3rem))] gap-0.5">
              <li>
                <NavigationMenuLink href="#docs">
                  <span className="flex items-center gap-2 font-medium">
                    <Terminal strokeWidth={1.5} />
                    Docs
                  </span>
                  <span className="font-sans text-caption text-fg-muted">Guides and the API reference.</span>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#changelog">Changelog</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function Site() {
  return (
    <div className="flex justify-center">
      <Menu />
    </div>
  );
}

export function Open() {
  return (
    <div className="flex h-72 items-start justify-center">
      <Menu defaultValue="product" />
    </div>
  );
}

```

## Source

components/ui/navigation-menu.tsx

```tsx
"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

// Site navigation with panels, drawn from the brand's header (site-header.tsx, the agentcard.sh nav): triggers and
// links are the header's links, 14px Inter with 14px by 8px of padding and 6px corners, a faint wash under the pointer
// and the pill wash while their panel is open; the trigger's chevron turns over when open (200ms, in-out: it travels on
// screen). The panel opens below in the brand's floating panel (white, a 16 percent ink hairline, 8px corners, the
// tooltip shadow), growing from scale 0.97 with a fade (160ms ease-out) and resizing to each panel (centered under the
// menu on phones, at its start from 768px). Links inside are the guides' rows: a 14px display-face title over a 12px
// line at 68 percent ink, washing under the pointer.
function NavigationMenu({ className, children, viewport = true, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
  return (
    <NavigationMenuPrimitive.Root data-slot="navigation-menu" data-viewport={viewport} className={cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className)} {...props}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn("relative", className)} {...props} />;
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex w-max items-center justify-center gap-1 rounded-sm px-3.5 py-2 font-sans text-body-sm leading-none text-fg outline-none transition-[background-color,color] duration-150 ease-out hover:bg-wash-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-wash-pill data-[state=open]:bg-wash-pill motion-reduce:transition-none",
);

function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" className={cn(navigationMenuTriggerStyle(), className)} {...props}>
      {children}
      <ChevronDown aria-hidden strokeWidth={1.75} className="size-3.5 text-fg-muted transition-[rotate] duration-200 ease-in-out group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-1.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-control group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-hairline group-data-[viewport=false]/navigation-menu:bg-surface group-data-[viewport=false]/navigation-menu:shadow-tooltip group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-pop-in",
        "data-[motion^=from-]:animate-fade-in motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-1/2 isolate z-50 flex -translate-x-1/2 justify-center md:left-0 md:translate-x-0">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) max-w-[calc(100vw-2rem)] origin-top overflow-hidden rounded-control border border-hairline bg-surface text-fg shadow-tooltip transition-[width,height] duration-200 ease-out data-[state=open]:animate-pop-in md:origin-top-left motion-reduce:animate-none motion-reduce:transition-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-menu px-2.5 py-2 font-display text-body-sm leading-snug text-fg outline-none transition-[background-color] duration-150 ease-out hover:bg-wash-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus-ring data-[active=true]:bg-wash-pill motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-fg-brand",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator data-slot="navigation-menu-indicator" className={cn("top-full z-10 flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-fade-in", className)} {...props}>
      <div className="relative top-[60%] size-2.5 rotate-45 rounded-tl-chip border-t border-l border-hairline bg-surface" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};

```
