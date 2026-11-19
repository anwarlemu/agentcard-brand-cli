import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { decodePng, encodePng, isPng, type Pixels } from './png.js';

// The user's pictures and the brand's art, as pixels and as data URIs an SVG can carry. PNG and JPEG decode in
// process (no browser, no system tool), so a render is the same on every machine.

const require = createRequire(import.meta.url);
const jpeg = require('jpeg-js') as { decode: (data: Buffer, opts: { useTArray: boolean; formatAsRGBA: boolean; maxMemoryUsageInMB?: number }) => { width: number; height: number; data: Uint8Array } };

export const MAX_PICTURE_BYTES = 15_000_000;

export type Picture = Pixels & { kind: 'png' | 'jpeg'; bytes: Buffer };

const isJpeg = (buf: Buffer) => buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;

/** Reads a PNG or JPEG file into straight RGBA. Anything else is refused with what to pass instead. */
export function readPicture(path: string, label = 'picture'): Picture {
	let bytes: Buffer;
	try {
		bytes = readFileSync(path);
	} catch {
		throw new Error(`Could not read the ${label} at ${path}.`);
	}
	if (bytes.length > MAX_PICTURE_BYTES) throw new Error(`The ${label} is larger than 15MB.`);
	if (isPng(bytes)) return { ...decodePng(bytes), kind: 'png', bytes };
	if (isJpeg(bytes)) {
		const raw = jpeg.decode(bytes, { useTArray: true, formatAsRGBA: true, maxMemoryUsageInMB: 1024 });
		return { width: raw.width, height: raw.height, data: new Uint8ClampedArray(raw.data.buffer, raw.data.byteOffset, raw.data.byteLength), kind: 'jpeg', bytes };
	}
	throw new Error(`The ${label} must be a PNG or JPEG (${path}).`);
}

/** A data URI for an SVG <image>: the file's own bytes when it is a file, or the pixels encoded as PNG. */
export function dataUri(source: Picture | Pixels): string {
	if ('bytes' in source) return `data:image/${source.kind};base64,${source.bytes.toString('base64')}`;
	return `data:image/png;base64,${encodePng(source).toString('base64')}`;
}

/** The smallest box around every pixel that is not clear, so a cut-out sits by its ink and not its canvas. */
export function inkBox(p: Pixels): { x: number; y: number; w: number; h: number } {
	let x0 = p.width;
	let y0 = p.height;
	let x1 = -1;
	let y1 = -1;
	for (let y = 0; y < p.height; y++)
		for (let x = 0; x < p.width; x++) {
			if (p.data[(y * p.width + x) * 4 + 3]! < 8) continue;
			if (x < x0) x0 = x;
			if (y < y0) y0 = y;
			if (x > x1) x1 = x;
			if (y > y1) y1 = y;
		}
	if (x1 < 0) return { x: 0, y: 0, w: p.width, h: p.height };
	return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

/** Crops pixels to a box. */
export function crop(p: Pixels, box: { x: number; y: number; w: number; h: number }): Pixels {
	const data = new Uint8ClampedArray(box.w * box.h * 4);
	for (let y = 0; y < box.h; y++) data.set(p.data.subarray(((box.y + y) * p.width + box.x) * 4, ((box.y + y) * p.width + box.x + box.w) * 4), y * box.w * 4);
	return { width: box.w, height: box.h, data };
}
