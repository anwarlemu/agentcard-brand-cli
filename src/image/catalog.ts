// Sizes, templates and the content an agent passes in. Layout code reads this; it does not invent copy.

export const SIZES = {
	og: { width: 1200, height: 630, label: 'Open Graph', use: 'Link previews, 1200 by 630' },
	square: { width: 1080, height: 1080, label: 'Square', use: 'Feed posts, 1080 by 1080' },
	portrait: { width: 1080, height: 1350, label: 'Portrait', use: 'Portrait posts, 1080 by 1350' },
	landscape: { width: 1200, height: 675, label: 'Landscape', use: 'X and LinkedIn, 1200 by 675' },
} as const;

export const TEMPLATES = {
	headline: {
		label: 'Headline',
		ground: 'blue',
		needs: ['headline'],
		optional: ['eyebrow', 'footer', 'ground'],
		summary: 'Centered headline on the blue ground, lockup at the top left, stepped band along the bottom.',
	},
	subtext: {
		label: 'Headline and subtext',
		ground: 'paper',
		needs: ['headline', 'subtext'],
		optional: ['eyebrow', 'footer', 'ground'],
		summary: 'Centered headline with a supporting line on the paper ground, and the stepped band below.',
	},
	screenshot: {
		label: 'Screenshot',
		ground: 'blue',
		needs: ['headline'],
		optional: ['subtext', 'image', 'window', 'footer', 'ground'],
		summary: 'Headline beside or above a window. Pass --image with a PNG or JPEG to fill the window.',
	},
	quote: {
		label: 'Quote',
		ground: 'paper',
		needs: ['quote'],
		optional: ['by', 'window', 'footer', 'ground'],
		summary: 'A quote inside a window on the paper ground, with an optional attribution.',
	},
	announcement: {
		label: 'Announcement',
		ground: 'split',
		needs: ['headline'],
		optional: ['eyebrow', 'subtext', 'footer'],
		summary: 'A blue cap with the eyebrow, then the stepped band, then the headline on paper. Ground is fixed.',
	},
} as const;

export type SizeId = keyof typeof SIZES;
export type TemplateId = keyof typeof TEMPLATES;
export type Ground = 'blue' | 'paper' | 'white';

export type ImageFields = {
	template: TemplateId;
	headline?: string;
	subtext?: string;
	eyebrow?: string;
	quote?: string;
	by?: string;
	image?: string;
	window?: string;
	footer: string;
	ground?: Ground;
};

export type ImageJob = ImageFields & { size: SizeId; width: number; height: number };

const LIMITS: Record<string, number> = { headline: 280, subtext: 500, eyebrow: 80, quote: 600, by: 80, footer: 80, window: 48 };

/** Turn a CLI or JSON value into a single line of copy, keeping intentional line breaks. */
export function cleanText(value: unknown, field: string): string | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	if (typeof value !== 'string') throw new Error(`${field} must be a string`);
	const text = value.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim();
	if (!text) return undefined;
	const limit = LIMITS[field];
	if (limit && text.length > limit) throw new Error(`${field} is ${text.length} characters. Keep it under ${limit}.`);
	return text;
}

export function parseSizes(value: string | undefined): SizeId[] {
	const raw = (value ?? 'og').split(',').map((s) => s.trim()).filter(Boolean);
	if (raw.length === 1 && raw[0] === 'all') return Object.keys(SIZES) as SizeId[];
	const ids: SizeId[] = [];
	for (const id of raw) {
		if (!(id in SIZES)) throw new Error(`Unknown size "${id}". Use ${Object.keys(SIZES).join(', ')}, or all.`);
		if (!ids.includes(id as SizeId)) ids.push(id as SizeId);
	}
	if (!ids.length) throw new Error(`Pick a size: ${Object.keys(SIZES).join(', ')}.`);
	return ids;
}

export function parseExports(value: string | undefined): ('png' | 'svg')[] {
	const raw = (value ?? 'png,svg').split(',').map((s) => s.trim()).filter(Boolean);
	const out: ('png' | 'svg')[] = [];
	for (const id of raw) {
		if (id !== 'png' && id !== 'svg') throw new Error(`Unknown export "${id}". Use png, svg, or png,svg.`);
		if (!out.includes(id)) out.push(id);
	}
	if (!out.length) throw new Error('Pick an export: png, svg, or both.');
	return out;
}

export function safeName(value: string): string {
	const name = value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
	if (!name) throw new Error('The file name needs a letter or a number.');
	return name;
}

export type RawImageInput = {
	template?: unknown;
	headline?: unknown;
	subtext?: unknown;
	eyebrow?: unknown;
	quote?: unknown;
	by?: unknown;
	image?: unknown;
	window?: unknown;
	footer?: unknown;
	ground?: unknown;
	noFooter?: boolean;
};

/** Check one set of fields. Size is applied by the caller, once per requested size. */
export function resolveFields(raw: RawImageInput, defaults: { footer: string }): ImageFields {
	const template = String(raw.template ?? 'headline');
	if (!(template in TEMPLATES)) throw new Error(`Unknown template "${template}". Use ${Object.keys(TEMPLATES).join(', ')}.`);
	const id = template as TemplateId;
	const spec = TEMPLATES[id];
	const groundRaw = cleanText(raw.ground, 'ground');
	if (groundRaw && groundRaw !== 'blue' && groundRaw !== 'paper' && groundRaw !== 'white') throw new Error('Ground must be blue, paper or white.');
	if (id === 'announcement' && groundRaw) throw new Error('The announcement template keeps its blue cap and paper body. Leave ground off.');
	const fields: ImageFields = {
		template: id,
		headline: cleanText(raw.headline, 'headline'),
		subtext: cleanText(raw.subtext, 'subtext'),
		eyebrow: cleanText(raw.eyebrow, 'eyebrow'),
		quote: cleanText(raw.quote, 'quote'),
		by: cleanText(raw.by, 'by'),
		image: typeof raw.image === 'string' && raw.image.trim() ? raw.image.trim() : undefined,
		window: cleanText(raw.window, 'window'),
		footer: raw.noFooter ? '' : cleanText(raw.footer, 'footer') ?? defaults.footer,
		ground: (groundRaw as Ground | undefined) ?? (spec.ground === 'split' ? undefined : spec.ground),
	};
	const missing = spec.needs.filter((key) => !fields[key as keyof ImageFields]);
	if (missing.length) throw new Error(`The ${id} template needs ${missing.map((key) => `--${key}`).join(' and ')}.`);
	return fields;
}

export function catalog() {
	return {
		ok: true,
		sizes: Object.entries(SIZES).map(([id, size]) => ({ id, ...size })),
		templates: Object.entries(TEMPLATES).map(([id, template]) => ({ id, ...template })),
		exports: ['png', 'svg'],
		type: {
			family: 'Inter',
			weights: { text: 400, display: 500 },
			note: 'The display family named in the brand tokens is not included. Images set text and display in Inter, the body font shipped with the CLI, at the token weights and tracking. Logos are the shipped lockup, drawn as vectors.',
		},
	};
}
