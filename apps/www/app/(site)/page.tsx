import Link from "next/link";

import { Button } from "@/components/ui/button";
import { InstallCommand, SectionHeading, SiteSection } from "@www/components/chrome";
import { APPLY_COMMAND, GROUPS, counts, registryName } from "@www/lib/registry";

export default function Home() {
  return (
    <main>
      <SiteSection className="bg-brand text-on-brand">
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <h1 className="font-display text-hero leading-tight font-medium tracking-display">{registryName} design system</h1>
          <p className="max-w-(--ds-layout-heading) text-body-lg leading-snug text-fg-on-brand-muted">Every component and section of the {registryName} site for React and Tailwind, and one command that applies the brand to any site.</p>
          <div className="flex gap-3">
            <Button asChild variant="on-brand">
              <Link href="/components">Browse components</Link>
            </Button>
          </div>
        </div>
      </SiteSection>
      <SiteSection>
        <SectionHeading title="Apply it to any site" description="Give your coding agent this command and let it work until it says it is done." />
        <InstallCommand command={APPLY_COMMAND} className="mx-auto" />
      </SiteSection>
      <SiteSection>
        <SectionHeading title="The library" />
        <ul className="grid gap-4 sm:grid-cols-3">
          {GROUPS.map((g) => (
            <li key={g.type}>
              <Link href={`/components#${g.id}`} className="flex flex-col gap-2 rounded-card border border-hairline bg-surface p-6 shadow-card">
                <span className="font-display text-h3 font-medium tracking-tight">{g.label}</span>
                <span className="text-body-sm text-fg-muted">{counts[g.type]} items. {g.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SiteSection>
    </main>
  );
}
