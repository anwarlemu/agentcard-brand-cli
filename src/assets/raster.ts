import type { Pixels } from './png.js';

// Resampling and blur on plain RGBA pixels (from the context-ds illustrate engine): pure and deterministic.

function premultiplied(src: Pixels): Float32Array {
	const out = new Float32Array(src.width * src.height * 4);
	for (let i = 0; i < src.width * src.height; i++) {
		const a = src.data[i * 4 + 3]! / 255;
		out[i * 4] = (src.data[i * 4]! / 255) * a;
		out[i * 4 + 1] = (src.data[i * 4 + 1]! / 255) * a;
		out[i * 4 + 2] = (src.data[i * 4 + 2]! / 255) * a;
		out[i * 4 + 3] = a;
	}
	return out;
}

function straight(px: Float32Array, width: number, height: number): Pixels {
	const data = new Uint8ClampedArray(width * height * 4);
	for (let i = 0; i < width * height; i++) {
		const a = px[i * 4 + 3]!;
		data[i * 4 + 3] = Math.round(a * 255);
		if (a > 1e-6) for (let c = 0; c < 3; c++) data[i * 4 + c] = Math.round(Math.min(1, px[i * 4 + c]! / a) * 255);
	}
	return { width, height, data };
}

/**
 * Draws `src` into a new W by H transparent image so that it fills the rectangle (dx, dy, dw, dh), like canvas
 * drawImage: an area average when shrinking, bilinear when enlarging, partly covered edge pixels antialiased.
 */
export function drawImage(src: Pixels, W: number, H: number, dx: number, dy: number, dw: number, dh: number): Pixels {
	const s = premultiplied(src);
	const out = new Float32Array(W * H * 4);
	const sx = src.width / dw;
	const sy = src.height / dh;
	const axis = (o: number, d: number, scale: number, size: number, n: number) => {
		// Per destination column (or row): weighted source taps and the share of the pixel inside the rectangle.
		const taps: { idx: number[]; w: number[]; cover: number }[] = [];
		for (let X = 0; X < n; X++) {
			const cover = Math.max(0, Math.min(X + 1, o + d) - Math.max(X, o));
			const idx: number[] = [];
			const w: number[] = [];
			if (cover > 0) {
				const u = (X + 0.5 - o) * scale;
				if (scale > 1) {
					const a = u - scale / 2;
					const b = u + scale / 2;
					for (let i = Math.floor(a); i < Math.ceil(b); i++) {
						const wt = Math.min(b, i + 1) - Math.max(a, i);
						if (wt <= 0) continue;
						idx.push(Math.max(0, Math.min(size - 1, i)));
						w.push(wt / scale);
					}
				} else {
					const f = u - 0.5;
					const i0 = Math.floor(f);
					const t = f - i0;
					idx.push(Math.max(0, Math.min(size - 1, i0)), Math.max(0, Math.min(size - 1, i0 + 1)));
					w.push(1 - t, t);
				}
			}
			taps.push({ idx, w, cover });
		}
		return taps;
	};
	const cols = axis(dx, dw, sx, src.width, W);
	const rows = axis(dy, dh, sy, src.height, H);
	for (let Y = 0; Y < H; Y++) {
		const r = rows[Y]!;
		if (!r.cover) continue;
		for (let X = 0; X < W; X++) {
			const c = cols[X]!;
			if (!c.cover) continue;
			let R = 0, G = 0, B = 0, A = 0;
			for (let j = 0; j < r.idx.length; j++) {
				const rowBase = r.idx[j]! * src.width;
				const wy = r.w[j]!;
				for (let i = 0; i < c.idx.length; i++) {
					const o = (rowBase + c.idx[i]!) * 4;
					const wt = wy * c.w[i]!;
					R += s[o]! * wt; G += s[o + 1]! * wt; B += s[o + 2]! * wt; A += s[o + 3]! * wt;
				}
			}
			const k = Math.min(1, r.cover) * Math.min(1, c.cover);
			const o = (Y * W + X) * 4;
			out[o] = R * k; out[o + 1] = G * k; out[o + 2] = B * k; out[o + 3] = A * k;
		}
	}
	return straight(out, W, H);
}

/** A gaussian blur of the alpha channel (CSS blur(σ px)), as a separate mask. */
export function blurAlpha(src: Pixels, sigma: number): Float32Array {
	const { width: W, height: H } = src;
	const r = Math.ceil(sigma * 3);
	const k: number[] = [];
	let sum = 0;
	for (let i = -r; i <= r; i++) {
		const v = Math.exp(-(i * i) / (2 * sigma * sigma));
		k.push(v);
		sum += v;
	}
	const kn = k.map((v) => v / sum);
	const a = new Float32Array(W * H);
	for (let i = 0; i < W * H; i++) a[i] = src.data[i * 4 + 3]! / 255;
	const tmp = new Float32Array(W * H);
	for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
		let v = 0;
		for (let i = -r; i <= r; i++) {
			const X = x + i;
			if (X >= 0 && X < W) v += a[y * W + X]! * kn[i + r]!;
		}
		tmp[y * W + x] = v;
	}
	const out = new Float32Array(W * H);
	for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
		let v = 0;
		for (let i = -r; i <= r; i++) {
			const Y = y + i;
			if (Y >= 0 && Y < H) v += tmp[Y * W + x]! * kn[i + r]!;
		}
		out[y * W + x] = v;
	}
	return out;
}
