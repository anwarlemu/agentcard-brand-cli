import { StickerField, type Sticker } from "@/components/visuals/sticker-field";

// Neutral stand-ins for the brand's 3D objects: small token-colored shapes (a card, a coin, a tag, a parcel).
const card = (bg: string) => <div className={`aspect-[1.6] w-full rounded-card border border-ink/12 ${bg} shadow-key`} />;
const coin = <div className="size-full rounded-pill border-4 border-white bg-tint-butter shadow-key" />;
const parcel = <div className="size-full rounded-control border border-ink/12 bg-tint-peach shadow-key" />;
const tag = <div className="size-full rounded-shell bg-heart shadow-key-brand" />;

const STICKERS: Sticker[] = [
  { src: card("bg-brand"), x: 4, y: 8, size: 170, rotate: -12 },
  { src: coin, x: 9, y: 46, size: 110, rotate: 8 },
  { src: parcel, x: 3, y: 76, size: 140, rotate: -6 },
  { src: card("bg-sky"), x: "calc(100% - 15rem)", y: 10, size: 160, rotate: 10 },
  { src: tag, x: "calc(100% - 12rem)", y: 44, size: 104, rotate: -16 },
  { src: card("bg-tint-sage"), x: "calc(100% - 14rem)", y: 74, size: 150, rotate: 6 },
];

export function Site() {
  return (
    <StickerField stickers={STICKERS} from="xl" className="bg-paper">
      <div className="mx-auto max-w-(--ds-layout-text) px-5 py-44 text-center">
        <h2 className="font-display text-h2 leading-heading font-medium tracking-tighter">Frequently asked questions</h2>
        <p className="mt-3.5 text-body-lg text-ink/70">The stickers drift in the margins and never cover the column. They hide where the margins are too narrow.</p>
        <div className="mt-10 rounded-card border border-hairline bg-surface p-7 text-left shadow-card">
          <p className="font-display text-h5 font-medium tracking-tight">What does an agent need to buy something?</p>
          <p className="mt-2 text-body text-fg-muted">A card it can use, and your approval when the amount is over your limit.</p>
        </div>
      </div>
    </StickerField>
  );
}
