// A clip: frames of any image layout over time, encoded as MP4 or WebM through ffmpeg, or as Motion JPEG MP4 in process
// when ffmpeg is missing.

import { encodeJpg } from '../assets/encode.js';
import { drawImage } from '../assets/raster.js';
import { buildScene, type SceneFields } from '../image/compose.js';
import { pictureArt } from '../image/objects.js';
import { rasterizeRgba } from '../image/render.js';
import { layoutOf, sceneSvg, type Art, type Scene } from '../image/scene.js';
import { encode, ffmpegPath, type Container } from './ffmpeg.js';
import { frameTimes, sceneMotion, videoConfig } from './motion.js';
import { muxMjpeg } from './mp4.js';

export const JPEG_QUALITY = 85;

export type Clip = { scene: Scene; seconds: number };

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
	const L = layoutOf(scene);
	L.stickers = L.stickers.map((st) => ({ ...st, art: fitArt(st.art, st.size * short) }));
	scene.stickers = L.stickers;
	if (scene.picture && L.window) scene.picture = fitArt(scene.picture, L.window.w);
	return { scene, seconds };
}

/** The SVG of a clip at time t. */
export const clipFrameSvg = (clip: Clip, t: number): string => sceneSvg(clip.scene, sceneMotion(clip.scene, t));

async function* rgbaFrames(clip: Clip): AsyncGenerator<Uint8Array> {
	const { width, height } = clip.scene;
	for (const t of frameTimes(clip.seconds)) {
		const r = await rasterizeRgba(clipFrameSvg(clip, t), width);
		if (r.width !== width || r.height !== height) throw new Error(`Rendered ${r.width} by ${r.height}. Expected ${width} by ${height}.`);
		yield r.pixels;
	}
}

export type Encoded = { data: Buffer; codec: string; container: Container; frames: number; fps: number };

/** Encodes a clip once per container from one pass over the frames. */
export async function encodeClip(clip: Clip, containers: Container[]): Promise<Encoded[]> {
	const { width, height } = clip.scene;
	const fps = videoConfig().fps;
	const frames = frameTimes(clip.seconds).length;
	if (ffmpegPath()) {
		const data = await encode(rgbaFrames(clip), width, height, fps, containers);
		return containers.map((container, i) => ({ data: data[i]!, codec: container === 'mp4' ? 'h264' : 'vp9', container, frames, fps }));
	}
	if (containers.includes('webm')) throw new Error('WebM needs ffmpeg. Install it (https://ffmpeg.org), set DS_FFMPEG, or export mp4.');
	const jpegs: Buffer[] = [];
	for await (const px of rgbaFrames(clip)) jpegs.push(encodeJpg({ data: px, width, height }, JPEG_QUALITY));
	return [{ data: muxMjpeg(jpegs, width, height, fps), codec: 'mjpeg', container: 'mp4', frames, fps }];
}
