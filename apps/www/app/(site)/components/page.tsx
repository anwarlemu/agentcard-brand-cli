import Link from "next/link";

import { Window } from "@/components/ui/window";
import { Block, Page, PageIntro } from "@www/components/chrome";
import { DocsSearch } from "@www/components/docs-search";
import { InlineCode, Prose } from "@www/components/prose";
import { Thumb } from "@www/components/thumb";
import { examples } from "@www/lib/examples.generated";
import { CLI_COMMAND, GROUPS, items } from "@www/lib/registry";

export const metadata = { title: "Library" };

// How small each kind of item draws in its card: a section or a page is a whole band, so it is shown from its top.
const THUMB: Record<string, { scale: number; align?: "start" }> = {
  ui: { scale: 0.6 },
  visual: { scale: 0.4, align: "start" },
  site: { scale: 0.3, align: "start" },
  block: { scale: 0.22, align: "start" },
};

// Examples that move the page when they mount draw in a frame (see Thumb).
const FRAMED = new Set(["command"]);

export default function Library() {
  return (
    <Page>
      <PageIntro
        title="Component library"
        lead="React components and page templates for Agentcard. Each item includes a preview, usage notes, source and an install command."
      >
        <div className="mx-auto grid w-full max-w-140 gap-4">
          <DocsSearch entries={items.map((i) => ({ name: i.name, title: i.title, group: GROUPS.find((g) => g.type === i.type)?.label ?? "Library", href: `/components/${i.name}` }))} />
          <p className="text-body-sm text-fg-muted">
            Requires React and Tailwind 4. Use <InlineCode>{`${CLI_COMMAND} add <item>`}</InlineCode> to add an item.
          </p>
        </div>
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
                      {main && <Thumb example={main} scale={thumb.scale} align={thumb.align} className="h-44" src={FRAMED.has(i.name) ? `/still/${i.name}/Site` : undefined} />}
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
