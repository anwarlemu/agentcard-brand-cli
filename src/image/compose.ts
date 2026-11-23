// From an image job (copy, size and choices) to a scene: the layout's defaults per template and size, the objects to
// arrange (preset, under, scatter or none), and the user's picture read and scaled to what is drawn.

import { drawImage } from '../assets/raster.js';
import { readPicture } from '../assets/picture.js';
import { toonify } from '../assets/toon.js';
import { unknownName } from '../lib/names.js';
import { resolve } from 'node:path';
import { illustrateConfig, imageConfig, layoutOf, layoutFor, pictureArt, subjectArt, type Art, type Card, type Scene, type SceneGround, type SceneTemplate, type WindowBody } from './scene.js';
import type { Edits } from './words.js';

export const SCENE_TEMPLATES = ['hero', 'window', 'cards', 'headline', 'subtext', 'screenshot', 'quote', 'announcement', 'logo'] as const;
export const STICKER_MODES = ['preset', 'under', 'scatter', 'none'] as const;
export type StickerMode = (typeof STICKER_MODES)[number];
export const WINDOW_BODIES = ['blue', 'sky', 'white'] as const;
export const SCENE_GROUNDS = ['blue', 'paper', 'white', 'ink'] as const;

export type SceneFields = {
	template: SceneTemplate;
	width: number;
	height: number;
	size?: string;
	ground?: SceneGround;
	band?: SceneGround | 'none';
	scan?: boolean;
	logo?: boolean;
	mark?: boolean;
	badge?: string;
	headline?: string;
	body?: string;
	button?: string;
	quote?: string;
	by?: string;
	window?: string;
	windowBody?: WindowBody;
	picture?: string;
	image?: string;
	toon?: boolean;
	stickers?: StickerMode;
	subjects?: string[];
	seed?: number;
	count?: number;
	cards?: Card[];
	footer?: string;
	footerOptional?: boolean;
	number?: string;
	edits?: Edits;
	/** A ceiling for the headline, so a carousel's slides share one size. */
	headlineSize?: number;
};

export function subjectNames() {
	return Object.keys(illustrateConfig().subjects);
}

export function checkSubject(name: string) {
	if (!(name in illustrateConfig().subjects)) throw unknownName('subject', name, subjectNames());
	return name;
}

/** Cards from text (blank lines between cards, each card's first line its heading) or from a list. */
export function parseCards(value: unknown): Card[] {
	if (value === undefined || value === null || value === '') return [];
	if (Array.isArray(value)) {
		return value.map((item, i) => {
			if (typeof item === 'string') return { title: item.trim(), body: '' };
			if (!item || typeof item !== 'object') throw new Error(`cards[${i}] must be a string or { "title", "body" }.`);
			const o = item as Record<string, unknown>;
			const extra = Object.keys(o).filter((key) => key !== 'title' && key !== 'body');
			if (extra.length) throw new Error(`Unknown card field "${extra[0]}". Use title and body.`);
			if (typeof o.title !== 'string' || !o.title.trim()) throw new Error(`cards[${i}] needs a title.`);
			return { title: o.title.trim(), body: typeof o.body === 'string' ? o.body.replace(/\s+/g, ' ').trim() : '' };
		});
	}
	if (typeof value !== 'string') throw new Error('cards must be text or a list.');
	return value
		.replace(/\\n/g, '\n')
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter(Boolean)
		.map((block) => {
			const [title, ...rest] = block.split('\n');
			return { title: title!.trim(), body: rest.join(' ').replace(/\s+/g, ' ').trim() };
		});
}

/** The user's picture, no larger than twice what any layout draws, so a huge photo does not make a huge file. */
function userArt(path: string, toon: boolean): Art {
	const pic = readPicture(resolve(path), 'image');
	if (toon) return pictureArt(toonify(pic), 'toon');
	const long = Math.max(pic.width, pic.height);
	const max = 2400;
	if (long <= max) return pictureArt(pic, 'image');
	const w = Math.max(1, Math.round((pic.width * max) / long));
	const h = Math.max(1, Math.round((pic.height * max) / long));
	return pictureArt(drawImage(pic, w, h, 0, 0, w, h), 'image');
}

/** The scene for a job, with the layout's opening choices filled in. Only copy that was passed is drawn. */
export function buildScene(f: SceneFields): Scene {
	const cfg = imageConfig();
	const t = cfg.templates[f.template];
	const lay = layoutFor(f.template, f.width, f.height, f.size);
	const maxCards = t.cards?.maxCards ?? 8;
	if (f.cards && f.cards.length > maxCards) throw new Error(`Use at most ${maxCards} cards.`);
	const ground = f.ground ?? t.ground;
	const bandTo = f.band ?? t.band;
	const scene: Scene = {
		template: f.template,
		width: f.width,
		height: f.height,
		size: f.size,
		ground,
		scan: f.scan ?? t.scan,
		band: bandTo === 'contrast' ? cfg.bandContrast[ground] : bandTo,
		logo: f.logo ?? true,
		mark: f.mark,
		badge: f.badge ?? '',
		headline: f.headline ?? '',
		body: f.body ?? '',
		button: f.button ?? '',
		quote: f.quote ?? '',
		by: f.by ?? '',
		...lay,
		...(f.headlineSize ? { textSize: Math.min(lay.textSize, f.headlineSize) } : {}),
		window: f.window ?? '',
		windowBody: f.windowBody ?? t.windowBody ?? 'blue',
		picture: null,
		fill: false,
		objects: { mode: 'none', targets: [], names: [], count: 0, seed: 0 },
		stickers: [],
		cards: f.cards ?? [],
		footer: f.footer ?? '',
		footerOptional: f.footerOptional ?? false,
		number: f.number ?? '',
		edits: f.edits ?? {},
		notes: [],
	};
	if (f.template === 'window' || f.template === 'screenshot') {
		if (f.image) {
			scene.picture = userArt(f.image, Boolean(f.toon));
			scene.fill = !f.toon;
		} else if (f.picture !== 'none') {
			const subject = f.picture ?? t.picture;
			if (subject) scene.picture = subjectArt(checkSubject(subject));
		}
		if (scene.fill && !f.windowBody) scene.windowBody = 'white';
		else if (f.template === 'screenshot' && !scene.fill && !f.windowBody) scene.windowBody = 'sky';
	}
	const mode: StickerMode = f.stickers ?? (f.template === 'hero' ? (f.image ? 'under' : ((t.stickers as StickerMode) ?? 'preset')) : 'none');
	const names = f.subjects?.length ? f.subjects.map(checkSubject) : undefined;
	if (mode === 'preset') {
		const list = cfg.stickers.preset.filter((p) => !names || names.includes(p.subject));
		const missing = names?.filter((n) => !cfg.stickers.preset.some((p) => p.subject === n)) ?? [];
		if (missing.length) throw new Error(`${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not in the preset. Use --stickers scatter to place ${missing.length === 1 ? 'it' : 'them'}.`);
		scene.objects = { mode, targets: list.map((p) => ({ art: subjectArt(p.subject), x: p.x, y: p.y, size: p.size, rotate: p.rotate })), names: list.map((p) => p.subject), count: list.length, seed: 0 };
	} else if (mode === 'under') {
		if (f.template !== 'hero') throw new Error('The under arrangement is for the hero. Use scatter or preset.');
		if (names && names.length > 1) throw new Error('The under arrangement draws one object. Name one subject, or use scatter.');
		const art = f.image ? userArt(f.image, Boolean(f.toon)) : subjectArt(names?.[0] ?? cfg.stickers.under.subject);
		scene.objects = { mode, targets: [], names: [art.name], count: 1, seed: 0, under: { art, rotate: cfg.stickers.under.rotate } };
	} else if (mode === 'scatter') {
		const sc = cfg.stickers.scatter;
		const count = f.count ?? (names ? Math.min(names.length, sc.max) : sc.count);
		if (!Number.isInteger(count) || count < 1 || count > sc.max) throw new Error(`count must be a whole number from 1 to ${sc.max}.`);
		scene.objects = { mode, targets: [], names: names ?? subjectNames(), count, seed: f.seed ?? sc.seed, asked: f.count !== undefined || Boolean(names) };
	}
	const L = layoutOf(scene);
	// Objects a person named by name are asked for: leaving one out is an error, not a note.
	if (names && L.notes.some((n) => n.startsWith('Left out'))) throw new Error(`${L.notes.find((n) => n.startsWith('Left out'))} Name fewer subjects, shorten the words or pick a larger size.`);
	scene.stickers = L.stickers;
	return scene;
}
