// Paint helpers for brand images: token colors, the shipped logo, and Inter set as paths.
// Type is outlined so an SVG opens the same way everywhere, with no font installed.

import { readFileSync } from 'node:fs';
import opentype, { type Font } from 'opentype.js';
import { tokens } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';

type Rgb = { r: number; g: number; b: number; a: number };

const num = (n: number) => {
	const rounded = Math.round(n * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

export const xml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function channel(hex: string) {
	return Number.parseInt(hex, 16);
}

export function parseColor(input: string): Rgb {
	const raw = input.trim();
	const hex = raw.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
	if (hex) {
		return { r: channel(hex[1].slice(0, 2)), g: channel(hex[1].slice(2, 4)), b: channel(hex[1].slice(4, 6)), a: hex[2] ? channel(hex[2]) / 255 : 1 };
	}
	const rgb = raw.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+)(%?)\s*)?\)$/i);
	if (!rgb) throw new Error(`Cannot use color ${input} in an image.`);
	const alpha = rgb[4] === undefined ? 1 : rgb[5] ? Number(rgb[4]) / 100 : Number(rgb[4]);
	return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: alpha };
}

export function hex(color: Rgb): string {
	const part = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
	return `#${part(color.r)}${part(color.g)}${part(color.b)}`.toUpperCase();
}

/** A token value as a color an SVG renderer can paint. Alpha is kept. */
export function tokenColor(name: string): string {
	const value = tokens().site[name.startsWith('--') ? name : `--ds-color-${name}`];
	if (!value) throw new Error(`Missing brand token ${name}.`);
	if (value.startsWith('color-mix') || value.startsWith('var(')) throw new Error(`Token ${name} is not a flat color.`);
	return value;
}

/** Flatten a translucent token onto a ground so small type stays the same color in every viewer. */
export function flatten(foreground: string, background: string): string {
	const fg = parseColor(foreground);
	if (fg.a >= 0.999) return hex(fg);
	const bg = parseColor(background);
	const mix = (front: number, back: number) => front * fg.a + back * (1 - fg.a);
	return hex({ r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 });
}

/** Mix `amount` of `toward` into `from` (0 to 1), in sRGB, matching the band steps. */
export function mix(from: string, toward: string, amount: number): string {
	const a = parseColor(from);
	const b = parseColor(toward);
	const span = (left: number, right: number) => left + (right - left) * amount;
	return hex({ r: span(a.r, b.r), g: span(a.g, b.g), b: span(a.b, b.b), a: 1 });
}

export function px(name: string): number {
	const value = tokens().site[name];
	if (!value) throw new Error(`Missing brand token ${name}.`);
	if (value.endsWith('rem')) return Number.parseFloat(value) * 16;
	if (value.endsWith('px')) return Number.parseFloat(value);
	if (value.endsWith('em')) return Number.parseFloat(value);
	const n = Number.parseFloat(value);
	if (!Number.isFinite(n)) throw new Error(`Token ${name} is not a length.`);
	return n;
}

/** Letter-spacing as a fraction of the em, the unit opentype.js expects. */
export function trackingEm(name: string): number {
	const value = tokens().site[name];
	if (!value?.endsWith('em')) throw new Error(`Token ${name} is not an em length.`);
	return Number.parseFloat(value);
}

export function trackingFor(size: number): number {
	if (size >= 72) return trackingEm('--ds-tracking-display');
	if (size >= 36) return trackingEm('--ds-tracking-tighter');
	return trackingEm('--ds-tracking-tight');
}

export function bandMixes(): number[] {
	return [1, 2, 3, 4].map((step) => {
		const value = tokens().site[`--ds-band-mix-${step}`];
		if (!value?.endsWith('%')) throw new Error(`Token --ds-band-mix-${step} is not a percentage.`);
		return Number.parseFloat(value) / 100;
	});
}

let fontPair: { regular: Font; medium: Font } | undefined;

export function brandFonts() {
	if (!fontPair) {
		const load = (file: string) => {
			const buf = readFileSync(pkgPath('brand', 'fonts', file));
			// A Node Buffer may sit inside a pooled ArrayBuffer. The parser wants a tight view.
			return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
		};
		fontPair = { regular: load('Inter-Regular.ttf'), medium: load('Inter-Medium.ttf') };
	}
	return fontPair;
}

/** Width of the ink. opentype.js adds one extra letter-spacing after the last glyph; that gap is not ink. */
export function measure(font: Font, text: string, size: number, tracking: number): number {
	if (!text) return 0;
	const advance = font.getAdvanceWidth(text, size, { letterSpacing: tracking, kerning: true });
	return advance - tracking * size;
}

export type Block = { font: Font; size: number; tracking: number; leading: number; lines: string[]; height: number };

function blockHeight(font: Font, size: number, leading: number, count: number) {
	if (count <= 0) return 0;
	const asc = (font.ascender / font.unitsPerEm) * size;
	const desc = Math.abs(font.descender / font.unitsPerEm) * size;
	return asc + (count - 1) * size * leading + desc;
}

export function wrap(font: Font, text: string, size: number, tracking: number, maxWidth: number): string[] {
	const lines: string[] = [];
	for (const paragraph of text.split('\n')) {
		const words = paragraph.split(/\s+/).filter(Boolean);
		if (!words.length) {
			lines.push('');
			continue;
		}
		let line = '';
		const pushWord = (word: string) => {
			if (measure(font, word, size, tracking) <= maxWidth) return word;
			let chunk = '';
			for (const char of word) {
				const next = chunk + char;
				if (measure(font, next, size, tracking) <= maxWidth) chunk = next;
				else {
					if (chunk) lines.push(chunk);
					chunk = char;
				}
			}
			return chunk;
		};
		for (const word of words) {
			const next = line ? `${line} ${word}` : word;
			if (measure(font, next, size, tracking) <= maxWidth) line = next;
			else {
				if (line) lines.push(line);
				line = pushWord(word);
			}
		}
		if (line) lines.push(line);
	}
	return lines.length ? lines : [''];
}

function tryFit(font: Font, text: string, maxWidth: number, maxHeight: number, opts: { start: number; min: number; leading: number; maxLines: number }): Block | undefined {
	let size = Math.max(opts.min, Math.floor(opts.start));
	const min = Math.max(8, Math.floor(opts.min));
	while (size >= min) {
		const tracking = trackingFor(size);
		const lines = wrap(font, text, size, tracking, maxWidth);
		const height = blockHeight(font, size, opts.leading, lines.length);
		const fits = lines.length <= opts.maxLines && height <= maxHeight + 0.5 && lines.every((line) => !line || measure(font, line, size, tracking) <= maxWidth + 0.5);
		if (fits) return { font, size, tracking, leading: opts.leading, lines, height };
		size -= 1;
	}
	return undefined;
}

/** Shrink until the copy fits the box. Throws when even the smallest size spills out. */
export function fitText(font: Font, text: string, maxWidth: number, maxHeight: number, opts: { start: number; min: number; leading: number; maxLines: number; role: string }): Block {
	const block = tryFit(font, text, maxWidth, maxHeight, opts);
	if (!block) throw new Error(`The ${opts.role} does not fit this size. Shorten it.`);
	return block;
}

export function drawText(block: Block, x: number, top: number, align: 'left' | 'center', boxWidth: number, fill: string): string {
	const asc = (block.font.ascender / block.font.unitsPerEm) * block.size;
	const parts: string[] = [];
	block.lines.forEach((line, index) => {
		if (!line) return;
		const width = measure(block.font, line, block.size, block.tracking);
		const left = align === 'center' ? x + (boxWidth - width) / 2 : x;
		const baseline = top + asc + index * block.size * block.leading;
		const data = block.font.getPath(line, left, baseline, block.size, { letterSpacing: block.tracking, kerning: true }).toPathData(1);
		if (data) parts.push(`<path d="${data}" fill="${fill}"/>`);
	});
	return parts.join('');
}

/** One line, cut with an ellipsis when the bar is narrower than the label. */
export function drawLine(font: Font, text: string, x: number, baseline: number, size: number, tracking: number, maxWidth: number, fill: string): string {
	let line = text;
	if (measure(font, line, size, tracking) > maxWidth) {
		while (line.length > 1 && measure(font, `${line}…`, size, tracking) > maxWidth) line = line.slice(0, -1);
		line = `${line.trimEnd()}…`;
	}
	const data = font.getPath(line, x, baseline, size, { letterSpacing: tracking, kerning: true }).toPathData(1);
	return data ? `<path d="${data}" fill="${fill}"/>` : '';
}

type Logo = { minX: number; minY: number; width: number; height: number; paths: string[] };

let logos: { mark: Logo; lockup: Logo } | undefined;

function readLogo(file: string): Logo {
	const text = readFileSync(pkgPath('brand', 'logo', file), 'utf8');
	const box = text.match(/viewBox="([^"]+)"/);
	if (!box) throw new Error(`Logo ${file} has no viewBox.`);
	const [minX, minY, width, height] = box[1].trim().split(/[\s,]+/).map(Number);
	const paths = [...text.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*\/?>/g)].map((match) => match[1]);
	if (!paths.length || [minX, minY, width, height].some((n) => !Number.isFinite(n))) throw new Error(`Logo ${file} has no paths.`);
	return { minX, minY, width, height, paths };
}

function logoSet() {
	logos ??= { mark: readLogo('mark.svg'), lockup: readLogo('lockup.svg') };
	return logos;
}

/** The lockup (wordmark plus hand) or the hand alone, painted in one flat color. */
export function drawLogo(kind: 'mark' | 'lockup', x: number, y: number, height: number, fill: string): string {
	const logo = logoSet()[kind];
	const scale = height / logo.height;
	const paths = logo.paths.map((data) => `<path d="${data}" fill="${fill}"/>`).join('');
	return `<g transform="translate(${num(x)} ${num(y)}) scale(${num(scale)}) translate(${num(-logo.minX)} ${num(-logo.minY)})">${paths}</g>`;
}

export function rect(x: number, y: number, w: number, h: number, fill: string, radius = 0): string {
	const rx = radius ? ` rx="${num(radius)}" ry="${num(radius)}"` : '';
	return `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}"${rx} fill="${fill}"/>`;
}

/** Four flat steps from one ground toward the next. A staircase, never a gradient. */
export function drawBand(y: number, width: number, from: string, toward: string, step = px('--ds-band-step')): { svg: string; height: number } {
	const svg = bandMixes()
		.map((amount, index) => rect(0, y + index * step, width, step + 0.5, mix(from, toward, amount)))
		.join('');
	return { svg, height: step * 4 };
}

export function document(width: number, height: number, title: string, body: string): string {
	return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">\n<title>${xml(title)}</title>\n${body}\n</svg>\n`;
}
