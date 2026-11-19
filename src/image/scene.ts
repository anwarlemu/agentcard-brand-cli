// The image editor's three layouts (hero, window, cards) as SVG: the ground with its scanlines, the stepped band, the
// lockup, the words in the order the brand stacks them (label, heading, a line, the key), the brand's toon objects, the
// sky-barred window and the numbered cards. Geometry comes from brand/assets/image.json, values from the tokens.
// Motion (for video) is an optional set of per-part offsets and opacities; a still passes none.

import { readFileSync } from 'node:fs';
import type { Font } from 'opentype.js';
import { dataUri, readPicture, type Picture } from '../assets/picture.js';
import type { Pixels } from '../assets/png.js';
import { tokens } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { band, boxShadow, Ids, num, placed, radiusPx, rgbaOf, scan, shadowToken, type GrainSpec, type ScanSpec } from './effects.js';
import { bandMixes, brandFonts, document, drawLine, drawLogo, flatten, logoBox, measure, rect, tokenColor, trackingEm, trackingFor, wrap } from './paint.js';

export type SceneGround = 'blue' | 'paper' | 'white' | 'ink';
export type SceneTemplate = 'hero' | 'window' | 'cards';
export type WindowBody = 'blue' | 'sky' | 'white';
export type Rect = { x: number; y: number; w: number; h: number };

type Fraction = number | { wide: number; tall: number };

export type ImageConfig = {
	unit: { width: number; height: number };
	sizes: Record<string, { width: number; height: number; label: string; use: string; aliases?: string[] }>;
	grounds: Record<SceneGround, { token: string; dark: boolean }>;
	scene: {
		margin: number;
		logo: number;
		wideRatio: number;
		eyebrow: { size: number; gap: number; tracking: string; caps: boolean };
		headline: { leading: string; gap: number; maxLines: number; min: number };
		body: { min: number; ratio: number; width: number; gap: number; leading: string };
		key: { height: number; size: number; padX: number; radius: string; onBlue: string; onLight: string };
		band: { step: number; minStep: number; steps: number };
		scan: ScanSpec & { line: string };
		grain: GrainSpec;
		window: { radius: string; bar: number; name: number; inset: number; pictureFit: number; shadow: string; rule: string; edge: string; arrowAlpha: number };
	};
	templates: Record<SceneTemplate, { label: string; ground: SceneGround; scan: boolean; band: SceneGround | 'none'; textSize: Fraction; textWidth?: Fraction; textX?: number; textY?: number; stickers?: string; window?: string; windowBody?: WindowBody; picture?: string; cards?: { pad: number; badge: number; heading: number; body: number; gapX: number; gapY: number; radius: string; shadow: string; edge: string; footer: number; titleLeading: number; maxCards: number } }>;
	stickers: {
		preset: { subject: string; x: number; y: number; size: number; rotate: number }[];
		under: { subject: string; textY: number; rotate: number; maxSize: number };
		scatter: { count: number; max: number; seed: number; minSize: number; spread: number; tilt: number; gap: number };
	};
	notes: string[];
	source: string;
};

export type IllustrateConfig = {
	subjects: Record<string, { file: string; label: string; source: string }>;
	compositions: Record<string, string>;
	sizes: Record<string, { width: number; height: number }>;
	grounds: string[];
	defaults: { composition: string; size: string; ground: string; scan: boolean; rotate: number };
	source: string;
};

let imageCfg: ImageConfig | undefined;
export function imageConfig(): ImageConfig {
	imageCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'image.json'), 'utf8')) as ImageConfig;
	return imageCfg;
}

let illustrateCfg: IllustrateConfig | undefined;
export function illustrateConfig(): IllustrateConfig {
	illustrateCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'illustrate.json'), 'utf8')) as IllustrateConfig;
	return illustrateCfg;
}

export type Art = { href: string; width: number; height: number; pixels: Pixels; name: string };
const artCache = new Map<string, Art>();

/** One of the brand's toon objects by subject name. */
export function subjectArt(subject: string): Art {
	const hit = artCache.get(subject);
	if (hit) return hit;
	const entry = illustrateConfig().subjects[subject];
	if (!entry) throw new Error(`Unknown subject "${subject}".`);
	const pic = readPicture(pkgPath(entry.file), 'object');
	const art = { href: dataUri(pic), width: pic.width, height: pic.height, pixels: pic, name: subject };
	artCache.set(subject, art);
	return art;
}

/** A user's picture (or a toon made from it) as art. */
export function pictureArt(pic: Picture | Pixels, name: string): Art {
	return { href: dataUri(pic), width: pic.width, height: pic.height, pixels: pic, name };
}

export type Sticker = { art: Art; x: number; y: number; size: number; rotate: number };
export type Card = { title: string; body: string };

/** Per-part motion for a video frame. Every field is optional; a still image passes none. */
export type Motion = {
	words?: { opacity: number; dy: number }[];
	stickers?: { opacity: number; dx: number; dy: number; dr: number; scale: number }[];
	window?: { opacity: number; dy: number };
	cards?: { opacity: number; dy: number }[];
	logo?: { opacity: number };
	grain?: [number, number];
};

export type Scene = {
	template: SceneTemplate;
	width: number;
	height: number;
	ground: SceneGround;
	scan: boolean;
	band: SceneGround | 'none';
	logo: boolean;
	eyebrow: string;
	headline: string;
	body: string;
	button: string;
	textSize: number;
	textWidth: number;
	textX: number;
	textY: number;
	window: string;
	windowBody: WindowBody;
	picture: Art | null;
	stickers: Sticker[];
	cards: Card[];
	footer: string;
	title?: string;
};

export const unitOf = (w: number, h: number) => {
	const u = imageConfig().unit;
	return Math.sqrt((w * h) / (u.width * u.height));
};
export const isWide = (w: number, h: number) => w / h >= imageConfig().scene.wideRatio;
const pick = (f: Fraction | undefined, wide: boolean, fallback: number) => (f === undefined ? fallback : typeof f === 'number' ? f : wide ? f.wide : f.tall);

export function groundColor(g: SceneGround) {
	return tokenColor(imageConfig().grounds[g].token);
}
const isDark = (g: SceneGround) => imageConfig().grounds[g].dark;

/** Text sizes and widths for a template at a size, as the editor sets them when the size changes. */
export function layoutFor(template: SceneTemplate, w: number, h: number) {
	const t = imageConfig().templates[template];
	const k = unitOf(w, h);
	const wide = isWide(w, h);
	return { textSize: Math.round(pick(t.textSize, wide, 54) * k), textWidth: pick(t.textWidth, wide, 0.86), textX: t.textX ?? 0.5, textY: t.textY ?? 0.5 };
}

/** The band at the bottom: step and height, when it leads to a different ground. */
export function bandOf(s: Pick<Scene, 'band' | 'ground' | 'width'>) {
	const b = imageConfig().scene.band;
	if (s.band === 'none' || s.band === s.ground) return { step: 0, h: 0 };
	const step = Math.max(b.minStep, (b.step * s.width) / imageConfig().unit.width);
	return { step, h: step * b.steps };
}

// Type ------------------------------------------------------------------------------------------------------------

const tokenNumber = (name: string) => {
	const raw = tokens().site[name];
	if (!raw) throw new Error(`Missing brand token ${name}.`);
	return Number.parseFloat(raw);
};

type Words = { S: number; eye: number; bodyS: number; head: string[]; body: string[]; eyeText: string; h: number; w: number; headW: number[]; bodyW: number[]; eyeW: number; leading: number; bodyLeading: number; track: number; parts: number };

function measureWords(s: Scene, max: number, k: number, S: number): Words {
	const cfg = imageConfig().scene;
	const { medium, regular } = brandFonts();
	const track = trackingFor(S);
	const leading = tokenNumber(cfg.headline.leading);
	const bodyLeading = tokenNumber(cfg.body.leading);
	const eye = cfg.eyebrow.size * k;
	const bodyS = Math.max(cfg.body.min * k, S * cfg.body.ratio);
	const head = s.headline.trim() ? wrap(medium, s.headline.trim(), S, track, max) : [];
	const body = s.body.trim() ? wrap(regular, s.body.trim(), bodyS, 0, max * cfg.body.width) : [];
	const eyeText = cfg.eyebrow.caps ? s.eyebrow.trim().toUpperCase() : s.eyebrow.trim();
	const eyeTrack = trackingEm(cfg.eyebrow.tracking);
	const eyeW = eyeText ? measure(medium, eyeText, eye, eyeTrack) : 0;
	const headW = head.map((l) => measure(medium, l, S, track));
	const bodyW = body.map((l) => measure(regular, l, bodyS, 0));
	const parts: { h: number; gap: number }[] = [];
	if (eyeW) parts.push({ h: eye * 1.2, gap: cfg.eyebrow.gap * k });
	if (head.length) parts.push({ h: head.length * S * leading, gap: S * cfg.headline.gap });
	if (body.length) parts.push({ h: body.length * bodyS * bodyLeading, gap: cfg.body.gap * k });
	if (s.button.trim()) parts.push({ h: cfg.key.height * k, gap: 0 });
	const h = parts.reduce((n, p, i) => n + p.h + (i < parts.length - 1 ? p.gap : 0), 0);
	const keyW = s.button.trim() ? measure(medium, s.button.trim(), cfg.key.size * k, 0) + cfg.key.padX * 2 * k : 0;
	const w = Math.max(1, eyeW, keyW, ...headW, ...bodyW);
	return { S, eye, bodyS, head, body, eyeText, h, w, headW, bodyW, eyeW, leading, bodyLeading, track, parts: parts.length };
}

/** The words at the editor's size, shrunk only when they would run past `maxH` or past the line limit. */
function fitWords(s: Scene, max: number, maxH: number, k: number): Words {
	const cfg = imageConfig().scene.headline;
	let S = s.textSize;
	const min = cfg.min * k;
	for (;;) {
		const m = measureWords(s, max, k, S);
		const ok = m.head.length <= cfg.maxLines && m.h <= maxH + 0.5;
		if (ok) return m;
		if (S <= min) throw new Error('The words do not fit this size. Shorten the headline or the line under it.');
		S = Math.max(min, S * 0.94);
	}
}

function lineAt(font: Font, text: string, x: number, baseline: number, size: number, tracking: number, align: 'left' | 'center', fill: string, opacity = 1) {
	const w = measure(font, text, size, tracking);
	const left = align === 'center' ? x - w / 2 : x;
	const svg = drawLine(font, text, left, baseline, size, tracking, w + size, fill);
	return opacity < 1 ? `<g opacity="${num(opacity)}">${svg}</g>` : svg;
}

function drawKey(ids: Ids, label: string, x: number, y: number, k: number, onBlue: boolean, align: 'left' | 'center') {
	const cfg = imageConfig().scene.key;
	const { medium } = brandFonts();
	const fs = cfg.size * k;
	const h = cfg.height * k;
	const w = measure(medium, label, fs, 0) + cfg.padX * 2 * k;
	const left = align === 'center' ? x - w / 2 : x;
	const r = radiusPx(cfg.radius, k);
	const face = onBlue ? tokenColor('white') : tokenColor('brand');
	const ink = onBlue ? tokenColor('brand') : tokenColor('white');
	const sh = boxShadow(ids, left, y, w, h, r, shadowToken(onBlue ? cfg.onBlue : cfg.onLight), k);
	return `<defs>${sh.defs}</defs>${sh.under}${rect(left, y, w, h, face, r)}${sh.over}${lineAt(medium, label, left + w / 2, y + h / 2 + fs * 0.35, fs, 0, 'center', ink)}`;
}

/** The words in the brand's order, from `top`, centered on x or starting at x. Each part can carry its own motion. */
function drawWords(ids: Ids, s: Scene, m: Words, x: number, top: number, align: 'left' | 'center', k: number, motion?: Motion['words']) {
	const cfg = imageConfig().scene;
	const { medium, regular } = brandFonts();
	const dark = isDark(s.ground);
	const ground = groundColor(s.ground);
	const out: string[] = [];
	let y = top;
	let part = 0;
	const wrapPart = (svg: string) => {
		const mo = motion?.[part];
		part += 1;
		if (!mo) return svg;
		return `<g opacity="${num(mo.opacity)}" transform="translate(0 ${num(mo.dy)})">${svg}</g>`;
	};
	if (m.eyeText) {
		const color = dark ? tokenColor('text-on-brand-label') : tokenColor('text-label');
		out.push(wrapPart(lineAt(medium, m.eyeText, x, y + m.eye * 0.95, m.eye, trackingEm(cfg.eyebrow.tracking), align, color)));
		y += m.eye * 1.2 + cfg.eyebrow.gap * k;
	}
	if (m.head.length) {
		const color = dark ? tokenColor('white') : tokenColor('ink');
		out.push(wrapPart(m.head.map((l, i) => lineAt(medium, l, x, y + m.S * 0.86 + i * m.S * m.leading, m.S, m.track, align, color)).join('')));
		y += m.head.length * m.S * m.leading + m.S * cfg.headline.gap;
	}
	if (m.body.length) {
		const color = dark ? flatten(tokenColor('text-on-brand-muted'), ground) : tokenColor('text-muted');
		out.push(wrapPart(m.body.map((l, i) => lineAt(regular, l, x, y + m.bodyS * 1.05 + i * m.bodyS * m.bodyLeading, m.bodyS, 0, align, color)).join('')));
		y += m.body.length * m.bodyS * m.bodyLeading + cfg.body.gap * k;
	}
	if (s.button.trim()) out.push(wrapPart(drawKey(ids, s.button.trim(), x, y, k, s.ground === 'blue', align)));
	return out.join('');
}

// Pieces ------------------------------------------------------------------------------------------------------------

function logoAt(x: number, y: number, h: number, ground: SceneGround, opacity = 1) {
	const svg = drawLogo('lockup', x, y, h, isDark(ground) ? tokenColor('white') : tokenColor('brand'));
	const box = logoBox('lockup');
	return { svg: opacity < 1 ? `<g opacity="${num(opacity)}">${svg}</g>` : svg, rect: { x, y, w: (h * box.width) / box.height, h } };
}

function stickerRects(s: Scene): Rect[] {
	const short = Math.min(s.width, s.height);
	return s.stickers.map((st) => {
		const w = st.size * short;
		const h = (w * st.art.height) / st.art.width;
		return { x: st.x * s.width - w / 2, y: st.y * s.height - h / 2, w, h };
	});
}

function drawStickers(s: Scene, motion?: Motion['stickers']) {
	const short = Math.min(s.width, s.height);
	return s.stickers
		.map((st, i) => {
			const mo = motion?.[i];
			const w = st.size * short * (mo?.scale ?? 1);
			const h = (w * st.art.height) / st.art.width;
			return placed(st.art.href, st.x * s.width + (mo?.dx ?? 0), st.y * s.height + (mo?.dy ?? 0), w, h, st.rotate + (mo?.dr ?? 0), mo?.opacity ?? 1);
		})
		.join('');
}

function windowMark(right: number, cy: number, fs: number, color: string) {
	const { medium } = brandFonts();
	const bw = measure(medium, ']', fs, 0);
	const a = fs * 0.8;
	const ax = right - bw - fs * 0.08 - a;
	const close = drawLine(medium, ']', right - bw, cy + fs * 0.35, fs, 0, bw + fs, color);
	const open = drawLine(medium, '[', ax - fs * 0.08 - measure(medium, '[', fs, 0), cy + fs * 0.35, fs, 0, fs * 2, color);
	const star = `<g transform="translate(${num(ax)} ${num(cy - a / 2)}) scale(${num(a / 12)})" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="square"><path d="M6 .5v11M1.24 3.25l9.52 5.5M1.24 8.75l9.52-5.5"/></g>`;
	return open + star + close;
}

/** The window: a sky bar with blue marks over a body with the card corner, lifted by the plan window's hard shadow. */
/** A window frame with any inside: the same bar, corner, shadow and edge. */
export function windowFrame(ids: Ids, r: Rect, k: number, name: string, body: WindowBody, inner: (inside: Rect) => string) {
	return drawWindow(ids, { windowBody: body, picture: null, window: name } as Scene, r, k, inner);
}

function drawWindow(ids: Ids, s: Pick<Scene, 'windowBody' | 'picture' | 'window'>, r: Rect, k: number, inner?: (inside: Rect) => string) {
	const cfg = imageConfig().scene;
	const wc = cfg.window;
	const { medium } = brandFonts();
	const rad = radiusPx(wc.radius, k);
	const bar = wc.bar * k;
	const sh = boxShadow(ids, r.x, r.y, r.w, r.h, rad, shadowToken(wc.shadow).filter((x) => !x.inset), k);
	const clip = ids.next('c');
	const inside: Rect = { x: r.x, y: r.y + bar, w: r.w, h: r.h - bar };
	const body = s.windowBody === 'blue' ? tokenColor('brand') : s.windowBody === 'sky' ? tokenColor('sky') : tokenColor('white');
	const parts: string[] = [`<defs>${sh.defs}<clipPath id="${clip}">${rect(r.x, r.y, r.w, r.h, '#fff', rad)}</clipPath></defs>`, sh.under, `<g clip-path="url(#${clip})">`, rect(inside.x, inside.y, inside.w, inside.h, body)];
	if (s.windowBody === 'blue') parts.push(scan(ids, inside.x, inside.y, inside.w, inside.h, cfg.scan, false));
	if (s.picture) {
		const pic = s.picture;
		const sc = Math.min((inside.w * wc.pictureFit) / pic.width, (inside.h * wc.pictureFit) / pic.height);
		const w = pic.width * sc;
		const h = pic.height * sc;
		parts.push(placed(pic.href, inside.x + inside.w / 2, inside.y + inside.h / 2, w, h, 0));
	}
	if (inner) parts.push(inner(inside));
	const fs = wc.name * k;
	const cy = r.y + bar / 2;
	const mark = tokenColor('window-bar-fg');
	parts.push(rect(r.x, r.y, r.w, bar, tokenColor('window-bar')));
	parts.push(rect(r.x, r.y + bar - k, r.w, k, rgbaOf(tokenColor(wc.rule))));
	parts.push(lineAt(medium, '↳', r.x + wc.inset * k, cy + fs * 0.35, fs, 0, 'left', mark, wc.arrowAlpha));
	parts.push(lineAt(medium, s.window, r.x + r.w / 2, cy + fs * 0.35, fs, 0, 'center', mark));
	parts.push(windowMark(r.x + r.w - wc.inset * k, cy, fs, mark));
	parts.push('</g>');
	parts.push(`<rect x="${num(r.x + 0.5 * k)}" y="${num(r.y + 0.5 * k)}" width="${num(r.w - k)}" height="${num(r.h - k)}" rx="${num(rad)}" fill="none" stroke="${rgbaOf(tokenColor(wc.edge))}" stroke-width="${num(k)}"/>`);
	return parts.join('');
}

// Cards -------------------------------------------------------------------------------------------------------------

type CardsLayout = { title: { lines: string[]; size: number; y: number; rect: Rect; w: number }; cards: { rect: Rect; n: number; heading: string[]; body: string[] }[]; s: number; footer: Rect; k: number; keep: Rect[] };

function layoutCards(sc: Scene, W: number, H: number, k: number): CardsLayout {
	const spec = imageConfig().templates.cards.cards!;
	const { medium, regular } = brandFonts();
	const mx = Math.max(W * 0.071, 32 * k);
	const top = H * 0.07;
	let size = sc.textSize;
	let lines: string[] = [];
	for (let i = 0; i < 12; i++) {
		lines = sc.headline.trim() ? wrap(medium, sc.headline.trim(), size, trackingFor(size), W - mx * 2) : [];
		if (lines.length <= 3) break;
		size *= 0.9;
	}
	const titleW = Math.max(0, ...lines.map((l) => measure(medium, l, size, trackingFor(size))));
	const titleH = lines.length * size * spec.titleLeading;
	const footerH = sc.logo || sc.footer.trim() ? 30 * k : 0;
	const footer = { x: mx, y: H - H * 0.055 - footerH, w: W - mx * 2, h: footerH };
	const areaTop = top + titleH + (titleH ? H * 0.065 : 0);
	const areaBottom = footerH ? footer.y - H * 0.065 : H - H * 0.07;
	const list = sc.cards;
	const n = list.length;
	const cols = n <= 1 ? 1 : W / H < 0.65 ? 1 : 2;
	const rows = Math.max(1, Math.ceil(n / cols));
	const gapX = spec.gapX * k;
	const gapY = spec.gapY * k;
	const cw = (W - mx * 2 - gapX * (cols - 1)) / cols;
	const ch = Math.max(40 * k, (areaBottom - areaTop - gapY * (rows - 1)) / rows);
	const bodyLeading = tokenNumber(imageConfig().scene.body.leading);
	let s = 1;
	let tallest = 0;
	let cards: CardsLayout['cards'] = [];
	for (let attempt = 0; attempt < 14; attempt++) {
		const pad = spec.pad * k * s;
		const badge = spec.badge * k * s;
		const hs = spec.heading * k * s;
		const bs = spec.body * k * s;
		tallest = 0;
		cards = list.map((card, i) => {
			const r = Math.floor(i / cols);
			const inRow = Math.min(cols, n - r * cols);
			const rowW = inRow * cw + (inRow - 1) * gapX;
			const x = (W - rowW) / 2 + (i % cols) * (cw + gapX);
			const y = areaTop + r * (ch + gapY);
			const heading = wrap(medium, card.title, hs, trackingFor(hs), cw - pad * 2 - badge * 2 - 14 * k * s);
			const body = card.body ? wrap(regular, card.body, bs, 0, cw - pad * 2) : [];
			const need = pad * 2 + Math.max(badge * 2, heading.length * hs * 1.2) + (body.length ? 14 * k * s + body.length * bs * bodyLeading : 0);
			tallest = Math.max(tallest, need);
			return { rect: { x, y, w: cw, h: ch }, n: i + 1, heading, body };
		});
		if (tallest <= ch || s < 0.45) break;
		s *= Math.max(0.8, Math.min(0.97, ch / tallest));
	}
	if (tallest > ch + 0.5) throw new Error('The cards do not fit this size. Use fewer cards or shorter lines.');
	if (spec.body * k * s < 8) throw new Error('The cards would be too small to read at this size. Use fewer cards, shorter lines or a taller size.');
	// Cards no taller than their words need, with the grid centered in the room, so tall posts do not get long empty cards.
	const need = Math.min(ch, tallest * 1.18);
	const lift = ((ch - need) * rows) / 2;
	cards = cards.map((cd, i) => ({ ...cd, rect: { ...cd.rect, y: areaTop + lift + Math.floor(i / cols) * (need + gapY), h: need } }));
	const keep: Rect[] = [{ x: W / 2 - titleW / 2, y: top, w: titleW, h: titleH }, ...cards.map((c) => c.rect)];
	if (footerH) keep.push(footer);
	return { title: { lines, size, y: top, rect: { x: mx, y: top, w: W - mx * 2, h: titleH }, w: titleW }, cards, s, footer, k, keep };
}

function drawCards(ids: Ids, sc: Scene, L: CardsLayout, motion?: Motion) {
	const spec = imageConfig().templates.cards.cards!;
	const { medium, regular } = brandFonts();
	const { k, s } = L;
	const dark = isDark(sc.ground);
	const out: string[] = [];
	const titleColor = dark ? tokenColor('white') : tokenColor('ink');
	const tw = motion?.words?.[0];
	const title = L.title.lines.map((l, i) => lineAt(medium, l, L.title.rect.x + L.title.rect.w / 2, L.title.y + L.title.size * 0.9 + i * L.title.size * spec.titleLeading, L.title.size, trackingFor(L.title.size), 'center', titleColor)).join('');
	out.push(tw ? `<g opacity="${num(tw.opacity)}" transform="translate(0 ${num(tw.dy)})">${title}</g>` : title);
	const pad = spec.pad * k * s;
	const badge = spec.badge * k * s;
	const hs = spec.heading * k * s;
	const bs = spec.body * k * s;
	const rad = radiusPx(spec.radius, k);
	const bodyLeading = tokenNumber(imageConfig().scene.body.leading);
	L.cards.forEach((cd, index) => {
		const r = cd.rect;
		const parts: string[] = [];
		const sh = boxShadow(ids, r.x, r.y, r.w, r.h, rad, shadowToken(spec.shadow), k);
		parts.push(`<defs>${sh.defs}</defs>`, sh.under, rect(r.x, r.y, r.w, r.h, tokenColor('white'), rad), sh.over);
		if (!dark) parts.push(`<rect x="${num(r.x + k / 2)}" y="${num(r.y + k / 2)}" width="${num(r.w - k)}" height="${num(r.h - k)}" rx="${num(rad)}" fill="none" stroke="${rgbaOf(tokenColor(spec.edge))}" stroke-width="${num(k)}"/>`);
		const hTop = r.y + pad;
		const headH = Math.max(badge * 2, cd.heading.length * hs * 1.2);
		const bcx = r.x + pad + badge;
		const bcy = hTop + (cd.heading.length > 1 ? badge : headH / 2);
		parts.push(`<circle cx="${num(bcx)}" cy="${num(bcy)}" r="${num(badge)}" fill="${tokenColor('brand')}"/>`);
		parts.push(lineAt(medium, String(cd.n), bcx, bcy + badge * 0.38, badge * 1.1, 0, 'center', tokenColor('white')));
		const hx = r.x + pad + badge * 2 + 14 * k * s;
		const firstBase = cd.heading.length > 1 ? hTop + hs * 0.95 : bcy + hs * 0.35;
		cd.heading.forEach((l, i) => parts.push(lineAt(medium, l, hx, firstBase + i * hs * 1.2, hs, trackingFor(hs), 'left', tokenColor('ink'))));
		const bTop = hTop + headH + 14 * k * s;
		cd.body.forEach((l, i) => parts.push(lineAt(regular, l, r.x + pad, bTop + bs * 1.05 + i * bs * bodyLeading, bs, 0, 'left', tokenColor('text-muted'))));
		const mo = motion?.cards?.[index];
		out.push(mo ? `<g opacity="${num(mo.opacity)}" transform="translate(0 ${num(mo.dy)})">${parts.join('')}</g>` : parts.join(''));
	});
	const f = L.footer;
	if (f.h) {
		const cy = f.y + f.h / 2;
		if (sc.logo) out.push(logoAt(f.x, cy - f.h / 2, f.h, sc.ground, motion?.logo?.opacity ?? 1).svg);
		if (sc.footer.trim()) {
			const fs = spec.footer * k;
			const w = measure(medium, sc.footer.trim(), fs, 0);
			out.push(lineAt(medium, sc.footer.trim(), f.x + f.w - w, cy + fs * 0.36, fs, 0, 'left', dark ? tokenColor('white') : tokenColor('ink')));
		}
	}
	return out.join('');
}

// Arrangements --------------------------------------------------------------------------------------------------------

/** A small seeded random (the editor's), so a scatter can be repeated or reshuffled. */
export function random(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** The editor's scatter: objects in the margins, never over the words or the logo, never on top of each other. */
export function scatter(W: number, H: number, room: number, keep: Rect[], count: number, seed: number, names: string[]): { subject: string; x: number; y: number; size: number; rotate: number }[] {
	const cfg = imageConfig().stickers.scatter;
	const short = Math.min(W, H);
	const rnd = random(seed);
	const order = [...names].sort(() => rnd() - 0.5);
	const placedList: (Rect & { s: { subject: string; x: number; y: number; size: number; rotate: number } })[] = [];
	const pad = cfg.gap * unitOf(W, H);
	const hit = (a: Rect, b: Rect) => a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
	for (const name of order) {
		if (placedList.length >= count) break;
		for (let t = 0; t < 80; t++) {
			const size = cfg.minSize + rnd() * cfg.spread;
			const w = size * short;
			const h = w * 0.85;
			const x = w / 2 + rnd() * (W - w);
			const y = h / 2 + rnd() * (room - h);
			const r = { x: x - w / 2, y: y - h / 2, w, h };
			if (keep.some((b) => hit(r, b)) || placedList.some((p) => hit(r, p))) continue;
			placedList.push({ ...r, s: { subject: name, x: x / W, y: y / H, size, rotate: Math.round(rnd() * cfg.tilt * 2 - cfg.tilt) } });
			break;
		}
	}
	return placedList.map((p) => p.s);
}

/** Where the words of a hero land, for arrangements that keep clear of them. */
export function wordsRect(s: Scene): Rect {
	const k = unitOf(s.width, s.height);
	const m = measureWords(s, s.textWidth * s.width, k, s.textSize);
	return { x: s.textX * s.width - m.w / 2, y: s.textY * s.height - m.h / 2, w: m.w, h: m.h };
}

export function logoRect(s: Scene): Rect | null {
	if (!s.logo) return null;
	const k = unitOf(s.width, s.height);
	const cfg = imageConfig().scene;
	return logoAt(cfg.margin * k, cfg.margin * k, cfg.logo * k, s.ground).rect;
}

/** One object, large, in the room under the words. */
export function underneath(s: Scene, text: Rect, art: Art, rotate: number, maxSize: number): Sticker {
	const room = s.height - bandOf(s).h;
	const top = text.y + text.h + 24 * unitOf(s.width, s.height);
	const space = Math.max(room - top, s.height * 0.2);
	const short = Math.min(s.width, s.height);
	return { art, x: 0.5, y: (top + space / 2) / s.height, size: Math.min(maxSize, (space * 0.92) / short / 0.75), rotate };
}

// The scene ---------------------------------------------------------------------------------------------------------

export type Drawn = { svg: string; text: Rect | null; logo: Rect | null; stickers: Rect[]; window: Rect | null; keep: Rect[] };

/** Draws the scene's body (no document wrapper), so decks and video frames can reuse it. */
export function drawScene(s: Scene, motion?: Motion, ids = new Ids('s')): Drawn {
	const cfg = imageConfig().scene;
	const W = s.width;
	const H = s.height;
	const k = unitOf(W, H);
	const ground = groundColor(s.ground);
	const out: string[] = [rect(0, 0, W, H, ground)];
	const b = bandOf(s);
	const room = H - b.h;
	if (s.scan && s.ground === 'blue') out.push(scan(ids, 0, 0, W, room, cfg.scan, s.template === 'hero'));
	if (b.h) out.push(band(ids, W, room, b.step, H, ground, groundColor(s.band as SceneGround), bandMixes(), cfg.grain, motion?.grain));
	const m0 = cfg.margin * k;
	const logoH = cfg.logo * k;
	let logo: Rect | null = null;
	let text: Rect | null = null;
	let win: Rect | null = null;
	let keep: Rect[] = [];

	if (s.template === 'cards') {
		const L = layoutCards(s, W, H - b.h, k);
		out.push(drawCards(ids, s, L, motion));
		out.push(drawStickers(s, motion?.stickers));
		keep = L.keep;
		text = L.title.rect;
		return { svg: out.join(''), text, logo: null, stickers: stickerRects(s), window: null, keep };
	}

	if (s.template === 'hero') {
		const maxH = room - (s.logo ? m0 + logoH : 0) - m0;
		const m = fitWords(s, s.textWidth * W, maxH, k);
		const cx = s.textX * W;
		const top = Math.max(s.logo ? m0 + logoH + 12 * k : m0 * 0.5, Math.min(s.textY * H - m.h / 2, room - m0 * 0.5 - m.h));
		text = { x: cx - m.w / 2, y: top, w: m.w, h: m.h };
		out.push(drawStickers(s, motion?.stickers));
		if (s.logo) {
			const l = logoAt(m0, m0, logoH, s.ground, motion?.logo?.opacity ?? 1);
			logo = l.rect;
			out.push(l.svg);
		}
		out.push(drawWords(ids, s, m, cx, top, 'center', k, motion?.words));
		return { svg: out.join(''), text, logo, stickers: stickerRects(s), window: null, keep };
	}

	// The window: the words on one side and the window on the other, or the words above the window when the image is tall.
	if (s.logo) {
		const l = logoAt(m0, m0, logoH, s.ground, motion?.logo?.opacity ?? 1);
		logo = l.rect;
		out.push(l.svg);
	}
	const top0 = s.logo ? m0 + logoH + 24 * k : m0;
	const wm = motion?.window;
	const windowSvg = (r: Rect) => {
		const svg = drawWindow(ids, s, r, k);
		return wm ? `<g opacity="${num(wm.opacity)}" transform="translate(0 ${num(wm.dy)})">${svg}</g>` : svg;
	};
	if (isWide(W, H)) {
		const colW = W * 0.44;
		const max = Math.min(s.textWidth * W, colW - m0 * 1.5);
		const m = fitWords(s, max, room - top0 - m0, k);
		const tx = m0 * 1.5;
		const ty = Math.max(top0, (room - m.h) / 2);
		text = { x: tx, y: ty, w: m.w, h: m.h };
		win = { x: W * 0.5, y: m0 * 1.2, w: W * 0.5 - m0 * 1.4, h: room - m0 * 2.4 };
		out.push(windowSvg(win));
		out.push(drawWords(ids, s, m, tx, ty, 'left', k, motion?.words));
	} else {
		const ty = top0 + 24 * k;
		const minWindow = Math.max(160 * k, (room - ty) * 0.38);
		const m = fitWords(s, s.textWidth * W, room - ty - minWindow - 48 * k - m0 * 1.4, k);
		text = { x: W / 2 - m.w / 2, y: ty, w: m.w, h: m.h };
		const wy = ty + m.h + 48 * k;
		win = { x: m0 * 1.2, y: wy, w: W - m0 * 2.4, h: room - wy - m0 * 1.4 };
		out.push(windowSvg(win));
		out.push(drawWords(ids, s, m, W / 2, ty, 'center', k, motion?.words));
	}
	out.push(drawStickers(s, motion?.stickers));
	return { svg: out.join(''), text, logo, stickers: stickerRects(s), window: win, keep };
}

export function sceneSvg(s: Scene, motion?: Motion): string {
	const drawn = drawScene(s, motion);
	return document(s.width, s.height, s.title || s.headline || s.template, drawn.svg);
}
