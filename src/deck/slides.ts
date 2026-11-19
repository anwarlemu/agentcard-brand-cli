// Deck slides at the deck size (brand/assets/deck.json), each built from the image layouts so a deck reads like the
// brand's share images: the hero, the window, the numbered cards and the quote window, plus a section, a stat and an
// end card drawn with the same grounds, scanlines, band, lockup and type.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildScene, parseCards } from '../image/compose.js';
import { band, Ids, scan } from '../image/effects.js';
import { bandMixes, brandFonts, document, drawLine, drawLogo, flatten, logoBox, measure, rect, tokenColor, trackingFor, wrap } from '../image/paint.js';
import { bandOf, drawScene, groundColor, imageConfig, unitOf, windowFrame, type Scene } from '../image/scene.js';
import { brand } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { pkgPath } from '../lib/paths.js';

export type SlideType = 'cover' | 'section' | 'statement' | 'bullets' | 'stat' | 'quote' | 'image' | 'cards' | 'end';
export type Slide = { type: SlideType; [slot: string]: unknown };
type SlideSpec = { name: string; about: string; slots: string[]; needs: string[]; sample: Record<string, unknown> };
export type DeckConfig = { width: number; height: number; slides: Record<SlideType, SlideSpec> };

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
	const s = slide as Record<string, unknown>;
	const types = Object.keys(deckConfig().slides);
	if (typeof s.type !== 'string') throw new Error(`Slide ${index + 1} needs a type: ${types.join(', ')}.`);
	if (!types.includes(s.type)) throw unknownName('slide type', s.type, types);
	const spec = deckConfig().slides[s.type as SlideType];
	for (const key of Object.keys(s)) if (key !== 'type' && !spec.slots.includes(key)) throw unknownName(`${s.type} slot`, key, spec.slots);
	for (const need of spec.needs) {
		const v = s[need];
		if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) throw new Error(`Slide ${index + 1} (${s.type}) needs ${need}.`);
	}
	return s as Slide;
}

function heroScene(width: number, height: number, opts: Partial<Parameters<typeof buildScene>[0]>): Scene {
	return buildScene({ template: 'hero', width, height, ...opts });
}

function centeredLine(font: ReturnType<typeof brandFonts>['medium'], line: string, cx: number, baseline: number, size: number, tracking: number, fill: string) {
	const w = measure(font, line, size, tracking);
	return drawLine(font, line, cx - w / 2, baseline, size, tracking, w + size, fill);
}

/** A section: number and title on paper, the band into blue. */
function sectionSvg(slide: Slide, W: number, H: number) {
	const ids = new Ids('d');
	const k = unitOf(W, H);
	const cfg = imageConfig().scene;
	const { medium } = brandFonts();
	const paper = groundColor('paper');
	const b = bandOf({ band: 'blue', ground: 'paper', width: W });
	const room = H - b.h;
	const out = [rect(0, 0, W, H, paper), band(ids, W, room, b.step, H, paper, groundColor('blue'), bandMixes(), cfg.grain)];
	out.push(drawLogo('lockup', cfg.margin * k, cfg.margin * k, cfg.logo * k, tokenColor('brand')));
	const x = cfg.margin * k * 1.5;
	const maxW = W - x * 2;
	const numSize = Math.round(0.2 * H);
	const titleSize = Math.round(84 * k);
	const number = text(slide.number);
	const title = wrap(medium, text(slide.title), titleSize, trackingFor(titleSize), maxW).slice(0, 3);
	const blockH = (number ? numSize * 1.05 + titleSize * 0.4 : 0) + title.length * titleSize * 1.05;
	let y = Math.max(cfg.margin * k * 3, (room - blockH) / 2);
	if (number) {
		out.push(drawLine(medium, number, x, y + numSize * 0.86, numSize, trackingFor(numSize), maxW, tokenColor('brand')));
		y += numSize * 1.05 + titleSize * 0.4;
	}
	title.forEach((l, i) => out.push(drawLine(medium, l, x, y + titleSize * 0.86 + i * titleSize * 1.05, titleSize, trackingFor(titleSize), maxW, tokenColor('ink'))));
	return out.join('');
}

/** A stat: the number large and a line under it in white on the blue ground, the band into paper. */
function statSvg(slide: Slide, W: number, H: number) {
	const ids = new Ids('d');
	const k = unitOf(W, H);
	const cfg = imageConfig().scene;
	const { medium } = brandFonts();
	const blue = groundColor('blue');
	const b = bandOf({ band: 'paper', ground: 'blue', width: W });
	const room = H - b.h;
	const out = [rect(0, 0, W, H, blue), scan(ids, 0, 0, W, room, cfg.scan, true), band(ids, W, room, b.step, H, blue, groundColor('paper'), bandMixes(), cfg.grain)];
	out.push(drawLogo('lockup', cfg.margin * k, cfg.margin * k, cfg.logo * k, tokenColor('white')));
	const stat = text(slide.stat);
	const statSize = Math.round(0.32 * H);
	const lineSize = Math.round(40 * k);
	const lines = wrap(medium, text(slide.title), lineSize, trackingFor(lineSize), W * 0.6).slice(0, 2);
	const blockH = statSize * 0.95 + (lines.length ? lineSize * 0.6 + lines.length * lineSize * 1.15 : 0);
	let y = (room - blockH) / 2;
	out.push(centeredLine(medium, stat, W / 2, y + statSize * 0.8, statSize, trackingFor(statSize), tokenColor('white')));
	y += statSize * 0.95 + lineSize * 0.6;
	lines.forEach((l, i) => out.push(centeredLine(medium, l, W / 2, y + lineSize * 0.86 + i * lineSize * 1.15, lineSize, trackingFor(lineSize), tokenColor('white'))));
	return out.join('');
}

/** A quote: the quote large in a white window on paper, the open quote in blue, the attribution under it. */
function quoteSvg(slide: Slide, W: number, H: number) {
	const ids = new Ids('d');
	const k = unitOf(W, H);
	const cfg = imageConfig().scene;
	const { medium, regular } = brandFonts();
	const out = [rect(0, 0, W, H, groundColor('paper'))];
	out.push(drawLogo('lockup', cfg.margin * k, cfg.margin * k, cfg.logo * k, tokenColor('brand')));
	const x = cfg.margin * k * 2.4;
	const w = W - x * 2;
	const pad = 48 * k;
	const size = Math.round(44 * k);
	const bySize = Math.round(18 * k);
	const lines = wrap(medium, text(slide.quote), size, trackingFor(size), w - pad * 2).slice(0, 6);
	const by = text(slide.by);
	const markSize = Math.round(72 * k);
	const innerH = markSize * 0.7 + lines.length * size * 1.2 + (by ? bySize * 2.6 : 0);
	const h = cfg.window.bar * k + pad * 2 + innerH;
	const top = Math.max(cfg.margin * k * 2.4, (H - h) / 2);
	out.push(
		windowFrame(ids, { x, y: top, w, h }, k, 'note.quote', 'white', (inside) => {
			const parts: string[] = [];
			let y = inside.y + pad;
			parts.push(drawLine(medium, '\u201C', inside.x + pad, y + markSize * 0.75, markSize, 0, markSize * 2, tokenColor('brand')));
			y += markSize * 0.7;
			lines.forEach((l, i) => parts.push(drawLine(medium, l, inside.x + pad, y + size * 0.86 + i * size * 1.2, size, trackingFor(size), w, tokenColor('ink'))));
			y += lines.length * size * 1.2;
			if (by) parts.push(drawLine(regular, by, inside.x + pad, y + bySize * 1.9, bySize, 0, w, tokenColor('brand')));
			return parts.join('');
		}),
	);
	return out.join('');
}

/** The end card: the lockup large, a line and the address, the band into paper. */
function endSvg(slide: Slide, W: number, H: number) {
	const ids = new Ids('d');
	const k = unitOf(W, H);
	const cfg = imageConfig().scene;
	const { medium, regular } = brandFonts();
	const blue = groundColor('blue');
	const b = bandOf({ band: 'paper', ground: 'blue', width: W });
	const room = H - b.h;
	const out = [rect(0, 0, W, H, blue), scan(ids, 0, 0, W, room, cfg.scan, true), band(ids, W, room, b.step, H, blue, groundColor('paper'), bandMixes(), cfg.grain)];
	const logoH = Math.round(0.1 * H);
	const box = logoBox('lockup');
	const logoW = (logoH * box.width) / box.height;
	const title = text(slide.title);
	const url = text(slide.url) || siteHost();
	const titleSize = Math.round(40 * k);
	const urlSize = Math.round(15 * k * 1.2);
	const blockH = logoH + (title ? titleSize * 1.6 + titleSize : 0) + (url ? urlSize * 2.4 : 0);
	let y = (room - blockH) / 2;
	out.push(drawLogo('lockup', (W - logoW) / 2, y, logoH, tokenColor('white')));
	y += logoH + titleSize * 1.6;
	if (title) {
		out.push(centeredLine(medium, title, W / 2, y + titleSize * 0.86, titleSize, trackingFor(titleSize), tokenColor('white')));
		y += titleSize;
	}
	if (url) out.push(centeredLine(regular, url, W / 2, y + urlSize * 2.4, urlSize, 0, flatten(tokenColor('text-on-brand-muted'), blue)));
	return out.join('');
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

/** One slide as an SVG document. */
export function slideSvg(slide: Slide, index: number): string {
	const { width: W, height: H } = deckConfig();
	const footer = siteHost();
	const title = text(slide.title);
	const image = typeof slide.image === 'string' && slide.image.trim() ? resolve(slide.image) : undefined;
	let body: string;
	switch (slide.type) {
		case 'cover':
			body = drawScene(heroScene(W, H, { headline: title, subtext: text(slide.body), image, toon: Boolean(image), stickers: image ? 'under' : 'preset' })).svg;
			break;
		case 'statement':
			body = drawScene(heroScene(W, H, { headline: title, stickers: 'none' })).svg;
			break;
		case 'stat':
			body = statSvg(slide, W, H);
			break;
		case 'bullets':
			body = drawScene(buildScene({ template: 'cards', width: W, height: H, headline: title, cards: items(slide.items), ground: 'paper', logo: false, footer: '' })).svg;
			break;
		case 'cards':
			body = drawScene(buildScene({ template: 'cards', width: W, height: H, headline: title, cards: items(slide.items), footer })).svg;
			break;
		case 'image':
			body = drawScene(buildScene({ template: 'window', width: W, height: H, eyebrow: text(slide.eyebrow), headline: title, subtext: text(slide.body), image, picture: typeof slide.picture === 'string' ? slide.picture : undefined, window: text(slide.window) || undefined })).svg;
			break;
		case 'quote':
			body = quoteSvg(slide, W, H);
			break;
		case 'section':
			body = sectionSvg(slide, W, H);
			break;
		default:
			body = endSvg(slide, W, H);
	}
	return document(W, H, `${index + 1}. ${deckConfig().slides[slide.type].name}${title ? `: ${title}` : ''}`, body);
}

export function sampleDeck(): Slide[] {
	return (Object.entries(deckConfig().slides) as [SlideType, SlideSpec][]).map(([type, spec]) => ({ type, ...spec.sample }));
}
