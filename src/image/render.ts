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

export function rasterize(svg: string, width: number): Promise<Buffer> {
	return startWasm().then(() => {
		const renderer = new Resvg(svg, { fitTo: { mode: 'width', value: width }, shapeRendering: 2, font: { loadSystemFonts: false } });
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

export type WrittenImage = { path: string; format: 'png' | 'svg'; size: SizeId; width: number; height: number; bytes: number; template: ImageJob['template'] };

export async function writeImages(jobs: ImageJob[], opts: { out: string; name: string; formats: ('png' | 'svg')[] }): Promise<WrittenImage[]> {
	const dir = resolve(opts.out);
	mkdirSync(dir, { recursive: true });
	const written: WrittenImage[] = [];
	for (const job of jobs) {
		if (job.image) {
			try {
				readFileSync(job.image);
			} catch {
				throw new Error(`Could not read the screenshot at ${job.image}.`);
			}
		}
		const svg = renderSvg(job);
		const stem = `${opts.name}-${job.size}`;
		if (opts.formats.includes('svg')) {
			const path = join(dir, `${stem}.svg`);
			writeFileSync(path, svg);
			written.push({ path, format: 'svg', size: job.size, width: job.width, height: job.height, bytes: Buffer.byteLength(svg), template: job.template });
		}
		if (opts.formats.includes('png')) {
			const png = await rasterize(svg, job.width);
			const path = join(dir, `${stem}.png`);
			writeFileSync(path, png);
			written.push({ path, format: 'png', size: job.size, width: job.width, height: job.height, bytes: png.length, template: job.template });
		}
	}
	return written;
}

export function showPath(path: string) {
	const rel = relative(process.cwd(), path);
	return rel.startsWith('..') || dirname(rel) === '..' ? path : rel.split('\\').join('/');
}
