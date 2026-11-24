// The brand's blocks for compose designs: the share images' own parts (the headline, the line, the label, the lockup
// and the mark, the window with a picture or a toon object, the toon objects, the white numbered card, the stat, the
// quote window, the numbered list, the key, the guides' search field, a chart, the stepped band as a divider, and the
// library's icons) drawn into any cells of the grid. Words fit their cells or the block fails saying what to shorten.

import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { blockRects } from '../design/compose.js';
import type { BlockInfo, DesignDoc, DrawnLayer, LayerEdit, Rect } from '../design/types.js';
import { readPicture } from '../assets/picture.js';
import { pkgPath } from '../lib/paths.js';
import { imageConfig, stageFor, type SceneGround } from './config.js';
import { band, boxShadow, Ids, num, placed, radiusPx, rgbaOf, scan, shadowToken } from './effects.js';
import { pictureArt, stickerBox, subjectArt, type Art } from './objects.js';
import { bandMixes, brandFonts, document, drawable, drawLogo, flatten, logoBox, measure, readBack, rect, tokenColor, trackingEm, trackingFor, wrapEven } from './paint.js';
import { drawChart, parseData } from './panels.js';
import { windowFrame } from './scene.js';
import { groundColor, groundColors, isDark, Layers, lineAt, type Align } from './words.js';

const TEXT: DrawnLayer['can'] = { scale: [0.5, 1.6], hide: true, align: true };
const PART: DrawnLayer['can'] = { scale: [0.5, 1.6], hide: true };
const OBJECT = 'object:';
const subjects = () => Object.keys(JSON.parse(readFileSync(pkgPath('brand', 'assets', 'illustrate.json'), 'utf8')).subjects as Record<string, unknown>);
const icons = () => (JSON.parse(readFileSync(pkgPath('brand', 'icons', 'icons.json'), 'utf8')) as { icons: { id: string }[] }).icons.map((i) => i.id);

export function composeBlocks(): BlockInfo[] {
	return [
		{ type: 'headline', names: ['title', 'heading'], kind: 'text', description: 'The headline in the display face at 500.', copy: [{ id: 'text', required: true }], sample: { text: 'Let agents buy anything online' }, span: { cols: 12, rows: 3 }, place: 'left' },
		{ type: 'body', names: ['subtitle', 'paragraph', 'line'], kind: 'text', description: 'A line or a paragraph in Inter.', copy: [{ id: 'text', required: true }], sample: { text: 'Cards your agent can use, with every purchase approved.' }, span: { cols: 8, rows: 2 } },
		{ type: 'badge', names: ['eyebrow', 'label', 'kicker'], kind: 'text', description: 'A short label in capitals, sky on the blue and blue on paper.', copy: [{ id: 'text', required: true }], sample: { text: 'New' }, span: { cols: 3, rows: 1 }, place: 'top-left' },
		{ type: 'logo', names: ['lockup', 'wordmark'], kind: 'logo', description: 'The lockup (or the mark, with the kind option), in white on dark grounds and blue on light.', copy: [], options: [{ id: 'kind', values: ['lockup', 'mark'] }], span: { cols: 4, rows: 1 }, place: 'top-left' },
		{ type: 'picture', names: ['image', 'screenshot', 'window', 'photo'], kind: 'key', description: 'Your picture (or a toon object) in the sky-barred window, whole; the frame option none shows it bare.', copy: [{ id: 'label' }], image: { values: subjects().map((n) => `${OBJECT}${n}`) }, options: [{ id: 'frame', values: ['window', 'none'] }], span: { cols: 6, rows: 8 }, place: 'right' },
		{ type: 'object', names: ['toon', 'sticker', 'art'], kind: 'art', description: 'One of the brand\'s toon objects, whole, turned a little.', copy: [], options: [{ id: 'subject', values: subjects() }, { id: 'rotate', range: [-16, 16] }], span: { cols: 3, rows: 3 }, under: true },
		{ type: 'card', names: ['feature', 'step'], kind: 'panel', description: 'A white card with the blue number badge, a heading and a line.', copy: [{ id: 'heading', required: true }, { id: 'text' }, { id: 'number' }], sample: { heading: 'Save it once', text: 'Your user adds their card a single time.', number: '1' }, span: { cols: 6, rows: 3 } },
		{ type: 'stat', names: ['number', 'metric'], kind: 'text', description: 'A big number with a line under it.', copy: [{ id: 'value', required: true }, { id: 'label' }], sample: { value: '40%', label: 'fewer abandoned carts' }, span: { cols: 6, rows: 4 } },
		{ type: 'quote', names: ['testimonial'], kind: 'panel', description: 'A quote in the white window with the blue open quote and who said it.', copy: [{ id: 'text', required: true }, { id: 'attribution' }, { id: 'label' }], sample: { text: 'Every purchase is approved.', attribution: 'Head of product, Acme' }, span: { cols: 10, rows: 5 } },
		{ type: 'list', names: ['bullets', 'points', 'steps'], kind: 'text', description: 'Points with | between, each with its blue number badge.', copy: [{ id: 'items', required: true }], sample: { items: 'Save it once | The agent asks | You approve' }, span: { cols: 6, rows: 5 } },
		{ type: 'button', names: ['cta', 'key'], kind: 'key', description: 'The key: blue on light grounds, white on the blue.', copy: [{ id: 'text', required: true }], sample: { text: 'Start free' }, span: { cols: 3, rows: 1 }, place: 'bottom-left' },
		{ type: 'search', names: ['search-bar', 'field', 'input'], kind: 'panel', description: 'The guides\' search field: white, 8 px corners, a hairline edge, the search mark and the words in it.', copy: [{ id: 'text', required: true }], sample: { text: 'Search the docs' }, span: { cols: 8, rows: 1 }, place: 'center' },
		{ type: 'chart', names: ['graph'], kind: 'art', description: 'A bar, line or donut chart from "Jan: 120, Feb: 180" (built from the tokens; the brand has no chart style of its own).', copy: [{ id: 'data', required: true }], sample: { data: 'Jan: 120, Feb: 180, Mar: 260' }, options: [{ id: 'kind', values: ['bar', 'line', 'donut'] }], span: { cols: 6, rows: 6 } },
		{ type: 'divider', names: ['band', 'rule'], kind: 'art', description: 'The stepped band across its cells, from the ground toward its contrast.', copy: [], span: { cols: 12, rows: 1 }, place: 'bottom', under: true },
		{ type: 'icon', names: ['glyph', 'symbol'], kind: 'key', description: 'One of the icons the library\'s components use (lucide, ISC), in the brand blue or white.', copy: [], options: [{ id: 'name', values: icons() }], span: { cols: 1, rows: 1 } },
	];
}

const info = (type: string) => composeBlocks().find((b) => b.type === type)!;

export type ComposeDrawn = { svg: string; layers: DrawnLayer[] };

/** Draws a compose design: the ground, then each block in its cells, in order. */
export function drawCompose(doc: DesignDoc, dir: string): ComposeDrawn {
	const W = doc.size.width;
	const H = doc.size.height;
	const ground = (doc.theme ?? 'blue') as SceneGround;
	const stage = stageFor(W, H, doc.size.id);
	const { k, small } = stage;
	const ids = new Ids('c');
	const layers = new Layers();
	const flat = groundColor(ground);
	const grounds = groundColors(ground, Boolean(doc.options.scan ?? ground === 'blue'));
	const strong = isDark(ground) ? tokenColor('white') : tokenColor('ink');
	const muted = isDark(ground) ? flatten(tokenColor('text-on-brand-muted'), flat) : tokenColor('text-muted');
	const label = isDark(ground) ? tokenColor('text-on-brand-label') : tokenColor('text-label');
	const out: string[] = [rect(0, 0, W, H, flat)];
	if (ground === 'blue' && doc.options.scan !== false) out.push(scan(ids, 0, 0, W, H, imageConfig().scene.scan, true));
	const e = (id: string): LayerEdit => doc.layers[id] ?? {};
	const words = (id: string, slot: string) => doc.copy[`${id}.${slot}`]?.trim() ?? '';
	const option = (id: string, name: string) => doc.options[`${id}.${name}`];
	const tooLong = (id: string) => new Error(`The ${id} is too long for its cells. Shorten it, or give it more cells (make it wider or taller).`);
	const { medium, regular } = brandFonts();
	/** Words fitted to a rect, from a start size down to the floor; a scale edit multiplies the start. */
	const fit = (id: string, value: string, font: typeof medium, from: number, r: Rect, leading: number, least = small) => {
		const text = drawable(value, id);
		for (let size = from * (e(id).scale ?? 1); ; size = Math.max(least, size * 0.94)) {
			const tr = font === regular ? 0 : trackingFor(size / k);
			const w = wrapEven(font, text, size, tr, r.w);
			if (w && w.lines.length * size * leading <= r.h + 0.5) return { w, size, tr, h: w.lines.length * size * leading };
			if (size <= least + 0.01) throw tooLong(id);
		}
	};
	const put = (id: string, b: ReturnType<typeof fit>, font: typeof medium, r: Rect, align: Align, color: string, ground2: string[], asked: string, leading: number, over?: string[], top?: number) => {
		const a = e(id).align ?? align;
		const x = a === 'center' ? r.x + r.w / 2 : a === 'right' ? r.x + r.w : r.x;
		const y0 = top ?? r.y + (r.h - b.h) / 2;
		const rows = b.w.lines.map((t, i) => ({ text: t, x, baseline: y0 + b.size * 0.86 + i * b.size * leading }));
		layers.text(id, font, rows, b.size, b.tr, a, color, ground2, asked, readBack(b.w), TEXT, over);
		out.push(rows.map((row) => lineAt(font, row.text, row.x, row.baseline, b.size, b.tr, a, color)).join(''));
	};
	const art = (id: string): Art | null => {
		const v = doc.images[id];
		if (!v || v === 'none') return null;
		if (v.startsWith(OBJECT)) return subjectArt(v.slice(OBJECT.length));
		return pictureArt(readPicture(resolve(dir, v), 'picture'), 'image');
	};
	const placedBlocks = blockRects(doc).filter((b) => !doc.layers[b.block.id]?.hidden);
	for (const { block, rect: r } of placedBlocks) {
		const id = block.id;
		const can = info(block.type)?.kind === 'text' ? TEXT : PART;
		switch (block.type) {
			case 'headline':
				put(id, fit(id, words(id, 'text'), medium, Math.min(r.h, 96 * k), r, 1.06, small * 1.25), medium, r, 'left', strong, grounds, words(id, 'text'), 1.06);
				break;
			case 'body':
				put(id, fit(id, words(id, 'text'), regular, Math.min(r.h, 26 * k), r, 1.3), regular, r, 'left', muted, grounds, words(id, 'text'), 1.3);
				break;
			case 'badge': {
				const value = drawable(words(id, 'text'), id).toUpperCase();
				const tr = trackingEm(imageConfig().scene.eyebrow.tracking);
				let size = Math.min(r.h * 0.8, 20 * k) * (e(id).scale ?? 1);
				while (measure(medium, value, size, tr) > r.w && size > small) size = Math.max(small, size * 0.94);
				if (measure(medium, value, size, tr) > r.w) throw tooLong(id);
				const a = e(id).align ?? 'left';
				const x = a === 'center' ? r.x + r.w / 2 : a === 'right' ? r.x + r.w : r.x;
				const base = r.y + r.h / 2 + size * 0.36;
				out.push(lineAt(medium, value, x, base, size, tr, a, label));
				layers.text(id, medium, [{ text: value, x, baseline: base }], size, tr, a, label, grounds, words(id, 'text'), words(id, 'text'), TEXT);
				break;
			}
			case 'logo': {
				const kind = option(id, 'kind') === 'mark' ? 'mark' : 'lockup';
				const box = logoBox(kind);
				const rule = imageConfig().scene.logoRule;
				const least = rule.min * k;
				const h = Math.max(least, Math.min(r.h / (1 + 2 * rule.clear), (r.w / (1 + rule.clear)) * (box.height / box.width), 34 * k * 1.8)) * (e(id).scale ?? 1);
				const w = (h * box.width) / box.height;
				const a = e(id).align ?? 'left';
				const x = a === 'center' ? r.x + (r.w - w) / 2 : a === 'right' ? r.x + r.w - w : r.x;
				const y = r.y + (r.h - h) / 2;
				out.push(drawLogo(kind, x, y, h, isDark(ground) ? tokenColor('white') : tokenColor('brand')));
				layers.add({ id, kind: 'logo', box: { x, y, w, h }, logo: { clear: h * rule.clear, min: least }, can: PART });
				break;
			}
			case 'picture': {
				const pic = art(id) ?? subjectArt(subjects()[0]!);
				const frame = option(id, 'frame') !== 'none';
				const bar = frame ? Math.max(imageConfig().scene.window.bar * k, small * 2.1) : 0;
				const a = pic.width / pic.height;
				const sc = e(id).scale ?? 1;
				const w = Math.min(r.w, (r.h - bar) * a) * Math.min(1, sc);
				const h = w / a + bar;
				const box = { x: r.x + (r.w - w) / 2, y: r.y + (r.h - h) / 2, w, h };
				layers.add({ id, kind: 'key', box, can: PART });
				if (frame) out.push(windowFrame(ids, box, k, words(id, 'label'), 'white', (inside) => placed(pic.href, inside.x + inside.w / 2, inside.y + inside.h / 2, inside.w, inside.h), small, layers, id));
				else out.push(placed(pic.href, box.x + w / 2, box.y + h / 2, w, h));
				// The window's label is reported by the frame as window-bar; under compose it is the block's part.
				const last = layers.list.at(-1);
				if (last?.id === 'window-bar') last.id = `${id}-label`;
				break;
			}
			case 'object': {
				const subject = String(option(id, 'subject') ?? subjects()[0]);
				const a = subjectArt(subject);
				const rotate = Number(option(id, 'rotate') ?? -6);
				const fitW = Math.min(r.w, (r.h * a.width) / a.height) * 0.9 * (e(id).scale ?? 1);
				let st = { art: a, x: (r.x + r.w / 2) / W, y: (r.y + r.h / 2) / H, size: fitW / Math.min(W, H), rotate };
				const b0 = stickerBox(st, W, H);
				const z = Math.min(1, r.w / b0.w, r.h / b0.h);
				st = { ...st, size: st.size * z };
				const box = stickerBox(st, W, H);
				const w = st.size * Math.min(W, H);
				out.push(placed(a.href, st.x * W, st.y * H, w, (w * a.height) / a.width, rotate));
				layers.add({ id, kind: 'art', box, can: PART });
				break;
			}
			case 'card':
			case 'quote': {
				const spec = imageConfig().templates.cards.cards!;
				const white = [tokenColor('white')];
				if (block.type === 'quote') {
					const bar = Math.max(imageConfig().scene.window.bar * k, small * 2.1);
					const pad = Math.min(36 * k, r.w * 0.08);
					const inner = { x: r.x + pad, y: r.y + bar + pad * 0.6, w: r.w - pad * 2, h: r.h - bar - pad * 1.6 };
					const by = words(id, 'attribution');
					const byH = by ? Math.max(small * 1.1, 18 * k) * 1.8 : 0;
					const mark = Math.min(inner.h * 0.25, 60 * k);
					const q = fit(id, words(id, 'text'), medium, Math.min(inner.h * 0.5, 44 * k), { ...inner, h: inner.h - byH - mark * 0.6 }, 1.25, small * 1.1);
					const total = mark * 0.6 + q.h + byH;
					const top = inner.y + (inner.h - total) / 2;
					layers.add({ id: `${id}-panel`, kind: 'panel', box: r, can: {} });
					out.push(windowFrame(ids, r, k, words(id, 'label'), 'white', () => '', small, layers, `${id}-panel`));
					const bar0 = layers.list.at(-1);
					if (bar0?.id === 'window-bar') bar0.id = `${id}-label`;
					out.push(lineAt(medium, '“', inner.x, top + mark * 0.62, mark, 0, 'left', tokenColor('brand')));
					put(id, q, medium, inner, 'left', tokenColor('ink'), white, words(id, 'text'), 1.25, [`${id}-panel`], top + mark * 0.6);
					if (by) {
						const b = fit(`${id}-by`, by, regular, Math.max(small * 1.1, 18 * k), { ...inner, h: byH }, 1.3);
						put(`${id}-by`, b, regular, inner, 'left', tokenColor('brand'), white, by, 1.3, [`${id}-panel`], top + mark * 0.6 + q.h + byH * 0.3);
					}
					// The quote's own id is its words; the panel under them is its part.
					break;
				}
				const rad = radiusPx(spec.radius, k);
				const sh = boxShadow(ids, r.x, r.y, r.w, r.h, rad, shadowToken(spec.shadow), k);
				out.push(`<defs>${sh.defs}</defs>${sh.under}${rect(r.x, r.y, r.w, r.h, tokenColor('white'), rad)}${sh.over}`);
				if (!isDark(ground)) out.push(`<rect x="${num(r.x + k / 2)}" y="${num(r.y + k / 2)}" width="${num(r.w - k)}" height="${num(r.h - k)}" rx="${num(rad)}" fill="none" stroke="${rgbaOf(tokenColor(spec.edge))}" stroke-width="${num(k)}"/>`);
				layers.add({ id, kind: 'panel', box: r, can: PART });
				const pad = Math.min(spec.pad * k, r.w * 0.08, r.h * 0.15);
				const br = Math.max(spec.badge * k, (small * 1.01) / 1.1);
				const n = words(id, 'number');
				let x = r.x + pad;
				if (n) {
					out.push(`<circle cx="${num(x + br)}" cy="${num(r.y + pad + br)}" r="${num(br)}" fill="${tokenColor('brand')}"/>`);
					out.push(lineAt(medium, drawable(n, 'number'), x + br, r.y + pad + br + br * 0.38, br * 1.1, 0, 'center', tokenColor('white')));
					layers.text(`${id}-number`, medium, [{ text: n, x: x + br, baseline: r.y + pad + br + br * 0.38 }], br * 1.1, 0, 'center', tokenColor('white'), [tokenColor('brand')], n, n, {}, [id]);
					x += br * 2 + 12 * k;
				}
				const body = words(id, 'text');
				const room = { x, y: r.y + pad, w: r.x + r.w - pad - x, h: (r.h - pad * 2) * (body ? 0.45 : 1) };
				const head = fit(`${id}-heading`, words(id, 'heading'), medium, Math.min(room.h, spec.heading * k), room, 1.15);
				put(`${id}-heading`, head, medium, room, 'left', tokenColor('ink'), white, words(id, 'heading'), 1.15, [id], room.y);
				if (body) {
					const br2 = { x: r.x + pad, y: room.y + head.h + 12 * k, w: r.w - pad * 2, h: r.y + r.h - pad - (room.y + head.h + 12 * k) };
					const t = fit(`${id}-text`, body, regular, Math.min(br2.h, spec.body * k), br2, 1.3);
					put(`${id}-text`, t, regular, br2, 'left', tokenColor('text-muted'), white, body, 1.3, [id], br2.y);
				}
				break;
			}
			case 'stat': {
				const value = words(id, 'value');
				const lab = words(id, 'label');
				const vr = { ...r, h: lab ? r.h * 0.68 : r.h };
				const v = fit(id, value, medium, vr.h * 0.9, vr, 0.98, small * 2);
				const color = isDark(ground) ? tokenColor('white') : tokenColor('brand');
				put(id, v, medium, vr, 'left', color, grounds, value, 0.98, undefined, r.y);
				if (lab) {
					const lr = { x: r.x, y: r.y + v.h + 10 * k, w: r.w, h: r.y + r.h - (r.y + v.h + 10 * k) };
					put(`${id}-label`, fit(`${id}-label`, lab, regular, Math.min(lr.h, 26 * k), lr, 1.3), regular, lr, 'left', muted, grounds, lab, 1.3, undefined, lr.y);
				}
				break;
			}
			case 'list': {
				const items = words(id, 'items').split('|').map((x) => x.trim()).filter(Boolean);
				if (!items.length) throw new Error(`The ${id} needs items with | between.`);
				const rowH = r.h / items.length;
				const br = Math.min(rowH * 0.32, 15 * k);
				items.forEach((item, i) => {
					const y = r.y + i * rowH;
					out.push(`<circle cx="${num(r.x + br)}" cy="${num(y + rowH / 2)}" r="${num(br)}" fill="${isDark(ground) ? tokenColor('white') : tokenColor('brand')}"/>`);
					out.push(lineAt(medium, String(i + 1), r.x + br, y + rowH / 2 + br * 0.38, br * 1.1, 0, 'center', isDark(ground) ? tokenColor('brand') : tokenColor('white')));
					const tr2 = { x: r.x + br * 2 + 14 * k, y, w: r.w - br * 2 - 14 * k, h: rowH };
					const lid = i ? `${id}-${i + 1}` : id;
					put(lid, fit(lid, item, medium, Math.min(rowH * 0.6, 30 * k), tr2, 1.15), medium, tr2, 'left', strong, grounds, item, 1.15);
				});
				break;
			}
			case 'button': {
				const text = drawable(words(id, 'text'), id);
				const cfg = imageConfig().scene.key;
				let size = Math.max(small, Math.min(r.h * 0.5, cfg.size * k * 1.4)) * (e(id).scale ?? 1);
				const width = (s2: number) => measure(medium, text, s2, 0) + cfg.padX * 2 * (s2 / cfg.size);
				while (width(size) > r.w && size > small) size = Math.max(small, size * 0.94);
				if (width(size) > r.w || size * 1.25 > r.h) throw tooLong(id);
				const h = Math.min(r.h, (cfg.height * size) / cfg.size);
				const w = width(size);
				const a = e(id).align ?? 'left';
				const x = a === 'center' ? r.x + (r.w - w) / 2 : a === 'right' ? r.x + r.w - w : r.x;
				const y = r.y + (r.h - h) / 2;
				const onBlue = ground === 'blue';
				const face = onBlue ? tokenColor('white') : tokenColor('brand');
				const ink = onBlue ? tokenColor('brand') : tokenColor('white');
				const rr = radiusPx(cfg.radius, k);
				const sh = boxShadow(ids, x, y, w, h, rr, shadowToken(onBlue ? cfg.onBlue : cfg.onLight), k);
				out.push(`<defs>${sh.defs}</defs>${sh.under}${rect(x, y, w, h, face, rr)}${sh.over}${lineAt(medium, text, x + w / 2, y + h / 2 + size * 0.35, size, 0, 'center', ink)}`);
				layers.add({ id, kind: 'key', box: { x, y, w, h }, text: { asked: words(id, 'text'), drawn: text, size, color: ink, ground: [face] }, can: PART });
				break;
			}
			case 'search': {
				const h = Math.min(r.h, Math.max(64 * k, (small * 1.01) / 0.36));
				if (h * 0.36 < small) throw tooLong(id);
				const box = { x: r.x, y: r.y + (r.h - h) / 2, w: r.w, h };
				const rr = radiusPx('--ds-radius-control', k);
				out.push(rect(box.x, box.y, box.w, box.h, tokenColor('white'), rr));
				out.push(`<rect x="${num(box.x + k / 2)}" y="${num(box.y + k / 2)}" width="${num(box.w - k)}" height="${num(box.h - k)}" rx="${num(rr)}" fill="none" stroke="${rgbaOf(tokenColor('border-field'))}" stroke-width="${num(k)}"/>`);
				layers.add({ id: `${id}-field`, kind: 'panel', box, can: {} });
				const icon = h * 0.42;
				out.push(`<g transform="translate(${num(box.x + h * 0.32)} ${num(box.y + (h - icon) / 2)}) scale(${num(icon / 24)})" fill="none" stroke="${tokenColor('ink')}" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></g>`);
				const tr2 = { x: box.x + h * 0.32 + icon + h * 0.25, y: box.y + h * 0.18, w: box.w - (h * 0.32 + icon + h * 0.5), h: h * 0.64 };
				put(id, fit(id, words(id, 'text'), regular, Math.max(small, h * 0.36), tr2, 1.2), regular, tr2, 'left', tokenColor('text-muted'), [tokenColor('white')], words(id, 'text'), 1.2, [`${id}-field`]);
				break;
			}
			case 'chart': {
				const ctx = { stage, ground, layers, ids, k };
				out.push(drawChart(ctx, { data: parseData(words(id, 'data')), chart: (option(id, 'kind') as 'bar') ?? 'bar' }, r, id));
				break;
			}
			case 'divider': {
				const steps = imageConfig().scene.flatBand.steps;
				const step = r.h / steps;
				out.push(band(ids, W, r.y, step, r.y + r.h, flat, groundColor(imageConfig().bandContrast[ground]), bandMixes()).replace(`<rect x="0" y="${num(r.y)}" width="${num(W)}"`, `<rect x="${num(r.x)}" y="${num(r.y)}" width="${num(r.w)}"`));
				layers.add({ id, kind: 'art', box: { x: 0, y: r.y, w: W, h: r.h }, bleeds: true, can: PART });
				break;
			}
			case 'icon': {
				const name = String(option(id, 'name') ?? 'credit-card');
				const svg = readFileSync(pkgPath('brand', 'icons', `${name}.svg`), 'utf8');
				const size = Math.min(r.w, r.h) * (e(id).scale ?? 1);
				const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
				out.push(`<g transform="translate(${num(r.x + (r.w - size) / 2)} ${num(r.y + (r.h - size) / 2)}) scale(${num(size / 24)})" fill="none" stroke="${isDark(ground) ? tokenColor('white') : tokenColor('brand')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`);
				layers.add({ id, kind: 'key', box: { x: r.x + (r.w - size) / 2, y: r.y + (r.h - size) / 2, w: size, h: size }, can: PART });
				break;
			}
			default:
				throw new Error(`Unknown block ${block.type}.`);
		}
		void can;
	}
	return { svg: document(W, H, 'Composition', out.join('')), layers: layers.list };
}
