// SVG pieces every scene shares: CSS shadows from the shadow tokens, the scanlines and vignette the blue grounds wear,
// the stepped band with its grain, and placed pictures. Values come from the tokens (and brand/assets for the
// geometry); nothing here names a brand.

import { tokens } from '../lib/brand.js';
import { mix, parseColor, rect, tokenColor } from './paint.js';

export const num = (n: number) => String(Math.round(n * 100) / 100);

/** Unique ids within one SVG document. */
export class Ids {
	private n = 0;
	constructor(private prefix = 's') {}
	next(kind: string) {
		this.n += 1;
		return `${this.prefix}${kind}${this.n}`;
	}
}

export type Shadow = { inset: boolean; x: number; y: number; blur: number; spread: number; color: string };

/** A token's CSS box-shadow, parsed into layers (px). */
export function shadowToken(name: string): Shadow[] {
	const raw = tokens().site[name];
	if (!raw) throw new Error(`Missing brand token ${name}.`);
	return raw.split(/,(?![^()]*\))/).map((part) => {
		const p = part.trim();
		const inset = /\binset\b/.test(p);
		const color = /(rgba?\([^)]*\)|#[0-9a-f]{3,8}\b)/i.exec(p)?.[1] ?? '#000000';
		const nums = p.replace(/\binset\b/, '').replace(color, '').trim().split(/\s+/).filter(Boolean).map((v) => Number.parseFloat(v));
		return { inset, x: nums[0] ?? 0, y: nums[1] ?? 0, blur: nums[2] ?? 0, spread: nums[3] ?? 0, color };
	});
}

export function rgbaOf(color: string, alpha = 1) {
	const c = parseColor(color);
	return `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.round(c.a * alpha * 1000) / 1000})`;
}

/** Outer shadows go under the shape, inset ones (the bevel's light top and dark bottom) over it, clipped to it. */
export function boxShadow(ids: Ids, x: number, y: number, w: number, h: number, r: number, layers: Shadow[], scale = 1) {
	const under: string[] = [];
	const over: string[] = [];
	const defs: string[] = [];
	for (const s of layers) {
		if (!s.inset) {
			const spread = s.spread * scale;
			const box = rect(x + s.x * scale - spread, y + s.y * scale - spread, w + spread * 2, h + spread * 2, rgbaOf(s.color), Math.max(0, r + spread));
			if (s.blur > 0) {
				const id = ids.next('b');
				defs.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${num((s.blur * scale) / 2)}"/></filter>`);
				under.push(box.replace('/>', ` filter="url(#${id})"/>`));
			} else under.push(box);
			continue;
		}
		// Inset shadows in the tokens have no blur: a band along the top (positive y) or the bottom (negative y).
		if (s.blur > 0 || s.y === 0) continue;
		const band = Math.abs(s.y) * scale;
		over.push(rect(x, s.y > 0 ? y : y + h - band, w, band, rgbaOf(s.color)));
	}
	const clip = ids.next('c');
	defs.push(`<clipPath id="${clip}">${rect(x, y, w, h, '#fff', r)}</clipPath>`);
	return { defs: defs.join(''), under: under.reverse().join(''), over: over.length ? `<g clip-path="url(#${clip})">${over.join('')}</g>` : '' };
}

export type ScanSpec = { line: string; lineAlpha: number; every: number; vignetteAlpha: number; vignetteClear: number; sidesAlpha: number; sidesStop: number };

/** Ink lines every few pixels, a vignette to the farthest corner and, with sides, the hero's darker side shades. */
export function scan(ids: Ids, x: number, y: number, w: number, h: number, spec: ScanSpec, sides: boolean) {
	const ink = spec.line.startsWith('--') ? tokenColor(spec.line) : spec.line;
	const pat = ids.next('p');
	const vig = ids.next('v');
	const side = ids.next('h');
	const clip = ids.next('c');
	const cx = x + w / 2;
	const cy = y + h / 2;
	const defs = [
		`<pattern id="${pat}" x="${num(x)}" y="${num(y)}" width="${num(Math.max(w, 1))}" height="${spec.every}" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="${num(Math.max(w, 1))}" height="1" fill="${rgbaOf(ink, spec.lineAlpha)}"/></pattern>`,
		`<radialGradient id="${vig}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${num(cx)} ${num(cy)}) scale(${num((w / 2) * Math.SQRT2)} ${num((h / 2) * Math.SQRT2)})"><stop offset="${spec.vignetteClear}" stop-color="${rgbaOf(ink, 0)}"/><stop offset="1" stop-color="${rgbaOf(ink, spec.vignetteAlpha)}"/></radialGradient>`,
		`<linearGradient id="${side}" gradientUnits="userSpaceOnUse" x1="${num(x)}" y1="0" x2="${num(x + w)}" y2="0"><stop offset="0" stop-color="${rgbaOf(ink, spec.sidesAlpha)}"/><stop offset="${spec.sidesStop}" stop-color="${rgbaOf(ink, 0)}"/><stop offset="${1 - spec.sidesStop}" stop-color="${rgbaOf(ink, 0)}"/><stop offset="1" stop-color="${rgbaOf(ink, spec.sidesAlpha)}"/></linearGradient>`,
		`<clipPath id="${clip}">${rect(x, y, w, h, '#fff')}</clipPath>`,
	];
	const body = [rect(x, y, w, h, `url(#${pat})`), rect(x, y, w, h, `url(#${vig})`), sides ? rect(x, y, w, h, `url(#${side})`) : ''].join('');
	return `<defs>${defs.join('')}</defs><g clip-path="url(#${clip})">${body}</g>`;
}

export type GrainSpec = { baseFrequency: number; octaves: number; opacity: number; blend: string };

/** Band steps from `from` toward `to` (each a further mix), the rest of the height in `to`, and the grain over the steps. */
export function band(ids: Ids, width: number, y: number, step: number, bottom: number, from: string, to: string, mixes: number[], grain?: GrainSpec, shift: [number, number] = [0, 0]) {
	const parts = [rect(0, y, width, bottom - y, to)];
	mixes.forEach((amount, i) => parts.push(rect(0, y + i * step, width, step + 0.5, mix(from, to, amount))));
	if (grain) {
		const f = ids.next('g');
		const clip = ids.next('c');
		const h = step * mixes.length;
		// Oversized past the steps so a jump never shows an edge (the band divider's grain moves the same way).
		const pad = 80;
		parts.push(
			`<defs><filter id="${f}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${grain.baseFrequency}" numOctaves="${grain.octaves}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><clipPath id="${clip}">${rect(0, y, width, h, '#fff')}</clipPath></defs>`,
			`<g clip-path="url(#${clip})"><g style="mix-blend-mode:${grain.blend}" opacity="${grain.opacity}"><rect x="${num(-pad + shift[0])}" y="${num(y - pad + shift[1])}" width="${num(width + pad * 2)}" height="${num(h + pad * 2)}" filter="url(#${f})"/></g></g>`,
		);
	}
	return parts.join('');
}

/** A picture centered on (cx, cy), w by h, turned by `rotate` degrees. */
export function placed(href: string, cx: number, cy: number, w: number, h: number, rotate = 0, opacity = 1) {
	const op = opacity < 1 ? ` opacity="${num(opacity)}"` : '';
	return `<image href="${href}" x="${num(-w / 2)}" y="${num(-h / 2)}" width="${num(w)}" height="${num(h)}" preserveAspectRatio="none" transform="translate(${num(cx)} ${num(cy)}) rotate(${num(rotate)})"${op}/>`;
}

/** The token's px value for a radius at an image's scale. */
export function radiusPx(name: string, scale = 1): number {
	const raw = tokens().site[name];
	if (!raw) throw new Error(`Missing brand token ${name}.`);
	const v = raw.endsWith('rem') ? Number.parseFloat(raw) * 16 : Number.parseFloat(raw);
	return v * scale;
}
