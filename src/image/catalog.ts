// Sizes, templates and the content an agent passes in. Layout code reads this; it does not invent copy.
// Sizes and the editor layouts' defaults are brand data (brand/assets/image.json); the field rules live here.

import { z } from 'zod';
import { typeNote } from '../brand/catalog.js';
import { unknownName } from '../lib/names.js';
import { parseSchema } from '../lib/schema.js';
import { parseCards, SCENE_GROUNDS, STICKER_MODES, subjectNames, WINDOW_BODIES, type StickerMode } from './compose.js';
import { imageConfig, type Card, type SceneGround, type WindowBody } from './scene.js';
import type { Edits } from './words.js';
import { sizeAlias } from '../design/platforms.js';

export const SIZES = imageConfig().sizes;

const OBJECTS = ['stickers', 'subjects', 'seed', 'count'] as const;
const SCENE_COMMON = ['badge', 'body', 'button', 'theme', 'band', 'scan', 'logo', ...OBJECTS] as const;
const label = (id: keyof ReturnType<typeof imageConfig>['templates']) => imageConfig().templates[id].label;
const ground = (id: keyof ReturnType<typeof imageConfig>['templates']) => imageConfig().templates[id].ground;

export const TEMPLATES = {
	hero: {
		label: label('hero'),
		ground: ground('hero') as Ground,
		needs: ['headline'],
		optional: [...SCENE_COMMON, 'image', 'toon', 'number'],
		summary: 'The editor\'s hero: words in the middle of the blue ground with its scanlines, the lockup at the top left, and the brand\'s toon objects round the words (preset, under, scatter). --image puts your picture in as the object (--toon makes it one).',
	},
	window: {
		label: label('window'),
		ground: ground('window') as Ground,
		needs: ['headline'],
		optional: ['badge', 'body', 'button', 'theme', 'band', 'scan', 'logo', 'window', 'windowBody', 'picture', 'image', 'toon', 'number', ...OBJECTS],
		summary: 'The editor\'s window: words beside a sky-barred window on paper (above it on tall sizes). The window holds a toon object (--picture) or your picture (--image).',
	},
	cards: {
		label: label('cards'),
		ground: ground('cards') as Ground,
		needs: ['headline', 'cards'],
		optional: ['theme', 'band', 'scan', 'logo', 'footer', 'number', ...OBJECTS],
		summary: 'The editor\'s numbered cards: a title, up to eight white cards (number, heading, a few lines) and a footer with the lockup and the address.',
	},
	headline: {
		label: label('headline'),
		ground: ground('headline') as Ground,
		needs: ['headline'],
		optional: ['badge', 'button', 'footer', 'theme', 'band', 'logo', 'number'],
		summary: 'Centered headline on the blue ground, lockup at the top left, stepped band along the bottom.',
	},
	subtext: {
		label: label('subtext'),
		ground: ground('subtext') as Ground,
		needs: ['headline', 'body'],
		optional: ['badge', 'button', 'footer', 'theme', 'band', 'logo', 'number'],
		summary: 'Centered headline with a supporting line on the paper ground, and the stepped band below.',
	},
	screenshot: {
		label: label('screenshot'),
		ground: ground('screenshot') as Ground,
		needs: ['headline'],
		oneOf: ['image', 'picture'],
		optional: ['badge', 'body', 'image', 'picture', 'window', 'windowBody', 'footer', 'theme', 'band', 'logo', 'number'],
		summary: 'Headline beside or above a window that takes the shape of your screenshot, shown whole. Needs --image (a PNG or JPEG), or --picture for a toon object in its place.',
	},
	quote: {
		label: label('quote'),
		ground: ground('quote') as Ground,
		needs: ['quote'],
		optional: ['by', 'window', 'footer', 'theme', 'band', 'logo', 'number'],
		summary: 'A quote inside a window on the paper ground, with an optional attribution.',
	},
	announcement: {
		label: label('announcement'),
		ground: 'split' as const,
		needs: ['headline'],
		optional: ['badge', 'body', 'button', 'footer', 'logo', 'number', 'theme'],
		summary: 'A blue (or ink) cap with the badge, then the stepped band, then the headline on paper. The page under the cap stays paper.',
	},
	stat: {
		label: label('stat'),
		ground: ground('stat') as Ground,
		needs: ['stat'],
		optional: ['badge', 'headline', 'body', 'footer', 'theme', 'scan', 'logo', 'number'],
		summary: 'One number as large as the room allows (--stat), with a headline under it.',
	},
	chart: {
		label: label('chart'),
		ground: ground('chart') as Ground,
		needs: ['data'],
		optional: ['chart', 'badge', 'headline', 'body', 'footer', 'theme', 'scan', 'logo', 'number'],
		summary: 'A bar, line or donut chart from --data "Jan: 120, Feb: 180" (--chart bar|line|donut), with a headline over it.',
	},
	pricing: {
		label: label('pricing'),
		ground: ground('pricing') as Ground,
		needs: ['plans'],
		optional: ['badge', 'headline', 'body', 'footer', 'theme', 'scan', 'logo', 'number'],
		summary: 'Up to three plans as cards: --plans with a blank line between plans, each plan its name, its price, then a line per feature.',
	},
	compare: {
		label: label('compare'),
		ground: ground('compare') as Ground,
		needs: ['columns'],
		optional: ['badge', 'headline', 'body', 'footer', 'theme', 'scan', 'logo', 'number'],
		summary: 'Two columns side by side: --columns with a blank line between them, each its title then a line per point.',
	},
	flow: {
		label: label('flow'),
		ground: ground('flow') as Ground,
		needs: ['steps'],
		optional: ['badge', 'headline', 'body', 'footer', 'theme', 'scan', 'logo', 'number'],
		summary: 'Two to five numbered steps joined by arrows: --steps with a blank line between steps, each its title then a line.',
	},
	'before-after': {
		label: label('before-after'),
		ground: ground('before-after') as Ground,
		needs: ['headline'],
		optional: ['image', 'image2', 'picture', 'picture2', 'left', 'right', 'badge', 'body', 'footer', 'theme', 'scan', 'logo', 'number'],
		summary: 'Two pictures side by side in windows (--image and --image2, or toon objects with --picture and --picture2), labelled with --left and --right.',
	},
	logo: {
		label: label('logo'),
		ground: ground('logo') as Ground,
		needs: [],
		optional: ['theme', 'band', 'scan', 'mark'],
		summary: 'The lockup alone in the middle of a ground (or the mark, with --mark; the profile picture always uses the mark). Takes no copy.',
	},
} as const;

export type SizeId = string;

export const IMAGE_FORMATS = ['png', 'svg', 'jpg', 'webp'] as const;

/** Sizes a template is drawn at: every size, less any its layout cannot hold. */
export function templateSizes(id: TemplateId): string[] {
	const skip = imageConfig().templates[id].notSizes ?? [];
	return Object.keys(SIZES).filter((s) => !skip.includes(s));
}
export type TemplateId = keyof typeof TEMPLATES;
export type Ground = SceneGround;

/** Names that changed, and the names other brands use, for the same fields. */
export const ALIASES: Record<string, string> = { subtext: 'body', subtitle: 'body', eyebrow: 'badge', kicker: 'badge', ground: 'theme', title: 'headline' };

export type ImageFields = {
	template: TemplateId;
	headline?: string;
	body?: string;
	badge?: string;
	quote?: string;
	by?: string;
	image?: string;
	window?: string;
	footer: string;
	footerOptional?: boolean;
	number?: string;
	ground?: Ground;
	button?: string;
	mark?: boolean;
	stat?: string;
	data?: string;
	chart?: 'bar' | 'line' | 'donut';
	plans?: string;
	columns?: string;
	steps?: string;
	image2?: string;
	picture2?: string;
	left?: string;
	right?: string;
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

export type ImageJob = ImageFields & { size: SizeId; width: number; height: number; edits?: Edits; headlineSize?: number };

const LIMITS: Record<string, number> = { headline: 280, body: 500, badge: 80, quote: 600, by: 80, footer: 80, window: 48, button: 32, number: 12, stat: 24, data: 600, plans: 900, columns: 900, steps: 900, left: 40, right: 40 };

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
	const alias = imageConfig().sizeAliases[id] ?? sizeAlias(id) ?? Object.entries(SIZES).find(([, s]) => s.aliases.includes(id))?.[0];
	if (alias) return alias;
	throw unknownName('size', id, [...Object.keys(SIZES), 'custom', 'all']);
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

export function safeName(value: string): string {
	const name = value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
	if (!name) throw new Error('The file name needs a letter or a number.');
	return name;
}

export const IMAGE_FIELDS = ['template', 'headline', 'body', 'badge', 'quote', 'by', 'image', 'window', 'footer', 'theme', 'noFooter', 'size', 'sizes', 'width', 'height', 'button', 'band', 'scan', 'logo', 'mark', 'windowBody', 'picture', 'toon', 'stickers', 'subjects', 'seed', 'count', 'cards', 'number', 'sample', 'stat', 'data', 'chart', 'plans', 'columns', 'steps', 'image2', 'picture2', 'left', 'right'] as const;

const text = z.string().optional();
const count = z.union([z.number(), z.string()]).optional();
export const imageInputSchema = z
	.object({
		template: text,
		headline: text,
		body: text,
		badge: text,
		quote: text,
		by: text,
		image: text,
		window: text,
		footer: text,
		theme: text,
		noFooter: z.boolean().optional(),
		size: text,
		sizes: text,
		width: count,
		height: count,
		button: text,
		band: text,
		scan: z.boolean().optional(),
		logo: z.boolean().optional(),
		mark: z.boolean().optional(),
		windowBody: text,
		picture: text,
		toon: z.boolean().optional(),
		stickers: text,
		subjects: z.union([z.string(), z.array(z.string())]).optional(),
		seed: count,
		count,
		cards: z.union([z.string(), z.array(z.union([z.string(), z.object({ title: z.string(), body: z.string().optional() }).strict()]))]).optional(),
		number: text,
		sample: z.boolean().optional(),
		stat: text,
		data: z.union([z.string(), z.array(z.object({ label: z.string(), value: z.union([z.number(), z.string()]) }).strict())]).optional(),
		chart: text,
		plans: text,
		columns: text,
		steps: text,
		image2: text,
		picture2: text,
		left: text,
		right: text,
	})
	.strict();

export type RawImageInput = z.infer<typeof imageInputSchema>;

/** Other names for a field to its own name. A field given under two names is an error. */
export function canonical(value: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, v] of Object.entries(value)) {
		const name = ALIASES[key] ?? key;
		if (name in out) throw new Error(`${key} and ${name} are the same field. Pass one of them.`);
		out[name] = v;
	}
	return out;
}

export function assertImageInput(value: unknown, what = 'image'): RawImageInput {
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${what} input must be a JSON object.`);
	return parseSchema(imageInputSchema, canonical(value as Record<string, unknown>), what, IMAGE_FIELDS);
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

const FLAG: Record<string, string> = { windowBody: 'window-body' };

/** Check one set of fields. Size is applied by the caller, once per requested size. */
export function resolveFields(raw: RawImageInput, defaults: { footer: string }): ImageFields {
	const ids = Object.keys(TEMPLATES);
	if (typeof raw.template !== 'string' || !raw.template.trim()) throw new Error(`Missing template. Use ${ids.join(', ')}.`);
	const template = raw.template.trim().toLowerCase();
	if (!(template in TEMPLATES)) throw unknownName('template', template, ids);
	const id = template as TemplateId;
	const spec = TEMPLATES[id];
	const config = imageConfig();
	if (raw.sample) {
		// Sample copy fills only what was left empty, and only when asked for.
		const given = new Set(Object.keys(raw).filter((k) => raw[k as keyof RawImageInput] !== undefined));
		const sample = config.samples[id] as Record<string, unknown>;
		raw = { ...Object.fromEntries(Object.entries(sample).filter(([k]) => !given.has(k) && !(k === 'picture' && given.has('image')))), ...raw } as RawImageInput;
	}
	const themeRaw = cleanText(raw.theme, 'theme')?.toLowerCase();
	const themes = id === 'announcement' ? config.templates.announcement.cap! : SCENE_GROUNDS;
	const theme = oneOf(id === 'announcement' ? 'theme for the announcement cap' : 'theme', themeRaw, themes);
	const subjects = raw.subjects === undefined ? undefined : (Array.isArray(raw.subjects) ? raw.subjects : raw.subjects.split(',')).map((s) => s.trim()).filter(Boolean);
	const allowed = new Set<string>([...spec.needs, ...spec.optional]);
	const takesFooter = allowed.has('footer');
	const fields: ImageFields = {
		template: id,
		headline: cleanText(raw.headline, 'headline'),
		body: cleanText(raw.body, 'body'),
		badge: cleanText(raw.badge, 'badge'),
		quote: cleanText(raw.quote, 'quote'),
		by: cleanText(raw.by, 'by'),
		image: typeof raw.image === 'string' && raw.image.trim() ? raw.image.trim() : undefined,
		window: cleanText(raw.window, 'window'),
		footer: raw.noFooter || !takesFooter ? '' : (cleanText(raw.footer, 'footer') ?? defaults.footer),
		footerOptional: cleanText(raw.footer, 'footer') === undefined,
		number: cleanText(raw.number, 'number'),
		ground: (theme ?? (spec.ground === 'split' ? config.templates.announcement.ground : spec.ground)) as Ground,
		button: cleanText(raw.button, 'button'),
		band: oneOf('band', raw.band, [...SCENE_GROUNDS, 'none'] as const),
		scan: raw.scan,
		logo: raw.logo,
		mark: raw.mark,
		windowBody: oneOf('window body', raw.windowBody, WINDOW_BODIES),
		picture: raw.picture === undefined ? undefined : raw.picture.trim() === 'none' ? 'none' : oneOf('picture', raw.picture, subjectNames()),
		toon: raw.toon,
		stickers: oneOf('stickers mode', raw.stickers, STICKER_MODES),
		subjects: subjects?.map((s) => oneOf('subject', s, subjectNames())!),
		seed: wholeNumber(raw.seed, 'seed'),
		count: wholeNumber(raw.count, 'count'),
		cards: raw.cards === undefined ? undefined : parseCards(raw.cards),
		stat: cleanText(raw.stat, 'stat'),
		data: raw.data === undefined ? undefined : Array.isArray(raw.data) ? raw.data.map((d) => `${d.label}: ${d.value}`).join(', ') : cleanText(raw.data, 'data'),
		chart: oneOf('chart', raw.chart, ['bar', 'line', 'donut'] as const),
		plans: cleanText(raw.plans, 'plans'),
		columns: cleanText(raw.columns, 'columns'),
		steps: cleanText(raw.steps, 'steps'),
		image2: typeof raw.image2 === 'string' && raw.image2.trim() ? raw.image2.trim() : undefined,
		picture2: raw.picture2 === undefined ? undefined : oneOf('picture', raw.picture2, subjectNames()),
		left: cleanText(raw.left, 'left'),
		right: cleanText(raw.right, 'right'),
	};
	for (const key of ['badge', 'window', 'footer', 'by', 'button', 'number', 'stat', 'left', 'right'] as const) if (fields[key]?.includes('\n')) throw new Error(`${key} is one line. Take the line break out.`);
	if (!takesFooter && cleanText(raw.footer, 'footer')) throw new Error(`The ${id} template does not take --footer.`);
	if (fields.image && !allowed.has('image')) throw new Error(`The ${id} template does not take --image. Use it with ${Object.entries(TEMPLATES).filter(([, t]) => (t.optional as readonly string[]).includes('image')).map(([k]) => k).join(', ')}, the screenshot template among them.`);
	for (const key of Object.keys(fields) as (keyof ImageFields)[]) {
		if (key === 'template' || key === 'footer' || key === 'footerOptional' || key === 'ground' || fields[key] === undefined) continue;
		if (!allowed.has(key)) throw new Error(`The ${id} template does not take --${FLAG[key] ?? key}.`);
	}
	if (fields.toon && !fields.image) throw new Error('--toon turns your --image into a toon object. Pass --image too.');
	if (fields.image && fields.picture) throw new Error('--image and --picture both fill the window. Pass one of them.');
	if (fields.image2 && fields.picture2) throw new Error('--image2 and --picture2 both fill the second window. Pass one of them.');
	if (fields.seed !== undefined || fields.count !== undefined) {
		// A seed or a count asks for a scatter.
		fields.stickers ??= 'scatter';
		if (fields.stickers !== 'scatter') throw new Error('--seed and --count arrange a scatter. Use them with --stickers scatter.');
	}
	const missing = (spec.needs as readonly string[]).filter((key) => {
		const v = fields[key as keyof ImageFields];
		return Array.isArray(v) ? !v.length : !v;
	});
	if (missing.length) throw new Error(`The ${id} template needs ${missing.map((key) => `--${key}`).join(' and ')}.`);
	const either = (spec as { oneOf?: readonly string[] }).oneOf;
	if (either && !either.some((key) => fields[key as keyof ImageFields] && fields[key as keyof ImageFields] !== 'none')) throw new Error(`The ${id} template needs ${either.map((key) => `--${key}`).join(' or ')}: an empty window is not drawn.`);
	return fields;
}

export type SizeChoice = { id: SizeId; width: number; height: number };

/** The sizes to draw: ids (with custom as --width and --height), each checked against what the template can hold. */
export function chooseSizes(template: TemplateId, value: string | undefined, width?: unknown, height?: unknown): SizeChoice[] {
	const w = wholeNumber(width, 'width');
	const h = wholeNumber(height, 'height');
	const requested = value?.trim().toLowerCase() || (w || h ? 'custom' : 'og');
	const allowed = templateSizes(template);
	if (requested === 'all') return allowed.map((id) => ({ id, width: SIZES[id]!.width, height: SIZES[id]!.height }));
	const out: SizeChoice[] = [];
	for (const raw of requested.split(',').map((s) => s.trim()).filter(Boolean)) {
		const literal = /^(\d{2,5})x(\d{2,5})$/.exec(raw);
		if (raw === 'custom' || literal) {
			const cw = literal ? Number(literal[1]) : w;
			const ch = literal ? Number(literal[2]) : h;
			if (!cw || !ch) throw new Error('A custom size needs --width and --height.');
			const { min, max } = imageConfig().custom;
			if (cw < min || ch < min || cw > max || ch > max) throw new Error(`Width and height must be ${min} to ${max} pixels.`);
			if (cw / ch > 8 || ch / cw > 4) throw new Error('That shape is too thin to lay out. Keep it between 8:1 and 1:4.');
			out.push({ id: literal ? raw : 'custom', width: cw, height: ch });
			continue;
		}
		const id = sizeId(raw);
		if (!allowed.includes(id)) throw new Error(`The ${template} template is not drawn at ${id}. Use ${allowed.join(', ')}.`);
		if (!out.some((s) => s.id === id)) out.push({ id, width: SIZES[id]!.width, height: SIZES[id]!.height });
	}
	if (!out.length) throw new Error(`Pick a size: ${Object.keys(SIZES).join(', ')}, or custom with --width and --height.`);
	if ((w || h) && !out.some((s) => s.id === 'custom')) throw new Error('--width and --height are for --size custom.');
	return out;
}

export function catalog() {
	const cfg = imageConfig();
	return {
		ok: true,
		sizes: [...Object.entries(SIZES).map(([id, size]) => ({ id, ...size })), { id: 'custom', label: 'Custom', use: `--width and --height, ${cfg.custom.min} to ${cfg.custom.max} pixels (or --size 1600x400)` }],
		templates: Object.entries(TEMPLATES).map(([id, template]) => ({ id, ...template, sizes: templateSizes(id as TemplateId), themes: id === 'announcement' ? cfg.templates.announcement.cap : [...SCENE_GROUNDS] })),
		exports: [...IMAGE_FORMATS],
		formats: [...IMAGE_FORMATS],
		fields: IMAGE_FIELDS,
		aliases: ALIASES,
		themes: [...SCENE_GROUNDS],
		grounds: [...SCENE_GROUNDS],
		bands: [...SCENE_GROUNDS, 'none'],
		windowBodies: [...WINDOW_BODIES],
		stickerModes: [...STICKER_MODES],
		subjects: subjectNames(),
		copy: 'Only the copy you pass is drawn (the lockup and the brand address may stay: --no-logo, --no-footer). --sample fills sample copy on purpose.',
		logo: cfg.scene.logoRule,
		smallText: cfg.scene.small.note,
		source: cfg.source,
		notes: cfg.notes,
		type: { note: typeNote() },
	};
}
