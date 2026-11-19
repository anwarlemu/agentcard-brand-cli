import { Window } from "@/components/ui/window";
import { Block, Command, PageBody, PageHead } from "@www/components/chrome";
import { Shot } from "@www/components/gallery";
import { galleryOf } from "@www/lib/gallery";
import { CLI_COMMAND } from "@www/lib/registry";

export const metadata = { title: "Illustrations" };

const subjects = galleryOf("subject");
const scenes = galleryOf("illustration");

const RULES = [
  ["Objects", "Use the fifteen toon objects whole: never recolor, outline, stretch or crop one. Scale and turn them only."],
  ["Tilt", "A little: between -16 and 16 degrees, -6 for one large object."],
  ["Room", "Objects never cover the words or the lockup, and never sit on each other."],
  ["New objects", "Make them from a picture with the toon treatment, not by hand."],
  ["Grounds", "Blue with its scanlines, paper, white, ink, or clear; the stepped band where two grounds meet."],
];

export default function IllustrationsPage() {
  return (
    <>
      <PageHead eyebrow="Docs" title="Illustrations" description="The brand illustrates with toon objects: everyday things of buying and paying, rendered as glossy 3D toys with their own thickness. Place the brand's objects, or turn any picture into one." />
      <PageBody className="max-w-300">
        <Command command={`${CLI_COMMAND} illustrate --list`} />

        <Block title="The objects" description="Fifteen objects, each a cut-out with alpha. Name one or more as subjects.">
          <div className="grid grid-cols-3 items-start gap-3 sm:grid-cols-5">
            {subjects.map((e) => (
              <Shot key={e.file} entry={e} fit />
            ))}
          </div>
        </Block>

        <Block title="Arrangements" description="single, row, preset (the hero's seven), scatter (seeded, so the same seed gives the same picture) and object (the object alone, clear).">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
            {scenes.map((e) => (
              <Shot key={e.file} entry={e} />
            ))}
          </div>
          <Command command={`${CLI_COMMAND} illustrate coins wallet receipt --ground paper`} />
        </Block>

        <Block title="Any picture as a toon object" description="The toon treatment cuts the subject out, smooths its colors into flat plastic bands, puffs it up, lights it from the upper left and gives it a thickness. Use a picture of one thing on a plain background.">
          <Command command={`${CLI_COMMAND} illustrate --image photo.jpg --composition object`} />
        </Block>

        <Block title="Rules" description="The full list, each with its source, ships as brand/illustration.md.">
          <Window name="illustration.md" bodyClassName="divide-y divide-line-subtle px-4">
            {RULES.map(([title, rule]) => (
              <div key={title} className="grid gap-1 py-3 text-body-sm sm:grid-cols-[9rem_1fr]">
                <span className="font-medium text-fg">{title}</span>
                <span className="text-fg-muted">{rule}</span>
              </div>
            ))}
          </Window>
        </Block>
      </PageBody>
    </>
  );
}
