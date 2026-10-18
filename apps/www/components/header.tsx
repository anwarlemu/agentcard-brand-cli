"use client";

import { usePathname } from "next/navigation";

import { NavDock } from "@/components/site/nav-dock";
import { SiteHeader } from "@/components/site/site-header";
import type { SearchEntry } from "@www/components/docs-search";
import { DocsHeader, DocsTop } from "@www/components/docs-top";

// The docs' navigation, as agentcard.sh draws its own: the home has the bare header over its blue hero; an item page
// has the guides' blue top (search and keys); an index page has the guides' index header on white. The glass dock at
// the foot of the screen carries the sections everywhere and becomes the top bar with its sheet on a phone.
export function Header({ repo, library, entries }: { repo: string; library: { title: string; description: string; href: string }[]; entries: SearchEntry[] }) {
  const pathname = usePathname();
  const item = pathname.startsWith("/components/");
  return (
    <>
      {pathname === "/" ? (
        <SiteHeader ground="blue" logoLabel="Agentcard design system, home" action={{ label: "GitHub", href: repo }} className="z-40 max-md:hidden" />
      ) : item ? (
        <DocsTop entries={entries} repo={repo} />
      ) : (
        <DocsHeader repo={repo} />
      )}
      <NavDock
        label="Docs"
        hideAt="docs-footer"
        center="Design system"
        links={[
          { label: "Overview", href: "/", current: pathname === "/" },
          { label: "Library", current: pathname.startsWith("/components"), items: library },
          { label: "Theme", href: "/theme", current: pathname.startsWith("/theme") },
        ]}
        action={{ label: "GitHub", href: repo }}
      />
    </>
  );
}
