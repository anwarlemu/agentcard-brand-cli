// Illustrations in the toon object style: the brand's own objects (or any picture made into one) arranged on a ground.
// The ground, its scanlines and the stepped band are vector; each object is its rendered art, placed and turned.
// Arrangements and defaults come from brand/assets/illustrate.json and image.json; the same inputs give the same bytes.

import { readPicture } from '../assets/picture.js';
import { crop, inkBox } from '../assets/picture.js';
import type { Pixels } from '../assets/png.js';
import { toonify } from '../assets/toon.js';
import { band, Ids, placed, scan } from '../image/effects.js';
import { bandMixes, document, rect } from '../image/paint.js';
import { settle } from '../image/objects.js';
import { groundColor, illustrateConfig, imageConfig, pictureArt, scatter, subjectArt, unitOf, type Art, type Rect, type SceneGround } from '../image/scene.js';
import { inflate, turnedBox } from '../image/space.js';
import { unknownName } from '../lib/names.js';

export const COMPOSITIONS = ['object', 'single', 'row', 'preset', 'scatter'] as const;
export type Composition = (typeof COMPOSITIONS)[number];
export type IllGround = SceneGround | 'none';

export type Illustration = {
	width: number;
	height: number;
	ground: IllGround;
	scan: boolean;
	band: SceneGround | 'none';
	items: { art: Art; cx: number; cy: number; w: number; h: number; rotate: number }[];
	title: string;
};

export type IllustrateInput = {
	subjects: string[];
	image?: string;
	toon: boolean;
	composition?: Composition;
	width?: number;
	height?: number;
	ground?: IllGround;
	scan?: boolean;
	band?: SceneGround | 'none';
	seed?: number;
	count?: number;
	rotate?: number;
};

const art = (p: Pixels, name: string) => pictureArt(crop(p, inkBox(p)), name);

/** The objects to draw: named subjects, or the user's picture (a toon made from it unless toon is off). */
export function objectsFor(input: IllustrateInput): Art[] {
	const pool = Object.keys(illustrateConfig().subjects);
	for (const s of input.subjects) if (!pool.includes(s)) throw unknownName('subject', s, pool);
	// Cropped to the object's edges, so single and row fill the room by what is drawn, not by the art's margin.
	const list: Art[] = input.subjects.map((s) => art(subjectArt(s).pixels, s));
	if (input.image) {
		const pic = readPicture(input.image, 'image');
		list.unshift(input.toon ? art(toonify(pic), 'toon') : art(pic, 'image'));
	}
	return list;
}

export function buildIllustration(input: IllustrateInput): Illustration {
	const cfg = illustrateConfig();
	const objects = objectsFor(input);
	const composition: Composition = input.composition ?? (input.subjects.length === 0 && !input.image ? 'preset' : objects.length === 1 ? 'single' : 'row');
	const rotate = input.rotate ?? cfg.defaults.rotate;
	if (composition === 'object') {
		if (objects.length !== 1) throw new Error('The object composition draws one object: name one subject or pass --image.');
		const a = objects[0]!;
		return { width: a.width, height: a.height, ground: 'none', scan: false, band: 'none', items: [{ art: a, cx: a.width / 2, cy: a.height / 2, w: a.width, h: a.height, rotate: 0 }], title: a.name };
	}
	const size = cfg.sizes[cfg.defaults.size]!;
	const W = input.width ?? size.width;
	const H = input.height ?? size.height;
	const ground = input.ground ?? (cfg.defaults.ground as IllGround);
	const short = Math.min(W, H);
	const items: Illustration['items'] = [];
	// Objects stand above the band, never on it.
	const bandH = input.band && input.band !== 'none' && input.band !== ground ? Math.max(imageConfig().scene.band.minStep, (imageConfig().scene.band.step * W) / imageConfig().unit.width) * imageConfig().scene.band.steps : 0;
	const midY = (H - bandH) / 2;
	const put = (a: Art, cx: number, cy: number, width: number, r: number) => items.push({ art: a, cx, cy, w: width, h: (width * a.height) / a.width, rotate: r });
	if (composition === 'single') {
		if (objects.length !== 1) throw new Error('The single composition draws one object. Use row, preset or scatter for several.');
		const a = objects[0]!;
		// As large as the room allows at the editor's largest object (0.62 of the short side), whichever side binds.
		const room = Math.min(short, H - bandH);
		const fit = Math.min(0.62 * short, (0.62 * room * a.width) / a.height, W * 0.78);
		put(a, W / 2, midY, fit, rotate);
	} else if (composition === 'row') {
		const n = objects.length;
		const slot = (W * 0.86) / n;
		objects.forEach((a, i) => {
			const width = Math.min(slot * 0.86, 0.5 * short, (0.5 * short * a.width) / a.height);
			put(a, W * 0.07 + slot * (i + 0.5), midY, width, i % 2 ? -rotate : rotate);
		});
	} else if (composition === 'preset') {
		const preset = imageConfig().stickers.preset;
		const named = input.subjects.length ? preset.filter((p) => input.subjects.includes(p.subject)) : preset;
		if (!named.length) throw new Error(`None of ${input.subjects.join(', ')} is in the preset. Use scatter or row.`);
		const k = unitOf(W, H);
		const m = 24 * k;
		const got = settle(named.map((p) => ({ art: subjectArt(p.subject), x: p.x, y: p.y * ((H - bandH) / H), size: p.size, rotate: p.rotate })), W, H, { x: m, y: m, w: W - m * 2, h: H - bandH - m * 2 }, [], imageConfig().stickers.fit.gap * k);
		if (got.left.length) throw new Error(`There is no room for ${got.left.join(', ')} at this size.`);
		for (const st of got.stickers) put(st.art, st.x * W, st.y * H, st.size * short, st.rotate);
	} else {
		const names = input.subjects.length ? input.subjects : Object.keys(cfg.subjects);
		const sc = imageConfig().stickers.scatter;
		const count = input.count ?? (input.subjects.length ? input.subjects.length : sc.count);
		if (count < 1 || count > sc.max) throw new Error(`count must be a whole number from 1 to ${sc.max}.`);
		const k = unitOf(W, H);
		const m = 30 * k;
		const center: Rect[] = [];
		if (input.image) {
			const a = objects[0]!;
			const w = Math.min(0.42 * short, (0.42 * short * a.width) / a.height);
			put(a, W / 2, H / 2, w, rotate);
			center.push(inflate(turnedBox(W / 2, H / 2, w, (w * a.height) / a.width, rotate), 16 * k));
		}
		const got = scatter(W, H, { x: m, y: m, w: W - m * 2, h: H - bandH - m * 2 }, center, count, input.seed ?? sc.seed, names, sc.gap * k);
		if (input.subjects.length && got.left.length) throw new Error(`There is no room for ${got.left.join(', ')} at this size. Name fewer subjects or pick a larger size.`);
		for (const st of got.stickers) put(st.art, st.x * W, st.y * H, st.size * short, st.rotate);
	}
	return { width: W, height: H, ground, scan: input.scan ?? cfg.defaults.scan, band: input.band ?? 'none', items, title: `${composition} illustration` };
}

export function illustrationSvg(ill: Illustration): string {
	const ids = new Ids('i');
	const out: string[] = [];
	const cfg = imageConfig().scene;
	let room = ill.height;
	if (ill.ground !== 'none') {
		const g = groundColor(ill.ground);
		out.push(rect(0, 0, ill.width, ill.height, g));
		const step = ill.band !== 'none' && ill.band !== ill.ground ? Math.max(cfg.band.minStep, (cfg.band.step * ill.width) / imageConfig().unit.width) : 0;
		room = ill.height - step * cfg.band.steps;
		if (ill.scan && ill.ground === 'blue') out.push(scan(ids, 0, 0, ill.width, room, cfg.scan, true));
		if (step) out.push(band(ids, ill.width, room, step, ill.height, g, groundColor(ill.band as SceneGround), bandMixes(), cfg.grain));
	}
	ill.items.forEach((it, i) => out.push(`<g id="${it.art.name}-${i + 1}">${placed(it.art.href, it.cx, it.cy, it.w, it.h, it.rotate)}</g>`));
	return document(ill.width, ill.height, ill.title, out.join(''));
}
