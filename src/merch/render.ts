// Merch print files from brand/assets/merch.json: each item at its trim size plus bleed, in inches, drawn at the
// print resolution. Only the approved logos in the approved colors and the brand grounds; the band and scanlines
// where an item asks for them. Guides (trim, bleed, safe) go in a separate proof, and a sticker's cut line in its own
// CutContour layer that the PNG never carries.

import { readFileSync } from 'node:fs';
import { band, Ids, scan } from '../image/effects.js';
import { bandMixes, brandFonts, document, drawLogo, flatten, logoBox, rect, tokenColor } from '../image/paint.js';
import { imageConfig, type SceneGround } from '../image/scene.js';
import { drawBlock, fitBlock, Layers } from '../image/words.js';
import { brand } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';

type Box = [x: number, y: number, w: number, h: number];
export type MerchLayer =
	| { type: 'logo'; kind: 'lockup' | 'mark'; box: Box }
	| { type: 'text'; slot: string; box: Box; size: number; align: 'left' | 'center' | 'right'; maxLines: number; weight?: 'regular' | 'medium'; tone?: 'muted' }
	| { type: 'band'; to: 'contrast'; at: number; step: number }
	| { type: 'scan' }
	/** A block of a ground (the contrast of the item's own, or a named one): a name tag's blue top. */
	| { type: 'panel'; box: Box; ground: SceneGround | 'contrast' }
	/** The logo repeated along a strip, with its clear space between (a lanyard). */
	| { type: 'repeat'; kind: 'lockup' | 'mark'; box: Box };
export type MerchItem = { id: string; name: string; group?: 'merch' | 'document'; size: [number, number]; bleed: number; safe: number; method: string; source: string; variants: string[]; cut?: { radius: number }; cuts?: { box: Box; radius: number }[]; layers: MerchLayer[] };
export type MerchVariant = { about: string; ground?: SceneGround; ink: 'white' | 'brand' | 'ink' };
export type MerchConfig = { dpi: number; copy: Record<string, string>; samples: Record<string, string>; variants: Record<string, MerchVariant>; logo: { minWidth: { lockup: number; mark: number }; clearSpace: string; note: string }; items: MerchItem[]; $comment: string };

let merchCfg: MerchConfig | undefined;
export function merchConfig(): MerchConfig {
	merchCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'merch.json'), 'utf8')) as MerchConfig;
	return merchCfg;
}

const CONTRAST: Record<SceneGround, SceneGround> = { blue: 'paper', paper: 'blue', ink: 'paper', white: 'blue' };
const GROUND_TOKEN: Record<SceneGround, string> = { blue: 'brand', paper: 'paper', ink: 'ink', white: 'white' };
const INK_ON: Record<SceneGround, 'white' | 'brand'> = { blue: 'white', ink: 'white', paper: 'brand', white: 'brand' };

export type LogoPlacement = { kind: 'lockup' | 'mark'; x: number; y: number; w: number; h: number };

/** Where a logo lands in its box (inches from the trim), fitted and centered. */
export function logoPlacement(layer: Extract<MerchLayer, { type: 'logo' }>): LogoPlacement {
	const b = logoBox(layer.kind);
	const [x, y, w, h] = layer.box;
	const sc = Math.min(w / b.width, h / b.height);
	const lw = b.width * sc;
	const lh = b.height * sc;
	return { kind: layer.kind, x: x + (w - lw) / 2, y: y + (h - lh) / 2, w: lw, h: lh };
}

function siteHost() {
	try {
		return brand().site ? new URL(brand().site!).host.replace(/^www\./, '') : '';
	} catch {
		return '';
	}
}

export type MerchOpts = { headline?: string; url?: string; copy?: Record<string, string>; sample?: boolean };

/** The copy slots an item draws. */
export const merchSlots = (item: MerchItem) => [...new Set(item.layers.flatMap((l) => (l.type === 'text' ? [l.slot] : [])))];

/** What is drawn in each slot: only what was passed, the brand's own address, and sample copy when asked for. */
function copyFor(item: MerchItem, opts: MerchOpts): Record<string, string> {
	const given: Record<string, string> = Object.fromEntries(Object.entries({ ...opts.copy, ...(opts.headline ? { headline: opts.headline } : {}), ...(opts.url ? { url: opts.url } : {}) }).map(([k, v]) => [k, String(v).trim()]).filter(([, v]) => v));
	const slots = merchSlots(item);
	for (const key of Object.keys(given)) if (!slots.includes(key)) throw new Error(`The ${item.name} has no place for --${key}. It takes ${slots.join(', ') || 'no copy'}.`);
	const samples: Record<string, string> = opts.sample ? { ...merchConfig().samples, ...(merchConfig().copy.headline ? { headline: merchConfig().copy.headline } : {}) } : {};
	return Object.fromEntries(slots.map((slot) => [slot, given[slot] ?? (slot === 'url' ? siteHost() : (samples[slot] ?? ''))]));
}

/** The print file (no guides), the proof (with guides) and the cut path, as SVG strings, plus the size in pixels. */
export function merchSvgs(item: MerchItem, variantId: string, opts: MerchOpts = {}) {
	const cfg = merchConfig();
	const variant = cfg.variants[variantId]!;
	const dpi = cfg.dpi;
	const px = (inches: number) => inches * dpi;
	const fullW = item.size[0] + item.bleed * 2;
	const fullH = item.size[1] + item.bleed * 2;
	const W = Math.round(px(fullW));
	const H = Math.round(px(fullH));
	const ox = px(item.bleed);
	const oy = px(item.bleed);
	const ids = new Ids('m');
	let logos = 0;
	const parts: string[] = [];
	const ground = variant.ground;
	const bandLayer = item.layers.find((l): l is Extract<MerchLayer, { type: 'band' }> => l.type === 'band');
	const panels = item.layers.filter((l): l is Extract<MerchLayer, { type: 'panel' }> => l.type === 'panel');
	const panelGround = (p: Extract<MerchLayer, { type: 'panel' }>): SceneGround => (p.ground === 'contrast' ? CONTRAST[ground ?? 'white'] : p.ground);
	const groundAt = (yInches: number, xInches = item.size[0] / 2): SceneGround | undefined => {
		const panel = [...panels].reverse().find((p) => xInches >= p.box[0] && xInches <= p.box[0] + p.box[2] && yInches >= p.box[1] && yInches < p.box[1] + p.box[3]);
		if (panel) return panelGround(panel);
		return ground && bandLayer && yInches >= bandLayer.at + bandLayer.step * 4 ? CONTRAST[ground] : ground;
	};
	const inkFor = (yInches: number, xInches?: number, tone?: 'muted') => {
		const g = groundAt(yInches, xInches);
		if (tone === 'muted') return g && imageConfig().grounds[g].dark ? flatten(tokenColor('text-on-brand-muted'), tokenColor(GROUND_TOKEN[g])) : tokenColor('text-secondary');
		return tokenColor(g ? INK_ON[g] : variant.ink === 'brand' ? 'brand' : variant.ink);
	};
	if (ground) parts.push(rect(0, 0, W, H, tokenColor(GROUND_TOKEN[ground])));
	const copy = copyFor(item, opts);
	const layers = new Layers();
	const groundHex = (g: SceneGround | undefined) => (g ? [tokenColor(GROUND_TOKEN[g])] : []);
	const { medium, regular } = brandFonts();
	for (const layer of item.layers) {
		if (layer.type === 'scan') {
			if (ground !== 'blue') continue;
			// The scanlines at print size: one line every three hundredths of an inch reads as the site's 3px at arm's length.
			const room = bandLayer ? oy + px(bandLayer.at) : H;
			const spec = { ...imageConfig().scene.scan, every: Math.round(dpi / 100) * 3 };
			parts.push(scan(ids, 0, 0, W, room, spec, true).replace(/height="1" fill/, `height="${Math.round(dpi / 100)}" fill`));
		} else if (layer.type === 'band') {
			if (!ground) continue;
			layers.add({ id: 'band', kind: 'panel', box: { x: 0, y: oy + px(layer.at), w: W, h: H - oy - px(layer.at) }, bleeds: true, can: {} });
			parts.push(band(ids, W, oy + px(layer.at), px(layer.step), H, tokenColor(GROUND_TOKEN[ground]), tokenColor(GROUND_TOKEN[CONTRAST[ground]]), bandMixes()));
		} else if (layer.type === 'panel') {
			const [bx, by, bw, bh] = layer.box;
			// A panel at the trim's edge runs on into the bleed.
			const x0 = bx <= 0 ? 0 : ox + px(bx);
			const y0 = by <= 0 ? 0 : oy + px(by);
			const x1 = bx + bw >= item.size[0] ? W : ox + px(bx + bw);
			const y1 = by + bh >= item.size[1] ? H : oy + px(by + bh);
			parts.push(rect(x0, y0, x1 - x0, y1 - y0, tokenColor(GROUND_TOKEN[panelGround(layer)])));
		} else if (layer.type === 'repeat') {
			const [bx, by, bw, bh] = layer.box;
			const b = logoBox(layer.kind);
			const across = bw >= bh;
			const h = across ? bh : bw;
			const w = (h * b.width) / b.height;
			const turn = across ? 0 : 90;
			const step = (across ? w : w) + h;
			const length = across ? bw : bh;
			const n = Math.max(1, Math.floor((length + h) / step));
			const start = (length - (n * step - h)) / 2;
			const fill = inkFor(by + bh / 2, bx + bw / 2);
			for (let i = 0; i < n; i++) {
				const at = start + i * step;
				if (across) parts.push(drawLogo(layer.kind, ox + px(bx + at), oy + px(by), px(h), fill));
				else parts.push(`<g transform="rotate(${turn} ${ox + px(bx + bw / 2)} ${oy + px(by + at + w / 2)})">${drawLogo(layer.kind, ox + px(bx + bw / 2 - w / 2), oy + px(by + at + w / 2 - h / 2), px(h), fill)}</g>`);
			}
			layers.add({ id: 'logo-repeat', kind: 'art', box: { x: ox + px(bx), y: oy + px(by), w: px(bw), h: px(bh) }, can: {} });
		} else if (layer.type === 'logo') {
			const p = logoPlacement(layer);
			const box = logoBox(layer.kind);
			layers.add({ id: logos++ ? `logo-${logos}` : 'logo', kind: 'logo', box: { x: ox + px(p.x), y: oy + px(p.y), w: px(p.w), h: px(p.h) }, logo: { clear: px(p.h / 2), min: (px(cfg.logo.minWidth[layer.kind]) * box.height) / box.width }, can: {} });
			parts.push(`<g id="logo-${layer.kind}">${drawLogo(layer.kind, ox + px(p.x), oy + px(p.y), px(p.h), inkFor(p.y + p.h / 2, p.x + p.w / 2))}</g>`);
		} else {
			const value = copy[layer.slot] ?? '';
			if (!value) continue;
			const [bx, by, bw, bh] = layer.box;
			// Tracking steps are screen sizes; a print inch reads as 96 of them.
			const unit = dpi / 96;
			const font = layer.weight === 'regular' ? regular : medium;
			const leading = layer.weight === 'regular' ? 1.35 : 1.05;
			// Body text may step down to a print floor of 7 pt; headings keep closer to their size.
			const floor = layer.weight === 'regular' ? Math.min(px(layer.size), px(7 / 72)) : Math.max(px(0.1), px(layer.size) * 0.3);
			const fit = fitBlock(font, value, { what: layer.slot, w: px(bw), h: px(bh), size: px(layer.size), floor, leading, maxLines: layer.maxLines, k: unit });
			const x = ox + px(layer.align === 'center' ? bx + bw / 2 : layer.align === 'right' ? bx + bw : bx);
			const own = layer.slot === 'url' && !opts.url?.trim() && !opts.copy?.url?.trim();
			parts.push(`<g id="text-${layer.slot}">${drawBlock(layers, layer.slot, font, fit, x, oy + px(by), layer.align, inkFor(by, bx + bw / 2, layer.tone), groundHex(groundAt(by, bx + bw / 2)), value, {}, own)}</g>`);
		}
	}
	const cutRects = [...(item.cut ? [{ box: [0, 0, item.size[0], item.size[1]] as Box, radius: item.cut.radius }] : []), ...(item.cuts ?? [])];
	const cutPath = cutRects.length ? `<g id="CutContour">${cutRects.map((c) => `<rect x="${ox + px(c.box[0])}" y="${oy + px(c.box[1])}" width="${px(c.box[2])}" height="${px(c.box[3])}" rx="${px(c.radius)}" fill="none" stroke="#EC008C" stroke-width="${dpi / 72}"/>`).join('')}</g>` : '';
	const title = `${item.name}, ${variantId}`;
	const sizeAttrs = (svg: string) => svg.replace(`width="${W}" height="${H}"`, `width="${fullW}in" height="${fullH}in"`);
	const print = sizeAttrs(document(W, H, title, parts.join('')));
	const printWithCut = cutPath ? print.replace('\n</svg>', `\n<g id="cut" style="display:inline">${cutPath}</g>\n</svg>`) : print;
	// The proof: the print file with the trim (solid), bleed edge (outer) and safe area (dashed) drawn over it.
	const guide = (x: number, y: number, w: number, h: number, dash: string, color: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="${dpi / 72}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
	const guides = [
		guide(ox, oy, px(item.size[0]), px(item.size[1]), '', '#EC008C'),
		guide(ox + px(item.safe), oy + px(item.safe), px(item.size[0] - item.safe * 2), px(item.size[1] - item.safe * 2), `${dpi / 12} ${dpi / 24}`, '#00A3E0'),
	].join('');
	const checker = ground ? '' : `<defs><pattern id="mchk" width="${dpi / 4}" height="${dpi / 4}" patternUnits="userSpaceOnUse"><rect width="${dpi / 4}" height="${dpi / 4}" fill="#DDDDDD"/><rect width="${dpi / 8}" height="${dpi / 8}" fill="#BBBBBB"/><rect x="${dpi / 8}" y="${dpi / 8}" width="${dpi / 8}" height="${dpi / 8}" fill="#BBBBBB"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#mchk)"/>`;
	const proof = document(W, H, `${title}, proof`, `${checker}${parts.join('')}${guides}${cutPath}`);
	return { print: printWithCut, raster: print, proof, cut: cutPath ? document(W, H, `${title}, cut`, cutPath) : undefined, width: W, height: H, inches: { width: fullW, height: fullH }, layers: layers.list };
}

/** The logo conventions (merch.json logo): minimum width, inside the safe area, clear space from the trim and from other parts. */
export function checkItem(item: MerchItem): string[] {
	const cfg = merchConfig();
	const errors: string[] = [];
	const boxes = item.layers.flatMap((l, i) => (l.type === 'logo' || l.type === 'text' ? [{ i, l, box: l.type === 'logo' ? (() => { const p = logoPlacement(l); return [p.x, p.y, p.w, p.h] as Box; })() : l.box }] : []));
	for (const { i, l, box } of boxes) {
		if (l.type !== 'logo') continue;
		const [x, y, w, h] = box;
		const min = cfg.logo.minWidth[l.kind];
		if (w + 1e-6 < min) errors.push(`${item.id}: the ${l.kind} is ${w.toFixed(2)} in wide, under the ${min} in minimum`);
		if (x < item.safe - 1e-6 || y < item.safe - 1e-6 || x + w > item.size[0] - item.safe + 1e-6 || y + h > item.size[1] - item.safe + 1e-6) errors.push(`${item.id}: the ${l.kind} leaves the safe area`);
		const clear = h / 2;
		if (x < clear || y < clear || item.size[0] - (x + w) < clear || item.size[1] - (y + h) < clear) errors.push(`${item.id}: the ${l.kind} is closer to the trim than half its height`);
		for (const other of boxes) {
			if (other.i === i) continue;
			const [ox, oy, ow, oh] = other.box;
			const gapX = Math.max(ox - (x + w), x - (ox + ow));
			const gapY = Math.max(oy - (y + h), y - (oy + oh));
			if (Math.max(gapX, gapY) < clear - 1e-6) errors.push(`${item.id}: the ${l.kind} is closer than half its height to layer ${other.i + 1}`);
		}
		const bandLayer = item.layers.find((b): b is Extract<MerchLayer, { type: 'band' }> => b.type === 'band');
		if (bandLayer) {
			const top = bandLayer.at;
			const bottom = bandLayer.at + bandLayer.step * 4;
			if (y + h > top - clear && y < bottom + clear) errors.push(`${item.id}: the ${l.kind} sits on the band`);
		}
	}
	return errors;
}
