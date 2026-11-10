// Rasterize each frame with resvg, encode JPEG in process, and mux a Motion JPEG MP4.

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { rasterizeRgba } from '../image/render.js';
import { JPEG_QUALITY, VIDEO_FPS, VIDEO_FRAMES, type VideoJob } from './catalog.js';
import { frameSvg } from './frames.js';
import { muxMjpeg } from './mp4.js';

const require = createRequire(import.meta.url);
const jpeg = require('jpeg-js') as { encode: (image: { data: Uint8Array; width: number; height: number }, quality?: number) => { data: Uint8Array } };

function matte(pixels: Uint8Array, width: number, height: number): Uint8Array {
	if (pixels.length !== width * height * 4) throw new Error(`Renderer returned ${pixels.length} bytes for ${width} by ${height}.`);
	const out = new Uint8Array(pixels);
	const base = out[3] === 255 ? [out[0], out[1], out[2]] : [255, 255, 255];
	for (let i = 0; i < out.length; i += 4) {
		const alpha = out[i + 3];
		if (alpha === 255) continue;
		const cover = alpha / 255;
		out[i] = Math.round(out[i] * cover + base[0] * (1 - cover));
		out[i + 1] = Math.round(out[i + 1] * cover + base[1] * (1 - cover));
		out[i + 2] = Math.round(out[i + 2] * cover + base[2] * (1 - cover));
		out[i + 3] = 255;
	}
	return out;
}

function encodeFrame(pixels: Uint8Array, width: number, height: number): Buffer {
	const encoded = jpeg.encode({ data: matte(pixels, width, height), width, height }, JPEG_QUALITY);
	const bytes = Buffer.from(encoded.data);
	if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('JPEG encoder did not return a JPEG.');
	return bytes;
}

export async function renderVideo(job: VideoJob): Promise<Buffer> {
	const frames: Buffer[] = [];
	for (let frame = 0; frame < VIDEO_FRAMES; frame++) {
		const raster = await rasterizeRgba(frameSvg(job, frame), job.width);
		if (raster.width !== job.width || raster.height !== job.height) throw new Error(`Rendered ${raster.width} by ${raster.height} for ${job.size}. Expected ${job.width} by ${job.height}.`);
		frames.push(encodeFrame(raster.pixels, raster.width, raster.height));
	}
	return muxMjpeg(frames, job.width, job.height, VIDEO_FPS);
}

export async function writeVideos(jobs: VideoJob[], opts: { out: string; name: string }): Promise<{ path: string; bytes: number; sha256: string; job: VideoJob }[]> {
	const prepared: { job: VideoJob; bytes: Buffer }[] = [];
	for (const job of jobs) prepared.push({ job, bytes: await renderVideo(job) });
	mkdirSync(opts.out, { recursive: true });
	return prepared.map((item) => {
		const path = join(opts.out, `${opts.name}-${item.job.size}.mp4`);
		writeFileSync(path, item.bytes);
		return { path, bytes: item.bytes.length, sha256: createHash('sha256').update(item.bytes).digest('hex'), job: item.job };
	});
}
