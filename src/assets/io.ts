import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { rasterize } from '../image/render.js';
import { unknownName } from '../lib/names.js';

// Writing what the asset commands make: SVG and PNG from one SVG, with sizes and hashes, everything prepared before
// anything is written so a failure leaves no partial set behind.

export type Format = 'png' | 'svg';
export type Written = { path: string; format: string; width: number; height: number; bytes: number; sha256: string };

export const sha256 = (buf: Buffer | string) => createHash('sha256').update(buf).digest('hex');

export function parseFormats(value: string | undefined, fallback: Format[] = ['svg', 'png']): Format[] {
	if (!value) return fallback;
	const out: Format[] = [];
	for (const raw of value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean)) {
		if (raw !== 'png' && raw !== 'svg') throw unknownName('format', raw, ['svg', 'png']);
		if (!out.includes(raw)) out.push(raw);
	}
	if (!out.length) throw new Error('Pick a format: svg, png, or both.');
	return out;
}

export type Prepared = { path: string; format: string; width: number; height: number; data: Buffer };

/** Renders the SVG (and its PNG) in memory. `scale` multiplies the PNG's pixel size. */
export async function prepare(dir: string, stem: string, svg: string, width: number, height: number, formats: Format[], scale = 1): Promise<Prepared[]> {
	const out: Prepared[] = [];
	if (formats.includes('svg')) out.push({ path: join(dir, `${stem}.svg`), format: 'svg', width, height, data: Buffer.from(svg) });
	if (formats.includes('png')) {
		const png = await rasterize(svg, Math.round(width * scale));
		out.push({ path: join(dir, `${stem}.png`), format: 'png', width: png.readUInt32BE(16), height: png.readUInt32BE(20), data: png });
	}
	return out;
}

export function writeAll(files: Prepared[]): Written[] {
	return files.map((f) => {
		mkdirSync(dirname(f.path), { recursive: true });
		writeFileSync(f.path, f.data);
		return { path: f.path, format: f.format, width: f.width, height: f.height, bytes: f.data.length, sha256: sha256(f.data) };
	});
}

export function show(path: string) {
	const rel = relative(process.cwd(), resolve(path));
	return rel.startsWith('..') ? path : rel.split('\\').join('/');
}
