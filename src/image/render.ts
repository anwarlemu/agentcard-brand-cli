// SVG to PNG, JPEG and WebP, and writing the files. PNG uses resvg's wasm build so a sandbox does not need a browser or
// a system font.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import { encodeJpg, encodeWebp, type ImageFormat } from '../assets/encode.js';
import { assertClean } from './check.js';
import { SIZES, type ImageJob, type SizeId } from './catalog.js';
import { renderJob, type Rendered } from './layout.js';

const require = createRequire(import.meta.url);
let wasmReady: Promise<void> | undefined;

function startWasm() {
	wasmReady ??= initWasm(readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')));
	return wasmReady;
}

const rasterOptions = (width: number) => ({ fitTo: { mode: 'width' as const, value: width }, shapeRendering: 2 as const, font: { loadSystemFonts: false } });

export function rasterize(svg: string, width: number): Promise<Buffer> {
	return startWasm().then(() => {
		const renderer = new Resvg(svg, rasterOptions(width));
		try {
			const png = renderer.render();
			const bytes = Buffer.from(png.asPng());
			png.free();
			return bytes;
		} finally {
			renderer.free();
		}
	});
}

/** Text left as text (a contact sheet's labels), set in the fonts passed in. */
export function rasterizeWithFont(svg: string, width: number, fonts: Uint8Array[]): Promise<Buffer> {
	return startWasm().then(() => {
		const renderer = new Resvg(svg, { ...rasterOptions(width), font: { loadSystemFonts: false, fontBuffers: fonts } });
		try {
			const png = renderer.render();
			const bytes = Buffer.from(png.asPng());
			png.free();
			return bytes;
		} finally {
			renderer.free();
		}
	});
}

/** RGBA pixels for video frames and for JPEG and WebP. The PNG path above stays the still-image renderer. */
export function rasterizeRgba(svg: string, width: number): Promise<{ width: number; height: number; pixels: Uint8Array }> {
	return startWasm().then(() => {
		const renderer = new Resvg(svg, rasterOptions(width));
		try {
			const image = renderer.render();
			const pixels = new Uint8Array(image.pixels.byteLength);
			pixels.set(image.pixels);
			const size = { width: image.width, height: image.height, pixels };
			image.free();
			return size;
		} finally {
			renderer.free();
		}
	});
}

/** One SVG as the asked-for formats. */
export async function encodeAll(svg: string, width: number, formats: ImageFormat[]): Promise<Partial<Record<ImageFormat, Buffer>>> {
	const out: Partial<Record<ImageFormat, Buffer>> = {};
	if (formats.includes('svg')) out.svg = Buffer.from(svg);
	if (formats.includes('png')) out.png = await rasterize(svg, width);
	if (formats.includes('jpg') || formats.includes('webp')) {
		const px = await rasterizeRgba(svg, width);
		const pixels = { width: px.width, height: px.height, data: px.pixels };
		if (formats.includes('jpg')) out.jpg = encodeJpg(pixels);
		if (formats.includes('webp')) out.webp = await encodeWebp(pixels);
	}
	return out;
}

/** A warning when a file is over what the platform accepts for its size. */
export function overLimit(size: SizeId, format: string, bytes: number): string | undefined {
	const limit = SIZES[size]?.limit;
	if (!limit || format === 'svg' || bytes <= limit.bytes) return undefined;
	const mb = (n: number) => `${(n / 1_000_000).toFixed(1)}MB`;
	return `The ${size} ${format} is ${mb(bytes)}, over the ${mb(limit.bytes)} that ${limit.where} take. Use --format jpg or webp, or a smaller --scale.`;
}

export type WrittenImage = { path: string; format: ImageFormat; size: SizeId; width: number; height: number; bytes: number; template: ImageJob['template'] };

function pngDimensions(buf: Buffer) {
	if (buf.length < 24 || buf.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Renderer did not return a PNG.');
	return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

export type OutPlan = { dir: string; stem?: string; format?: ImageFormat };

/** `--out` is a folder, or a file when it ends in an image type (and then names the file and its format). */
export function planOut(out: string): OutPlan {
	const ext = extname(out).slice(1).toLowerCase();
	const format = ext === 'jpeg' ? 'jpg' : ext;
	if (['png', 'svg', 'jpg', 'webp'].includes(format) && !(existsSync(out) && statSync(out).isDirectory())) return { dir: dirname(resolve(out)), stem: basename(out, extname(out)), format: format as ImageFormat };
	return { dir: resolve(out) };
}

export const stemFor = (name: string, job: Pick<ImageJob, 'size' | 'width' | 'height'>) => `${name}-${job.size === 'custom' ? `${job.width}x${job.height}` : job.size}`;

export async function writeImages(jobs: ImageJob[], opts: { out: string; name: string; formats: ImageFormat[]; scale?: number; stems?: string[] }): Promise<{ files: WrittenImage[]; warnings: string[]; rendered: Rendered[] }> {
	// Draw every file first. A later size that does not fit must not leave a partial directory behind.
	const scale = opts.scale ?? 1;
	const plan = planOut(opts.out);
	if (plan.stem && jobs.length > 1) throw new Error('--out names one file, and this makes several. Pass a folder.');
	const prepared: { job: ImageJob; data: Partial<Record<ImageFormat, Buffer>>; rendered: Rendered }[] = [];
	for (const job of jobs) {
		const rendered = renderJob(job);
		assertClean({ template: job.template, kind: 'image', size: { id: job.size, width: job.width, height: job.height }, copy: { headline: job.headline, body: job.body, badge: job.badge, button: job.button, quote: job.quote, by: job.by, 'window-bar': job.window, footer: job.footerOptional ? undefined : job.footer, number: job.number, cards: job.cards?.map((c) => `${c.title}\n${c.body}`).join('\n\n'), stat: job.stat, data: job.data, plans: job.plans, columns: job.columns, steps: job.steps, left: job.left, right: job.right }, layers: rendered.layers }, `The ${job.template} at ${job.size}`);
		const width = Math.round(job.width * scale);
		const data = await encodeAll(rendered.svg, width, opts.formats);
		if (data.png) {
			const dim = pngDimensions(data.png);
			if (dim.width !== width || Math.abs(dim.height - job.height * scale) > 1) throw new Error(`Rendered ${dim.width} by ${dim.height} for ${job.size}. Expected ${width} by ${Math.round(job.height * scale)}.`);
		}
		prepared.push({ job, data, rendered });
	}
	mkdirSync(plan.dir, { recursive: true });
	const files: WrittenImage[] = [];
	const warnings: string[] = [];
	prepared.forEach((item, i) => {
		const stem = plan.stem ?? opts.stems?.[i] ?? stemFor(opts.name, item.job);
		for (const format of ['svg', 'png', 'jpg', 'webp'] as const) {
			const buf = item.data[format];
			if (!buf) continue;
			const path = join(plan.dir, `${stem}.${format}`);
			writeFileSync(path, buf);
			const px = format === 'svg' ? 1 : scale;
			files.push({ path, format, size: item.job.size, width: Math.round(item.job.width * px), height: Math.round(item.job.height * px), bytes: buf.length, template: item.job.template });
			const over = overLimit(item.job.size, format, buf.length);
			if (over) warnings.push(over);
		}
		for (const note of item.rendered.notes) warnings.push(`${item.job.size}: ${note}`);
	});
	return { files, warnings: [...new Set(warnings)], rendered: prepared.map((p) => p.rendered) };
}

export function showPath(path: string) {
	const rel = relative(process.cwd(), path);
	return rel.startsWith('..') || dirname(rel) === '..' ? path : rel.split('\\').join('/');
}
