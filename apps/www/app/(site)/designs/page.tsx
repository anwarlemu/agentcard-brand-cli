import { Window } from "@/components/ui/window";
import { Block, Command, PageBody, PageHead } from "@www/components/chrome";
import { Shot } from "@www/components/gallery";
import { galleryOf } from "@www/lib/gallery";
import { CLI_COMMAND } from "@www/lib/registry";

export const metadata = { title: "Designs" };

const steps = galleryOf("design");
const refused = galleryOf("design-refused")[0];

const VERBS = [
  ["new", "Write a design file and draw it: design new hero --size x-banner --headline \"...\" -o banner.design.json"],
  ["revise", "Change it in plain words: \"bigger headline, logo top right, darker theme\". A part it does not understand changes nothing and lists what it can do."],
  ["edit", "Change it exactly: --set headline=\"...\" --theme ink --layer logo.anchor=top-right --hide badge --seed 5"],
  ["undo, redo, history", "Step back and forward through every change; the same steps write the same bytes."],
  ["variants, sizes, compare", "The same design by theme, seed or template, at other sizes (laid out again, not stretched), or two side by side."],
  ["check, render", "Every brand and layout rule, and the files in png, svg, jpg, webp (pdf for slides and print)."],
];

export default function DesignsPage() {
  return (
    <>
      <PageHead eyebrow="Docs" title="Designs" description="Make a graphic, look at it, say what to change, and repeat until it is right. Every step is checked against the brand: off-brand colors, lost words, overlaps and covered corners are refused and change nothing." />
      <PageBody className="max-w-300">
        <Command command={`${CLI_COMMAND} design new hero --size x-banner --headline "Let agents buy anything online" -o banner.design.json`} />

        <Block title="One session" description="An X banner, revised five times, then one step undone. Each picture is the file the command wrote.">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            {steps.map((e) => (
              <Shot key={e.file} entry={e} />
            ))}
          </div>
        </Block>

        {refused && (
          <Block title="Off brand is refused" description="A request the brand does not allow changes nothing, and says what can be done instead.">
            <Command command={refused.command} />
            <Window name="design revise" bodyClassName="px-4 py-3 text-body-sm text-fg-muted">
              {refused.title}
            </Window>
          </Block>
        )}

        <Block title="What you can do" description="The design file is a small JSON document: template, size, theme, your copy, your pictures and edits to layers. Never edit the PNG or SVG; change the design and draw it again.">
          <Window name="design --help" bodyClassName="divide-y divide-line-subtle px-4">
            {VERBS.map(([verb, what]) => (
              <div key={verb} className="grid gap-1 py-3 text-body-sm sm:grid-cols-[11rem_1fr]">
                <span className="font-medium text-fg">{verb}</span>
                <span className="text-fg-muted">{what}</span>
              </div>
            ))}
          </Window>
        </Block>
      </PageBody>
    </>
  );
}
