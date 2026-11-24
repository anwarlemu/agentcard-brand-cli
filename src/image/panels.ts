// The data layouts: a stat, a chart (bar, line, donut), pricing plans, a two-column comparison, a flow of steps, and
// a before and after. Built only from the brand's parts: white cards with its corner, shadow and edge, the window, the
// numbered badge, its blues and type. The brand never published a chart style; this one is derived from the tokens
// (brand/assets/image.json notes).

import type { Rect } from '../design/types.js';
import { imageConfig, type Stage } from './config.js';
import { boxShadow, Ids, num, radiusPx, rgbaOf, shadowToken } from './effects.js';
import type { Art } from './objects.js';
import { brandFonts, drawable, flatten, mix, readBack, rect, tokenColor, trackingFor, wrapEven, type Wrapped } from './paint.js';
import { bottom, right } from './space.js';
import { groundColor, isDark, lineAt, type Layers } from './words.js';
import type { SceneGround } from './config.js';

export const PANEL_TEMPLATES = ['stat', 'chart', 'pricing', 'compare', 'flow', 'before-after'] as const;
export type PanelTemplate = (typeof PANEL_TEMPLATES)[number];
export const isPanel = (t: string): t is PanelTemplate => (PANEL_TEMPLATES as readonly string[]).includes(t);

export type Datum = { label: string; value: number; shown: string };
export type Block = { title: string; lines: string[] };
export type PanelInput = { stat?: string; data?: Datum[]; chart?: 'bar' | 'line' | 'donut'; blocks?: Block[]; pictures?: [Art, Art]; left?: string; right?: string };

/** "Q1: 12, Q2: 18" or [{ label, value }] as data. */
export function parseData(value: unknown): Datum[] {
	const list: { label: string; raw: string }[] = Array.isArray(value)
		? value.map((d, i) => {
				if (!d || typeof d !== 'object') throw new Error(`data[${i}] must be { "label", "value" }.`);
				const o = d as Record<string, unknown>;
				return { label: String(o.label ?? ''), raw: String(o.value ?? '') };
			})
		: String(value ?? '').split(/[,\n]/).map((p) => p.trim()).filter(Boolean).map((p) => {
				const at = p.lastIndexOf(':');
				if (at < 1) throw new Error(`Each data point is "label: value", not "${p}".`);
				return { label: p.slice(0, at).trim(), raw: p.slice(at + 1).trim() };
			});
	if (list.length < 2) throw new Error('A chart needs at least two data points.');
	if (list.length > 12) throw new Error('Keep a chart to 12 data points.');
	return list.map(({ label, raw }) => {
		const value = Number(raw.replace(/[^0-9.\-]/g, ''));
		if (!label || !Number.isFinite(value) || value < 0) throw new Error(`"${label}: ${raw}" needs a label and a number of 0 or more.`);
		return { label, value, shown: raw };
	});
}

/** Blocks of lines, blank line between: the first line of each is its title. */
export function parseBlocks(value: unknown, what: string, min: number, max: number): Block[] {
	const text = Array.isArray(value) ? value.map((v) => (typeof v === 'string' ? v : [v?.title, ...(Array.isArray(v?.lines) ? v.lines : [])].join('\n'))).join('\n\n') : String(value ?? '');
	const blocks = text.replace(/\\n/g, '\n').split(/\n\s*\n/).map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean)).filter((b) => b.length).map(([title, ...lines]) => ({ title: title!, lines }));
	if (blocks.length < min || blocks.length > max) throw new Error(`${what} takes ${min === max ? min : `${min} to ${max}`} blocks (blank line between, title first); got ${blocks.length}.`);
	return blocks;
}

type Ctx = { stage: Stage; ground: SceneGround; layers: Layers; ids: Ids; k: number };

const card = (ctx: Ctx, r: Rect, id: string) => {
	const spec = imageConfig().templates.cards.cards!;
	const rad = radiusPx(spec.radius, ctx.k);
	const sh = boxShadow(ctx.ids, r.x, r.y, r.w, r.h, rad, shadowToken(spec.shadow), ctx.k);
	ctx.layers.add({ id, kind: 'panel', box: r, can: {} });
	const edge = isDark(ctx.ground) ? '' : `<rect x="${num(r.x + ctx.k / 2)}" y="${num(r.y + ctx.k / 2)}" width="${num(r.w - ctx.k)}" height="${num(r.h - ctx.k)}" rx="${num(rad)}" fill="none" stroke="${rgbaOf(tokenColor(spec.edge))}" stroke-width="${num(ctx.k)}"/>`;
	return `<defs>${sh.defs}</defs>${sh.under}${rect(r.x, r.y, r.w, r.h, tokenColor('white'), rad)}${sh.over}${edge}`;
};

/** One fitted block of words in a box, reported over its panel. */
function words(ctx: Ctx, id: string, text: string, r: Rect, o: { size: number; weight?: 'medium' | 'regular'; color: string; ground: string[]; align?: 'left' | 'center' | 'right'; maxLines?: number; over?: string[] }) {
	const { medium, regular } = brandFonts();
	const font = o.weight === 'regular' ? regular : medium;
	const value = drawable(text, id);
	const floor = ctx.stage.small;
	const leading = o.weight === 'regular' ? 1.3 : 1.12;
	for (let size = Math.max(floor, o.size); ; size = Math.max(floor, size * 0.94)) {
		const tr = o.weight === 'regular' ? 0 : trackingFor(size / ctx.k);
		const w = wrapEven(font, value, size, tr, r.w);
		if (w && w.lines.length <= (o.maxLines ?? 3) && w.lines.length * size * leading <= r.h + 0.5) {
			const align = o.align ?? 'left';
			const x = align === 'center' ? r.x + r.w / 2 : align === 'right' ? right(r) : r.x;
			const rows = w.lines.map((t, i) => ({ text: t, x, baseline: r.y + size * 0.86 + i * size * leading }));
			ctx.layers.text(id, font, rows, size, tr, align, o.color, o.ground, text, readBack(w), {}, o.over);
			return { svg: rows.map((row) => lineAt(font, row.text, row.x, row.baseline, size, tr, align, o.color)).join(''), h: w.lines.length * size * leading };
		}
		if (size <= floor) throw new Error(`"${text}" is too long for its place at this size. Shorten it.`);
	}
}

const onGround = (g: SceneGround) => ({ strong: isDark(g) ? tokenColor('white') : tokenColor('ink'), muted: isDark(g) ? flatten(tokenColor('text-on-brand-muted'), groundColor(g)) : tokenColor('text-muted'), accent: isDark(g) ? tokenColor('white') : tokenColor('brand') });

/** The chart's colors, from the tokens: the brand blue first, then its lighter steps (on dark grounds, white first). */
function palette(g: SceneGround): string[] {
	const blue = tokenColor('brand');
	if (isDark(g)) return [tokenColor('white'), tokenColor('sky'), mix(tokenColor('sky'), blue, 0.45), mix(tokenColor('white'), blue, 0.75), tokenColor('blue-mid')];
	return [blue, tokenColor('blue-mid'), tokenColor('sky'), tokenColor('ink'), mix(blue, tokenColor('white'), 0.6)];
}

export function drawChart(ctx: Ctx, input: PanelInput, r: Rect): string {
	const data = input.data!;
	const kind = input.chart ?? 'bar';
	const c = onGround(ctx.ground);
	const g = [groundColor(ctx.ground)];
	const out: string[] = [];
	const lab = Math.max(ctx.stage.small, 21 * ctx.k);
	const marks: Rect[] = [];
	if (kind === 'donut') {
		const total = data.reduce((n, d) => n + d.value, 0);
		if (!total) throw new Error('A donut needs a total over 0.');
		if (data.length > 5) throw new Error('A donut takes at most five slices; use a bar chart for more.');
		const legendW = r.w * 0.46;
		const size = Math.min(r.h, r.w - legendW - 30 * ctx.k);
		const cx = r.x + size / 2;
		const cy = r.y + r.h / 2;
		const R = size / 2;
		const t = R * 0.36;
		const cols = palette(ctx.ground);
		let a0 = -Math.PI / 2;
		data.forEach((d, i) => {
			const a1 = a0 + (d.value / total) * Math.PI * 2;
			const large = a1 - a0 > Math.PI ? 1 : 0;
			const p = (a: number, rr: number) => `${num(cx + Math.cos(a) * rr)} ${num(cy + Math.sin(a) * rr)}`;
			out.push(`<path d="M${p(a0, R)} A${num(R)} ${num(R)} 0 ${large} 1 ${p(a1 - 0.0001, R)} L${p(a1 - 0.0001, R - t)} A${num(R - t)} ${num(R - t)} 0 ${large} 0 ${p(a0, R - t)} Z" fill="${cols[i]}"/>`);
			a0 = a1;
		});
		marks.push({ x: cx - R, y: cy - R, w: size, h: size });
		const lx = r.x + size + 30 * ctx.k;
		const rowH = Math.min(lab * 2.2, r.h / data.length);
		const top = cy - (rowH * data.length) / 2;
		data.forEach((d, i) => {
			const y = top + i * rowH;
			out.push(rect(lx, y + rowH / 2 - lab * 0.4, lab * 0.8, lab * 0.8, cols[i]!, lab * 0.15));
			out.push(words(ctx, `label-${i + 1}`, `${d.label}  ${d.shown}`, { x: lx + lab * 1.3, y: y + rowH / 2 - lab * 0.62, w: right(r) - lx - lab * 1.3, h: lab * 1.3 }, { size: lab, color: c.strong, ground: g, maxLines: 1 }).svg);
		});
	} else {
		const max = Math.max(...data.map((d) => d.value)) || 1;
		const valueH = lab * 1.4;
		const labelH = lab * 1.5;
		const plot = { x: r.x, y: r.y + valueH, w: r.w, h: r.h - valueH - labelH };
		const step = plot.w / data.length;
		const base = bottom(plot);
		out.push(rect(plot.x, base, plot.w, Math.max(1, ctx.k), c.muted));
		const points = data.map((d, i) => ({ x: plot.x + step * (i + 0.5), y: base - (d.value / max) * plot.h * 0.96 }));
		if (kind === 'bar') {
			const bw = Math.min(step * 0.62, 120 * ctx.k);
			data.forEach((d, i) => {
				const h = base - points[i]!.y;
				out.push(rect(points[i]!.x - bw / 2, points[i]!.y, bw, h, palette(ctx.ground)[0]!, Math.min(6 * ctx.k, bw / 4)));
				marks.push({ x: points[i]!.x - bw / 2, y: points[i]!.y, w: bw, h });
			});
		} else {
			const line = points.map((p, i) => `${i ? 'L' : 'M'}${num(p.x)} ${num(p.y)}`).join(' ');
			out.push(`<path d="${line}" fill="none" stroke="${palette(ctx.ground)[0]}" stroke-width="${num(4 * ctx.k)}" stroke-linejoin="round" stroke-linecap="round"/>`);
			for (const p of points) out.push(`<circle cx="${num(p.x)}" cy="${num(p.y)}" r="${num(6 * ctx.k)}" fill="${palette(ctx.ground)[0]}"/>`);
			for (const p of points) marks.push({ x: p.x - 6 * ctx.k, y: p.y - 6 * ctx.k, w: 12 * ctx.k, h: 12 * ctx.k });
		}
		data.forEach((d, i) => {
			const cell = { x: plot.x + step * i + 2 * ctx.k, w: step - 4 * ctx.k };
			out.push(words(ctx, `value-${i + 1}`, d.shown, { ...cell, y: points[i]!.y - valueH - (kind === 'line' ? 14 * ctx.k : 2 * ctx.k), h: valueH }, { size: lab, color: c.strong, ground: g, align: 'center', maxLines: 1 }).svg);
			out.push(words(ctx, `label-${i + 1}`, d.label, { ...cell, y: base + lab * 0.35, h: labelH }, { size: lab, weight: 'regular', color: c.muted, ground: g, align: 'center', maxLines: 1 }).svg);
		});
	}
	ctx.layers.add({ id: 'chart', kind: 'art', box: r, ink: marks, can: {} });
	return out.join('');
}

/** Cards side by side (or stacked on tall sizes), each with a title, a big line (a price) and lines, no taller than
 * their words need and centered in the room. */
function cardsRow(ctx: Ctx, blocks: Block[], r: Rect, o: { big?: boolean; check?: boolean; numbered?: boolean; arrows?: boolean; id: string }) {
	const spec = imageConfig().templates.cards.cards!;
	const n = blocks.length;
	const gap = (o.arrows ? 50 : 24) * ctx.k;
	// Side by side while each card keeps a readable width; otherwise one under the other.
	const across = (r.w - gap * (n - 1)) / n >= 300 * ctx.k && r.w / r.h >= 0.8;
	const cw = across ? (r.w - gap * (n - 1)) / n : r.w;
	const chMax = across ? r.h : (r.h - gap * (n - 1)) / n;
	const { medium, regular } = brandFonts();
	const ink = tokenColor('ink');
	const muted = tokenColor('text-muted');
	const white = [tokenColor('white')];
	// One size for every card, the largest at which every card's words fit its share.
	for (let q = 1.6; ; q *= 0.93) {
		const pad = Math.min(spec.pad * ctx.k * Math.min(1, q), cw * 0.1);
		const titleS = Math.max(ctx.stage.small * 1.1, 32 * ctx.k * q);
		const priceS = Math.max(ctx.stage.small * 1.6, 60 * ctx.k * q);
		const lineS = Math.max(ctx.stage.small, 23 * ctx.k * q);
		const br = spec.badge * ctx.k * Math.max(1, q);
		const mark = o.check ? lineS * 1.05 : 0;
		const textW = (indent: number) => cw - pad * 2 - indent;
		const plans = blocks.map((b) => {
			const tIndent = o.numbered ? br * 2 + 12 * ctx.k : 0;
			const title = wrapEven(medium, drawable(b.title, 'title'), titleS, trackingFor(titleS / ctx.k), textW(tIndent));
			const price = o.big && b.lines[0] ? wrapEven(medium, drawable(b.lines[0], 'price'), priceS, trackingFor(priceS / ctx.k), textW(0)) : null;
			const rest = o.big ? b.lines.slice(1) : b.lines;
			const lines = rest.map((l) => wrapEven(regular, drawable(l, 'line'), lineS, 0, textW(mark ? mark + 10 * ctx.k : 0)));
			if (!title || (o.big && b.lines[0] && !price) || lines.some((l) => !l)) return null;
			const h = pad * 2 + Math.max(o.numbered ? br * 2 : 0, title.lines.length * titleS * 1.12) + (price ? 10 * ctx.k + price.lines.length * priceS : 0) + lines.reduce((sum, l) => sum + 12 * ctx.k + l!.lines.length * lineS * 1.3, 0);
			return { b, title, price, lines: lines as Wrapped[], h, tIndent };
		});
		const fits = plans.every((p) => p && p.h <= chMax + 0.5);
		if (!fits) {
			if (lineS <= ctx.stage.small + 0.01) throw new Error(`The ${o.id}s do not fit at a size that reads. Use fewer lines or a taller size.`);
			continue;
		}
		const ch = Math.max(...plans.map((p) => p!.h));
		const total = across ? ch : ch * n + gap * (n - 1);
		const top = r.y + (r.h - total) / 2;
		const out: string[] = [];
		plans.forEach((p, i) => {
			const { b, title, price, lines, tIndent } = p!;
			const box = across ? { x: r.x + i * (cw + gap), y: top, w: cw, h: ch } : { x: r.x, y: top + i * (ch + gap), w: cw, h: ch };
			const id = `${o.id}-${i + 1}`;
			out.push(card(ctx, box, id));
			const x = box.x + pad;
			let y = box.y + pad;
			if (o.numbered) {
				out.push(`<circle cx="${num(x + br)}" cy="${num(y + br)}" r="${num(br)}" fill="${tokenColor('brand')}"/>`);
				out.push(lineAt(medium, String(i + 1), x + br, y + br + br * 0.38, br * 1.1, 0, 'center', tokenColor('white')));
			}
			const put = (wid: string, w: Wrapped, font: typeof medium, size: number, tr: number, at: number, top: number, color: string, leading: number, asked: string) => {
				const rows = w.lines.map((t, j) => ({ text: t, x: at, baseline: top + size * 0.86 + j * size * leading }));
				ctx.layers.text(wid, font, rows, size, tr, 'left', color, white, asked, readBack(w), {}, [id]);
				out.push(rows.map((row) => lineAt(font, row.text, row.x, row.baseline, size, tr, 'left', color)).join(''));
				return w.lines.length * size * leading;
			};
			const headTop = o.numbered && title.lines.length === 1 ? y + br - titleS * 0.56 : y;
			y = Math.max(y + (o.numbered ? br * 2 : 0), headTop + put(`${id}-title`, title, medium, titleS, trackingFor(titleS / ctx.k), x + tIndent, headTop, ink, 1.12, b.title));
			if (price) y += 10 * ctx.k + put(`${id}-price`, price, medium, priceS, trackingFor(priceS / ctx.k), x, y + 10 * ctx.k, tokenColor('brand'), 1, b.lines[0]!);
			const rest = o.big ? b.lines.slice(1) : b.lines;
			lines.forEach((w, j) => {
				y += 12 * ctx.k;
				if (o.check) out.push(`<g transform="translate(${num(x)} ${num(y + lineS * 0.1)}) scale(${num(mark / 24)})" fill="none" stroke="${tokenColor('brand')}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></g>`);
				y += put(`${id}-line-${j + 1}`, w, regular, lineS, 0, x + (mark ? mark + 10 * ctx.k : 0), y, muted, 1.3, rest[j]!);
			});
			if (o.arrows && i < n - 1) {
				const a = across ? { x1: right(box) + 10 * ctx.k, y1: box.y + box.h / 2, x2: right(box) + gap - 10 * ctx.k, y2: box.y + box.h / 2 } : { x1: box.x + box.w / 2, y1: bottom(box) + 10 * ctx.k, x2: box.x + box.w / 2, y2: bottom(box) + gap - 10 * ctx.k };
				const head = 10 * ctx.k;
				const ang = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
				const hx = (sd: number) => num(a.x2 - Math.cos(ang + sd) * head);
				const hy = (sd: number) => num(a.y2 - Math.sin(ang + sd) * head);
				out.push(`<path d="M${num(a.x1)} ${num(a.y1)} L${num(a.x2)} ${num(a.y2)} M${hx(0.6)} ${hy(0.6)} L${num(a.x2)} ${num(a.y2)} L${hx(-0.6)} ${hy(-0.6)}" fill="none" stroke="${onGround(ctx.ground).accent}" stroke-width="${num(3.5 * ctx.k)}" stroke-linecap="round" stroke-linejoin="round"/>`);
			}
		});
		return out.join('');
	}
}

export function drawPanel(template: PanelTemplate, ctx: Ctx, input: PanelInput, r: Rect, drawPicture: (art: Art, r: Rect, label: string) => string): string {
	switch (template) {
		case 'chart':
			return drawChart(ctx, input, r);
		case 'pricing':
			return cardsRow(ctx, input.blocks!, r, { big: true, check: true, id: 'plan' });
		case 'compare':
			return cardsRow(ctx, input.blocks!, r, { check: true, id: 'column' });
		case 'flow':
			return cardsRow(ctx, input.blocks!, r, { numbered: true, arrows: true, id: 'step' });
		case 'before-after': {
			const gap = 36 * ctx.k;
			// Side by side or one over the other, whichever lets the pictures be larger.
			const fitOf = (w: number, h: number) => Math.min(...input.pictures!.map((p) => Math.min(w / p.width, h / p.height)));
			const across = fitOf((r.w - gap) / 2, r.h) >= fitOf(r.w, (r.h - gap) / 2);
			const a = across ? { x: r.x, y: r.y, w: (r.w - gap) / 2, h: r.h } : { x: r.x, y: r.y, w: r.w, h: (r.h - gap) / 2 };
			const b = across ? { ...a, x: r.x + a.w + gap } : { ...a, y: r.y + a.h + gap };
			return drawPicture(input.pictures![0], a, input.left ?? '') + drawPicture(input.pictures![1], b, input.right ?? '');
		}
		default:
			return '';
	}
}

