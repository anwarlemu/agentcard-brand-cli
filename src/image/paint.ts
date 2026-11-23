// Paint helpers for brand images: token colors, the shipped logo, and Inter set as paths.
// Type is outlined so an SVG opens the same way everywhere, with no font installed.

import { readFileSync } from 'node:fs';
import opentype, { type Font, type Glyph } from 'opentype.js';
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

// Inter's default quotes are square slabs. The round alternates match the display face this image stands in for.
const ROUND_QUOTES = new Set(['quotedblleft', 'quotedblright', 'quoteleft', 'quoteright']);
const roundCache = new WeakMap<Font, Map<string, Glyph | null>>();
const kernCache = new WeakMap<Font, unknown>();

function roundQuote(font: Font, glyph: Glyph): Glyph {
	let cache = roundCache.get(font);
	if (!cache) roundCache.set(font, (cache = new Map()));
	const known = cache.get(glyph.name);
	if (known !== undefined) return known ?? glyph;
	if (!ROUND_QUOTES.has(glyph.name)) {
		cache.set(glyph.name, null);
		return glyph;
	}
	const alt = font.nameToGlyph(`${glyph.name}.ss03`);
	const use = alt.name === `${glyph.name}.ss03` ? alt : null;
	cache.set(glyph.name, use);
	return use ?? glyph;
}

function lineGlyphs(font: Font, text: string) {
	let round = false;
	const glyphs = font.stringToGlyphs(text).map((glyph) => {
		const next = roundQuote(font, glyph);
		if (next !== glyph) round = true;
		return next;
	});
	return { glyphs, round };
}

function kerningTables(font: Font) {
	let tables = kernCache.get(font);
	if (tables === undefined) {
		tables = font.position.getKerningTables(font.position.getDefaultScriptName());
		kernCache.set(font, tables);
	}
	return tables;
}

/** Positions for one line. The returned advance includes the extra letter-spacing opentype.js adds after the last glyph. */
function placeGlyphs(font: Font, glyphs: Glyph[], size: number, tracking: number) {
	const scale = size / font.unitsPerEm;
	const tables = kerningTables(font);
	const stops: number[] = [];
	let advance = 0;
	for (let i = 0; i < glyphs.length; i++) {
		stops.push(advance);
		const glyph = glyphs[i];
		if (glyph.advanceWidth) advance += glyph.advanceWidth * scale;
		if (i < glyphs.length - 1) advance += font.position.getKerningValue(tables, glyph.index, glyphs[i + 1].index) * scale;
		advance += tracking * size;
	}
	return { stops, advance };
}

/** Characters that draw nothing on their own (joiners, variation selectors, byte order marks): they never count as missing. */
const INVISIBLE = /[\u200B-\u200F\u2060\uFE00-\uFE0F\uFEFF\u00AD\u202A-\u202E]/gu;

/** The characters of `text` the shipped font cannot draw (emoji, Chinese, Arabic and so on). */
export function missingGlyphs(text: string, font: Font = brandFonts().medium): string[] {
	const out = new Set<string>();
	for (const ch of text.normalize('NFC').replace(INVISIBLE, '')) if (!/\s/u.test(ch) && font.charToGlyph(ch).index === 0) out.add(ch);
	return [...out];
}

/** Text ready to draw: composed letters, no invisible characters. Throws when a character has no glyph, so nothing is drawn as an empty box. */
export function drawable(text: string, what = 'text'): string {
	const bad = missingGlyphs(text);
	if (bad.length) throw new Error(`The brand font has no character for ${bad.slice(0, 8).join(' ')}${bad.length > 8 ? ` and ${bad.length - 8} more` : ''} (in the ${what}). Remove ${bad.length === 1 ? 'it' : 'them'} or write the words in Latin, Greek or Cyrillic letters.`);
	return text.normalize('NFC').replace(INVISIBLE, '');
}

function inkAdvance(font: Font, text: string, size: number, tracking: number) {
	const { glyphs, round } = lineGlyphs(font, text);
	if (!round) return font.getAdvanceWidth(text, size, { letterSpacing: tracking, kerning: true });
	return placeGlyphs(font, glyphs, size, tracking).advance;
}

function inkPath(font: Font, text: string, x: number, baseline: number, size: number, tracking: number) {
	const { glyphs, round } = lineGlyphs(font, text);
	if (!round) return font.getPath(text, x, baseline, size, { letterSpacing: tracking, kerning: true }).toPathData(1);
	const { stops } = placeGlyphs(font, glyphs, size, tracking);
	return glyphs.map((glyph, index) => glyph.getPath(x + stops[index], baseline, size).toPathData(1)).join('');
}

const widths = new WeakMap<Font, Map<string, number>>();

/** Width of the ink. `tracking` is a fraction of the em. opentype.js adds one extra letter-spacing after the last glyph; that gap is not ink. */
export function measure(font: Font, text: string, size: number, tracking: number): number {
	if (!text) return 0;
	// Advances, kerning and tracking all scale with the size, so one measurement per line serves every size it is tried at.
	let cache = widths.get(font);
	if (!cache || cache.size > 20000) widths.set(font, (cache = new Map()));
	const key = `${tracking} ${text}`;
	let unit = cache.get(key);
	if (unit === undefined) cache.set(key, (unit = (inkAdvance(font, text, 1000, tracking) - tracking * 1000) / 1000));
	return unit * size;
}

export type Block = { font: Font; size: number; tracking: number; leading: number; lines: string[]; height: number };

function blockHeight(font: Font, size: number, leading: number, count: number) {
	if (count <= 0) return 0;
	const asc = (font.ascender / font.unitsPerEm) * size;
	const desc = Math.abs(font.descender / font.unitsPerEm) * size;
	return asc + (count - 1) * size * leading + desc;
}

/** Lines of text within a width. `soft` marks a line that ends inside a long word (after a slash, dot, dash and the like). */
export type Wrapped = { lines: string[]; soft: boolean[] };

const SOFT = /(?<=[/\-_.?&=:@+~#,])/u;

/** Wraps words to a width. A word too long for a line breaks only after its own punctuation; null when it still does not fit. */
export function wrapFit(font: Font, text: string, size: number, tracking: number, maxWidth: number): Wrapped | null {
	const lines: string[] = [];
	const soft: boolean[] = [];
	const push = (line: string, isSoft = false) => {
		lines.push(line);
		soft.push(isSoft);
	};
	const fits = (line: string) => measure(font, line, size, tracking) <= maxWidth + 0.01;
	for (const paragraph of text.split('\n')) {
		const words = paragraph.split(/\s+/).filter(Boolean);
		if (!words.length) {
			push('');
			continue;
		}
		let line = '';
		for (const word of words) {
			const next = line ? `${line} ${word}` : word;
			if (fits(next)) {
				line = next;
				continue;
			}
			if (line) push(line);
			line = '';
			if (fits(word)) {
				line = word;
				continue;
			}
			for (const piece of word.split(SOFT)) {
				if (fits(line + piece)) line += piece;
				else {
					if (!line || !fits(piece)) return null;
					push(line, true);
					line = piece;
				}
			}
		}
		if (line) push(line);
	}
	return { lines: lines.length ? lines : [''], soft: soft.length ? soft : [false] };
}

/** The words as drawn, read back from the wrapped lines. */
export const readBack = (w: Wrapped) => w.lines.map((l, i) => l + (i === w.lines.length - 1 || w.soft[i] ? '' : ' ')).join('').replace(/\s+/g, ' ').trim();

/** The same number of lines, as even as they go: no single word left alone on the last line. */
export function wrapEven(font: Font, text: string, size: number, tracking: number, maxWidth: number): Wrapped | null {
	const first = wrapFit(font, text, size, tracking, maxWidth);
	if (!first || first.lines.length < 2 || first.soft.some(Boolean)) return first;
	let lo = maxWidth / first.lines.length;
	let hi = maxWidth;
	let best = first;
	for (let i = 0; i < 9; i++) {
		const mid = (lo + hi) / 2;
		const w = wrapFit(font, text, size, tracking, mid);
		if (w && w.lines.length === first.lines.length && !w.soft.some(Boolean)) {
			best = w;
			hi = mid;
		} else lo = mid;
	}
	return best;
}

export function wrap(font: Font, text: string, size: number, tracking: number, maxWidth: number): string[] {
	const w = wrapFit(font, text, size, tracking, maxWidth);
	if (!w) throw new Error(`"${text.split(/\s+/).sort((a, b) => b.length - a.length)[0]}" is too long for this size. Shorten it.`);
	return w.lines;
}

/** The exact bounds of a drawn line: its ink, not its advance. */
export function lineInk(font: Font, text: string, x: number, baseline: number, size: number, tracking: number): { x: number; y: number; w: number; h: number } {
	const { glyphs } = lineGlyphs(font, text);
	const { stops } = placeGlyphs(font, glyphs, size, tracking);
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -Infinity;
	let y1 = -Infinity;
	glyphs.forEach((g, i) => {
		const b = g.getPath(x + stops[i]!, baseline, size).getBoundingBox();
		if (b.x2 <= b.x1 && b.y2 <= b.y1) return;
		x0 = Math.min(x0, b.x1);
		y0 = Math.min(y0, b.y1);
		x1 = Math.max(x1, b.x2);
		y1 = Math.max(y1, b.y2);
	});
	if (x1 < x0) return { x, y: baseline, w: 0, h: 0 };
	return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function tryFit(font: Font, text: string, maxWidth: number, maxHeight: number, opts: { start: number; min: number; leading: number; maxLines: number }): Block | undefined {
	let size = Math.max(opts.min, Math.floor(opts.start));
	const min = Math.max(8, Math.floor(opts.min));
	while (size >= min) {
		const tracking = trackingFor(size);
		const lines = wrapEven(font, text, size, tracking, maxWidth)?.lines;
		if (!lines) {
			size -= 1;
			continue;
		}
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
		const data = inkPath(block.font, line, left, baseline, block.size, block.tracking);
		if (data) parts.push(`<path d="${data}" fill="${fill}"/>`);
	});
	return parts.join('');
}

/** One line. It never cuts: a line wider than its room is an error. */
export function drawLine(font: Font, text: string, x: number, baseline: number, size: number, tracking: number, maxWidth: number, fill: string): string {
	if (measure(font, text, size, tracking) > maxWidth + 0.5) throw new Error(`"${text}" is too long for this size. Shorten it.`);
	const data = inkPath(font, text, x, baseline, size, tracking);
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

export function logoBox(kind: 'mark' | 'lockup') {
	const logo = logoSet()[kind];
	return { width: logo.width, height: logo.height };
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
