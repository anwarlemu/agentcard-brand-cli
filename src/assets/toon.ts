import { cutout } from './cutout.js';
import type { Pixels } from './png.js';
import { drawImage } from './raster.js';

/*
 * Turns a picture into a toon object, the 3D sticker style (ported step for step from the share-image playground's
 * toonify): the background taken away, colors smoothed into flat, saturated bands like a toy's plastic, the shape
 * puffed up and lit from the upper left with a soft shine, and given a thickness below and to the right. The
 * playground runs this on a canvas; here it runs on plain RGBA pixels, so the same picture always gives the same bytes.
 * No brand values: the light, bands and thickness are the style itself.
 */

const LIGHT = (() => {
	const v = [-0.45, -0.65, 0.62];
	const n = Math.hypot(v[0]!, v[1]!, v[2]!);
	return v.map((c) => c / n) as [number, number, number];
})();

/** Distance from each solid pixel to the nearest clear one, in pixels (two-pass chamfer). */
function distances(alpha: Uint8ClampedArray, w: number, h: number) {
	const D = new Float32Array(w * h);
	const BIG = 1e6;
	for (let i = 0; i < w * h; i++) D[i] = alpha[i]! > 127 ? BIG : 0;
	const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : D[y * w + x]!);
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++) {
			const i = y * w + x;
			if (!D[i]) continue;
			D[i] = Math.min(D[i]!, at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414);
		}
	for (let y = h - 1; y >= 0; y--)
		for (let x = w - 1; x >= 0; x--) {
			const i = y * w + x;
			if (!D[i]) continue;
			D[i] = Math.min(D[i]!, at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414);
		}
	return D;
}

/** A box blur, run three times: close to a gaussian. */
function blur(src: Float32Array, w: number, h: number, r: number) {
	let a = src;
	for (let pass = 0; pass < 3; pass++) {
		const b = new Float32Array(w * h);
		for (let y = 0; y < h; y++) {
			let s = 0;
			for (let x = -r; x <= r; x++) s += a[y * w + Math.min(w - 1, Math.max(0, x))]!;
			for (let x = 0; x < w; x++) {
				b[y * w + x] = s / (2 * r + 1);
				s += a[y * w + Math.min(w - 1, x + r + 1)]! - a[y * w + Math.max(0, x - r)]!;
			}
		}
		const c = new Float32Array(w * h);
		for (let x = 0; x < w; x++) {
			let s = 0;
			for (let y = -r; y <= r; y++) s += b[Math.min(h - 1, Math.max(0, y)) * w + x]!;
			for (let y = 0; y < h; y++) {
				c[y * w + x] = s / (2 * r + 1);
				s += b[Math.min(h - 1, y + r + 1) * w + x]! - b[Math.max(0, y - r) * w + x]!;
			}
		}
		a = c;
	}
	return a;
}

/** Color in flat, saturated bands: smoothed first so the bands are clean. */
function plastic(d: Uint8ClampedArray, w: number, h: number) {
	const ch = [0, 1, 2].map((k) => {
		const f = new Float32Array(w * h);
		for (let i = 0; i < w * h; i++) f[i] = d[i * 4 + k]!;
		return blur(f, w, h, Math.max(1, Math.round(Math.min(w, h) / 220)));
	});
	const levels = 6;
	const q = (v: number) => {
		const t = Math.min(255, Math.max(0, v)) / 255;
		// Mostly the smooth value with a pull toward its band, so shapes read as flat plastic without hard steps.
		return (0.62 * t + 0.38 * (Math.round(t * (levels - 1)) / (levels - 1))) * 255;
	};
	for (let i = 0; i < w * h; i++) {
		let r = ch[0]![i]!;
		let g = ch[1]![i]!;
		let b = ch[2]![i]!;
		// Saturation up by a third, around the pixel's own gray.
		const y = 0.3 * r + 0.59 * g + 0.11 * b;
		r = y + (r - y) * 1.35;
		g = y + (g - y) * 1.35;
		b = y + (b - y) * 1.35;
		d[i * 4] = q(r);
		d[i * 4 + 1] = q(g);
		d[i * 4 + 2] = q(b);
	}
}

/**
 * A logo or graphic on one flat color also has that color inside its holes (the bowl of an "a"), which a fill from
 * the edges cannot reach. When the border is one even color, every pixel near it goes too.
 */
function keyFlatBackground(src: Uint8ClampedArray, d: Uint8ClampedArray, w: number, h: number) {
	const border: number[] = [];
	for (let i = 0; i < w; i++) border.push(i, (h - 1) * w + i);
	for (let j = 0; j < h; j++) border.push(j * w, j * w + w - 1);
	const solid = border.filter((p) => src[p * 4 + 3]! > 200);
	if (solid.length < border.length * 0.9) return;
	const mean = [0, 1, 2].map((k) => solid.reduce((n, p) => n + src[p * 4 + k]!, 0) / solid.length);
	const spread = solid.reduce((n, p) => n + Math.hypot(src[p * 4]! - mean[0]!, src[p * 4 + 1]! - mean[1]!, src[p * 4 + 2]! - mean[2]!), 0) / solid.length;
	// A photo's border wanders; a flat background does not.
	if (spread > 6) return;
	for (let p = 0; p < w * h; p++) {
		const dist = Math.hypot(src[p * 4]! - mean[0]!, src[p * 4 + 1]! - mean[1]!, src[p * 4 + 2]! - mean[2]!);
		// Fully clear near the color, eased back in across antialiasing.
		const keep = Math.min(1, Math.max(0, (dist - 18) / 60));
		d[p * 4 + 3] = Math.min(d[p * 4 + 3]!, keep * 255);
	}
}

/** Straight-alpha source-over of `top` onto `base` at an offset (both the same size as their buffers). */
function over(base: Uint8ClampedArray, bw: number, bh: number, top: Uint8ClampedArray, tw: number, th: number, ox: number, oy: number) {
	for (let y = 0; y < th; y++) {
		const Y = y + oy;
		if (Y < 0 || Y >= bh) continue;
		for (let x = 0; x < tw; x++) {
			const X = x + ox;
			if (X < 0 || X >= bw) continue;
			const t = (y * tw + x) * 4;
			const a = top[t + 3]! / 255;
			if (a <= 0) continue;
			const b = (Y * bw + X) * 4;
			const ba = base[b + 3]! / 255;
			const oa = a + ba * (1 - a);
			for (let c = 0; c < 3; c++) base[b + c] = Math.round((top[t + c]! * a + base[b + c]! * ba * (1 - a)) / oa);
			base[b + 3] = Math.round(oa * 255);
		}
	}
}

/** Makes the toon object. Returns pixels a little larger than the picture, with room for the thickness. */
export function toonify(picture: Pixels): Pixels {
	// The playground's cutout works at most 900 pixels across; scale first so the flat-background key sees the same pixels.
	const sc = Math.min(1, 900 / Math.max(picture.width, picture.height));
	const w0 = Math.max(2, Math.round(picture.width * sc));
	const h0 = Math.max(2, Math.round(picture.height * sc));
	const src = sc === 1 ? { width: w0, height: h0, data: new Uint8ClampedArray(picture.data) } : drawImage(picture, w0, h0, 0, 0, w0, h0);
	const keyed = cutout(src, 'auto', 2).pixels;
	const w = keyed.width;
	const h = keyed.height;
	const d = new Uint8ClampedArray(keyed.data);
	keyFlatBackground(src.data, d, w, h);
	const N = w * h;
	// A clean silhouette: the cut-out's edge softened, then firmed up again, so a ragged key becomes a smooth outline.
	const af = new Float32Array(N);
	for (let i = 0; i < N; i++) af[i] = d[i * 4 + 3]! / 255;
	const soft = blur(af, w, h, Math.max(1, Math.round(Math.min(w, h) / 300)));
	const alpha = new Uint8ClampedArray(N);
	for (let i = 0; i < N; i++) {
		const t = Math.min(1, Math.max(0, (soft[i]! - 0.35) / 0.3));
		alpha[i] = t * t * (3 - 2 * t) * 255;
		d[i * 4 + 3] = alpha[i]!;
	}
	const dist = distances(alpha, w, h);
	// The edge still carries a little of the old background: give the outermost pixels the color of their neighbor further in.
	for (let pass = 0; pass < 2; pass++)
		for (let y = 1; y < h - 1; y++)
			for (let x = 1; x < w - 1; x++) {
				const i = y * w + x;
				if (!alpha[i] || dist[i]! > 2.5) continue;
				let best = i;
				for (let oy = -1; oy <= 1; oy++)
					for (let ox = -1; ox <= 1; ox++) {
						const j = i + oy * w + ox;
						if (dist[j]! > dist[best]!) best = j;
					}
				if (best === i) continue;
				d[i * 4] = d[best * 4]!;
				d[i * 4 + 1] = d[best * 4 + 1]!;
				d[i * 4 + 2] = d[best * 4 + 2]!;
			}
	plastic(d, w, h);
	// The height: a pillow from the edges in, its radius following how thick the shape is, with a little of the
	// picture's own light and dark pressed into it.
	let thickest = 0;
	for (let i = 0; i < N; i++) if (dist[i]! > thickest) thickest = dist[i]!;
	const R = Math.max(3, Math.min(thickest * 0.9, Math.min(w, h) * 0.12));
	const height = new Float32Array(N);
	for (let i = 0; i < N; i++) {
		if (alpha[i]! < 128) continue;
		const t = Math.min(1, dist[i]! / R);
		const pillow = Math.sqrt(1 - (1 - t) * (1 - t));
		const lum = (0.3 * d[i * 4]! + 0.59 * d[i * 4 + 1]! + 0.11 * d[i * 4 + 2]!) / 255;
		height[i] = pillow * R * 0.9 + lum * R * 0.18;
	}
	const H = blur(height, w, h, Math.max(1, Math.round(R * 0.08)));
	// Light it: diffuse from the upper left, a tight shine, darker toward the rim where the surface turns away.
	const hv = [LIGHT[0], LIGHT[1], LIGHT[2] + 1];
	const hl = Math.hypot(hv[0]!, hv[1]!, hv[2]!);
	for (let y = 0; y < h; y++)
		for (let x = 0; x < w; x++) {
			const i = y * w + x;
			if (alpha[i]! < 8) continue;
			const hx = H[y * w + Math.min(w - 1, x + 1)]! - H[y * w + Math.max(0, x - 1)]!;
			const hy = H[Math.min(h - 1, y + 1) * w + x]! - H[Math.max(0, y - 1) * w + x]!;
			const nx = -hx / 2;
			const ny = -hy / 2;
			const nz = 1;
			const nl = Math.hypot(nx, ny, nz);
			const diffuse = Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / nl);
			const ndh = Math.max(0, (nx * hv[0]! + ny * hv[1]! + nz * hv[2]!) / (nl * hl));
			const spec = ndh ** 40 * 0.55;
			const shade = 0.42 + 0.72 * diffuse;
			for (let k = 0; k < 3; k++) d[i * 4 + k] = Math.min(255, d[i * 4 + k]! * shade + 255 * spec);
		}
	// The thickness: the silhouette, darkened, stacked down and to the right, then the lit face on top.
	const depth = Math.max(4, Math.round(Math.min(w, h) * 0.035));
	const side = new Uint8ClampedArray(d);
	for (let i = 0; i < N; i++) {
		side[i * 4] = Math.round(side[i * 4]! * 0.45 + 10 * 0.55);
		side[i * 4 + 1] = Math.round(side[i * 4 + 1]! * 0.45 + 12 * 0.55);
		side[i * 4 + 2] = Math.round(side[i * 4 + 2]! * 0.45 + 40 * 0.55);
	}
	const W = w + depth;
	const HH = h + depth;
	const out = new Uint8ClampedArray(W * HH * 4);
	for (let i = depth; i >= 1; i--) over(out, W, HH, side, w, h, i, i);
	over(out, W, HH, d, w, h, 0, 0);
	return { width: W, height: HH, data: out };
}
