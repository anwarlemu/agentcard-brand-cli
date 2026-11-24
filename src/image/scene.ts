// The image layouts as SVG: the editor's hero, window and numbered cards, and the headline, subtext, screenshot, quote,
// announcement and logo layouts on the same grounds, scanlines, stepped band, lockup and type. Geometry comes from
// brand/assets/image.json, values from the tokens. Layer edits apply inside the layout, so words re-wrap round a moved
// logo and objects keep clear of both, and every layer drawn is reported by the code that drew it. Motion (for video)
// is an optional set of per-part offsets and opacities; a still passes none.

import type { Anchor, DrawnLayer, Rect } from '../design/types.js';
import { tokens } from '../lib/brand.js';
import { imageConfig, isWide, pick, stageFor, unitOf, type Card, type SceneGround, type SceneTemplate, type Stage, type WindowBody } from './config.js';
import { band, boxShadow, Ids, num, placed, radiusPx, rgbaOf, scan, shadowToken } from './effects.js';
import { settle, scatter, stickerBox, type Art, type Sticker } from './objects.js';
import { bandMixes, brandFonts, document, drawable, drawLine, drawLogo, logoBox, measure, readBack, rect, tokenColor, trackingFor, wrapEven, wrapFit, type Wrapped } from './paint.js';
import { bottom, freeRects, hit, inflate, right, union } from './space.js';
import { drawWords, fitWords, groundColor, groundColors, isDark, Layers, lineAt, lineBox, placeWords, readable, tokenNumber, tooLong, type Align, type Edits, type Placed, type Words } from './words.js';

export { illustrateConfig, imageConfig, isWide, unitOf } from './config.js';
export type { Card, IllustrateConfig, ImageConfig, SceneGround, SceneTemplate, WindowBody } from './config.js';
export { pictureArt, random, scatter, subjectArt, type Art, type Sticker } from './objects.js';
export { groundColor } from './words.js';
export type { Rect } from '../design/types.js';

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
	/** The size id, for the safe area and the small-text floor its platform sets. */
	size?: string;
	ground: SceneGround;
	scan: boolean;
	band: SceneGround | 'none';
	logo: boolean;
	/** The mark alone in place of the lockup (the logo layout). */
	mark?: boolean;
	badge: string;
	headline: string;
	body: string;
	button: string;
	quote: string;
	by: string;
	textSize: number;
	textWidth: number;
	textX: number;
	textY: number;
	window: string;
	windowBody: WindowBody;
	picture: Art | null;
	/** The picture fills the window, which takes its shape. */
	fill: boolean;
	/** Where objects go before they are settled round the words. */
	objects: { mode: 'none' | 'preset' | 'scatter' | 'under'; targets: Sticker[]; names: string[]; count: number; seed: number; asked?: boolean; under?: { art: Art; rotate: number } };
	stickers: Sticker[];
	cards: Card[];
	footer: string;
	/** The brand's own address, drawn when nobody asked for one: it gives way when there is no room. */
	footerOptional: boolean;
	number: string;
	edits: Edits;
	title?: string;
	notes: string[];
};

/** Text sizes and widths for a template at a size, as the editor sets them when the size changes. */
export function layoutFor(template: SceneTemplate, w: number, h: number, size?: string) {
	const t = imageConfig().templates[template];
	const stage = stageFor(w, h, size);
	return { textSize: Math.round(pick(t.textSize, stage.wide, 54) * stage.k), textWidth: pick(t.textWidth, stage.wide, 0.86), textX: t.textX ?? 0.5, textY: t.textY ?? 0.5 };
}

function flatBand(w: number, h: number) {
	const f = imageConfig().scene.flatBand;
	const step = Math.min(Math.max(f.step, w * f.share), h * f.maxShare);
	return { step, h: step * f.steps };
}

/** The band at the bottom: step and height, when it leads to a different ground. */
export function bandOf(s: Pick<Scene, 'band' | 'ground' | 'width'> & { template?: SceneTemplate; height?: number }) {
	const b = imageConfig().scene.band;
	if (s.band === 'none' || s.band === s.ground) return { step: 0, h: 0 };
	if (s.template && imageConfig().templates[s.template].flatBand) return flatBand(s.width, s.height ?? s.width);
	const step = Math.max(b.minStep, (b.step * s.width) / imageConfig().unit.width);
	return { step, h: step * b.steps };
}

// Pieces ------------------------------------------------------------------------------------------------------------

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

/** A window frame with any inside: the same bar, corner, shadow and edge. */
export function windowFrame(ids: Ids, r: Rect, k: number, name: string, body: WindowBody, inner: (inside: Rect) => string, small = 0, layers?: Layers) {
	return drawWindow(ids, { windowBody: body, picture: null, window: name, fill: false }, r, k, small, layers, inner);
}

const barHeight = (k: number, small: number) => Math.max(imageConfig().scene.window.bar * k, small * 2.1);

/** The window: a sky bar with blue marks over a body with the card corner, lifted by the plan window's hard shadow. */
function drawWindow(ids: Ids, s: Pick<Scene, 'windowBody' | 'picture' | 'window' | 'fill'>, r: Rect, k: number, small: number, layers?: Layers, inner?: (inside: Rect) => string) {
	const cfg = imageConfig().scene;
	const wc = cfg.window;
	const { medium } = brandFonts();
	const rad = radiusPx(wc.radius, k);
	const bar = barHeight(k, small);
	const sh = boxShadow(ids, r.x, r.y, r.w, r.h, rad, shadowToken(wc.shadow).filter((x) => !x.inset), k);
	const clip = ids.next('c');
	const inside: Rect = { x: r.x, y: r.y + bar, w: r.w, h: r.h - bar };
	const body = s.windowBody === 'blue' ? tokenColor('brand') : s.windowBody === 'sky' ? tokenColor('sky') : tokenColor('white');
	const parts: string[] = [`<defs>${sh.defs}<clipPath id="${clip}">${rect(r.x, r.y, r.w, r.h, '#fff', rad)}</clipPath></defs>`, sh.under, `<g clip-path="url(#${clip})">`, rect(inside.x, inside.y, inside.w, inside.h, body)];
	if (s.windowBody === 'blue') parts.push(scan(ids, inside.x, inside.y, inside.w, inside.h, cfg.scan, false));
	if (s.picture) {
		// Always whole: the window takes a filling picture's shape, and an object sits inside it with room round it.
		const pic = s.picture;
		const share = s.fill ? 1 : wc.pictureFit;
		const sc = Math.min((inside.w * share) / pic.width, (inside.h * share) / pic.height);
		parts.push(placed(pic.href, inside.x + inside.w / 2, inside.y + inside.h / 2, pic.width * sc, pic.height * sc, 0));
	}
	if (inner) parts.push(inner(inside));
	const fs = Math.max(wc.name * k, small);
	const cy = r.y + bar / 2;
	const mark = tokenColor('window-bar-fg');
	const inset = wc.inset * k;
	parts.push(rect(r.x, r.y, r.w, bar, tokenColor('window-bar')));
	parts.push(rect(r.x, r.y + bar - k, r.w, k, rgbaOf(tokenColor(wc.rule))));
	parts.push(lineAt(medium, '↳', r.x + inset, cy + fs * 0.35, fs, 0, 'left', mark, wc.arrowAlpha));
	if (s.window) {
		const name = drawable(s.window, 'window label');
		if (measure(medium, name, fs, 0) > r.w - (inset + fs * 2.4) * 2) throw new Error(`The window label "${name}" is too long for the window. Shorten it.`);
		const base = cy + fs * 0.35;
		parts.push(lineAt(medium, name, r.x + r.w / 2, base, fs, 0, 'center', mark));
		layers?.text('window-bar', medium, [{ text: name, x: r.x + r.w / 2, baseline: base }], fs, 0, 'center', mark, [tokenColor('window-bar')], s.window, name, {}, ['picture']);
	}
	parts.push(windowMark(r.x + r.w - inset, cy, fs, mark));
	parts.push('</g>');
	parts.push(`<rect x="${num(r.x + 0.5 * k)}" y="${num(r.y + 0.5 * k)}" width="${num(r.w - k)}" height="${num(r.h - k)}" rx="${num(rad)}" fill="none" stroke="${rgbaOf(tokenColor(wc.edge))}" stroke-width="${num(k)}"/>`);
	return parts.join('');
}

export const ART_CAN: DrawnLayer['can'] = { scale: [0.6, 1.5], hide: true };
export const PICTURE_CAN: DrawnLayer['can'] = { move: true, scale: [0.6, 1.25], hide: true, anchors: ['right', 'left'] };
const TOPS: Anchor[] = ['top-left', 'top', 'top-right'];
const NINE: Anchor[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];

export type LogoAt = { kind: 'lockup' | 'mark'; rect: Rect; clear: number; color: string; can: DrawnLayer['can']; min: number };

/** A box of a size at an anchor of the frame, moved off any part a platform covers. */
function anchorBox(frame: Rect, w: number, h: number, anchor: string, avoid: Rect[], gap: number): Rect {
	const x = anchor.includes('left') ? frame.x : anchor.includes('right') ? right(frame) - w : frame.x + (frame.w - w) / 2;
	const y = anchor.startsWith('top') ? frame.y : anchor.startsWith('bottom') ? bottom(frame) - h : frame.y + (frame.h - h) / 2;
	const r = { x, y, w, h };
	for (const a of avoid) {
		if (!hit(r, a, gap)) continue;
		const moves = [right(a) + gap - r.x, a.x - gap - w - r.x].filter((d) => r.x + d >= frame.x - 0.5 && r.x + d + w <= right(frame) + 0.5).sort((p, q) => Math.abs(p) - Math.abs(q));
		if (moves.length) r.x += moves[0]!;
	}
	return r;
}

export function logoAt(s: Pick<Scene, 'logo' | 'edits' | 'width' | 'height'>, stage: Stage, frame: Rect, ground: SceneGround, opts: { anchor?: string; anchors?: readonly Anchor[]; h?: number; scale?: [number, number]; kind?: 'lockup' | 'mark'; move?: boolean } = {}): LogoAt | null {
	if (!s.logo || s.edits.logo?.hidden) return null;
	const cfg = imageConfig().scene;
	const edit = s.edits.logo ?? {};
	const kind = opts.kind ?? 'lockup';
	const box = logoBox(kind);
	// On a shallow canvas the lockup is set by the height there is, not by the area.
	const row = stage.row && !opts.anchors;
	const h = (opts.h ?? (row ? Math.max(cfg.logo * stage.k, frame.h * 0.32) : cfg.logo * stage.k)) * (edit.scale ?? 1);
	const w = (h * box.width) / box.height;
	const clear = h * cfg.logoRule.clear;
	const r = anchorBox(frame, w, h, edit.anchor ?? opts.anchor ?? (row ? 'left' : 'top-left'), stage.avoid, clear);
	r.x += (edit.dx ?? 0) * s.width;
	r.y += (edit.dy ?? 0) * s.height;
	return { kind, rect: r, clear, color: isDark(ground) ? tokenColor('white') : tokenColor('brand'), min: cfg.logoRule.min * stage.k, can: { move: opts.move ?? true, scale: opts.scale ?? cfg.logoRule.scale, hide: true, anchors: [...(opts.anchors ?? NINE)] } };
}

export function drawLogoAt(l: LogoAt, layers: Layers, opacity = 1, over?: string[]) {
	const svg = drawLogo(l.kind, l.rect.x, l.rect.y, l.rect.h, l.color);
	layers.add({ id: 'logo', kind: 'logo', box: l.rect, ...(over ? { over } : {}), logo: { clear: l.clear, min: l.min }, can: l.can });
	return opacity < 1 ? `<g opacity="${num(opacity)}">${svg}</g>` : svg;
}

type SmallLine = { id: string; own: boolean; text: string; asked: string; fs: number; x: number; baseline: number; box: Rect; color: string; ground: string[]; can: DrawnLayer['can'] };

/** A small line (the footer, a carousel's number) at an anchor, clear of what a platform covers. */
function smallLine(s: Scene, stage: Stage, frame: Rect, id: string, value: string, anchor: string, ground: SceneGround, obstacles: Rect[], optional = false): SmallLine | null {
	if (!value.trim() || s.edits[id]?.hidden) return null;
	if (optional && stage.box.w / stage.box.h > 5) return null;
	const { medium } = brandFonts();
	const textValue = drawable(value.trim(), id);
	const fs = Math.max(stage.small, imageConfig().scene.footer * stage.k);
	const w = measure(medium, textValue, fs, 0);
	if (w > frame.w) throw new Error(`The ${id} "${textValue}" is too long for this size. Shorten it.`);
	const h = fs;
	const want = s.edits[id]?.anchor ?? anchor;
	const order = [want, ...(want.startsWith('bottom') ? ['bottom-left', 'bottom-right', 'bottom', 'top-right', 'top'] : ['top-right', 'top', 'bottom-left', 'bottom-right', 'bottom', 'top-left'])];
	// Its own corner, then the others, then nudged along off what is in the way.
	for (const [a, nudge] of [...order.map((o) => [o, false] as const), ...order.map((o) => [o, true] as const)]) {
		const r = anchorBox(frame, w, h, a, nudge ? stage.avoid : [], fs * 0.6);
		if ([...obstacles, ...stage.avoid].some((o) => hit(r, o))) continue;
		const baseline = r.y + h * 0.8;
		// 4.5:1 on every ground: the muted white reads on blue and ink, the muted ink on paper and white.
		const color = isDark(ground) ? tokenColor('white') : tokenColor('text-secondary');
		return { id, own: optional || id === 'number', text: textValue, asked: value.trim(), fs, x: r.x, baseline, box: lineBox(medium, textValue, r.x, baseline, fs, 0, 'left'), color, ground: groundColors(ground, s.scan), can: { hide: true } };
	}
	if (optional) return null;
	throw new Error(`There is no room for the ${id} at this size. Leave it off or pick a larger size.`);
}

function drawSmall(l: SmallLine, layers: Layers) {
	const { medium } = brandFonts();
	layers.text(l.id, medium, [{ text: l.text, x: l.x, baseline: l.baseline }], l.fs, 0, 'left', l.color, l.ground, l.asked, l.text, l.can, undefined, l.own);
	return lineAt(medium, l.text, l.x, l.baseline, l.fs, 0, 'left', l.color);
}

// Cards -------------------------------------------------------------------------------------------------------------

type CardBox = { rect: Rect; n: number; title: string; body: string; heading: Wrapped; lines: Wrapped };
type CardsLayout = { title: { w: Wrapped; size: number; x: number; y: number; align: Align } | null; cards: CardBox[]; s: number; foot: Rect; logo: LogoAt | null; footer: SmallLine | null; number: SmallLine | null };

function layoutCards(sc: Scene, stage: Stage, frame: Rect): CardsLayout {
	const spec = imageConfig().templates.cards.cards!;
	const { medium, regular } = brandFonts();
	const { k, small } = stage;
	const size = sc.size ?? `${sc.width} by ${sc.height}`;
	const footH = sc.logo || sc.footer.trim() || sc.number ? 34 * k : 0;
	const logo = logoAt(sc, stage, frame, sc.ground, { anchor: 'bottom-left', anchors: ['bottom-left', 'bottom-right', 'top-left', 'top-right'], move: false, scale: [0.8, 1.6] });
	const gap = 24 * k;
	const obstacles = [...stage.avoid, ...(logo ? [inflate(logo.rect, logo.clear + 4 * k)] : [])];
	const footer = smallLine(sc, stage, frame, 'footer', sc.footer, logo?.rect && logo.rect.x > frame.x + frame.w / 2 ? 'bottom-left' : 'bottom-right', sc.ground, logo ? [inflate(logo.rect, logo.clear)] : [], sc.footerOptional);
	const number = smallLine(sc, stage, frame, 'number', sc.number, 'top-right', sc.ground, logo ? [inflate(logo.rect, logo.clear)] : []);
	const foot = { x: frame.x, y: bottom(frame) - footH, w: frame.w, h: footH };
	for (const o of [footer, number]) if (o) obstacles.push(inflate(o.box, 10 * k));
	const areas = freeRects(frame, obstacles).slice(0, 8);
	const floorBody = Math.max(small, 14 * k);
	const headline = sc.headline.trim() ? drawable(sc.headline.trim(), 'headline') : '';
	const titleFloor = Math.max(small * 1.25, 24 * k);
	const bodyLeading = tokenNumber(imageConfig().scene.body.leading);
	const cardsIn = sc.cards.map((c) => ({ title: drawable(c.title, 'card title'), body: c.body ? drawable(c.body, 'card body') : '' }));
	const n = cardsIn.length;
	let best: (CardsLayout & { score: number }) | null = null;
	for (const area of areas) {
		if (area.w < 160 * k || area.h < 100 * k) continue;
		const colsTried = n <= 1 ? [1] : area.w / area.h > 2.4 ? [Math.min(4, n), 2, 3] : area.w / area.h < 0.72 ? [1, 2] : [2, 1, 3];
		for (let ts = sc.textSize * (sc.edits.headline?.scale ?? 1); ; ts = Math.max(titleFloor, ts * 0.9)) {
			const title = headline ? wrapEven(medium, headline, ts, trackingFor(ts), area.w) : null;
			const titleOk = !headline || (title !== null && title.lines.length <= (ts > titleFloor ? 2 : 4));
			if (titleOk) {
				const titleH = title ? title.lines.length * ts * spec.titleLeading : 0;
				const top = area.y + titleH + (titleH ? Math.max(gap, ts * 0.55) : 0);
				for (const cols of colsTried) {
					const rows = Math.max(1, Math.ceil(n / cols));
					const gapX = spec.gapX * k * (cols > 2 ? 0.7 : 1);
					const gapY = spec.gapY * k;
					const cw = (area.w - gapX * (cols - 1)) / cols;
					const ch = (bottom(area) - top - gapY * (rows - 1)) / rows;
					if (ch < 40 * k || cw < 120 * k) continue;
					for (let q = Math.max(1.15, (floorBody * 1.001) / (spec.body * k)); q >= 0.5; q *= 0.94) {
						const bs = spec.body * k * q;
						if (bs < floorBody - 0.01) break;
						const pad = spec.pad * k * Math.min(1, q);
						const badge = spec.badge * k * q;
						const hs = spec.heading * k * q;
						const wraps = cardsIn.map((c) => ({ h: wrapEven(medium, c.title, hs, trackingFor(hs), cw - pad * 2 - badge * 2 - 14 * k * q), b: c.body ? wrapFit(regular, c.body, bs, 0, cw - pad * 2) : { lines: [], soft: [] } }));
						if (wraps.some((w) => !w.h || !w.b)) continue;
						const needs = wraps.map((w) => pad * 2 + Math.max(badge * 2, w.h!.lines.length * hs * 1.2) + (w.b!.lines.length ? 14 * k * q + w.b!.lines.length * bs * bodyLeading : 0));
						const tallest = Math.max(...needs);
						if (tallest > ch) continue;
						// Cards no taller than their words need, with the grid centered in the room, so tall posts do not get long empty cards.
						const need = Math.min(ch, tallest * 1.18);
						const lift = ((ch - need) * rows) / 2;
						const cards = cardsIn.map((c, i) => {
							const row = Math.floor(i / cols);
							const inRow = Math.min(cols, n - row * cols);
							const rowW = inRow * cw + (inRow - 1) * gapX;
							return { n: i + 1, title: c.title, body: c.body, heading: wraps[i]!.h!, lines: wraps[i]!.b!, rect: { x: area.x + (area.w - rowW) / 2 + (i % cols) * (cw + gapX), y: top + lift + row * (need + gapY), w: cw, h: need } };
						});
						const align = sc.edits.headline?.align ?? 'center';
						const score = q * 2 + ts / sc.textSize;
						if (!best || score > best.score) best = { title: title ? { w: title, size: ts, x: align === 'left' ? area.x : align === 'right' ? right(area) : area.x + area.w / 2, y: area.y + lift * 0.35, align } : null, cards, s: q, foot, logo, footer, number, score };
						break;
					}
				}
			}
			if (ts <= titleFloor) break;
		}
	}
	if (!best) throw new Error(`The ${n} card${n === 1 ? '' : 's'} and the title do not fit ${size} at a size that reads. Use fewer cards, shorter lines or a taller size.`);
	return best;
}

function drawCards(ids: Ids, sc: Scene, L: CardsLayout, stage: Stage, layers: Layers, motion?: Motion) {
	const spec = imageConfig().templates.cards.cards!;
	const { medium, regular } = brandFonts();
	const { k } = stage;
	const { s } = L;
	const dark = isDark(sc.ground);
	const out: string[] = [];
	if (L.title) {
		const t = L.title;
		const color = dark ? tokenColor('white') : tokenColor('ink');
		const rows = t.w.lines.map((text, i) => ({ text, x: t.x, baseline: t.y + t.size * 0.9 + i * t.size * spec.titleLeading }));
		const svg = rows.map((r) => lineAt(medium, r.text, r.x, r.baseline, t.size, trackingFor(t.size), t.align, color)).join('');
		const tw = motion?.words?.[0];
		out.push(tw ? `<g opacity="${num(tw.opacity)}" transform="translate(0 ${num(tw.dy)})">${svg}</g>` : svg);
		layers.text('headline', medium, rows, t.size, trackingFor(t.size), t.align, color, groundColors(sc.ground, sc.scan), sc.headline.trim(), readBack(t.w), { scale: [0.6, 1.4], align: true });
	}
	const pad = spec.pad * k * Math.min(1, s);
	const badge = spec.badge * k * s;
	const hs = spec.heading * k * s;
	const bs = spec.body * k * s;
	const rad = radiusPx(spec.radius, k);
	const bodyLeading = tokenNumber(imageConfig().scene.body.leading);
	const face = tokenColor('white');
	if (L.cards.length) layers.add({ id: 'cards', kind: 'panel', box: union(L.cards.map((c) => c.rect)), ink: L.cards.map((c) => c.rect), can: {} });
	L.cards.forEach((cd, index) => {
		const r = cd.rect;
		const parts: string[] = [];
		const sh = boxShadow(ids, r.x, r.y, r.w, r.h, rad, shadowToken(spec.shadow), k);
		parts.push(`<defs>${sh.defs}</defs>`, sh.under, rect(r.x, r.y, r.w, r.h, face, rad), sh.over);
		if (!dark) parts.push(`<rect x="${num(r.x + k / 2)}" y="${num(r.y + k / 2)}" width="${num(r.w - k)}" height="${num(r.h - k)}" rx="${num(rad)}" fill="none" stroke="${rgbaOf(tokenColor(spec.edge))}" stroke-width="${num(k)}"/>`);
		const hTop = r.y + pad;
		const headH = Math.max(badge * 2, cd.heading.lines.length * hs * 1.2);
		const bcx = r.x + pad + badge;
		const bcy = hTop + (cd.heading.lines.length > 1 ? badge : headH / 2);
		parts.push(`<circle cx="${num(bcx)}" cy="${num(bcy)}" r="${num(badge)}" fill="${tokenColor('brand')}"/>`);
		parts.push(lineAt(medium, String(cd.n), bcx, bcy + badge * 0.38, badge * 1.1, 0, 'center', face));
		const hx = r.x + pad + badge * 2 + 14 * k * s;
		const firstBase = cd.heading.lines.length > 1 ? hTop + hs * 0.95 : bcy + hs * 0.35;
		const headRows = cd.heading.lines.map((text, i) => ({ text, x: hx, baseline: firstBase + i * hs * 1.2 }));
		for (const row of headRows) parts.push(lineAt(medium, row.text, row.x, row.baseline, hs, trackingFor(hs), 'left', tokenColor('ink')));
		layers.text(`card-${cd.n}-title`, medium, headRows, hs, trackingFor(hs), 'left', tokenColor('ink'), [face], sc.cards[index]!.title, readBack(cd.heading), {}, ['cards']);
		const bTop = hTop + headH + 14 * k * s;
		const bodyRows = cd.lines.lines.map((text, i) => ({ text, x: r.x + pad, baseline: bTop + bs * 1.05 + i * bs * bodyLeading }));
		for (const row of bodyRows) parts.push(lineAt(regular, row.text, row.x, row.baseline, bs, 0, 'left', tokenColor('text-muted')));
		if (bodyRows.length) layers.text(`card-${cd.n}-body`, regular, bodyRows, bs, 0, 'left', tokenColor('text-muted'), [face], sc.cards[index]!.body, readBack(cd.lines), {}, ['cards']);
		const mo = motion?.cards?.[index];
		out.push(mo ? `<g opacity="${num(mo.opacity)}" transform="translate(0 ${num(mo.dy)})">${parts.join('')}</g>` : parts.join(''));
	});
	if (L.logo) out.push(drawLogoAt(L.logo, layers, motion?.logo?.opacity ?? 1));
	for (const l of [L.footer, L.number]) if (l) out.push(drawSmall(l, layers));
	return out.join('');
}

// Layouts -------------------------------------------------------------------------------------------------------------

type QuoteLayout = { rect: Rect; mark: { size: number; x: number; baseline: number }; quote: { w: Wrapped; size: number; x: number; baseline: number; leading: number }; by: { w: Wrapped; size: number; x: number; baseline: number } | null };

type Layout = {
	stage: Stage;
	frame: Rect;
	band: { step: number; h: number };
	room: number;
	cap: { h: number; ground: SceneGround; step: number; bandH: number } | null;
	logo: LogoAt | null;
	words: Placed | null;
	window: Rect | null;
	quote: QuoteLayout | null;
	cards: CardsLayout | null;
	footer: SmallLine | null;
	number: SmallLine | null;
	badgeLine: { text: string; size: number; x: number; baseline: number; align: Align } | null;
	stickers: Sticker[];
	notes: string[];
};

/** The window's box in the free room: its shape from the picture when the picture fills it. */
function windowSize(s: Scene, stage: Stage, maxW: number, maxH: number): { w: number; h: number } {
	const wc = imageConfig().scene.window;
	const bar = barHeight(stage.k, stage.small);
	const scale = s.edits.picture?.scale ?? 1;
	let w = maxW;
	let h = maxH;
	if (s.fill && s.picture) {
		const a = Math.max(wc.pictureMin, Math.min(wc.pictureMax, s.picture.width / s.picture.height));
		w = Math.min(maxW, (maxH - bar) * a);
		h = w / a + bar;
	} else if (!stage.wide) {
		w = Math.min(w, h * wc.maxAspect);
		h = Math.min(h, w / wc.minAspect);
	}
	return { w: w * Math.min(1, scale), h: h * Math.min(1, scale) };
}

function layoutQuote(s: Scene, stage: Stage, frame: Rect, obstacles: Rect[]): QuoteLayout {
	const { medium, regular } = brandFonts();
	const { k, small } = stage;
	const spec = imageConfig().templates.quote;
	const bar = barHeight(k, small);
	const text = drawable(s.quote.trim(), 'quote');
	const by = s.by.trim() && !s.edits.by?.hidden ? drawable(s.by.trim(), 'attribution') : '';
	const leading = tokenNumber('--ds-leading-snug');
	const edit = s.edits.quote ?? {};
	const size0 = pick(spec.textSize, stage.wide, 48) * k * (edit.scale ?? 1);
	const floor = Math.max(small * 1.2, 22 * k);
	let best: (QuoteLayout & { score: number }) | null = null;
	for (const room of freeRects(frame, obstacles).slice(0, 8)) {
		const w = Math.min(room.w, 1180 * k);
		const pad = Math.min(48 * k, w * 0.07, room.h * 0.1);
		const inner = w - pad * 2;
		if (inner < 120 * k) continue;
		for (let size = Math.max(floor, size0); ; size = Math.max(floor, size * 0.95)) {
			const q = wrapEven(medium, text, size, trackingFor(size / k), inner);
			const bySize = Math.max(small * 1.1, Math.min(24 * k, size * 0.5));
			const b = by ? wrapFit(regular, by, bySize, 0, inner) : null;
			if (q && (!by || b)) {
				const mark = size * 1.3;
				const h = bar + pad * 1.6 + mark * 0.55 + q.lines.length * size * leading + (b ? bySize * 0.9 + b.lines.length * bySize * 1.3 : 0);
				if (h <= room.h) {
					const r = { x: room.x + (room.w - w) / 2, y: room.y + (room.h - h) / 2, w, h };
					const x = r.x + pad;
					const top = r.y + bar + pad * 0.8;
					const qTop = top + mark * 0.55;
					const score = size / size0 - (Math.abs(r.x + r.w / 2 - s.width / 2) / s.width) * 0.6;
					if (!best || score > best.score) best = { rect: r, mark: { size: mark, x, baseline: top + mark * 0.62 }, quote: { w: q, size, x, baseline: qTop + size * 0.86, leading }, by: b ? { w: b, size: bySize, x, baseline: qTop + q.lines.length * size * leading + bySize * 1.9 } : null, score };
					break;
				}
			}
			if (size <= floor) break;
		}
	}
	if (!best) throw new Error(`The quote (${text.length} characters) does not fit ${s.size ?? `${s.width} by ${s.height}`}. Shorten it, or pick a taller size.`);
	return best;
}

const layouts = new WeakMap<Scene, Layout>();

/** Where everything lands. Worked out once per scene, so a video draws every frame from the same layout. */
export function layoutOf(s: Scene): Layout {
	const known = layouts.get(s);
	if (known) return known;
	const cfg = imageConfig();
	const sc = cfg.scene;
	const t = cfg.templates[s.template];
	const W = s.width;
	const H = s.height;
	const stage = stageFor(W, H, s.size);
	const { k } = stage;
	const b = s.edits.band?.hidden ? { step: 0, h: 0 } : bandOf(s);
	const room = H - b.h;
	const frame: Rect = { ...stage.frame, h: Math.min(bottom(stage.frame), room - sc.margin * k * 0.55) - stage.frame.y };
	const L: Layout = { stage, frame, band: b, room, cap: null, logo: null, words: null, window: null, quote: null, cards: null, footer: null, number: null, badgeLine: null, stickers: [], notes: [] };
	const size = s.size ?? `${W} by ${H}`;
	const words = readable({ badge: s.badge, headline: s.headline, body: s.body, button: s.button }, s.edits);
	// Fill before shrinking: a shallow canvas starts its words at the height it has.
	const S = stage.row && s.template !== 'cards' ? Math.max(s.textSize, frame.h * 0.42) : s.textSize;
	const opts = (o: Partial<Parameters<typeof placeWords>[5]>) => ({ S, maxW: s.textWidth * stage.box.w, align: 'center' as Align, ax: stage.box.x + s.textX * stage.box.w, ay: stage.box.y + s.textY * stage.box.h, W, H, size, ...o });
	// Words keep a little off a covered part: descenders reach below their line.
	const covered = stage.avoid.map((r) => inflate(r, 12 * k));
	const clearOf = (l: LogoAt | null) => (l ? [inflate(l.rect, l.clear + 10 * k)] : []);
	const small = (ground: SceneGround, extra: Rect[] = [], frame = L.frame) => {
		L.number = smallLine(s, stage, frame, 'number', s.number, 'top-right', ground, [...clearOf(L.logo), ...extra]);
		L.footer = smallLine(s, stage, frame, 'footer', s.footer, 'bottom-left', ground, [...clearOf(L.logo), ...extra, ...(L.number ? [inflate(L.number.box, 8 * k)] : [])], s.footerOptional);
	};
	const lines = () => [L.footer, L.number].filter((l): l is SmallLine => Boolean(l)).map((l) => inflate(l.box, 18 * k));

	if (s.template === 'cards') {
		L.cards = layoutCards(s, stage, frame);
		L.logo = L.cards.logo;
	} else if (s.template === 'logo') {
		const kind = s.mark || stage.circle ? 'mark' : 'lockup';
		const box = logoBox(kind);
		const share = t.share!;
		// In a circle the mark's own corners have to sit inside it; elsewhere the logo takes a share of the safe box.
		const fit = stage.circle ? Math.min((W * share.mark) / Math.hypot(box.width, box.height)) * 1.15 : Math.min((stage.box.w * share[kind]) / box.width, (Math.min(frame.h, room - frame.y) * share.height) / box.height, kind === 'lockup' ? Infinity : (frame.h * share.height) / box.height);
		L.logo = logoAt(s, stage, frame, s.ground, { anchor: 'center', h: box.height * fit, kind, scale: stage.circle ? [0.5, 1.2] : [0.3, 1.35] });
		// Centered in the whole canvas rather than in what the covered parts leave, when that is clear of them.
		if (L.logo && !s.edits.logo?.anchor) {
			const r = L.logo.rect;
			const halfFree = Math.min(...stage.avoid.map((a) => (a.y < stage.box.y + stage.box.h / 2 + r.h * 1.1 ? Math.abs(stage.box.x + stage.box.w / 2 - (a.x < stage.box.w / 2 ? right(a) : a.x)) : Infinity)), Infinity);
			const z = Math.min(1, (halfFree * 2) / (r.w + L.logo.clear * 2));
			Object.assign(r, { w: r.w * z, h: r.h * z });
			L.logo.clear *= z;
			const c = { ...r, x: stage.box.x + (stage.box.w - r.w) / 2 + (s.edits.logo?.dx ?? 0) * W, y: Math.min(room, stage.box.y + stage.box.h) / 2 + stage.box.y / 2 - r.h / 2 + (s.edits.logo?.dy ?? 0) * H };
			if (!stage.avoid.some((a) => hit(c, a, L.logo!.clear))) L.logo.rect = c;
			else {
				// A covered middle (a video call's person): the logo goes over it, in the room above, at a size that fits.
				const blocked = stage.avoid.find((a) => hit(L.logo!.rect, a, L.logo!.clear));
				if (blocked && blocked.y - frame.y > 40 * k) {
					const room = blocked.y - frame.y - L.logo.clear * 1.2;
					const z = Math.min(1, room / L.logo.rect.h, (frame.w * 0.4) / L.logo.rect.w);
					const w = L.logo.rect.w * z;
					const h = L.logo.rect.h * z;
					L.logo.rect = { x: stage.box.x + (stage.box.w - w) / 2, y: frame.y + Math.max(0, (room - h) / 2), w, h };
					L.logo.clear *= z;
				}
			}
		}
		small(s.ground);
	} else if (s.template === 'announcement') {
		const ground = s.ground;
		const m = Math.min(sc.margin * k, frame.h * 0.12);
		const capFrame = { ...frame };
		L.logo = logoAt(s, stage, capFrame, ground, { anchors: TOPS });
		const top = frame.y;
		const logoH = L.logo?.rect.h ?? 0;
		const { medium } = brandFonts();
		const badge = words.badge;
		let capH = logoH;
		if (badge) {
			const fs = Math.max(stage.small, sc.eyebrow.size * k * (s.edits.badge?.scale ?? 1));
			const shown = sc.eyebrow.caps ? badge.toUpperCase() : badge;
			const tr = eyeTracking();
			const w = measure(medium, shown, fs, tr);
			const l = L.logo?.rect;
			const side = l && l.x + l.w / 2 > frame.x + frame.w * 0.66 ? 'left' : 'right';
			const free = l ? (side === 'right' ? right(frame) - right(l) : l.x - frame.x) : frame.w;
			if (w <= free - (L.logo ? L.logo.clear + 8 * k : 0)) {
				capH = Math.max(capH, fs * 1.2);
				const cy = l ? l.y + l.h / 2 : top + fs * 0.6;
				L.badgeLine = { text: shown, size: fs, x: side === 'right' ? (l ? right(frame) : frame.x) : frame.x, baseline: cy + fs * 0.36, align: side === 'right' && l ? 'right' : 'left' };
			} else {
				if (w > frame.w) throw new Error(`The badge "${badge}" is too long for a line at ${size}. Shorten it.`);
				const y = top + logoH + (L.logo?.clear ?? 0) + 6 * k;
				capH = y + fs * 1.2 - top;
				L.badgeLine = { text: shown, size: fs, x: frame.x, baseline: y + fs, align: 'left' };
			}
		}
		if (L.logo) capH = Math.max(capH, bottom(L.logo.rect) - top);
		const { step, h: bandH } = flatBand(W, H);
		const cap = Math.min(H * 0.6, top + capH + Math.max(m * 0.7, (L.logo?.clear ?? 0)));
		L.cap = { h: cap, ground, step, bandH };
		const bodyGround: SceneGround = t.body ?? 'paper';
		const page = { x: frame.x, y: cap + L.cap.bandH + 14 * k, w: frame.w, h: 0 };
		page.h = bottom(frame) - page.y;
		const s2 = { ...s, scan: false };
		L.number = smallLine(s2, stage, page, 'number', s.number, 'bottom-right', bodyGround, []);
		L.footer = smallLine(s2, stage, page, 'footer', s.footer, 'bottom-left', bodyGround, L.number ? [inflate(L.number.box, 8 * k)] : [], s.footerOptional);
		L.words = placeWords({ ...words, badge: '' }, s.edits, stage, page, [...covered, ...lines()], opts({ ax: page.x + page.w / 2, ay: (cap + L.cap.bandH + Math.min(H, bottom(frame) + m)) / 2 }));
	} else if (s.template === 'quote') {
		L.logo = logoAt(s, stage, frame, s.ground, { anchors: [...TOPS, 'bottom-left', 'bottom-right'] });
		small(s.ground);
		L.quote = layoutQuote(s, stage, frame, [...covered, ...clearOf(L.logo), ...lines()]);
		L.window = L.quote.rect;
	} else if (s.template === 'window' || s.template === 'screenshot') {
		L.logo = logoAt(s, stage, frame, s.ground, {});
		const edit = s.edits.picture ?? {};
		const gap = 40 * k;
		const hidden = Boolean(edit.hidden);
		if (hidden) {
			small(s.ground);
			L.words = placeWords(words, s.edits, stage, frame, [...covered, ...clearOf(L.logo), ...lines()], opts({}));
		} else if (stage.wide) {
			// Words put on the right send the window to the left.
			const onLeft = edit.anchor === 'left' || (!edit.anchor && Boolean(s.edits.headline?.anchor?.includes('right')));
			// The editor's window: half the width, the full height of the frame. Where that leaves the words too little room
			// (a banner whose corner the profile picture covers), the window gives way before the words shrink.
			const S0 = S * (s.edits.headline?.scale ?? 1);
			const first = Math.min(0.62, (s.template === 'screenshot' ? 0.54 : 0.5) * Math.max(1, edit.scale ?? 1));
			const shares = edit.scale !== undefined ? [first] : [first, first * 0.86, first * 0.74];
			let best: { window: Rect; words: Placed | null; footer: SmallLine | null; number: SmallLine | null } | undefined;
			let failed: unknown;
			for (const share of shares) {
				try {
					const wz = windowSize(s, stage, frame.w * share, frame.h - sc.window.bar * k * 0.2);
					const x = onLeft ? frame.x : right(frame) - wz.w;
					L.window = { x: x + (edit.dx ?? 0) * W, y: frame.y + (frame.h - wz.h) / 2 + (edit.dy ?? 0) * H, w: wz.w, h: wz.h };
					const blocked = [...stage.avoid, ...clearOf(L.logo)];
					for (const a of [...stage.avoid, ...clearOf(L.logo)]) if (hit(L.window, a)) {
						// A window over a covered corner moves up and gets smaller to stay whole and clear of it.
						const free = freeRects(frame, blocked).filter((f) => (onLeft ? f.x <= frame.x + frame.w * 0.5 : right(f) >= right(frame) - 1)).sort((p, q) => windowSize(s, stage, Math.min(q.w, frame.w * share), q.h).w - windowSize(s, stage, Math.min(p.w, frame.w * share), p.h).w)[0];
						if (!free) break;
						const z = windowSize(s, stage, Math.min(free.w, frame.w * share), free.h);
						L.window = { x: (onLeft ? free.x : right(free) - z.w) + (edit.dx ?? 0) * W, y: free.y + (free.h - z.h) / 2 + (edit.dy ?? 0) * H, w: z.w, h: z.h };
						break;
					}
					const wall = inflate(L.window, 0);
					// The words keep to their side of the window.
					const col: Rect = onLeft ? { x: right(wall) + gap, y: frame.y, w: right(frame) - right(wall) - gap, h: frame.h } : { x: frame.x, y: frame.y, w: wall.x - gap - frame.x, h: frame.h };
					small(s.ground, [], col);
					const maxW = s.edits.headline?.align === 'center' ? s.textWidth * stage.box.w : Math.max(s.textWidth * stage.box.w, col.w * 0.94);
					L.words = placeWords(words, s.edits, stage, col, [...covered, ...clearOf(L.logo), ...lines()], opts({ align: 'left', ax: col.x, ay: frame.y + frame.h / 2, maxW }));
					const got = { window: L.window!, words: L.words, footer: L.footer, number: L.number };
					if (!best || (got.words?.m.S ?? 0) > (best.words?.m.S ?? 0) + 0.5) best = got;
					if (!words.headline || (got.words?.m.S ?? 0) >= S0 * 0.92) break;
				} catch (error) {
					failed = error;
				}
			}
			if (!best) throw failed;
			Object.assign(L, best);
		} else {
			small(s.ground);
			// On a tall size the window is under the words, or over them when it is moved to the other side.
			const below = edit.anchor !== 'left';
			const blocked = [...covered, ...clearOf(L.logo), ...lines()];
			// Words over the window (or under it), the pair centered in the free height.
			const area = freeRects(frame, blocked).sort((p, q) => q.w * q.h - p.w * p.h).find((r) => r.w > frame.w * 0.8) ?? frame;
			const minWin = Math.max(170 * k, area.h * 0.36);
			const has = words.headline || words.body || words.badge || words.button;
			const m = has ? fitWords(words, s.edits, stage, { w: area.w, h: area.h - minWin - gap }, { S: S * (s.edits.headline?.scale ?? 1), maxW: s.textWidth * stage.box.w, bodyMax: s.textWidth * stage.box.w * sc.body.width }) : null;
			if (has && !m) throw tooLong(words, stage, { w: area.w, h: area.h - minWin - gap }, size);
			const wz = windowSize(s, stage, area.w, area.h - (m ? m.h + gap : 0));
			const total = (m ? m.h + gap : 0) + wz.h;
			const y0 = area.y + Math.max(0, (area.h - total) / 2);
			const wy = below ? y0 + (m ? m.h + gap : 0) : y0;
			L.window = { x: area.x + (area.w - wz.w) / 2 + (edit.dx ?? 0) * W, y: wy + (edit.dy ?? 0) * H, w: wz.w, h: wz.h };
			if (m) {
				const ty = below ? y0 : y0 + wz.h + gap;
				const zone = { x: area.x, y: ty, w: area.w, h: m.h + 1 };
				L.words = placeWords(words, s.edits, stage, zone, [], opts({ ax: area.x + area.w / 2, ay: ty + m.h / 2, align: s.edits.headline?.align ?? 'center' }));
			}
		}
	} else {
		// The centered layouts: the words in the middle, the objects (if any) round them.
		L.logo = logoAt(s, stage, frame, s.ground, {});
		small(s.ground);
		const obstacles = [...covered, ...clearOf(L.logo), ...lines()];
		const art = s.edits.art ?? {};
		const under = s.objects.mode === 'under' && !art.hidden ? s.objects.under : undefined;
		if (under) {
			const U = cfg.stickers.under;
			const shortSide = Math.min(stage.box.w, stage.box.h);
			const inkA = (under.art.width * under.art.ink.w) / (under.art.height * under.art.ink.h);
			const anchor = stage.wide ? 'right' : 'bottom';
			const across = anchor === 'right';
			const zone: Rect = across
				? { x: frame.x + frame.w * 0.62, y: frame.y, w: frame.w * 0.38, h: frame.h }
				: { x: frame.x, y: frame.y + frame.h * 0.5, w: frame.w, h: frame.h * 0.5 };
			const wordZone: Rect = across ? { x: frame.x, y: frame.y, w: frame.w - zone.w - 20 * k, h: frame.h } : { x: frame.x, y: frame.y, w: frame.w, h: frame.h * 0.48 };
			L.words = placeWords(words, s.edits, stage, wordZone, obstacles, opts(across ? { align: 'left', ax: wordZone.x, ay: frame.y + frame.h / 2, maxW: wordZone.w } : { ax: frame.x + frame.w / 2, ay: stage.box.y + stage.box.h * U.textY }));
			const keep = [...obstacles, ...(L.words ? [inflate(L.words.box, 22 * k)] : [])];
			const spot = freeRects(across ? zone : frame, keep).filter((r) => across || r.y > (L.words ? L.words.box.y : 0)).map((r) => ({ r, w: Math.min(r.w * 0.94, r.h * 0.94 * inkA, U.maxSize * shortSide * Math.min(1.6, art.scale ?? 1) * (inkA < 1 ? inkA : 1)) })).sort((p, q) => q.w - p.w)[0];
			if (spot && spot.w > 40 * k) {
				const inkW = spot.w * Math.min(1, art.scale ?? 1);
				let rotate = under.rotate;
				let st: Sticker = { art: under.art, x: 0, y: 0, size: inkW / under.art.ink.w / Math.min(W, H), rotate };
				const b0 = stickerBox({ ...st, x: 0.5, y: 0.5 }, W, H);
				const shrink = Math.min(1, (spot.r.w * 0.98) / b0.w, (spot.r.h * 0.98) / b0.h);
				st = { ...st, size: st.size * shrink };
				const b1 = stickerBox({ ...st, x: 0.5, y: 0.5 }, W, H);
				const ox = b1.x + b1.w / 2 - W / 2;
				const oy = b1.y + b1.h / 2 - H / 2;
				const cx = across ? spot.r.x + spot.r.w / 2 : Math.max(spot.r.x + b1.w / 2, Math.min(right(spot.r) - b1.w / 2, frame.x + frame.w / 2));
				L.stickers = [{ ...st, x: (cx - ox) / W, y: (spot.r.y + spot.r.h / 2 - oy) / H }];
			} else L.notes.push(`Left out ${under.art.name}: there is no room for it beside these words.`);
		} else L.words = placeWords(words, s.edits, stage, frame, obstacles, opts({}));
	}

	// Objects keep clear of everything drawn and of what the platform covers.
	const art = s.edits.art ?? {};
	if ((s.objects.mode === 'preset' || s.objects.mode === 'scatter') && !art.hidden) {
		const fit = cfg.stickers.fit;
		// Objects are art, not words: they may sit by a covered corner rather than shrink to dodge it.
		const keep = [
			...(L.logo ? [inflate(L.logo.rect, Math.max(L.logo.clear, fit.clear * k))] : []),
			...(L.words ? [inflate(L.words.box, fit.clear * k)] : []),
			...(L.window ? [inflate(L.window, fit.clear * k)] : []),
			...(L.cards ? [...L.cards.cards.map((c) => inflate(c.rect, fit.clear * k)), ...(L.cards.title ? [titleBox(L.cards, fit.clear * k)] : []), ...[L.cards.footer, L.cards.number].filter((l): l is SmallLine => Boolean(l)).map((l) => inflate(l.box, 10 * k))] : []),
			...lines(),
		];
		const open = { ...frame, x: Math.max(stage.box.x + 10 * k, frame.x - 22 * k), w: 0 };
		open.w = Math.min(stage.box.x + stage.box.w - 10 * k, right(frame) + 22 * k) - open.x;
		if (stage.frame.x - stage.box.x > sc.margin * k * 1.2) Object.assign(open, frame);
		const scale = art.scale ?? 1;
		const got = s.objects.mode === 'preset'
			? settle(s.objects.targets.map((o) => ({ ...o, size: (o.size * scale * Math.min(stage.box.w, stage.box.h)) / Math.min(W, H), x: (stage.box.x + o.x * stage.box.w) / W, y: (stage.box.y + o.y * Math.min(stage.box.h, room - stage.box.y)) / H })), W, H, open, keep, fit.gap * k)
			: scatter(W, H, open, keep, s.objects.count, s.objects.seed, s.objects.names, cfg.stickers.scatter.gap * k, scale, s.objects.asked);
		L.stickers = got.stickers;
		if (got.left.length) L.notes.push(`Left out ${got.left.join(', ')}: no room clear of the words and the logo.`);
	}
	layouts.set(s, L);
	return L;
}

const titleBox = (c: CardsLayout, by: number) => {
	const t = c.title!;
	const { medium } = brandFonts();
	return inflate(union(t.w.lines.map((line, i) => lineBox(medium, line, t.x, t.y + t.size * 0.9 + i * t.size * 1.15, t.size, trackingFor(t.size), t.align))), by);
};

const eyeTracking = () => Number.parseFloat(tokens().site[imageConfig().scene.eyebrow.tracking] ?? '0');

// The scene ---------------------------------------------------------------------------------------------------------

export type Drawn = { svg: string; text: Rect | null; logo: Rect | null; stickers: Rect[]; window: Rect | null; layers: DrawnLayer[]; notes: string[] };

/** Draws the scene's body (no document wrapper), so decks and video frames can reuse it. */
export function drawScene(s: Scene, motion?: Motion, ids = new Ids('s')): Drawn {
	const cfg = imageConfig().scene;
	const W = s.width;
	const H = s.height;
	const L = layoutOf(s);
	const { k, small } = L.stage;
	const layers = new Layers();
	const ground = groundColor(s.ground);
	const out: string[] = [];
	let wordGround = s.ground;
	if (L.cap) {
		const bodyGround: SceneGround = imageConfig().templates.announcement.body ?? 'paper';
		wordGround = bodyGround;
		out.push(rect(0, 0, W, H, groundColor(bodyGround)), rect(0, 0, W, L.cap.h + 0.5, ground));
		out.push(band(ids, W, L.cap.h, L.cap.step, H, ground, groundColor(bodyGround), bandMixes()));
		layers.add({ id: 'cap', kind: 'panel', box: { x: 0, y: 0, w: W, h: L.cap.h }, bleeds: true, can: {} });
		layers.add({ id: 'band', kind: 'panel', box: { x: 0, y: L.cap.h, w: W, h: L.cap.bandH }, bleeds: true, can: {} });
	} else {
		out.push(rect(0, 0, W, H, ground));
		if (s.scan && s.ground === 'blue') out.push(scan(ids, 0, 0, W, L.room, cfg.scan, s.template === 'hero' || s.template === 'logo'));
		if (L.band.h) {
			out.push(band(ids, W, L.room, L.band.step, H, ground, groundColor(s.band as SceneGround), bandMixes(), imageConfig().templates[s.template].flatBand ? undefined : cfg.grain, motion?.grain));
			layers.add({ id: 'band', kind: 'panel', box: { x: 0, y: L.room, w: W, h: H - L.room }, bleeds: true, can: { hide: true } });
		}
	}
	const over = L.cap ? ['cap'] : undefined;
	const objects = () => {
		const short = Math.min(W, H);
		const list = L.stickers;
		if (!list.length) return;
		const boxes = list.map((st) => stickerBox(st, W, H));
		// One layer per object; an edit to the first (art) is an edit to all of them.
		boxes.forEach((box, i) => layers.add({ id: i ? `art-${i + 1}` : 'art', kind: 'art', box, can: i ? {} : ART_CAN }));
		out.push(
			...list.map((st, i) => {
				const mo = motion?.stickers?.[i];
				const w = st.size * short * (mo?.scale ?? 1);
				return placed(st.art.href, st.x * W + (mo?.dx ?? 0), st.y * H + (mo?.dy ?? 0), w, (w * st.art.height) / st.art.width, st.rotate + (mo?.dr ?? 0), mo?.opacity ?? 1);
			}),
		);
	};
	const windowLayer = (r: Rect, kind: 'key' | 'panel', can: DrawnLayer['can']) => layers.add({ id: 'picture', kind, box: r, can });
	const moved = (svg: string) => {
		const wm = motion?.window;
		return wm ? `<g opacity="${num(wm.opacity)}" transform="translate(0 ${num(wm.dy)})">${svg}</g>` : svg;
	};

	if (L.cards) {
		out.push(drawCards(ids, s, L.cards, L.stage, layers, motion));
		objects();
	} else {
		if (s.template === 'hero' || s.template === 'headline' || s.template === 'subtext') objects();
		if (L.logo) out.push(drawLogoAt(L.logo, layers, motion?.logo?.opacity ?? 1, over));
		if (L.badgeLine) {
			const { medium } = brandFonts();
			const bl = L.badgeLine;
			const color = isDark(s.ground) ? tokenColor('text-on-brand-label') : tokenColor('text-label');
			out.push(lineAt(medium, bl.text, bl.x, bl.baseline, bl.size, eyeTracking(), bl.align, color, motion?.words?.[0]?.opacity ?? 1));
			layers.text('badge', medium, [{ text: bl.text, x: bl.x, baseline: bl.baseline }], bl.size, eyeTracking(), bl.align, color, [ground], s.badge.trim(), s.badge.trim(), { scale: [0.9, 1.6], hide: true }, over);
		}
		if (L.quote) {
			const q = L.quote;
			const { medium, regular } = brandFonts();
			windowLayer(q.rect, 'panel', {});
			const face = tokenColor('white');
			const rows = q.quote.w.lines.map((text, i) => ({ text, x: q.quote.x, baseline: q.quote.baseline + i * q.quote.size * q.quote.leading }));
			const byRows = q.by ? q.by.w.lines.map((text, i) => ({ text, x: q.by!.x, baseline: q.by!.baseline + i * q.by!.size * 1.3 })) : [];
			out.push(
				moved(
					drawWindow(ids, { windowBody: 'white', picture: null, window: s.window, fill: false }, q.rect, k, small, layers, () =>
						[
							lineAt(medium, '“', q.mark.x, q.mark.baseline, q.mark.size, 0, 'left', tokenColor('brand')),
							...rows.map((r) => lineAt(medium, r.text, r.x, r.baseline, q.quote.size, trackingFor(q.quote.size / k), 'left', tokenColor('ink'))),
							...byRows.map((r) => lineAt(regular, r.text, r.x, r.baseline, q.by!.size, 0, 'left', tokenColor('brand'))),
						].join(''),
					),
				),
			);
			layers.text('quote', medium, rows, q.quote.size, trackingFor(q.quote.size / k), 'left', tokenColor('ink'), [face], s.quote.trim(), readBack(q.quote.w), { scale: [0.6, 1.5] }, ['picture']);
			if (q.by) layers.text('by', regular, byRows, q.by.size, 0, 'left', tokenColor('brand'), [face], s.by.trim(), readBack(q.by.w), { hide: true }, ['picture']);
		} else if (L.window) {
			windowLayer(L.window, 'key', PICTURE_CAN);
			out.push(moved(drawWindow(ids, s, L.window, k, small, layers)));
		}
		if (L.words) out.push(drawWords(ids, L.words, wordGround, s.scan && !L.cap, k, layers, L.badgeLine ? motion?.words?.slice(1) : motion?.words));
		if (s.template === 'window' || s.template === 'screenshot' || s.template === 'quote') objects();
		for (const l of [L.footer, L.number]) if (l) out.push(drawSmall(l, layers));
	}
	return { svg: out.join(''), text: L.words?.box ?? (L.cards?.title ? titleBox(L.cards, 0) : null), logo: L.logo?.rect ?? null, stickers: L.stickers.map((st) => stickerBox(st, W, H)), window: L.window, layers: layers.list, notes: [...s.notes, ...L.notes] };
}

export function sceneSvg(s: Scene, motion?: Motion): string {
	const drawn = drawScene(s, motion);
	return document(s.width, s.height, s.title || s.headline || s.quote || s.template, drawn.svg);
}
