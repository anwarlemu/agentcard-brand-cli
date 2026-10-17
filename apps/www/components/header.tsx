"use client";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site/site-header";

// The docs header: the library's own site header on white, with the docs' sections and GitHub as the key.
export function Header({ repo }: { name: string; repo: string; counts?: Record<string, number> }) {
  const pathname = usePathname();
  const links = [
    { label: "Components", href: "/components" },
    { label: "Theme", href: "/theme" },
    { label: "CLI", href: "/cli" },
  ].map((l) => ({ ...l, current: pathname.startsWith(l.href) }));
  return (
    <div className="relative z-40 h-20">
      <SiteHeader ground="white" overlay logoLabel="Agentcard UI, home" links={links} action={{ label: "GitHub", href: repo }} />
    </div>
  );
}
