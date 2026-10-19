import Link from "next/link";
import { notFound } from "next/navigation";

import { Window } from "@/components/ui/window";
import { Command } from "@www/components/chrome";
import { CtaCard } from "@www/components/cta-card";
import { Pager } from "@www/components/pager";
import { Contents } from "@www/components/toc";
import { Code } from "@www/components/code";
import { FramePreview } from "@www/components/frame-preview";
import { Preview } from "@www/components/preview";
import { InlineCode, Prose } from "@www/components/prose";
import { examples } from "@www/lib/examples.generated";
import { CLI_COMMAND, GROUPS, type Item, exampleSource, findItem, items, needsPreviewFrame, sourceOf } from "@www/lib/registry";

export function generateStaticParams() {
  return items.map((i) => ({ name: i.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const item = findItem((await params).name);
  return item ? { title: item.title, description: item.description, alternates: { canonical: `/components/${item.name}`, types: { "text/markdown": `/r/${item.name}.md`, "application/json": `/r/${item.name}.json` } } } : {};
}

const TYPE_LABEL: Record<Item["type"], string> = { ui: "Component", product: "Component", site: "Section", block: "Page", visual: "Visual", hook: "Hook", lib: "Library" };

function exampleLabel(name: string) {
  if (name === "Block") return "Page";
  if (name === "Site") return "Preview";
  const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// A section of the article, as the guides set theirs: a 24px display heading 56px below what came before.
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="mb-5 font-display text-h3 leading-display font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const item = findItem((await params).name);
  if (!item) notFound();
  // The main example first (a page, then the preview), then its states (Open, Few...) in their own order.
  const MAIN = ["Block", "Site"];
  const demos = Object.entries(examples[item.name] ?? {}).sort(([a], [b]) => (MAIN.includes(a) ? MAIN.indexOf(a) : 9) - (MAIN.includes(b) ? MAIN.indexOf(b) : 9));
  // Isolate demos that focus, lock scrolling, or open overlays from the surrounding docs.
  const framed = needsPreviewFrame(item);
  const surfaceFlag = item.surface === "site" || item.surface === "product" ? ` --surface ${item.surface}` : "";
  const sections = [
    ...(demos.length ? [{ id: "preview", label: "Preview" }] : []),
    { id: "usage", label: "Usage" },
    ...(item.examples.length ? [{ id: "example", label: "Example" }] : []),
    { id: "source", label: "Source" },
  ];
  // The library's order, as the panel lists it: by group, then each group's own order.
  const flat = GROUPS.flatMap((g) => items.filter((i) => i.type === g.type));
  const at = flat.findIndex((i) => i.name === item.name);
  const prev = at > 0 ? flat[at - 1] : undefined;
  const next = at < flat.length - 1 ? flat[at + 1] : undefined;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 xl:grid-cols-[minmax(0,1fr)_clamp(15.25rem,19vw,17.5rem)]">
      <article className="mx-auto grid w-full max-w-180 min-w-0 grid-cols-[minmax(0,1fr)] gap-14">
        <header className="border-b border-line-rule pb-7">
          <p className="font-display text-caption tracking-label text-fg-label">{TYPE_LABEL[item.type]}</p>
          <h1 className="mt-3 font-display text-h2 leading-display font-medium tracking-tight text-pretty">{item.title}</h1>
          <p className="mt-3.5 text-body-lg leading-normal text-fg-muted">
            <Prose text={item.description} />
          </p>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-fg-brand">
            <a href={`/r/${item.name}.md`} className="underline underline-offset-4">Text reference</a>
            <a href={`/r/${item.name}.json`} className="underline underline-offset-4">Source and examples as JSON</a>
          </p>
          <Command command={`${CLI_COMMAND} add ${item.name}${surfaceFlag}`} className="mt-7 max-w-none" />
          <p className="mt-2 text-caption text-fg-muted">Run from the target React 19.2+ app root with Tailwind CSS 4 and the <code>@/*</code> source alias.</p>
        </header>

        {demos.length > 0 && (
          <div id="preview" className="grid scroll-mt-6 gap-8">
            {demos.map(([name, Demo]) =>
              framed ? <FramePreview key={name} src={`/preview/${item.name}/${name}`} name={item.name} label={exampleLabel(name)} component={item.type === "ui"} /> : <Preview key={name} example={Demo} name={item.name} block={name === "Block"} label={exampleLabel(name)} />,
            )}
          </div>
        )}

        <Usage item={item} />

        {item.examples.length > 0 && (
          <Section id="example" title="Example">
            <Code title={`examples/${item.name}.tsx`} code={exampleSource(item.name)} />
          </Section>
        )}

        <Section id="source" title="Source">
          <div className="grid gap-5">
            {item.paths.map((p) => (
              <Code key={p} title={p} code={sourceOf(p)} tall />
            ))}
          </div>
          {item.source && <p className="mt-5 text-caption text-fg-muted">Reference: {item.source}.</p>}
        </Section>

        <Pager prev={prev && { name: prev.name, title: prev.title }} next={next && { name: next.name, title: next.title }} />
      </article>
      <div className="sticky top-6 hidden flex-col gap-6 xl:flex">
        <Contents sections={sections} />
        <CtaCard command={`${CLI_COMMAND} add ${item.name}${surfaceFlag}`} />
      </div>
    </div>
  );
}

function Usage({ item }: { item: Item }) {
  const requires = item.dependencies.filter((d) => d !== "utils");
  return (
    <Section id="usage" title="Usage">
      <div className="grid gap-4">
        <Window name="use-it-for.md" className="bg-note shadow-guide" bodyClassName="px-4.5 pt-3.5 pb-4">
          <p className="text-body-sm leading-relaxed text-fg">
            <Prose text={item.use_for} />
          </p>
        </Window>
        {item.never.length > 0 && (
          <Window name="never.md" className="shadow-guide" bodyClassName="px-4.5 pt-3.5 pb-4">
            <ul className="grid gap-1.5 text-body-sm leading-relaxed text-fg">
              {item.never.map((n) => (
                <li key={n} className="flex gap-2.5">
                  <span aria-hidden className="mt-2.5 h-px w-2.5 shrink-0 bg-danger" />
                  <Prose text={n} />
                </li>
              ))}
            </ul>
          </Window>
        )}
      </div>
      <p className="mt-5 text-body-sm text-fg-muted">Exports: <InlineCode>{item.exports.join(", ")}</InlineCode>. {item.client ? "This component includes a client boundary. Keep event handlers and state in a client component." : "Read the examples for composition and props."}</p>
      {item.body && <div className="mt-5 text-body-sm leading-relaxed"><Prose text={item.body} /></div>}
      {(requires.length > 0 || item.npm.length > 0) && (
        <p className="mt-5 text-body-sm text-fg-muted">
          Dependencies: {" "}
          {requires.map((d, i) => (
            <span key={d}>
              {findItem(d) ? (
                <Link href={`/components/${d}`} className="rounded-sm text-fg underline decoration-line-brand underline-offset-[0.2em] outline-none transition-colors duration-150 ease-out hover:text-fg-brand focus-visible:outline-2 focus-visible:outline-focus-ring">
                  {d}
                </Link>
              ) : <InlineCode>{d}</InlineCode>}
              {i < requires.length - 1 || item.npm.length ? ", " : ""}
            </span>
          ))}
          {item.npm.map((p, i) => (
            <span key={p}>
              <InlineCode>{p}</InlineCode>
              {i < item.npm.length - 1 ? ", " : ""}
            </span>
          ))}.
        </p>
      )}
    </Section>
  );
}
