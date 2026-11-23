// Deck slides at the deck size (brand/assets/deck.json), each built from the image layouts so a deck reads like the
// brand's share images: the hero, the window, the numbered cards and the quote window, plus a section, a stat and an
// end card drawn with the same grounds, scanlines, band, lockup and type. Copy is fitted, never cut.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { DrawnLayer } from '../design/types.js';
import { buildScene, parseCards, type SceneFields } from '../image/compose.js';
import { stageFor, type SceneGround } from '../image/config.js';
import { band, Ids, scan } from '../image/effects.js';
import { bandMixes, brandFonts, document, drawable, flatten, rect, tokenColor } from '../image/paint.js';
import { bandOf, drawLogoAt, drawScene, groundColor, imageConfig, logoAt } from '../image/scene.js';
import { bottom } from '../image/space.js';
import { drawBlock, fitBlock, groundColors, isDark, Layers, type Edits } from '../image/words.js';
import { brand } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { pkgPath } from '../lib/paths.js';

export type SlideType = 'cover' | 'section' | 'statement' | 'bullets' | 'stat' | 'quote' | 'image' | 'cards' | 'end';
export type Slide = { type: SlideType; [slot: string]: unknown };
type SlideSpec = { name: string; about: string; slots: string[]; needs: string[]; sample: Record<string, unknown> };
export type DeckConfig = { width: number; height: number; slides: Record<SlideType, SlideSpec>; themes: Record<SlideType, SceneGround[]>; aliases: Record<string, string> };

let deckCfg: DeckConfig | undefined;
export function deckConfig(): DeckConfig {
	deckCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'deck.json'), 'utf8')) as DeckConfig;
	return deckCfg;
}

export function siteHost() {
	try {
		return brand().site ? new URL(brand().site!).host.replace(/^www\./, '') : '';
	} catch {
		return '';
	}
}

const text = (v: unknown) => (typeof v === 'string' ? v.replace(/\\n/g, '\n').trim() : '');

/** Checks a slide against its type's slots: unknown types and slots exit with the nearest names. */
export function checkSlide(slide: unknown, index: number): Slide {
	if (!slide || typeof slide !== 'object' || Array.isArray(slide)) throw new Error(`Slide ${index + 1} must be an object with a type.`);
	const cfg = deckConfig();
	const s = slide as Record<string, unknown>;
	const types = Object.keys(cfg.slides);
	if (typeof s.type !== 'string') throw new Error(`Slide ${index + 1} needs a type: ${types.join(', ')}.`);
	if (!types.includes(s.type)) throw unknownName('slide type', s.type, types);
	const type = s.type as SlideType;
	const spec = cfg.slides[type];
	const out: Slide = { type };
	for (const [raw, value] of Object.entries(s)) {
		if (raw === 'type') continue;
		const key = cfg.aliases[raw] && spec.slots.includes(cfg.aliases[raw]!) ? cfg.aliases[raw]! : raw;
		if (!spec.slots.includes(key)) throw unknownName(`${type} slot`, raw, [...spec.slots, ...Object.entries(cfg.aliases).filter(([, v]) => spec.slots.includes(v)).map(([k]) => k)]);
		if (key in out) throw new Error(`Slide ${index + 1} (${type}): ${raw} and ${key} are the same slot. Pass one of them.`);
		if (key === 'items' ? !Array.isArray(value) && typeof value !== 'string' : typeof value !== 'string') throw new Error(`Slide ${index + 1} (${type}): ${raw} must be ${key === 'items' ? 'a list or text' : 'text'}.`);
		out[key] = value;
	}
	if (out.theme !== undefined && !cfg.themes[type].includes(out.theme as SceneGround)) throw unknownName(`theme for ${type}`, String(out.theme), cfg.themes[type]);
	for (const need of spec.needs) {
		const v = out[need];
		if (v === undefined || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)) throw new Error(`Slide ${index + 1} (${type}) needs ${need}.`);
	}
	return out;
}

type Frame = { W: number; H: number; ground: SceneGround; layers: Layers; out: string[]; room: number; k: number; small: number; frame: { x: number; y: number; w: number; h: number }; scan: boolean };

/** The ground, its scanlines and the stepped band, and the room above the band. */
function slideFrame(slide: Slide, W: number, H: number, scanned: boolean): Frame {
	const ids = new Ids('d');
	const stage = stageFor(W, H);
	const cfg = imageConfig();
	const ground = (slide.theme as SceneGround | undefined) ?? deckConfig().themes[slide.type][0]!;
	const to = cfg.bandContrast[ground];
	const b = bandOf({ band: to, ground, width: W });
	const room = H - b.h;
	const on = scanned && ground === 'blue';
	const out = [rect(0, 0, W, H, groundColor(ground))];
	if (on) out.push(scan(ids, 0, 0, W, room, cfg.scene.scan, true));
	out.push(band(ids, W, room, b.step, H, groundColor(ground), groundColor(to), bandMixes(), cfg.scene.grain));
	const layers = new Layers();
	layers.add({ id: 'band', kind: 'panel', box: { x: 0, y: room, w: W, h: b.h }, bleeds: true, can: {} });
	const frame = { ...stage.frame, h: room - cfg.scene.margin * stage.k * 0.6 - stage.frame.y };
	return { W, H, ground, layers, out, room, k: stage.k, small: stage.small, frame, scan: on };
}

const strong = (g: SceneGround) => (isDark(g) ? tokenColor('white') : tokenColor('ink'));
const accent = (g: SceneGround) => (isDark(g) ? tokenColor('white') : tokenColor('brand'));
const CAN = { move: true, scale: [0.5, 1.5] as [number, number] };
const shift = (edits: Edits, id: string, W: number, H: number) => ({ dx: (edits[id]?.dx ?? 0) * W, dy: (edits[id]?.dy ?? 0) * H });

/** A section: number and title on paper, the band into blue. */
function section(slide: Slide, W: number, H: number, edits: Edits) {
	const f = slideFrame(slide, W, H, false);
	const { medium } = brandFonts();
	const logo = logoAt({ logo: true, edits, width: W, height: H }, stageFor(W, H), f.frame, f.ground, { anchors: ['top-left', 'top', 'top-right'] });
	if (logo) f.out.push(drawLogoAt(logo, f.layers));
	const x = f.frame.x * 1.5;
	const maxW = W - x * 2;
	const top = logo ? bottom(logo.rect) + logo.clear * 2 : f.frame.y;
	const number = text(slide.number);
	const numSize = number && !edits.number?.hidden ? Math.round(0.2 * H) * (edits.number?.scale ?? 1) : 0;
	const num = numSize ? fitBlock(medium, number, { what: 'number', w: maxW, h: H * 0.34, size: numSize, floor: 60 * f.k, leading: 1.05, maxLines: 1, k: f.k }) : null;
	const gap = num ? 34 * f.k : 0;
	const title = fitBlock(medium, text(slide.headline), { what: 'headline', w: maxW, h: bottom(f.frame) - top - (num?.h ?? 0) - gap, size: 84 * f.k * (edits.headline?.scale ?? 1), floor: 30 * f.k, leading: 1.05, maxLines: 5, k: f.k });
	let y = Math.max(top, (f.room - (num?.h ?? 0) - gap - title.h) / 2);
	if (num) {
		const s = shift(edits, 'number', W, H);
		f.out.push(drawBlock(f.layers, 'number', medium, num, x + s.dx, y + s.dy, 'left', accent(f.ground), groundColors(f.ground), number, { ...CAN, hide: true }));
		y += num.h + gap;
	}
	const s = shift(edits, 'headline', W, H);
	f.out.push(drawBlock(f.layers, 'headline', medium, title, x + s.dx, y + s.dy, 'left', strong(f.ground), groundColors(f.ground), text(slide.headline), CAN));
	return f;
}

/** A stat: the number large and a line under it in white on the blue ground, the band into paper. */
function stat(slide: Slide, W: number, H: number, edits: Edits) {
	const f = slideFrame(slide, W, H, true);
	const { medium } = brandFonts();
	const logo = logoAt({ logo: true, edits, width: W, height: H }, stageFor(W, H), f.frame, f.ground, { anchors: ['top-left', 'top', 'top-right'] });
	if (logo) f.out.push(drawLogoAt(logo, f.layers));
	const top = logo ? bottom(logo.rect) + logo.clear * 2 : f.frame.y;
	const number = fitBlock(medium, text(slide.stat), { what: 'stat', w: f.frame.w, h: H * 0.46, size: 0.32 * H * (edits.stat?.scale ?? 1), floor: 60 * f.k, leading: 0.98, maxLines: 1, k: f.k });
	const headline = text(slide.headline);
	const line = headline ? fitBlock(medium, headline, { what: 'headline', w: W * 0.68, h: bottom(f.frame) - top - number.h - 24 * f.k, size: 40 * f.k * (edits.headline?.scale ?? 1), floor: f.small, leading: 1.15, maxLines: 4, k: f.k }) : null;
	let y = Math.max(top, (f.room - number.h - (line ? line.h + 24 * f.k : 0)) / 2);
	const a = shift(edits, 'stat', W, H);
	f.out.push(drawBlock(f.layers, 'stat', medium, number, W / 2 + a.dx, y + a.dy, 'center', strong(f.ground), groundColors(f.ground, f.scan), text(slide.stat), CAN));
	y += number.h + 24 * f.k;
	const b = shift(edits, 'headline', W, H);
	if (line) f.out.push(drawBlock(f.layers, 'headline', medium, line, W / 2 + b.dx, y + b.dy, 'center', strong(f.ground), groundColors(f.ground, f.scan), headline, CAN));
	return f;
}

/** The end card: the lockup large, a line and the address, the band into paper. */
function end(slide: Slide, W: number, H: number, edits: Edits) {
	const f = slideFrame(slide, W, H, true);
	const { medium, regular } = brandFonts();
	const stage = stageFor(W, H);
	const logo = logoAt({ logo: true, edits: { logo: { ...edits.logo, dx: 0, dy: 0 } }, width: W, height: H }, stage, f.frame, f.ground, { anchor: 'top', anchors: [], h: 0.1 * H, scale: [0.4, 1.6] });
	const headline = text(slide.headline);
	const url = edits.url?.hidden ? '' : text(slide.url) || siteHost();
	const title = headline ? fitBlock(medium, headline, { what: 'headline', w: W * 0.72, h: H * 0.3, size: 40 * f.k * (edits.headline?.scale ?? 1), floor: f.small, leading: 1.15, maxLines: 4, k: f.k }) : null;
	const address = url ? fitBlock(regular, drawable(url, 'url'), { what: 'url', w: f.frame.w, h: H * 0.1, size: 22 * f.k, floor: f.small, leading: 1.2, maxLines: 1, k: f.k }) : null;
	const logoH = logo?.rect.h ?? 0;
	const gaps = [logo && (title || address) ? 64 * f.k : 0, title && address ? 36 * f.k : 0];
	let y = (f.room - logoH - gaps[0]! - (title?.h ?? 0) - gaps[1]! - (address?.h ?? 0)) / 2;
	if (logo) {
		const s = shift(edits, 'logo', W, H);
		logo.rect.x = (W - logo.rect.w) / 2 + s.dx;
		logo.rect.y = y + s.dy;
		f.out.push(drawLogoAt(logo, f.layers));
		y += logoH + gaps[0]!;
	}
	if (title) {
		const s = shift(edits, 'headline', W, H);
		f.out.push(drawBlock(f.layers, 'headline', medium, title, W / 2 + s.dx, y + s.dy, 'center', strong(f.ground), groundColors(f.ground, f.scan), headline, CAN));
		y += title.h + gaps[1]!;
	}
	if (address) f.out.push(drawBlock(f.layers, 'url', regular, address, W / 2, y, 'center', isDark(f.ground) ? flatten(tokenColor('text-on-brand-muted'), groundColor(f.ground)) : tokenColor('text-secondary'), groundColors(f.ground), text(slide.url) || siteHost(), { hide: true }));
	return f;
}

/** Items as cards: a string's first line is its heading, the rest its line; objects pass through. */
function items(v: unknown) {
	if (!Array.isArray(v)) return parseCards(v);
	return parseCards(
		v.map((x) => {
			if (typeof x !== 'string') return x;
			const [head, ...rest] = x.replace(/\\n/g, '\n').split('\n');
			return { title: head!.trim(), body: rest.join(' ').trim() };
		}),
	);
}


/** The scene a slide is built from, for the types that are one of the image layouts. */
function sceneFields(slide: Slide, W: number, H: number, edits: Edits): SceneFields | null {
	const image = text(slide.image) ? resolve(text(slide.image)) : undefined;
	const base = { width: W, height: H, edits, headline: text(slide.headline), body: text(slide.body), badge: text(slide.badge), button: text(slide.button), ...(slide.theme ? { ground: slide.theme as SceneGround } : {}) };
	switch (slide.type) {
		case 'cover':
			return { template: 'hero', ...base, image, toon: Boolean(image), stickers: image ? 'under' : 'preset' };
		case 'statement':
			return { template: 'hero', ...base, stickers: 'none' };
		case 'bullets':
			return { template: 'cards', ...base, cards: items(slide.items), ground: (slide.theme as SceneGround | undefined) ?? 'paper', logo: false };
		case 'cards':
			return { template: 'cards', ...base, cards: items(slide.items), footer: siteHost(), footerOptional: true };
		case 'image':
			return { template: 'window', ...base, image, picture: text(slide.picture) || undefined, window: text(slide.window) || undefined };
		case 'quote':
			return { template: 'quote', ...base, quote: text(slide.quote), by: text(slide.by), band: 'none' };
		default:
			return null;
	}
}

export type DrawnSlide = { svg: string; layers: DrawnLayer[]; notes: string[] };

/** One slide as an SVG document, with what was drawn. */
export function drawSlide(slide: Slide, index: number, edits: Edits = {}): DrawnSlide {
	const { width: W, height: H } = deckConfig();
	try {
		const fields = sceneFields(slide, W, H, edits);
		const title = text(slide.headline);
		const doc = (body: string) => document(W, H, `${index + 1}. ${deckConfig().slides[slide.type].name}${title ? `: ${title}` : ''}`, body);
		if (fields) {
			const drawn = drawScene(buildScene(fields));
			return { svg: doc(drawn.svg), layers: drawn.layers, notes: drawn.notes };
		}
		const f = slide.type === 'section' ? section(slide, W, H, edits) : slide.type === 'stat' ? stat(slide, W, H, edits) : end(slide, W, H, edits);
		return { svg: doc(f.out.join('')), layers: f.layers.list, notes: [] };
	} catch (error) {
		throw new Error(`Slide ${index + 1} (${slide.type}): ${(error as Error).message}`);
	}
}

export const slideSvg = (slide: Slide, index: number): string => drawSlide(slide, index).svg;

export function sampleDeck(): Slide[] {
	return (Object.entries(deckConfig().slides) as [SlideType, SlideSpec][]).map(([type, spec]) => ({ type, ...spec.sample }));
}
