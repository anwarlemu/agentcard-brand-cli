import Link from "next/link";

import { Hero } from "@/components/site/hero";
import { Button } from "@/components/ui/button";
import { InstallCommand, SectionHeading, SiteSection } from "@www/components/chrome";
import { APPLY_COMMAND, GROUPS, counts, registryName } from "@www/lib/registry";

export default function Home() {
  return (
    <main className="-mt-20">
      <Hero
        fullScreen={false}
        className="pt-40 pb-28"
        eyebrow="Design system"
        title={`${registryName} design system`}
        actions={
          <Button asChild variant="on-brand">
            <Link href="/components">Browse components</Link>
          </Button>
        }
      />
      <SiteSection>
        <SectionHeading title="Apply it to any site" description="Give your coding agent this command and let it work until it says it is done." />
        <InstallCommand command={APPLY_COMMAND} className="mx-auto mt-10" />
      </SiteSection>
      <SiteSection className="pt-0 md:pt-0">
        <SectionHeading title="The library" description="Copy any piece into your project as source you own." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {GROUPS.filter((g) => counts[g.type]).map((g) => (
            <li key={g.type}>
              <Link href={`/components#${g.id}`} className="flex h-full flex-col gap-2 rounded-card border border-hairline bg-surface p-6 shadow-card transition-[border-color] duration-150 ease-out hover:border-line-brand">
                <span className="font-display text-h3 leading-display font-medium tracking-tight">{g.label}</span>
                <span className="text-body-sm text-fg-muted">
                  {counts[g.type]} items. {g.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SiteSection>
    </main>
  );
}
