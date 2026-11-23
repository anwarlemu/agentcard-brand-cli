// The design contract, the same file in every brand CLI (src/design/types.ts). Brand-free. Units: canvas pixels.
export type Rect = { x: number; y: number; w: number; h: number };
export type LayerKind = 'logo' | 'text' | 'art' | 'picture' | 'panel' | 'key';
export type Anchor = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';

/** What the engine actually drew. Reported by the drawing code itself, never estimated beside it. */
export type DrawnLayer = {
	id: string;               // logo, headline, body, badge, art, picture, footer, ... stable per template
	kind: LayerKind;
	box: Rect;                // full drawn bounds, before the canvas edge cuts it
	ink?: Rect[];             // tighter bounds (one per text line), for overlap checks
	bleeds?: boolean;         // this layout runs it off the canvas on purpose (a pattern, a horizon)
	over?: string[];          // layers it may sit on by design (text on a panel)
	text?: { asked: string; drawn: string; size: number; color: string; ground: string[]; sample?: boolean };
	logo?: { clear: number; min: number };   // clear space in px at this size, minimum height in px (from brand/)
	can: { move?: boolean; scale?: [number, number]; align?: boolean; hide?: boolean; anchors?: Anchor[] };
};

/** A change to one layer, relative to where the template puts it. dx/dy are shares of the canvas. */
export type LayerEdit = { dx?: number; dy?: number; scale?: number; anchor?: Anchor; align?: 'left' | 'center' | 'right'; hidden?: boolean };

export type DesignDoc = {
	version: 1;
	brand: string;            // the CLI's bin name; another brand's file is an error
	kind: 'image' | 'slide' | 'merch' | 'illustration' | 'video';
	template: string;
	size: { id: string; width: number; height: number };
	theme?: string;
	copy: Record<string, string>;                      // only what the user wrote; nothing invented
	images: Record<string, string>;                    // slot -> file path, relative to the document
	seed?: number;
	options: Record<string, string | number | boolean>;
	layers: Record<string, LayerEdit>;
	history: { change: string; before: unknown }[];    // no timestamps: same inputs, same bytes
	future: { change: string; after: unknown }[];
};

export type TemplateInfo = {
	id: string; kind: DesignDoc['kind']; description: string; sizes: string[]; themes: string[];
	copy: { id: string; required?: boolean }[]; images: { id: string; required?: boolean }[];
	options: { id: string; values?: string[]; range?: [number, number] }[]; layers: { id: string; can: DrawnLayer['can'] }[];
};

/** The one thing each brand implements (src/design/adapter.ts). Everything else in src/design/ is shared, byte for byte. */
export type Adapter = {
	brand: string;
	templates(): TemplateInfo[];
	defaults(template: string, size: string): Pick<DesignDoc, 'size' | 'theme' | 'seed' | 'options'>;
	/** Draws the document with its layer edits applied inside the real drawing code (text re-wraps, art re-flows). */
	render(doc: DesignDoc, dir: string, out: { formats: ('png' | 'svg' | 'jpg' | 'webp' | 'pdf')[]; scale: number }): Promise<{ files: Record<string, Uint8Array>; layers: DrawnLayer[] }>;
};
