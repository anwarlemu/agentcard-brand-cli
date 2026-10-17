"use client";

import { usePathname } from "next/navigation";

import { NavDock } from "@/components/site/nav-dock";
import { SiteHeader } from "@/components/site/site-header";

// The docs' navigation, as agentcard.sh draws its own: a bare header (the lockup, one key) over the page, and the glass
// dock at the foot of the screen carrying the sections, which becomes the top bar with its sheet on a phone.
export function Header({ repo, library: libraryItems }: { repo: string; library: { title: string; description: string; href: string }[] }) {
  const pathname = usePathname();
  const onBlue = pathname === "/";
  const library = pathname.startsWith("/components");
  return (
    <>
      <SiteHeader ground={onBlue ? "blue" : "white"} logoLabel="Agentcard UI, home" action={{ label: "GitHub", href: repo }} className="z-40 max-md:hidden" />
      <NavDock
        label="Docs"
        hideAt="docs-footer"
        center="Design system"
        links={[
          { label: "Overview", href: "/", current: pathname === "/" },
          { label: "Library", current: library, items: libraryItems },
          { label: "Theme", href: "/theme", current: pathname.startsWith("/theme") },
          { label: "CLI", href: "/cli", current: pathname.startsWith("/cli") },
        ]}
        action={{ label: "GitHub", href: repo }}
      />
    </>
  );
}
