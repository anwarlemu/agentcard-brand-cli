// The words of a layout: measured, fitted into the free room, drawn, and reported as they were drawn. Words shrink to a
// floor and re-wrap; when they still do not fit the render fails and says what to shorten. They are never cut.

import type { Font } from 'opentype.js';
import type { DrawnLayer, LayerEdit, Rect } from '../design/types.js';
import { tokens } from '../lib/brand.js';
import { imageConfig, type SceneGround, type Stage } from './config.js';
import { boxShadow, Ids, num, radiusPx, shadowToken } from './effects.js';
import { brandFonts, drawable, drawLine, flatten, lineInk, measure, mix, readBack, rect, tokenColor, trackingEm, trackingFor, wrapEven, wrapFit, type Wrapped } from './paint.js';
import { bottom, freeRects, right, union } from './space.js';

export type Align = 'left' | 'center' | 'right';
export type Edits = Record<string, LayerEdit>;

export const groundColor = (g: SceneGround) => tokenColor(imageConfig().grounds[g].token);
export const isDark = (g: SceneGround) => imageConfig().grounds[g].dark;

/** The colors a word on this ground can meet: the flat ground, and with scanlines the darkest their vignette makes it. */
export function groundColors(g: SceneGround, scan = false): string[] {
	const flat = groundColor(g);
	const spec = imageConfig().scene.scan;
	return scan && g === 'blue' ? [flat, mix(flat, tokenColor(spec.line), Math.min(1, spec.vignetteAlpha + spec.sidesAlpha + spec.lineAlpha))] : [flat];
}

export const tokenNumber = (name: string) => {
	const raw = tokens().site[name];
	if (!raw) throw new Error(`Missing brand token ${name}.`);
	return Number.parseFloat(raw);
};

export function lineAt(font: Font, text: string, x: number, baseline: number, size: number, tracking: number, align: Align, fill: string, opacity = 1) {
	const w = measure(font, text, size, tracking);
	const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
	const svg = drawLine(font, text, left, baseline, size, tracking, w + size, fill);
	return opacity < 1 ? `<g opacity="${num(opacity)}">${svg}</g>` : svg;
}

/** The ink of a line placed the way lineAt places it. */
export function lineBox(font: Font, text: string, x: number, baseline: number, size: number, tracking: number, align: Align): Rect {
	const w = measure(font, text, size, tracking);
	return lineInk(font, text, align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, baseline, size, tracking);
}

/** Collects what the drawing code drew. */
export class Layers {
	list: DrawnLayer[] = [];
	add(layer: DrawnLayer) {
		this.list.push(layer);
	}
	/** `own` marks the brand's own words (its address) and numbering, which nobody passed. */
	text(id: string, font: Font, rows: { text: string; x: number; baseline: number }[], size: number, tracking: number, align: Align, color: string, ground: string[], asked: string, drawn: string, can: DrawnLayer['can'] = {}, over?: string[], own = false) {
		const ink = rows.filter((r) => r.text).map((r) => lineBox(font, r.text, r.x, r.baseline, size, tracking, align));
		if (!ink.length) return;
		this.add({ id, kind: 'text', box: union(ink), ink, ...(over ? { over } : {}), text: { asked, drawn, size, color, ground, ...(own ? { own } : {}) }, can });
	}
}

export type WordsIn = { badge: string; headline: string; body: string; button: string };

export type Words = {
	S: number;
	eye: number;
	bodyS: number;
	keyS: number;
	keyH: number;
	keyW: number;
	head: Wrapped;
	body: Wrapped;
	eyeText: string;
	eyeW: number;
	h: number;
	/** Room over the first line for marks that stand taller than capitals (stacked accents). */
	lead: number;
	w: number;
	leading: number;
	bodyLeading: number;
	track: number;
	asked: WordsIn;
	gaps: { eye: number; head: number; body: number };
};

const NONE: Wrapped = { lines: [], soft: [] };

/** Where an edited layer's scale lands: its own times the layout's. */
const scaleOf = (edits: Edits, id: string) => edits[id]?.scale ?? 1;

export function readable(words: WordsIn, edits: Edits): WordsIn {
	const keep = (id: string, v: string, what: string) => (edits[id]?.hidden ? '' : v.trim() ? drawable(v.trim(), what) : '');
	return { badge: keep('badge', words.badge, 'badge'), headline: keep('headline', words.headline, 'headline'), body: keep('body', words.body, 'body'), button: keep('button', words.button, 'button') };
}

function measureWords(words: WordsIn, edits: Edits, stage: Stage, max: number, S: number, bodyMax: number, squeeze: number): Words | null {
	const cfg = imageConfig().scene;
	const { medium, regular } = brandFonts();
	const { k, small } = stage;
	const track = trackingFor(S / Math.max(k, 0.5));
	const leading = tokenNumber(cfg.headline.leading);
	const bodyLeading = tokenNumber(cfg.body.leading);
	const eye = Math.max(small, cfg.eyebrow.size * k * scaleOf(edits, 'badge'));
	const bodyS = Math.max(small * 1.08, Math.min(cfg.body.max * k, Math.max(cfg.body.min * k, S * cfg.body.ratio)) * scaleOf(edits, 'body') * squeeze);
	const keyS = Math.max(small, cfg.key.size * k * scaleOf(edits, 'button') * squeeze);
	const keyR = keyS / cfg.key.size;
	const head = words.headline ? wrapEven(medium, words.headline, S, track, max) : NONE;
	const body = words.body ? wrapEven(regular, words.body, bodyS, 0, Math.min(max, bodyMax)) : NONE;
	if (!head || !body) return null;
	const eyeText = cfg.eyebrow.caps ? words.badge.toUpperCase() : words.badge;
	const eyeW = eyeText ? measure(medium, eyeText, eye, trackingEm(cfg.eyebrow.tracking)) : 0;
	const keyW = words.button ? measure(medium, words.button, keyS, 0) + cfg.key.padX * 2 * keyR : 0;
	if (eyeW > max || keyW > max) return null;
	const gaps = { eye: cfg.eyebrow.gap * k * squeeze, head: Math.max(S * cfg.headline.gap, 10 * k), body: cfg.body.gap * k * squeeze };
	const parts: { h: number; gap: number }[] = [];
	if (eyeW) parts.push({ h: eye * 1.2, gap: gaps.eye });
	if (head.lines.length) parts.push({ h: head.lines.length * S * leading, gap: gaps.head });
	if (body.lines.length) parts.push({ h: body.lines.length * bodyS * bodyLeading, gap: gaps.body });
	const keyH = cfg.key.height * keyR;
	if (keyW) parts.push({ h: keyH, gap: 0 });
	const first = eyeW ? '' : (head.lines[0] ?? '');
	const lead = first ? Math.max(0, -lineInk(medium, first, 0, 0, S, track).y - S * 0.86) : 0;
	const h = lead + parts.reduce((n, p, i) => n + p.h + (i < parts.length - 1 ? p.gap : 0), 0);
	const w = Math.max(1, eyeW, keyW, ...head.lines.map((l) => measure(medium, l, S, track)), ...body.lines.map((l) => measure(regular, l, bodyS, 0)));
	return { S, eye, bodyS, keyS, keyH, keyW, head, body, eyeText, eyeW, h, lead, w, leading, bodyLeading, track, asked: words, gaps };
}

/** The floor for a headline: 26 px at the base scale, and always a step over the small words. */
const headFloor = (stage: Stage) => Math.max(imageConfig().scene.headline.min * stage.k, stage.small * 1.25);

/** The words at the layout's size, shrunk only as far as they must to fit w by h. Null when even the floor spills. */
export function fitWords(words: WordsIn, edits: Edits, stage: Stage, room: { w: number; h: number }, opts: { S: number; maxW: number; bodyMax: number }): Words | null {
	const cfg = imageConfig().scene.headline;
	const floor = headFloor(stage);
	const top = Math.max(floor, opts.S);
	const lines = (n: number, m: Words) => m.head.lines.length <= n;
	const tryPass = (pass: { n: number; w: number; q: number }): Words | null => {
		for (let S = top; ; S = Math.max(floor, S * 0.95)) {
			const m = measureWords(words, edits, stage, pass.w, S, Math.max(opts.bodyMax, pass.q < 1 ? room.w : 0), pass.q);
			if (m && lines(pass.n, m) && m.h <= room.h + 0.5 && m.w <= room.w + 0.5) return m;
			if (S <= floor) return null;
		}
	};
	const first = tryPass({ n: cfg.maxLines, w: Math.min(room.w, opts.maxW), q: 1 });
	if (first && first.S > top * 0.7) return first;
	// A long line gets more lines, or a wider column, when that keeps it clearly larger.
	const wide = Math.min(room.w, opts.maxW * 1.2);
	const second = [tryPass({ n: cfg.maxLines + 2, w: Math.min(room.w, opts.maxW), q: 1 }), tryPass({ n: cfg.maxLines, w: wide, q: 1 }), tryPass({ n: cfg.maxLines + 2, w: wide, q: 1 })].filter((m): m is Words => Boolean(m)).sort((p, q) => q.S - p.S)[0];
	if (second && second.S > (first?.S ?? 0) * 1.18) return second;
	return first ?? tryPass({ n: cfg.maxLinesTight, w: room.w, q: 1 }) ?? tryPass({ n: cfg.maxLinesTight, w: room.w, q: 0.72 });
}

/** What to say when the words do not fit: the word that is too long, or how long the copy is. */
export function tooLong(words: WordsIn, stage: Stage, room: { w: number; h: number }, size: string): Error {
	const { medium } = brandFonts();
	const floor = headFloor(stage);
	const long = words.headline.split(/\s+/).find((w) => !wrapFit(medium, w, floor, trackingFor(floor / stage.k), room.w));
	if (long) return new Error(`"${long}" is too long for a line at ${size}. Shorten it or put a space in it.`);
	const parts = [words.headline && `headline (${words.headline.length} characters)`, words.body && `body (${words.body.length})`, words.badge && `badge (${words.badge.length})`, words.button && `button (${words.button.length})`].filter(Boolean);
	return new Error(`The words do not fit ${size}. Shorten the ${parts.join(', ')}, or pick a larger size.`);
}

export type Placed = { m: Words; x: number; top: number; align: Align; box: Rect; room: Rect };

/**
 * Fits the words in the free room and places them nearest a point: of every free box round the logo and the parts a
 * platform covers, the one that keeps the words largest and closest to where the layout wants them.
 */
export function placeWords(words: WordsIn, edits: Edits, stage: Stage, frame: Rect, obstacles: Rect[], opts: { S: number; maxW: number; align: Align; ax: number; ay: number; W: number; H: number; size: string }): Placed | null {
	if (!words.badge && !words.headline && !words.body && !words.button) return null;
	const cfg = imageConfig().scene;
	const edit = edits.headline ?? {};
	const anchored = edit.anchor !== undefined;
	const col = edit.anchor?.includes('left') ? 'left' : edit.anchor?.includes('right') ? 'right' : 'center';
	const align: Align = edit.align ?? (anchored ? col : opts.align);
	const tx = anchored ? (col === 'left' ? frame.x : col === 'right' ? right(frame) : frame.x + frame.w / 2) : edit.align && edit.align !== opts.align ? (edit.align === 'left' ? frame.x : edit.align === 'right' ? right(frame) : frame.x + frame.w / 2) : opts.ax;
	const ty = anchored ? (edit.anchor!.startsWith('top') ? frame.y : edit.anchor!.startsWith('bottom') ? bottom(frame) : frame.y + frame.h / 2) : opts.ay;
	const S = opts.S * scaleOf(edits, 'headline');
	const maxW = opts.maxW * Math.max(1, scaleOf(edits, 'headline'));
	const diag = Math.hypot(frame.w, frame.h);
	let best: (Placed & { score: number }) | null = null;
	for (const room of freeRects(frame, obstacles).slice(0, 10)) {
		if (room.w < 60 * stage.k || room.h < stage.small) continue;
		const m = fitWords(words, edits, stage, room, { S, maxW, bodyMax: maxW * cfg.body.width });
		if (!m) continue;
		const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(Math.max(lo, hi), v));
		const x = align === 'left' ? clamp(tx, room.x, right(room) - m.w) : align === 'right' ? clamp(tx, room.x + m.w, right(room)) : clamp(tx, room.x + m.w / 2, right(room) - m.w / 2);
		const wantTop = anchored ? (edit.anchor!.startsWith('top') ? ty : edit.anchor!.startsWith('bottom') ? ty - m.h : ty - m.h / 2) : ty - m.h / 2;
		const top = clamp(wantTop, room.y, bottom(room) - m.h);
		const left = align === 'left' ? x : align === 'right' ? x - m.w : x - m.w / 2;
		const dist = Math.hypot(x - tx, top - wantTop) / diag;
		const score = m.S / S - dist * 0.8;
		if (!best || score > best.score + 1e-6) best = { m, x, top, align, box: { x: left, y: top, w: m.w, h: m.h }, room, score };
	}
	if (!best) {
		const widest = freeRects(frame, obstacles)[0] ?? frame;
		throw tooLong(words, stage, widest, opts.size);
	}
	const dx = (edit.dx ?? 0) * opts.W;
	const dy = (edit.dy ?? 0) * opts.H;
	return { m: best.m, x: best.x + dx, top: best.top + dy, align, box: { ...best.box, x: best.box.x + dx, y: best.box.y + dy }, room: best.room };
}

export const WORD_CAN: Record<string, DrawnLayer['can']> = {
	badge: { scale: [0.9, 1.6], hide: true },
	headline: { move: true, scale: [0.5, 1.6], align: true, anchors: ['center', 'top-left', 'top', 'top-right', 'left', 'right', 'bottom-left', 'bottom', 'bottom-right'] },
	body: { scale: [0.8, 1.6], hide: true },
	button: { scale: [0.9, 1.4], hide: true },
};

function drawKey(ids: Ids, label: string, m: Words, x: number, y: number, k: number, onBlue: boolean, align: Align, layers: Layers) {
	const cfg = imageConfig().scene.key;
	const { medium } = brandFonts();
	const left = align === 'center' ? x - m.keyW / 2 : align === 'right' ? x - m.keyW : x;
	const r = radiusPx(cfg.radius, k);
	const face = onBlue ? tokenColor('white') : tokenColor('brand');
	const ink = onBlue ? tokenColor('brand') : tokenColor('white');
	const sh = boxShadow(ids, left, y, m.keyW, m.keyH, r, shadowToken(onBlue ? cfg.onBlue : cfg.onLight), k);
	const cx = left + m.keyW / 2;
	const base = y + m.keyH / 2 + m.keyS * 0.35;
	layers.add({ id: 'button', kind: 'key', box: { x: left, y, w: m.keyW, h: m.keyH }, text: { asked: label, drawn: label, size: m.keyS, color: ink, ground: [face] }, can: WORD_CAN.button! });
	return `<defs>${sh.defs}</defs>${sh.under}${rect(left, y, m.keyW, m.keyH, face, r)}${sh.over}${lineAt(medium, label, cx, base, m.keyS, 0, 'center', ink)}`;
}

/** The words in the brand's order, from `top`. Each part can carry its own motion. */
export function drawWords(ids: Ids, p: Placed, ground: SceneGround, scan: boolean, k: number, layers: Layers, motion?: { opacity: number; dy: number }[], over?: string[]) {
	const cfg = imageConfig().scene;
	const { medium, regular } = brandFonts();
	const { m, x, align } = p;
	const dark = isDark(ground);
	const flat = groundColor(ground);
	const grounds = groundColors(ground, scan);
	const out: string[] = [];
	let y = p.top + m.lead;
	let part = 0;
	const wrapPart = (svg: string) => {
		const mo = motion?.[part];
		part += 1;
		return mo ? `<g opacity="${num(mo.opacity)}" transform="translate(0 ${num(mo.dy)})">${svg}</g>` : svg;
	};
	if (m.eyeText) {
		const color = dark ? tokenColor('text-on-brand-label') : tokenColor('text-label');
		const t = trackingEm(cfg.eyebrow.tracking);
		const base = y + m.eye * 0.95;
		out.push(wrapPart(lineAt(medium, m.eyeText, x, base, m.eye, t, align, color)));
		layers.text('badge', medium, [{ text: m.eyeText, x, baseline: base }], m.eye, t, align, color, grounds, m.asked.badge, m.asked.badge, WORD_CAN.badge, over);
		y += m.eye * 1.2 + m.gaps.eye;
	}
	if (m.head.lines.length) {
		const color = dark ? tokenColor('white') : tokenColor('ink');
		const rows = m.head.lines.map((text, i) => ({ text, x, baseline: y + m.S * 0.86 + i * m.S * m.leading }));
		out.push(wrapPart(rows.map((r) => lineAt(medium, r.text, r.x, r.baseline, m.S, m.track, align, color)).join('')));
		layers.text('headline', medium, rows, m.S, m.track, align, color, grounds, m.asked.headline, readBack(m.head), WORD_CAN.headline, over);
		y += m.head.lines.length * m.S * m.leading + m.gaps.head;
	}
	if (m.body.lines.length) {
		const color = dark ? flatten(tokenColor('text-on-brand-muted'), flat) : tokenColor('text-muted');
		const rows = m.body.lines.map((text, i) => ({ text, x, baseline: y + m.bodyS * 1.05 + i * m.bodyS * m.bodyLeading }));
		out.push(wrapPart(rows.map((r) => lineAt(regular, r.text, r.x, r.baseline, m.bodyS, 0, align, color)).join('')));
		layers.text('body', regular, rows, m.bodyS, 0, align, color, grounds, m.asked.body, readBack(m.body), WORD_CAN.body, over);
		y += m.body.lines.length * m.bodyS * m.bodyLeading + m.gaps.body;
	}
	if (m.keyW) out.push(wrapPart(drawKey(ids, m.asked.button, m, x, y, k, ground === 'blue', align, layers)));
	return out.join('');
}

/** One block of copy fitted to a box: shrunk and re-wrapped to a floor, or an error naming what to shorten. */
export function fitBlock(font: Font, text: string, o: { what: string; w: number; h: number; size: number; floor: number; leading: number; maxLines: number; k: number }): { w: Wrapped; size: number; tracking: number; h: number; leading: number } {
	const value = drawable(text, o.what);
	for (let size = Math.max(o.floor, o.size); ; size = Math.max(o.floor, size * 0.95)) {
		const tracking = trackingFor(size / Math.max(o.k, 0.5));
		const w = wrapEven(font, value, size, tracking, o.w);
		if (w && w.lines.length <= o.maxLines && w.lines.length * size * o.leading <= o.h + 0.5) return { w, size, tracking, h: w.lines.length * size * o.leading, leading: o.leading };
		if (size <= o.floor) throw new Error(`The ${o.what} (${value.length} characters) does not fit. Shorten it.`);
	}
}

/** Draws a fitted block with its first line's top at y, and reports it. */
export function drawBlock(layers: Layers, id: string, font: Font, b: ReturnType<typeof fitBlock>, x: number, y: number, align: Align, color: string, ground: string[], asked: string, can: DrawnLayer['can'] = {}, own = false): string {
	const rows = b.w.lines.map((text, i) => ({ text, x, baseline: y + b.size * 0.86 + i * b.size * b.leading }));
	layers.text(id, font, rows, b.size, b.tracking, align, color, ground, asked, readBack(b.w), can, undefined, own);
	return rows.map((r) => lineAt(font, r.text, r.x, r.baseline, b.size, b.tracking, align, color)).join('');
}
