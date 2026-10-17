import Link from "next/link";

import { Window } from "@/components/ui/window";
import { Block, Command, Page, PageIntro } from "@www/components/chrome";
import { Prose } from "@www/components/prose";
import { Thumb } from "@www/components/thumb";
import { examples } from "@www/lib/examples.generated";
import { GROUPS, items, registryName } from "@www/lib/registry";

export const metadata = { title: "Library" };

// How small each kind of item draws in its card: a section or a page is a whole band, so it is shown from its top.
const THUMB: Record<string, { scale: number; align?: "start" }> = {
  ui: { scale: 0.6 },
  visual: { scale: 0.4, align: "start" },
  site: { scale: 0.3, align: "start" },
  block: { scale: 0.22, align: "start" },
};

export default function Library() {
  return (
    <Page>
      <PageIntro
        eyebrow="Library"
        title="The library, piece by piece"
        lead={`Everything the ${registryName} site draws, as React components on Tailwind. Add any item and it brings the theme and what it needs.`}
      >
        <Command command="npx agentcard-ds add <item>" />
      </PageIntro>
      {GROUPS.map((g) => {
        const list = items.filter((i) => i.type === g.type);
        if (!list.length) return null;
        return (
          <Block key={g.type} id={g.id} title={g.label} description={g.blurb}>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => {
                const main = examples[i.name]?.Block ?? examples[i.name]?.Site ?? Object.values(examples[i.name] ?? {})[0];
                const thumb = THUMB[i.type] ?? THUMB.ui;
                return (
                  <li key={i.name} className="group/card relative">
                    <Window name={i.name} className="h-full transition-[border-color] duration-150 ease-out group-hover/card:border-line-brand">
                      {main && <Thumb example={main} scale={thumb.scale} align={thumb.align} className="h-44" />}
                      <div className="grid gap-1 border-t border-line-subtle p-5">
                        <Link
                          href={`/components/${i.name}`}
                          className="rounded-sm font-display text-body font-medium outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-ring"
                        >
                          {i.title}
                        </Link>
                        <span className="line-clamp-2 text-body-sm text-fg-muted">
                          <Prose text={i.description} />
                        </span>
                      </div>
                    </Window>
                  </li>
                );
              })}
            </ul>
          </Block>
        );
      })}
    </Page>
  );
}
