// The motion of a scene at a time: entrances on the brand's ease-out, the objects' slow drift on its in-out, and the
// band's grain jumping between fixed offsets. Values come from brand/assets/video.json and the motion tokens; no clock,
// no random source, so a frame at a time is always the same frame.

import { readFileSync } from 'node:fs';
import { tokens } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { unitOf, type Motion, type Scene } from '../image/scene.js';

export type VideoConfig = {
	source: string;
	fps: number;
	seconds: { default: number; min: number; max: number };
	enter: { start: number; duration: string; easing: string; lift: string; stagger: number; fromScale: number };
	drift: { easing: string; periodMin: number; periodSpread: number };
	grain: { interval: number; jumps: [number, number][] };
	sizes: Record<string, { width: number; height: number }>;
};

let videoCfg: VideoConfig | undefined;
export function videoConfig(): VideoConfig {
	videoCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'video.json'), 'utf8')) as VideoConfig;
	return videoCfg;
}

const EASE = /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/;

/** A cubic-bezier easing token as a function of 0..1. Ease-in curves are refused: nothing here starts slow. */
export function easing(token: string): (x: number) => number {
	const raw = tokens().site[token];
	const m = raw?.match(EASE);
	if (!m) throw new Error(`Token ${token} is not a cubic-bezier.`);
	const [x1, y1, x2, y2] = m.slice(1).map(Number) as [number, number, number, number];
	const bez = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
	const slope = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * (b - a) + 3 * t * t * (1 - b);
	return (x: number) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		let t = x;
		for (let i = 0; i < 12; i++) {
			const d = bez(t, x1, x2) - x;
			if (Math.abs(d) < 1e-7) break;
			const s = slope(t, x1, x2);
			if (Math.abs(s) < 1e-7) break;
			t = Math.min(1, Math.max(0, t - d / s));
		}
		return Math.round(bez(t, y1, y2) * 1e6) / 1e6;
	};
}

const seconds = (token: string) => {
	const raw = tokens().site[token] ?? '';
	return raw.endsWith('ms') ? Number.parseFloat(raw) / 1000 : Number.parseFloat(raw);
};
const length = (token: string) => {
	const raw = tokens().site[token] ?? '0';
	return raw.endsWith('rem') ? Number.parseFloat(raw) * 16 : Number.parseFloat(raw);
};

/** How far an entrance that starts at `start` has come at `t` (0 to 1, eased out). */
export function entered(t: number, start: number) {
	const cfg = videoConfig().enter;
	return easing(cfg.easing)((t - start) / seconds(cfg.duration));
}

/** The site's sticker drift for object i at time t: a few pixels and a degree or two, each on its own pace. */
export function drift(i: number, t: number) {
	const cfg = videoConfig().drift;
	const dx = ((i * 37) % 11) - 5;
	const dy = -4 - ((i * 53) % 6);
	const dr = (i % 2 ? 1 : -1) * (1 + ((i * 29) % 4) * 0.5);
	const period = cfg.periodMin + ((i * 41) % cfg.periodSpread);
	const phase = (((t + ((i * 2.3) % period)) % period) + period) % period / period;
	const io = easing(cfg.easing);
	const a = phase < 0.5 ? io(phase * 2) : 1 - io((phase - 0.5) * 2);
	return { dx: dx * a, dy: dy * a, dr: dr * a };
}

/** The motion for a scene at time t. The last frame is the still image plus the drift. */
export function sceneMotion(scene: Scene, t: number): Motion {
	const cfg = videoConfig();
	const k = unitOf(scene.width, scene.height);
	const lift = length(cfg.enter.lift) * k;
	const s0 = cfg.enter.start;
	const step = cfg.enter.stagger;
	const part = (start: number) => {
		const p = entered(t, start);
		return { opacity: p, dy: (1 - p) * lift };
	};
	const words = [0, 1, 2, 3].map((i) => part(s0 + i * step));
	const after = s0 + 3 * step;
	const stickers = scene.stickers.map((_, i) => {
		const p = entered(t, after + i * step);
		const d = drift(i, t);
		return { opacity: p, dx: d.dx * k, dy: (1 - p) * lift + d.dy * k, dr: d.dr, scale: cfg.enter.fromScale + (1 - cfg.enter.fromScale) * p };
	});
	const cards = scene.cards.map((_, i) => part(s0 + step * 2 + i * step));
	const jump = cfg.grain.jumps[Math.floor(t / cfg.grain.interval) % cfg.grain.jumps.length]!;
	return { words, stickers, cards, window: part(after), logo: { opacity: entered(t, 0) }, grain: [jump[0] * k, jump[1] * k] };
}

/** Frame times for a clip: fps times seconds frames, from 0. */
export function frameTimes(secondsLong: number) {
	const fps = videoConfig().fps;
	const n = Math.round(secondsLong * fps);
	return Array.from({ length: n }, (_, i) => Math.round((i / fps) * 1e6) / 1e6);
}
