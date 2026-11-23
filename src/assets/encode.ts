import jpeg from 'jpeg-js';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { unknownName } from '../lib/names.js';
import type { Pixels } from './png.js';

// JPEG and WebP from pixels, in process and deterministic (the same pixels give the same bytes on every machine).

const require = createRequire(import.meta.url);

export const JPG_QUALITY = 90;
export const WEBP_QUALITY = 90;

/** JPEG has no alpha: clear pixels are flattened on white. */
export function encodeJpg(p: { width: number; height: number; data: Uint8Array | Uint8ClampedArray }, quality = JPG_QUALITY): Buffer {
	const data = new Uint8Array(p.data);
	for (let i = 0; i < data.length; i += 4) {
		const a = data[i + 3]! / 255;
		if (a < 1) {
			for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c]! * a + 255 * (1 - a));
			data[i + 3] = 255;
		}
	}
	return Buffer.from(jpeg.encode({ data, width: p.width, height: p.height }, quality).data);
}

type WebpModule = { encode(data: Uint8Array | Uint8ClampedArray, width: number, height: number, options: Record<string, unknown>): Uint8Array | null };
let webp: Promise<WebpModule> | undefined;

// The plain (not SIMD) build, so every machine writes the same bytes.
async function webpModule(): Promise<WebpModule> {
	const dir = '@jsquash/webp/codec/enc/webp_enc';
	const { default: create } = (await import('@jsquash/webp/codec/enc/webp_enc.js')) as { default: (options: Record<string, unknown>) => Promise<WebpModule> };
	return create({ noInitialRun: true, wasmBinary: readFileSync(require.resolve(`${dir}.wasm`)) });
}

export async function encodeWebp(p: Pixels | { width: number; height: number; data: Uint8Array }, quality = WEBP_QUALITY): Promise<Buffer> {
	webp ??= webpModule();
	const [module, { defaultOptions }] = await Promise.all([webp, import('@jsquash/webp/meta.js') as Promise<{ defaultOptions: Record<string, unknown> }>]);
	const out = module.encode(new Uint8ClampedArray(p.data), p.width, p.height, { ...defaultOptions, quality });
	if (!out) throw new Error('The WebP encoder failed.');
	return Buffer.from(out);
}

export type ImageFormat = 'png' | 'svg' | 'jpg' | 'webp';
export const ALL_FORMATS: ImageFormat[] = ['png', 'svg', 'jpg', 'webp'];

export function parseImageFormats(value: string | undefined, fallback: ImageFormat[]): ImageFormat[] {
	if (!value?.trim()) return fallback;
	const out: ImageFormat[] = [];
	for (const raw of value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean)) {
		const id = raw === 'jpeg' ? 'jpg' : raw;
		if (!(ALL_FORMATS as string[]).includes(id)) throw unknownName('format', raw, ALL_FORMATS);
		if (!out.includes(id as ImageFormat)) out.push(id as ImageFormat);
	}
	if (!out.length) throw new Error(`Pick a format: ${ALL_FORMATS.join(', ')}.`);
	return out;
}
