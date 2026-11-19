// Illustrations in the toon object style: the brand's own objects (or any picture made into one) arranged on a ground.
// The ground, its scanlines and the stepped band are vector; each object is its rendered art, placed and turned.
// Arrangements and defaults come from brand/assets/illustrate.json and image.json; the same inputs give the same bytes.

import { readPicture } from '../assets/picture.js';
import { crop, inkBox } from '../assets/picture.js';
import type { Pixels } from '../assets/png.js';
import { toonify } from '../assets/toon.js';
import { band, Ids, placed, scan } from '../image/effects.js';
import { bandMixes, document, rect } from '../image/paint.js';
import { groundColor, illustrateConfig, imageConfig, pictureArt, scatter, subjectArt, type Art, type SceneGround } from '../image/scene.js';
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
	const put = (a: Art, cx: number, cy: number, width: number, r: number) => items.push({ art: a, cx, cy, w: width, h: (width * a.height) / a.width, rotate: r });
	if (composition === 'single') {
		if (objects.length !== 1) throw new Error('The single composition draws one object. Use row, preset or scatter for several.');
		const a = objects[0]!;
		// As large as the room allows at the editor's largest object (0.62 of the short side), whichever side binds.
		const fit = Math.min(0.62 * short, (0.62 * short * a.width) / a.height, W * 0.78);
		put(a, W / 2, H / 2, fit, rotate);
	} else if (composition === 'row') {
		const n = objects.length;
		const slot = (W * 0.86) / n;
		objects.forEach((a, i) => {
			const width = Math.min(slot * 0.86, 0.5 * short, (0.5 * short * a.width) / a.height);
			put(a, W * 0.07 + slot * (i + 0.5), H / 2, width, i % 2 ? -rotate : rotate);
		});
	} else if (composition === 'preset') {
		const preset = imageConfig().stickers.preset;
		const named = input.subjects.length ? preset.filter((p) => input.subjects.includes(p.subject)) : preset;
		if (!named.length) throw new Error(`None of ${input.subjects.join(', ')} is in the preset. Use scatter or row.`);
		for (const p of named) put(subjectArt(p.subject), p.x * W, p.y * H, p.size * short, p.rotate);
	} else {
		const names = input.subjects.length ? input.subjects : Object.keys(cfg.subjects);
		const sc = imageConfig().stickers.scatter;
		const placedList = scatter(W, H, H, [], input.count ?? sc.count, input.seed ?? sc.seed, names);
		for (const p of placedList) put(subjectArt(p.subject), p.x * W, p.y * H, p.size * short, p.rotate);
		if (input.image) put(objects[0]!, W / 2, H / 2, 0.42 * short, rotate);
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
