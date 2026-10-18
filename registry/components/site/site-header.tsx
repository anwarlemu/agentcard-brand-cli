import * as React from "react";

import { Button } from "@/components/ui/button";
import { Lockup } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

// The bare header (agentcard.sh, .v7-space-header): the lockup at the left linking home, one Get started key at the
// right, laid over the top of whatever opens the page, 20px from the top and 30px from the sides (18px on phones). Over
// the blue hero the lockup is white; on a white page it is ink, as on /pricing and /about. The key is the white key with
// blue text on both. Navigation lives in the floating dock, so links here are optional and leave on phones; the lockup
// and the key stay.
type HeaderLink = { label: React.ReactNode; href: string; current?: boolean };

const GROUNDS = {
  blue: "text-on-brand",
  white: "text-fg",
} as const;

function SiteHeader({
  logo,
  href = "/",
  logoLabel = "Agentcard, home",
  action,
  links,
  ground = "blue",
  overlay = true,
  className,
  ...props
}: React.ComponentProps<"header"> & {
  /** The logo. Defaults to the lockup, in the ground's color. */
  logo?: React.ReactNode;
  /** Where the logo leads. */
  href?: string;
  /** The logo link's accessible name. */
  logoLabel?: string;
  /** The one key at the right. */
  action?: { label: React.ReactNode; href: string };
  /** Optional links between the logo and the key (hidden on phones). */
  links?: HeaderLink[];
  /** blue over the hero, white on other pages. */
  ground?: keyof typeof GROUNDS;
  /** Lay the header over the top of its positioned parent (the hero, the page's first section), as the site does. */
  overlay?: boolean;
}) {
  return (
    <header
      data-slot="site-header"
      className={cn(
        "z-20 flex h-10 items-center gap-8.75 font-display text-caption",
        overlay ? "absolute inset-x-4.5 top-5 md:inset-x-7.5" : "relative mx-4.5 mt-5 md:mx-7.5",
        GROUNDS[ground],
        className,
      )}
      {...props}
    >
      <a href={href} aria-label={logoLabel} className="shrink-0 rounded-chip">
        {logo ?? <Lockup label={null} className="w-21.5 md:w-40" />}
      </a>
      {links && links.length > 0 && (
        <nav aria-label="Main" className="flex items-center gap-1 max-md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "rounded-sm px-3.5 py-2 text-body-sm leading-none transition-[background-color,color] duration-150 ease-out",
                ground === "blue" ? "hover:bg-wash-on-brand" : "hover:bg-wash-hover",
                link.current && (ground === "blue" ? "bg-wash-on-brand" : "bg-wash-pill"),
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
      {action && (
        <Button asChild variant="on-brand" className="ml-auto px-5.5 font-medium leading-tight">
          <a href={action.href}>{action.label}</a>
        </Button>
      )}
    </header>
  );
}

export { SiteHeader };
export type { HeaderLink };
