// Sizes, templates and the content an agent passes in. Layout code reads this; it does not invent copy.
// Sizes and the editor layouts' defaults are brand data (brand/assets/image.json); the field rules live here.

import { z } from 'zod';
import { typeNote } from '../brand/catalog.js';
import { unknownName } from '../lib/names.js';
import { parseSchema } from '../lib/schema.js';
import { parseCards, SCENE_GROUNDS, STICKER_MODES, subjectNames, WINDOW_BODIES, type StickerMode } from './compose.js';
import { imageConfig, type Card, type SceneGround, type WindowBody } from './scene.js';

type Size = { width: number; height: number; label: string; use: string; aliases?: string[] };

export const SIZES: Record<string, Size> = imageConfig().sizes;

const SCENE_COMMON = ['eyebrow', 'subtext', 'button', 'ground', 'band', 'scan', 'logo', 'stickers', 'subjects', 'seed', 'count'] as const;

export const TEMPLATES = {
	hero: {
		label: imageConfig().templates.hero.label,
		ground: imageConfig().templates.hero.ground,
		needs: ['headline'],
		optional: [...SCENE_COMMON, 'image', 'toon'],
		summary: 'The editor\'s hero: words in the middle of the blue ground with its scanlines, the lockup at the top left, and the brand\'s toon objects round the words (preset, under, scatter). --image puts your picture in as the object (--toon makes it one).',
	},
	window: {
		label: imageConfig().templates.window.label,
		ground: imageConfig().templates.window.ground,
		needs: ['headline'],
		optional: [...SCENE_COMMON, 'window', 'windowBody', 'picture', 'image', 'toon'],
		summary: 'The editor\'s window: words beside a sky-barred window on paper (above it on tall sizes). The window holds a toon object (--picture) or your picture (--image).',
	},
	cards: {
		label: imageConfig().templates.cards.label,
		ground: imageConfig().templates.cards.ground,
		needs: ['headline', 'cards'],
		optional: ['ground', 'band', 'scan', 'logo', 'footer', 'stickers', 'subjects', 'seed', 'count'],
		summary: 'The editor\'s numbered cards: a title, up to eight white cards (number, heading, a few lines) and a footer with the lockup and the address.',
	},
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
		notSizes: ['linkedin-banner'],
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

export type SizeId = string;

/** Sizes a template is drawn at: every size, less any its layout cannot hold. */
export function templateSizes(id: TemplateId): string[] {
	const skip = ((TEMPLATES[id] as { notSizes?: readonly string[] }).notSizes ?? []) as readonly string[];
	return Object.keys(SIZES).filter((s) => !skip.includes(s));
}
export type TemplateId = keyof typeof TEMPLATES;
export type Ground = SceneGround;
export const isScene = (id: TemplateId): id is 'hero' | 'window' | 'cards' => id === 'hero' || id === 'window' || id === 'cards';

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
	button?: string;
	band?: Ground | 'none';
	scan?: boolean;
	logo?: boolean;
	windowBody?: WindowBody;
	picture?: string;
	toon?: boolean;
	stickers?: StickerMode;
	subjects?: string[];
	seed?: number;
	count?: number;
	cards?: Card[];
};

export type ImageJob = ImageFields & { size: SizeId; width: number; height: number };

const LIMITS: Record<string, number> = { headline: 280, subtext: 500, eyebrow: 80, quote: 600, by: 80, footer: 80, window: 48, button: 32 };

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

/** A size id or one of its aliases (the editor's names), to the id. */
export function sizeId(raw: string): SizeId {
	const id = raw.trim().toLowerCase();
	if (id in SIZES) return id;
	const alias = Object.entries(SIZES).find(([, s]) => s.aliases?.includes(id));
	if (alias) return alias[0];
	throw unknownName('size', id, [...Object.keys(SIZES), 'all']);
}

export function parseSizes(value: string | undefined): SizeId[] {
	const raw = (value ?? 'og').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
	if (raw.length === 1 && raw[0] === 'all') return Object.keys(SIZES);
	const ids: SizeId[] = [];
	for (const one of raw) {
		const id = sizeId(one);
		if (!ids.includes(id)) ids.push(id);
	}
	if (!ids.length) throw new Error(`Pick a size: ${Object.keys(SIZES).join(', ')}.`);
	return ids;
}

export function parseExports(value: string | undefined): ('png' | 'svg')[] {
	const raw = (value ?? 'png,svg').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
	const out: ('png' | 'svg')[] = [];
	for (const id of raw) {
		if (id !== 'png' && id !== 'svg') throw unknownName('export', id, ['png', 'svg']);
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

export const IMAGE_FIELDS = ['template', 'headline', 'subtext', 'eyebrow', 'quote', 'by', 'image', 'window', 'footer', 'ground', 'noFooter', 'size', 'sizes', 'button', 'band', 'scan', 'logo', 'windowBody', 'picture', 'toon', 'stickers', 'subjects', 'seed', 'count', 'cards'] as const;

export const imageInputSchema = z
	.object({
		template: z.string().optional(),
		headline: z.string().optional(),
		subtext: z.string().optional(),
		eyebrow: z.string().optional(),
		quote: z.string().optional(),
		by: z.string().optional(),
		image: z.string().optional(),
		window: z.string().optional(),
		footer: z.string().optional(),
		ground: z.string().optional(),
		noFooter: z.boolean().optional(),
		size: z.string().optional(),
		sizes: z.string().optional(),
		button: z.string().optional(),
		band: z.string().optional(),
		scan: z.boolean().optional(),
		logo: z.boolean().optional(),
		windowBody: z.string().optional(),
		picture: z.string().optional(),
		toon: z.boolean().optional(),
		stickers: z.string().optional(),
		subjects: z.union([z.string(), z.array(z.string())]).optional(),
		seed: z.union([z.number(), z.string()]).optional(),
		count: z.union([z.number(), z.string()]).optional(),
		cards: z.union([z.string(), z.array(z.union([z.string(), z.object({ title: z.string(), body: z.string().optional() }).strict()]))]).optional(),
	})
	.strict();

export type RawImageInput = z.infer<typeof imageInputSchema>;

export function assertImageInput(value: unknown, label = 'image'): RawImageInput {
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} input must be a JSON object.`);
	return parseSchema(imageInputSchema, value, label, IMAGE_FIELDS);
}

function oneOf<T extends string>(what: string, value: string | undefined, pool: readonly T[]): T | undefined {
	if (value === undefined) return undefined;
	const v = value.trim().toLowerCase();
	if (!(pool as readonly string[]).includes(v)) throw unknownName(what, v, [...pool]);
	return v as T;
}

function wholeNumber(value: unknown, field: string): number | undefined {
	if (value === undefined || value === '') return undefined;
	const n = typeof value === 'number' ? value : Number(String(value).trim());
	if (!Number.isInteger(n)) throw new Error(`${field} must be a whole number.`);
	return n;
}

/** Check one set of fields. Size is applied by the caller, once per requested size. */
export function resolveFields(raw: RawImageInput, defaults: { footer: string }): ImageFields {
	const ids = Object.keys(TEMPLATES);
	if (typeof raw.template !== 'string' || !raw.template.trim()) throw new Error(`Missing template. Use ${ids.join(', ')}.`);
	const template = raw.template.trim().toLowerCase();
	if (!(template in TEMPLATES)) throw unknownName('template', template, ids);
	const id = template as TemplateId;
	const spec = TEMPLATES[id];
	const scene = isScene(id);
	const groundRaw = cleanText(raw.ground, 'ground')?.toLowerCase();
	const grounds = scene ? SCENE_GROUNDS : (['blue', 'paper', 'white', 'ink'] as const);
	const ground = oneOf('ground', groundRaw, grounds);
	if (id === 'announcement' && groundRaw) throw new Error('The announcement template keeps its blue cap and paper body. Leave ground off.');
	const subjects = raw.subjects === undefined ? undefined : (Array.isArray(raw.subjects) ? raw.subjects : raw.subjects.split(',')).map((s) => s.trim()).filter(Boolean);
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
		ground: ground ?? (spec.ground === 'split' ? undefined : (spec.ground as Ground)),
		button: cleanText(raw.button, 'button'),
		band: oneOf('band', raw.band, [...SCENE_GROUNDS, 'none'] as const),
		scan: raw.scan,
		logo: raw.logo,
		windowBody: oneOf('window body', raw.windowBody, WINDOW_BODIES),
		picture: raw.picture === undefined ? undefined : raw.picture.trim() === 'none' ? 'none' : oneOf('picture', raw.picture, subjectNames()),
		toon: raw.toon,
		stickers: oneOf('stickers mode', raw.stickers, STICKER_MODES),
		subjects: subjects?.map((s) => oneOf('subject', s, subjectNames())!),
		seed: wholeNumber(raw.seed, 'seed'),
		count: wholeNumber(raw.count, 'count'),
		cards: raw.cards === undefined ? undefined : parseCards(raw.cards),
	};
	if (fields.image && !(spec.optional as readonly string[]).includes('image')) throw new Error(`Pass --image only with the ${Object.entries(TEMPLATES).filter(([, t]) => (t.optional as readonly string[]).includes('image')).map(([k]) => k).join(', ')} templates.`);
	const allowed = new Set<string>([...spec.needs, ...spec.optional]);
	const given: [keyof ImageFields, string][] = [['headline', 'headline'], ['subtext', 'subtext'], ['eyebrow', 'eyebrow'], ['quote', 'quote'], ['by', 'by'], ['window', 'window'], ['button', 'button'], ['band', 'band'], ['scan', 'scan'], ['logo', 'logo'], ['windowBody', 'window-body'], ['picture', 'picture'], ['toon', 'toon'], ['stickers', 'stickers'], ['subjects', 'subjects'], ['seed', 'seed'], ['count', 'count'], ['cards', 'cards']];
	for (const [key, flag] of given) {
		if (fields[key] !== undefined && !allowed.has(key)) throw new Error(`The ${id} template does not take --${flag}.`);
	}
	if (fields.toon && !fields.image) throw new Error('--toon turns your --image into a toon object. Pass --image too.');
	const missing = spec.needs.filter((key) => {
		const v = fields[key as keyof ImageFields];
		return Array.isArray(v) ? !v.length : !v;
	});
	if (missing.length) throw new Error(`The ${id} template needs ${missing.map((key) => `--${key}`).join(' and ')}.`);
	return fields;
}

export function catalog() {
	const cfg = imageConfig();
	return {
		ok: true,
		sizes: Object.entries(SIZES).map(([id, size]) => ({ id, ...size })),
		templates: Object.entries(TEMPLATES).map(([id, template]) => ({ id, ...template, sizes: templateSizes(id as TemplateId) })),
		exports: ['png', 'svg'],
		fields: IMAGE_FIELDS,
		grounds: [...SCENE_GROUNDS],
		bands: [...SCENE_GROUNDS, 'none'],
		windowBodies: [...WINDOW_BODIES],
		stickerModes: [...STICKER_MODES],
		subjects: subjectNames(),
		source: cfg.source,
		notes: cfg.notes,
		type: { note: typeNote() },
	};
}
