import { notFound } from "next/navigation";

import { PreviewHeight } from "@www/components/preview-height";
import { Surface } from "@/lib/surface";
import { examples } from "@www/lib/examples.generated";
import { findItem, items } from "@www/lib/registry";

// One example alone on a page, at the window's real width: full-page items (site sections, page blocks) switch layout
// on it, so the docs show them in a frame at desktop or phone width instead of squeezed into the column.
export function generateStaticParams() {
  return items.flatMap((i) => Object.keys(examples[i.name] ?? {}).map((example) => ({ name: i.name, example })));
}

export const metadata = { robots: { index: false } };

export default async function ExamplePage({ params }: { params: Promise<{ name: string; example: string }> }) {
  const { name, example } = await params;
  const item = findItem(name);
  const Example = examples[name]?.[example];
  if (!item || !Example) notFound();
  return (
    <Surface data-preview-root="" className={item.type === "ui" ? "min-h-120 bg-surface p-6 sm:p-10" : "bg-surface"}>
      <Example />
      <PreviewHeight />
    </Surface>
  );
}
