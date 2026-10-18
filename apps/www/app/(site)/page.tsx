import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/site/hero";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/window";
import { Block, Command, Page } from "@www/components/chrome";
import { Prose } from "@www/components/prose";
import { Thumb } from "@www/components/thumb";
import { examples } from "@www/lib/examples.generated";
import { CLI_COMMAND, findItem, registryName } from "@www/lib/registry";

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
        title={`${registryName} design system`}
        titleClassName="max-w-none text-nowrap text-[length:min(var(--ds-text-hero),7vw)]"
        actions={
          <div className="grid w-[calc(100vw-2*var(--ds-layout-gutter))] max-w-2xl justify-items-center gap-4">
            <p className="text-body-sm text-fg-on-brand-muted">Install and apply the design system to an existing project.</p>
            <Command command={CLI_COMMAND} wrap />
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="on-brand"><Link href="/components">Browse components</Link></Button>
            </div>
          </div>
        }
      />
      <Page className="pt-24 md:pt-28">
        <Block title="Components and page sections" description="Preview the components, read the usage notes and copy the source into the project.">
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
                View all components <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </Block>
      </Page>
    </>
  );
}
