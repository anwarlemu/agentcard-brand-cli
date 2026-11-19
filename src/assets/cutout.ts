import type { Pixels } from './png.js';
import { blurAlpha, drawImage } from './raster.js';

// Cut a subject out of its background (ported from the share-image playground's cutout, via the context-ds engine):
// transparent pictures keep their alpha; otherwise the border colors are clustered in OKLab and a fill grows inward
// through anything close to them. Whatever it cannot reach is the subject.

const toLin = (c: number) => {
	c /= 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const LIN = new Float32Array(256).map((_, i) => toLin(i));
function oklab(r: number, g: number, b: number): [number, number, number] {
	const R = LIN[r]!, G = LIN[g]!, B = LIN[b]!;
	const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
	const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
	const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
	return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
export type Cut = { pixels: Pixels; info: 'whole' | 'transparent' | 'removed' | 'no-background' };

export function cutout(img: Pixels, mode: 'auto' | 'whole', keyTol: number): Cut {
	const sc = Math.min(1, 900 / Math.max(img.width, img.height));
	const w = Math.max(2, Math.round(img.width * sc));
	const h = Math.max(2, Math.round(img.height * sc));
	const base = sc === 1 ? { width: w, height: h, data: new Uint8ClampedArray(img.data) } : drawImage(img, w, h, 0, 0, w, h);
	const d = base.data;
	const N = w * h;
	// The model is the top and sides: subjects usually enter from the bottom, so it must not learn their color.
	const border: number[] = [];
	const model: number[] = [];
	for (let i = 0; i < w; i++) {
		border.push(i, (h - 1) * w + i);
		model.push(i);
	}
	for (let j = 1; j < h - 1; j++) {
		border.push(j * w, j * w + w - 1);
		model.push(j * w, j * w + w - 1);
	}
	const transparentBorder = border.filter((p) => d[p * 4 + 3]! < 200).length / border.length;
	if (mode === 'whole') return { pixels: base, info: 'whole' };
	if (transparentBorder > 0.25) return { pixels: base, info: 'transparent' };
	const lab = new Float32Array(N * 3);
	for (let p = 0; p < N; p++) {
		const o = oklab(d[p * 4]!, d[p * 4 + 1]!, d[p * 4 + 2]!);
		lab[p * 3] = o[0];
		lab[p * 3 + 1] = o[1];
		lab[p * 3 + 2] = o[2];
	}
	const K = 4;
	const cen: number[][] = [];
	for (let k = 0; k < K; k++) {
		const p = model[Math.floor(((k + 0.5) / K) * model.length)]!;
		cen.push([lab[p * 3]!, lab[p * 3 + 1]!, lab[p * 3 + 2]!]);
	}
	const dist = (p: number, c: number[]) => Math.hypot(lab[p * 3]! - c[0]!, (lab[p * 3 + 1]! - c[1]!) * 1.4, (lab[p * 3 + 2]! - c[2]!) * 1.4);
	const asg = new Int32Array(model.length);
	for (let it = 0; it < 10; it++) {
		const acc = cen.map(() => [0, 0, 0, 0]);
		model.forEach((p, i) => {
			let b = 0;
			let bd = 1e9;
			cen.forEach((c, k) => {
				const q = dist(p, c);
				if (q < bd) {
					bd = q;
					b = k;
				}
			});
			asg[i] = b;
			const a = acc[b]!;
			a[0]! += lab[p * 3]!;
			a[1]! += lab[p * 3 + 1]!;
			a[2]! += lab[p * 3 + 2]!;
			a[3]!++;
		});
		acc.forEach((a, k) => {
			if (a[3]) cen[k] = [a[0]! / a[3], a[1]! / a[3], a[2]! / a[3]];
		});
	}
	const share = cen.map((_, k) => asg.filter((v) => v === k).length / model.length);
	const bgC = cen.filter((_, k) => share[k]! >= 0.12);
	const tol = keyTol / 100;
	const dBg = new Float32Array(N);
	for (let p = 0; p < N; p++) {
		let m = 1e9;
		for (const c of bgC) m = Math.min(m, dist(p, c));
		dBg[p] = m;
	}
	const bg = new Uint8Array(N);
	const q = new Int32Array(N);
	let qh = 0;
	let qt = 0;
	for (const p of border) if (dBg[p]! < tol * 1.5 && !bg[p]) {
		bg[p] = 1;
		q[qt++] = p;
	}
	while (qh < qt) {
		const p = q[qh++]!;
		const px = p % w;
		const py = (p / w) | 0;
		for (const n of [px > 0 ? p - 1 : -1, px < w - 1 ? p + 1 : -1, py > 0 ? p - w : -1, py < h - 1 ? p + w : -1]) {
			if (n < 0 || bg[n]) continue;
			const step = Math.hypot(lab[n * 3]! - lab[p * 3]!, (lab[n * 3 + 1]! - lab[p * 3 + 1]!) * 1.4, (lab[n * 3 + 2]! - lab[p * 3 + 2]!) * 1.4);
			if (dBg[n]! < tol || (step < tol * 0.25 && dBg[n]! < tol * 3)) {
				bg[n] = 1;
				q[qt++] = n;
			}
		}
	}
	// Drop specks: subject pixels in a mostly-background neighborhood.
	let subj = 0;
	for (let p = 0; p < N; p++) {
		if (bg[p]) continue;
		const px = p % w;
		const py = (p / w) | 0;
		let nb = 0;
		let t = 0;
		for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
			const X = px + dx;
			const Y = py + dy;
			if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
			t++;
			nb += bg[Y * w + X]!;
		}
		if (nb / t > 0.8) d[p * 4 + 3] = 0;
		else subj++;
	}
	for (let p = 0; p < N; p++) if (bg[p]) d[p * 4 + 3] = 0;
	const frac = subj / N;
	if (frac < 0.005 || frac > 0.985) {
		for (let p = 0; p < N; p++) d[p * 4 + 3] = 255;
		return { pixels: base, info: 'no-background' };
	}
	// Soften the cut edge a touch (blur(1px) used as a mask) so edge dots antialias.
	const mask = blurAlpha(base, 1);
	for (let p = 0; p < N; p++) d[p * 4 + 3] = Math.round(d[p * 4 + 3]! * mask[p]!);
	return { pixels: base, info: 'removed' };
}
