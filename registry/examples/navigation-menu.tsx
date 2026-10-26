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
