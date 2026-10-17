import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Lockup } from "@www/components/logo";

// The docs header: the lockup, the docs' sections, and one key.
export function Header({ name, repo }: { name: string; repo: string; counts?: Record<string, number> }) {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-(--ds-frame-column) items-center justify-between gap-6">
        <Link href="/" aria-label={`${name} UI home`} className="flex items-baseline gap-2 rounded-sm">
          <Lockup className="h-6" />
          <span className="font-display text-caption text-fg-label">ui</span>
        </Link>
        <nav className="flex items-center gap-1 font-display text-body-sm">
          {[
            { label: "Components", href: "/components" },
            { label: "Theme", href: "/theme" },
            { label: "CLI", href: "/cli" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-sm px-3.5 py-2 transition-colors duration-150 ease-out hover:bg-wash-hover max-sm:hidden">
              {l.label}
            </Link>
          ))}
          <Button asChild variant="secondary" className="ml-2">
            <a href={repo}>GitHub</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
