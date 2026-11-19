// From an image job (copy, size and choices) to a scene for the hero, window and cards layouts: the editor's defaults
// per template and size, the objects arranged (preset, under, scatter or none), and the user's picture placed.

import { resolve } from 'node:path';
import { readPicture } from '../assets/picture.js';
import { toonify } from '../assets/toon.js';
import { unknownName } from '../lib/names.js';
import { bandOf, drawScene, illustrateConfig, imageConfig, layoutFor, logoRect, pictureArt, scatter, subjectArt, underneath, wordsRect, type Art, type Card, type Scene, type SceneGround, type SceneTemplate, type Sticker, type WindowBody } from './scene.js';

export const SCENE_TEMPLATES = ['hero', 'window', 'cards'] as const;
export const STICKER_MODES = ['preset', 'under', 'scatter', 'none'] as const;
export type StickerMode = (typeof STICKER_MODES)[number];
export const WINDOW_BODIES = ['blue', 'sky', 'white'] as const;
export const SCENE_GROUNDS = ['blue', 'paper', 'white', 'ink'] as const;

export type SceneFields = {
	template: SceneTemplate;
	width: number;
	height: number;
	ground?: SceneGround;
	band?: SceneGround | 'none';
	scan?: boolean;
	logo?: boolean;
	eyebrow?: string;
	headline?: string;
	subtext?: string;
	button?: string;
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

function userArt(path: string, toon: boolean): Art {
	const pic = readPicture(resolve(path), 'image');
	return toon ? pictureArt(toonify(pic), 'toon') : pictureArt(pic, 'image');
}

/** The scene for a job, with the editor's opening choices filled in. */
export function buildScene(f: SceneFields): Scene {
	const cfg = imageConfig();
	const t = cfg.templates[f.template];
	const lay = layoutFor(f.template, f.width, f.height);
	const maxCards = t.cards?.maxCards ?? 8;
	if (f.cards && f.cards.length > maxCards) throw new Error(`Use at most ${maxCards} cards.`);
	const scene: Scene = {
		template: f.template,
		width: f.width,
		height: f.height,
		ground: f.ground ?? t.ground,
		scan: f.scan ?? t.scan,
		band: f.band ?? t.band,
		logo: f.logo ?? true,
		eyebrow: f.eyebrow ?? '',
		headline: f.headline ?? '',
		body: f.subtext ?? '',
		button: f.button ?? '',
		...lay,
		window: f.window ?? t.window ?? 'screen.preview',
		windowBody: f.windowBody ?? t.windowBody ?? 'blue',
		picture: null,
		stickers: [],
		cards: f.cards ?? [],
		footer: f.footer ?? '',
	};
	if (f.template === 'window') {
		if (f.image) scene.picture = userArt(f.image, Boolean(f.toon));
		else if (f.picture !== 'none') scene.picture = subjectArt(checkSubject(f.picture ?? t.picture ?? subjectNames()[0]!));
	}
	const mode: StickerMode = f.stickers ?? (f.template === 'hero' ? (f.image ? 'under' : (t.stickers as StickerMode) ?? 'preset') : 'none');
	const names = f.subjects?.length ? f.subjects.map(checkSubject) : undefined;
	if (mode === 'preset') {
		const list = cfg.stickers.preset.filter((p) => !names || names.includes(p.subject));
		if (!list.length) throw new Error(`None of ${names!.join(', ')} is in the preset. Use --stickers scatter to place them.`);
		scene.stickers = list.map((p) => ({ art: subjectArt(p.subject), x: p.x, y: p.y, size: p.size, rotate: p.rotate }));
	} else if (mode === 'under') {
		const under = cfg.stickers.under;
		const art = f.image && f.template !== 'window' ? userArt(f.image, Boolean(f.toon)) : subjectArt(names?.[0] ?? under.subject);
		if (f.template === 'hero') scene.textY = under.textY;
		const text = f.template === 'hero' ? wordsRect(scene) : { x: 0, y: 0, w: f.width, h: f.height * 0.4 };
		scene.stickers = [underneath(scene, text, art, under.rotate, under.maxSize) satisfies Sticker];
	} else if (mode === 'scatter') {
		const sc = cfg.stickers.scatter;
		const count = f.count ?? sc.count;
		if (!Number.isInteger(count) || count < 1 || count > sc.max) throw new Error(`count must be a whole number from 1 to ${sc.max}.`);
		const seed = f.seed ?? sc.seed;
		// Keep clear of everything already drawn: the words, the logo, the window or the cards.
		const drawn = drawScene({ ...scene, stickers: [] });
		const keep = [drawn.text, drawn.logo ?? logoRect(scene), drawn.window, ...drawn.keep].filter((r): r is NonNullable<typeof r> => Boolean(r));
		const room = f.height - bandOf(scene).h;
		scene.stickers = scatter(f.width, f.height, room, keep, count, seed, names ?? subjectNames()).map((p) => ({ art: subjectArt(p.subject), x: p.x, y: p.y, size: p.size, rotate: p.rotate }));
	}
	return scene;
}
