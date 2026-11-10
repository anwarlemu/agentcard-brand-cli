// Write SVG and PNG files. PNG uses resvg's wasm build so a sandbox does not need a browser or a system font.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import { type ImageJob, type SizeId } from './catalog.js';
import { renderSvg } from './layout.js';

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

/** RGBA pixels for video frames. The PNG path above stays the still-image renderer. */
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

export type WrittenImage = { path: string; format: 'png' | 'svg'; size: SizeId; width: number; height: number; bytes: number; template: ImageJob['template'] };

function pngDimensions(buf: Buffer) {
	if (buf.length < 24 || buf.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Renderer did not return a PNG.');
	return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

export async function writeImages(jobs: ImageJob[], opts: { out: string; name: string; formats: ('png' | 'svg')[] }): Promise<WrittenImage[]> {
	// Draw every file first. A later size that does not fit must not leave a partial directory behind.
	const prepared: { job: ImageJob; svg: string; png?: Buffer }[] = [];
	for (const job of jobs) {
		const svg = renderSvg(job);
		let png: Buffer | undefined;
		if (opts.formats.includes('png')) {
			png = await rasterize(svg, job.width);
			const dim = pngDimensions(png);
			if (dim.width !== job.width || dim.height !== job.height) throw new Error(`Rendered ${dim.width} by ${dim.height} for ${job.size}. Expected ${job.width} by ${job.height}.`);
		}
		prepared.push({ job, svg, png });
	}
	const dir = resolve(opts.out);
	mkdirSync(dir, { recursive: true });
	const written: WrittenImage[] = [];
	for (const item of prepared) {
		const stem = `${opts.name}-${item.job.size}`;
		if (opts.formats.includes('svg')) {
			const path = join(dir, `${stem}.svg`);
			writeFileSync(path, item.svg);
			written.push({ path, format: 'svg', size: item.job.size, width: item.job.width, height: item.job.height, bytes: Buffer.byteLength(item.svg), template: item.job.template });
		}
		if (item.png) {
			const path = join(dir, `${stem}.png`);
			writeFileSync(path, item.png);
			written.push({ path, format: 'png', size: item.job.size, width: item.job.width, height: item.job.height, bytes: item.png.length, template: item.job.template });
		}
	}
	return written;
}

export function showPath(path: string) {
	const rel = relative(process.cwd(), path);
	return rel.startsWith('..') || dirname(rel) === '..' ? path : rel.split('\\').join('/');
}
