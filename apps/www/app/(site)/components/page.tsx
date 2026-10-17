import Link from "next/link";

import { InstallCommand, SectionHeading, SiteSection } from "@www/components/chrome";
import { Prose } from "@www/components/prose";
import { GROUPS, items, registryName } from "@www/lib/registry";

export const metadata = { title: "Library" };

export default function Library() {
  return (
    <main>
      <SiteSection>
        <SectionHeading as="h1" title="The library, piece by piece" description={`Everything the ${registryName} site draws, as React components on Tailwind. Add any item and it brings the theme and what it needs.`}>
          <InstallCommand command="npx agentcard-ds add <item>" className="mt-4" />
        </SectionHeading>
      </SiteSection>
      {GROUPS.map((g) => {
        const list = items.filter((i) => i.type === g.type);
        if (!list.length) return null;
        return (
          <SiteSection key={g.type} id={g.id}>
            <SectionHeading title={g.label} description={g.blurb} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => (
                <li key={i.name} className="flex">
                  <Link
                    href={`/components/${i.name}`}
                    className="group/item flex w-full flex-col gap-2 rounded-card border border-hairline bg-surface p-5 shadow-card outline-none transition-[border-color,translate] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none hover:-translate-y-px hover:border-line-brand"
                  >
                    <span className="font-display text-body font-medium text-fg">{i.title}</span>
                    <span className="line-clamp-3 text-body-sm text-fg-muted"><Prose text={i.description} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </SiteSection>
        );
      })}
    </main>
  );
}
