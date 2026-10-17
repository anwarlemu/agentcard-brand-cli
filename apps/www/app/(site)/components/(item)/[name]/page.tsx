import Link from "next/link";
import { notFound } from "next/navigation";

import { Window } from "@/components/ui/window";
import { Block, Command, PageIntro } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { FramePreview } from "@www/components/frame-preview";
import { Preview } from "@www/components/preview";
import { Prose } from "@www/components/prose";
import { examples } from "@www/lib/examples.generated";
import { type Item, exampleSource, findItem, items, sourceOf } from "@www/lib/registry";

export function generateStaticParams() {
  return items.map((i) => ({ name: i.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const item = findItem((await params).name);
  return item ? { title: item.title, description: item.description } : {};
}

const TYPE_LABEL: Record<Item["type"], string> = { ui: "Component", product: "Component", site: "Section", block: "Page", visual: "Visual", hook: "Hook", lib: "Library" };

function exampleLabel(name: string) {
  if (name === "Block") return "Page";
  if (name === "Site") return "Preview";
  const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// From 1280px, the page's sections down the right, sticky at the top of the screen.
function OnThisPage({ sections }: { sections: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="sticky top-0 hidden w-40 shrink-0 self-start pt-14 xl:block">
      <p className="mb-3 font-display text-caption tracking-label text-fg-label">On this page</p>
      <ul className="grid gap-px border-l border-line">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-3 text-body-sm text-fg-muted outline-none transition-[border-color,color] duration-150 ease-out hover:border-line-brand hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const item = findItem((await params).name);
  if (!item) notFound();
  // The main example first (a page, then the preview), then its states (Open, Few...) in their own order.
  const MAIN = ["Block", "Site"];
  const demos = Object.entries(examples[item.name] ?? {}).sort(([a], [b]) => (MAIN.includes(a) ? MAIN.indexOf(a) : 9) - (MAIN.includes(b) ? MAIN.indexOf(b) : 9));
  const framed = item.type === "site" || item.type === "block";
  const requires = item.dependencies.filter((d) => d !== "utils");
  const sections = [
    ...(demos.length ? [{ id: "preview", label: "Preview" }] : []),
    { id: "usage", label: "Usage" },
    ...(item.examples.length ? [{ id: "example", label: "Example" }] : []),
    { id: "source", label: "Source" },
  ];
  return (
    <div className="flex gap-12">
      <main className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] content-start gap-20 pt-12 pb-36">
        <PageIntro align="start" eyebrow={TYPE_LABEL[item.type]} title={item.title} lead={<Prose text={item.description} />}>
          <Command command={`npx agentcard-ds add ${item.name}`} />
        </PageIntro>

        {demos.length > 0 && (
          <div id="preview" className="grid scroll-mt-24 gap-8">
            {demos.map(([name, Demo]) =>
              framed ? <FramePreview key={name} src={`/preview/${item.name}/${name}`} name={item.name} label={exampleLabel(name)} /> : <Preview key={name} example={Demo} name={item.name} block={name === "Block"} label={exampleLabel(name)} />,
            )}
          </div>
        )}

        <Block id="usage" align="start" title="Usage">
          <div className="grid gap-4 md:grid-cols-2">
            <Window name="use-it-for.md" bodyClassName="p-6">
              <p className="text-body-sm leading-relaxed text-fg">
                <Prose text={item.use_for} />
              </p>
            </Window>
            {item.never.length > 0 && (
              <Window name="never.md" bodyClassName="p-6">
                <ul className="grid gap-2 text-body-sm text-fg">
                  {item.never.map((n) => (
                    <li key={n} className="flex gap-2.5">
                      <span aria-hidden className="mt-2.25 h-px w-2.5 shrink-0 bg-danger" />
                      <Prose text={n} />
                    </li>
                  ))}
                </ul>
              </Window>
            )}
          </div>
          {(requires.length > 0 || item.npm.length > 0) && (
            <p className="mt-5 text-body-sm text-fg-muted">
              Brings{" "}
              {requires.map((d, i) => (
                <span key={d}>
                  <Link href={`/components/${d}`} className="rounded-sm text-fg underline decoration-line-brand underline-offset-[0.2em] outline-none transition-colors duration-150 ease-out hover:text-fg-brand focus-visible:outline-2 focus-visible:outline-focus-ring">
                    {d}
                  </Link>
                  {i < requires.length - 1 || item.npm.length ? ", " : ""}
                </span>
              ))}
              {item.npm.map((p, i) => (
                <code key={p} className="font-mono text-body-sm text-fg">
                  {p}
                  {i < item.npm.length - 1 ? ", " : ""}
                </code>
              ))}{" "}
              with it.
            </p>
          )}
        </Block>

        {item.examples.length > 0 && (
          <Block id="example" align="start" title="Example">
            <Code title={`examples/${item.name}.tsx`} code={exampleSource(item.name)} />
          </Block>
        )}

        <Block id="source" align="start" title="Source">
          <div className="grid gap-5">
            {item.paths.map((p) => (
              <Code key={p} title={p} code={sourceOf(p)} tall />
            ))}
          </div>
          {item.source && <p className="mt-5 text-caption text-fg-subtle">Ported from {item.source}.</p>}
        </Block>
      </main>
      <OnThisPage sections={sections} />
    </div>
  );
}
