// The brand's toon objects (and the user's own picture as one): reading them, and placing them so that none touches the
// words, the logo, the canvas edge, a part a platform covers, or another object.

import { dataUri, inkBox, readPicture, type Picture } from '../assets/picture.js';
import type { Pixels } from '../assets/png.js';
import type { Rect } from '../design/types.js';
import { pkgPath } from '../lib/paths.js';
import { illustrateConfig, imageConfig } from './config.js';
import { contains, hit, turnedBox } from './space.js';

export type Art = { href: string; width: number; height: number; pixels: Pixels; name: string; ink: Rect };
const artCache = new Map<string, Art>();

const inkShare = (p: Pixels): Rect => {
	const b = inkBox(p);
	return { x: b.x / p.width, y: b.y / p.height, w: b.w / p.width, h: b.h / p.height };
};

/** One of the brand's toon objects by subject name. */
export function subjectArt(subject: string): Art {
	const known = artCache.get(subject);
	if (known) return known;
	const entry = illustrateConfig().subjects[subject];
	if (!entry) throw new Error(`Unknown subject "${subject}".`);
	const pic = readPicture(pkgPath(entry.file), 'object');
	const art = { href: dataUri(pic), width: pic.width, height: pic.height, pixels: pic, name: subject, ink: inkShare(pic) };
	artCache.set(subject, art);
	return art;
}

/** A user's picture (or a toon made from it) as art. */
export function pictureArt(pic: Picture | Pixels, name: string): Art {
	return { href: dataUri(pic), width: pic.width, height: pic.height, pixels: pic, name, ink: inkShare(pic) };
}

/** x and y are shares of the canvas, size a share of its short side. */
export type Sticker = { art: Art; x: number; y: number; size: number; rotate: number };

/** The bounds of an object's ink as it is drawn. */
export function stickerBox(st: Sticker, W: number, H: number, scale = 1): Rect {
	const w = st.size * Math.min(W, H) * scale;
	return turnedBox(st.x * W, st.y * H, w, (w * st.art.height) / st.art.width, st.rotate, st.art.ink);
}

/**
 * Each object at the free spot nearest its own, a little smaller when that is what it takes. An object with no room left
 * is left off (and named), never squeezed over something else.
 */
export function settle(targets: Sticker[], W: number, H: number, frame: Rect, keep: Rect[], gap: number): { stickers: Sticker[]; left: string[] } {
	const cfg = imageConfig().stickers.fit;
	const diag = Math.hypot(frame.w, frame.h);
	const placed: Rect[] = [];
	const stickers: Sticker[] = [];
	const left: string[] = [];
	const step = Math.max(4, Math.min(frame.w, frame.h) / 46);
	for (const t of targets) {
		let best: { st: Sticker; box: Rect; cost: number } | undefined;
		for (const sc of [1, 0.9, 0.8, 0.7, cfg.minScale]) {
			const base = (1 - sc) * 0.45;
			if (best && base >= best.cost) break;
			const size = t.size * sc;
			const at = (x: number, y: number) => {
				const st = { ...t, size, x: x / W, y: y / H };
				const dist = Math.hypot(x - t.x * W, y - t.y * H) / diag;
				const cost = base + dist;
				if (dist > cfg.maxShift || (best && cost >= best.cost)) return;
				const box = stickerBox(st, W, H);
				if (!contains(frame, box, 0)) return;
				if (keep.some((o) => hit(box, o)) || placed.some((o) => hit(box, o, gap))) return;
				best = { st, box, cost };
			};
			at(t.x * W, t.y * H);
			for (let y = frame.y; y <= frame.y + frame.h; y += step) for (let x = frame.x; x <= frame.x + frame.w; x += step) at(x, y);
		}
		if (best) {
			placed.push(best.box);
			stickers.push(best.st);
		} else left.push(t.art.name);
	}
	return { stickers, left };
}

/** A small seeded random (the editor's), so a scatter can be repeated or reshuffled. */
export function random(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * A seeded scatter over the free room: every object takes, of a handful of random spots, the one farthest from what is
 * already there, so the same seed gives the same even spread and none piles up on another.
 */
export function scatter(W: number, H: number, frame: Rect, keep: Rect[], count: number, seed: number, names: string[], gap: number, scale = 1, asked = true): { stickers: Sticker[]; left: string[] } {
	const cfg = imageConfig().stickers.scatter;
	// Nobody asked for a number: fewer objects with air round them, rather than a crowd in what room is left.
	const air = asked ? gap : Math.max(gap, Math.min(frame.w, frame.h) * cfg.air);
	const short = Math.min(frame.w, frame.h) / Math.min(W, H);
	const rnd = random(seed);
	const order = names.map((name) => ({ name, r: rnd() })).sort((a, b) => a.r - b.r).map((o) => o.name);
	const boxes: Rect[] = [];
	const stickers: Sticker[] = [];
	const left: string[] = [];
	const near = (b: Rect, o: Rect) => {
		const dx = Math.max(0, o.x - (b.x + b.w), b.x - (o.x + o.w));
		const dy = Math.max(0, o.y - (b.y + b.h), b.y - (o.y + o.h));
		return Math.hypot(dx, dy);
	};
	for (const name of order) {
		if (stickers.length >= count) break;
		const art = subjectArt(name);
		let best: { st: Sticker; box: Rect; score: number } | undefined;
		for (const shrink of [1, 0.85, 0.7]) {
			for (let t = 0; t < cfg.tries; t++) {
				const size = (cfg.minSize + rnd() * cfg.spread) * short * shrink * scale * 1.12;
				const st: Sticker = { art, size, rotate: Math.round(rnd() * cfg.tilt * 2 - cfg.tilt), x: (frame.x + rnd() * frame.w) / W, y: (frame.y + rnd() * frame.h) / H };
				const box = stickerBox(st, W, H);
				if (!contains(frame, box, 0) || keep.some((o) => hit(box, o)) || boxes.some((o) => hit(box, o, air))) continue;
				const others = boxes.map((o) => near(box, o));
				// The emptier half of the picture first, then the spot farthest from the rest.
				const half = (b: Rect) => Number(b.x + b.w / 2 > frame.x + frame.w / 2);
				const lean = boxes.filter((o) => half(o) === half(box)).length - boxes.filter((o) => half(o) !== half(box)).length;
				const score = others.length ? Math.min(...others) - Math.max(0, lean) * frame.w * 0.06 : rnd();
				if (!best || score > best.score) best = { st, box, score };
			}
			if (best) break;
		}
		if (!best) continue;
		boxes.push(best.box);
		stickers.push(best.st);
	}
	if (asked && stickers.length < Math.min(count, order.length)) left.push(`${Math.min(count, order.length) - stickers.length} of ${Math.min(count, order.length)} objects`);
	return { stickers, left };
}
