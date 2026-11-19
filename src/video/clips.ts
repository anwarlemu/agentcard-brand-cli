// A clip: frames of a scene (hero, window, cards) or of a first-generation template (social, announcement, product)
// over time, encoded as MP4 or WebM through ffmpeg, or as Motion JPEG MP4 in process when ffmpeg is missing.

import { buildScene, type SceneFields } from '../image/compose.js';
import { rasterizeRgba } from '../image/render.js';
import { pictureArt, sceneSvg, type Art, type Scene } from '../image/scene.js';
import { drawImage } from '../assets/raster.js';
import { JPEG_QUALITY, VIDEO_FRAMES, type VideoJob as LegacyJob } from './catalog.js';
import { encode, ffmpegPath, type Container } from './ffmpeg.js';
import { frameSvg } from './frames.js';
import { frameTimes, sceneMotion, videoConfig } from './motion.js';
import { muxMjpeg } from './mp4.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jpeg = require('jpeg-js') as { encode: (image: { data: Uint8Array; width: number; height: number }, quality?: number) => { data: Uint8Array } };

export const SCENE_CLIPS = ['hero', 'window', 'cards'] as const;
export const LEGACY_CLIPS = ['social', 'announcement', 'product'] as const;

export type Clip = { kind: 'scene'; scene: Scene; seconds: number } | { kind: 'legacy'; job: LegacyJob; seconds: number };

/** Art at the size it is drawn, so each frame decodes small pictures instead of the full renders. */
function fitArt(art: Art, width: number): Art {
	const w = Math.ceil(width);
	if (art.width <= w * 1.05) return art;
	const h = Math.max(1, Math.round((art.height * w) / art.width));
	return pictureArt(drawImage(art.pixels, w, h, 0, 0, w, h), art.name);
}

export function sceneClip(fields: SceneFields, seconds: number): Clip {
	const scene = buildScene(fields);
	const short = Math.min(scene.width, scene.height);
	scene.stickers = scene.stickers.map((st) => ({ ...st, art: fitArt(st.art, st.size * short) }));
	return { kind: 'scene', scene, seconds };
}

/** The SVG of a clip at time t. A first-generation template plays its twelve eased frames over its first second. */
export function clipFrameSvg(clip: Clip, t: number): string {
	if (clip.kind === 'scene') return sceneSvg(clip.scene, sceneMotion(clip.scene, t));
	const frame = Math.min(VIDEO_FRAMES - 1, Math.floor(t * VIDEO_FRAMES));
	return frameSvg(clip.job, frame);
}

function size(clip: Clip) {
	return clip.kind === 'scene' ? { width: clip.scene.width, height: clip.scene.height } : { width: clip.job.width, height: clip.job.height };
}

async function* rgbaFrames(clip: Clip): AsyncGenerator<Uint8Array> {
	const { width, height } = size(clip);
	for (const t of frameTimes(clip.seconds)) {
		const r = await rasterizeRgba(clipFrameSvg(clip, t), width);
		if (r.width !== width || r.height !== height) throw new Error(`Rendered ${r.width} by ${r.height}. Expected ${width} by ${height}.`);
		yield r.pixels;
	}
}

function opaque(pixels: Uint8Array) {
	const out = new Uint8Array(pixels);
	for (let i = 0; i < out.length; i += 4) {
		const a = out[i + 3]! / 255;
		if (a === 1) continue;
		for (let c = 0; c < 3; c++) out[i + c] = Math.round(out[i + c]! * a + 255 * (1 - a));
		out[i + 3] = 255;
	}
	return out;
}

export type Encoded = { data: Buffer; codec: string; container: Container; frames: number; fps: number };

/** Encodes a clip once per container from one pass over the frames. */
export async function encodeClip(clip: Clip, containers: Container[]): Promise<Encoded[]> {
	const { width, height } = size(clip);
	const fps = videoConfig().fps;
	const frames = frameTimes(clip.seconds).length;
	if (ffmpegPath()) {
		const data = await encode(rgbaFrames(clip), width, height, fps, containers);
		return containers.map((container, i) => ({ data: data[i]!, codec: container === 'mp4' ? 'h264' : 'vp9', container, frames, fps }));
	}
	if (containers.includes('webm')) throw new Error('WebM needs ffmpeg. Install it (https://ffmpeg.org), set DS_FFMPEG, or export mp4.');
	const jpegs: Buffer[] = [];
	for await (const px of rgbaFrames(clip)) jpegs.push(Buffer.from(jpeg.encode({ data: opaque(px), width, height }, JPEG_QUALITY).data));
	return [{ data: muxMjpeg(jpegs, width, height, fps), codec: 'mjpeg', container: 'mp4', frames, fps }];
}
