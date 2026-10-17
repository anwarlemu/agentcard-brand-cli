import { notFound } from "next/navigation";

import { Surface } from "@/lib/surface";
import { examples } from "@www/lib/examples.generated";
import { findItem } from "@www/lib/registry";

// An example drawn as a still for a thumbnail: as the preview page, but nothing in it may scroll the pages around it (a
// command palette scrolls its selected row into view when it mounts, and that would move the docs page holding the
// frame). Only the examples that need it are drawn here.
export const STILL = ["command"];

export function generateStaticParams() {
  return STILL.flatMap((name) => Object.keys(examples[name] ?? {}).map((example) => ({ name, example })));
}

export const metadata = { robots: { index: false } };

export default async function StillPage({ params }: { params: Promise<{ name: string; example: string }> }) {
  const { name, example } = await params;
  const Example = examples[name]?.[example];
  if (!findItem(name) || !Example || !STILL.includes(name)) notFound();
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "Element.prototype.scrollIntoView = function () {};" }} />
      <Surface data-preview-root="" className="bg-surface">
        <Example />
      </Surface>
    </>
  );
}
