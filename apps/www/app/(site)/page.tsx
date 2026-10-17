import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/site/hero";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";
import { Block, Command, Page } from "@www/components/chrome";
import { Prose } from "@www/components/prose";
import { Thumb } from "@www/components/thumb";
import { examples } from "@www/lib/examples.generated";
import { APPLY_COMMAND, findItem, registryName } from "@www/lib/registry";

const STEPS = [
  { name: "apply.run", title: "Give it to your agent", body: "Claude Code, Codex, Cursor or any other: it installs the brand, converts every style value by role and marks the hero." },
  { name: "tasks.run", title: "The agent finishes it", body: "One screen at a time, each restyled the way the brand draws that element, then reviewed against agentcard.sh." },
  { name: "hooks.run", title: "It stays on the brand", body: "Hooks and a pre-commit check block any write that adds a value the brand does not have." },
];

// A few pieces that carry the look, each drawn live.
const SHOWCASE: { item: string; example: string; scale: number; align?: "start" }[] = [
  { item: "pricing", example: "Site", scale: 0.34, align: "start" },
  { item: "testimonials", example: "Site", scale: 0.34, align: "start" },
  { item: "faq", example: "Site", scale: 0.34, align: "start" },
  { item: "button", example: "Site", scale: 0.62 },
  { item: "tabs", example: "Site", scale: 0.62 },
  { item: "window", example: "Site", scale: 0.48 },
];

export default function Home() {
  return (
    <>
      <Hero
        fullScreen={false}
        className="pt-40 pb-28 max-md:pt-32"
        eyebrow="Design system"
        title={`${registryName} design system`}
        actions={
          <Button asChild variant="on-brand">
            <Link href="/components">Browse components</Link>
          </Button>
        }
      />
      <Page className="pt-24 md:pt-28">
        <Block title="Apply it to any site" description="Give your coding agent this command and let it work until it says it is done. It changes how the site looks, never what it says.">
          <Command command={APPLY_COMMAND} className="mx-auto" />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.name}>
                <Window name={s.name} className="h-full" bodyClassName="grid content-start gap-2 p-6">
                  <h3 className="font-display text-h3 leading-display font-medium tracking-tight">{s.title}</h3>
                  <p className="text-body-sm text-fg-muted">{s.body}</p>
                </Window>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="The library" description="Every component and section of the site for React and Tailwind, copied into your project as source you own.">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((s) => {
              const item = findItem(s.item);
              const Example = examples[s.item]?.[s.example];
              if (!item || !Example) return null;
              return (
                <li key={s.item} className="group/card relative">
                  <Window name={`${s.item}.tsx`} className="h-full transition-[border-color] duration-150 ease-out group-hover/card:border-line-brand">
                    <Thumb example={Example} scale={s.scale} align={s.align} />
                    <div className="grid gap-1 border-t border-line-subtle p-5">
                      <Link
                        href={`/components/${s.item}`}
                        className="rounded-sm font-display text-body font-medium outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-ring"
                      >
                        {item.title}
                      </Link>
                      <span className="line-clamp-2 text-body-sm text-fg-muted">
                        <Prose text={item.description} />
                      </span>
                    </div>
                  </Window>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="secondary">
              <Link href="/components">
                Every item <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </Block>
      </Page>
    </>
  );
}
