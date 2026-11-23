// Plane geometry for layouts: boxes, the free room left around obstacles, and the bounds of a turned picture.

import type { Rect } from '../design/types.js';

export const right = (r: Rect) => r.x + r.w;
export const bottom = (r: Rect) => r.y + r.h;
export const inflate = (r: Rect, by: number): Rect => ({ x: r.x - by, y: r.y - by, w: r.w + by * 2, h: r.h + by * 2 });
export const hit = (a: Rect, b: Rect, gap = 0) => a.x < b.x + b.w + gap - 0.01 && a.x + a.w + gap - 0.01 > b.x && a.y < b.y + b.h + gap - 0.01 && a.y + a.h + gap - 0.01 > b.y;
export const contains = (outer: Rect, inner: Rect, slack = 0.5) => inner.x >= outer.x - slack && inner.y >= outer.y - slack && right(inner) <= right(outer) + slack && bottom(inner) <= bottom(outer) + slack;
export const union = (list: Rect[]): Rect => {
	const x = Math.min(...list.map((r) => r.x));
	const y = Math.min(...list.map((r) => r.y));
	return { x, y, w: Math.max(...list.map(right)) - x, h: Math.max(...list.map(bottom)) - y };
};

/** Every largest empty box of a frame around its obstacles, biggest first. */
export function freeRects(frame: Rect, obstacles: Rect[]): Rect[] {
	const near = obstacles.filter((o) => hit(frame, o));
	if (!near.length) return [frame];
	const edges = (lo: number, hi: number, list: number[]) => [...new Set([lo, hi, ...list.filter((v) => v > lo && v < hi)])].sort((a, b) => a - b);
	const xs = edges(frame.x, right(frame), near.flatMap((o) => [o.x, right(o)]));
	const ys = edges(frame.y, bottom(frame), near.flatMap((o) => [o.y, bottom(o)]));
	const open: Rect[] = [];
	for (let i = 0; i < xs.length; i++)
		for (let j = i + 1; j < xs.length; j++)
			for (let a = 0; a < ys.length; a++)
				for (let b = a + 1; b < ys.length; b++) {
					const r = { x: xs[i]!, y: ys[a]!, w: xs[j]! - xs[i]!, h: ys[b]! - ys[a]! };
					if (!near.some((o) => hit(r, o))) open.push(r);
				}
	return open.filter((r) => !open.some((o) => o !== r && contains(o, r, 0))).sort((a, b) => b.w * b.h - a.w * a.h);
}

/** The box round a w by h picture turned by `deg`, given the part of it that has ink (as shares of w and h). */
export function turnedBox(cx: number, cy: number, w: number, h: number, deg: number, ink: Rect = { x: 0, y: 0, w: 1, h: 1 }): Rect {
	const rad = (deg * Math.PI) / 180;
	const c = Math.cos(rad);
	const s = Math.sin(rad);
	const xs: number[] = [];
	const ys: number[] = [];
	for (const [u, v] of [
		[ink.x, ink.y],
		[ink.x + ink.w, ink.y],
		[ink.x, ink.y + ink.h],
		[ink.x + ink.w, ink.y + ink.h],
	] as const) {
		const px = (u - 0.5) * w;
		const py = (v - 0.5) * h;
		xs.push(cx + px * c - py * s);
		ys.push(cy + px * s + py * c);
	}
	const x = Math.min(...xs);
	const y = Math.min(...ys);
	return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
