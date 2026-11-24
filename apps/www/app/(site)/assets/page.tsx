import { Window } from "@/components/ui/window";
import { Block, Command, PageBody, PageHead } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { Shot } from "@www/components/gallery";
import { galleryOf } from "@www/lib/gallery";
import { CLI_COMMAND } from "@www/lib/registry";

export const metadata = { title: "Assets" };

const images = galleryOf("image");
const deck = galleryOf("deck");
const merch = galleryOf("merch");
const data = galleryOf("data");
const ads = galleryOf("ads");
const print = galleryOf("print");
const clip = galleryOf("video")[0];

const SIZES = [
  ["og", "1200 by 630", "Link previews"],
  ["square", "1080 by 1080", "Feed posts"],
  ["portrait", "1080 by 1350", "Portrait posts (4:5)"],
  ["landscape", "1200 by 675", "X and LinkedIn posts (16:9)"],
  ["story", "1080 by 1920", "Stories and reels (9:16)"],
  ["x-banner", "1500 by 500", "X profile header"],
  ["linkedin-banner", "1584 by 396", "LinkedIn cover"],
];

export default function AssetsPage() {
  return (
    <>
      <PageHead eyebrow="Docs" title="Assets" description="Make share images, social posts, slides, short clips and merch print files from the brand's own layouts. Every value comes from the tokens; the same input gives the same file." />
      <PageBody className="max-w-300">
        <Command command={`${CLI_COMMAND} manifest --json`} />

        <Block id="images" title="Share images and social posts" description="Hero, window and cards are the brand's image editor layouts; headline, subtext, screenshot, quote and announcement are the first templates. Each writes PNG and SVG at every size.">
          <div className="columns-1 gap-4 sm:columns-2">
            {images.map((e) => (
              <Shot key={e.file} entry={e} className="mb-4 break-inside-avoid" />
            ))}
          </div>
          <Window name="sizes.txt" bodyClassName="divide-y divide-line-subtle px-4">
            {SIZES.map(([id, size, use]) => (
              <div key={id} className="grid gap-1 py-2.5 text-body-sm sm:grid-cols-[11rem_9rem_1fr]">
                <span className="font-mono text-fg">{id}</span>
                <span className="text-fg-muted">{size}</span>
                <span className="text-fg-subtle">{use}</span>
              </div>
            ))}
          </Window>
          <Code
            title="cards.json"
            lang="json"
            code={`{
  "template": "cards",
  "headline": "How to safely share your users’ cards with an agent",
  "cards": [
    { "title": "Save it once, not in the chat", "body": "Stored encrypted, never pasted." },
    { "title": "Every purchase is approved", "body": "With a passkey, tied to that exact cart." }
  ]
}`}
          />
          <Command command={`${CLI_COMMAND} image cards --input cards.json --size all`} />
        </Block>

        <Block id="deck" title="Slides" description="Cover, section, statement, bullets, stat, quote, image, cards and end card at 1920 by 1080, from one JSON file: a PNG per slide and one PDF.">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
            {deck.map((e) => (
              <Shot key={e.file} entry={e} command={false} />
            ))}
          </div>
          <Code
            title="deck.json"
            lang="json"
            code={`{
  "slides": [
    { "type": "cover", "title": "Let agents buy anything online", "body": "Cards your agent can use." },
    { "type": "section", "number": "01", "title": "Products" },
    { "type": "bullets", "title": "Four ways to pay", "items": ["Vault\\nStore customers’ cards.", "Issuing\\nCards for your agent."] },
    { "type": "end" }
  ]
}`}
          />
          <Command command={`${CLI_COMMAND} deck --input deck.json --out deck`} />
        </Block>

        <Block id="video" title="Clips" description="The brand's motion: words and objects arrive on the ease-out token, the objects drift like the site's sticker field, and the band's grain jumps. MP4 and WebM through ffmpeg, or one frame with --still.">
          {clip && (
            <figure className="overflow-hidden rounded-card border border-hairline bg-surface shadow-tile">
              <video src={clip.file} poster={images[0]?.file} width={clip.width} height={clip.height} controls muted playsInline preload="metadata" className="block h-auto w-full bg-paper" aria-label={clip.title} />
              <figcaption className="px-3 py-2 text-caption text-fg-muted">{clip.title}, 4 seconds at 30 fps</figcaption>
            </figure>
          )}
          <Command command={`${CLI_COMMAND} video hero --headline "Let agents buy anything online" --size square,vertical --format mp4,webm`} />
        </Block>

        <Block id="merch" title="Merch" description="Print files at real size with bleed and safe area: SVG in inches, PNG at 300 dpi, a proof with the guides (shown here) and a cut line for stickers. Sizes are common vendor conventions; confirm with the vendor's template.">
          <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3">
            {merch.map((e) => (
              <Shot key={e.file} entry={e} />
            ))}
          </div>
          <Command command={`${CLI_COMMAND} merch tee-front --variant all`} />
        </Block>

        <Block id="data" title="Stats, charts and plans" description="A stat, bar, line and donut charts, pricing plans, a comparison and a flow of steps, built only from the brand's cards, badge, window and blues (the brand has no chart style of its own).">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
            {data.map((e) => (
              <Shot key={e.file} entry={e} />
            ))}
          </div>
        </Block>

        <Block id="ads" title="Ads and backgrounds" description="The IAB display sizes, with shallow ones in one row (logo, words, key), and a video call background that keeps the middle clear.">
          <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-4">
            {ads.map((e) => (
              <Shot key={e.file} entry={e} />
            ))}
          </div>
        </Block>

        <Block id="print" title="Print documents" description="Business cards, letterheads, report covers, a one-pager and case study, a certificate, a name tag and an event badge, at real size with bleed. Only the words you pass (--set name=...) are printed.">
          <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-4">
            {print.map((e) => (
              <Shot key={e.file} entry={e} />
            ))}
          </div>
          <Command command={`${CLI_COMMAND} print business-card-back --set name="Sam Acme" --set role="Head of product"`} />
        </Block>
      </PageBody>
    </>
  );
}
