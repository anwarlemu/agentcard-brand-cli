// This brand's side of the design core: what can be made, and how a document becomes the engine's own request. Every
// kind draws through the same functions as its plain command, so a document with no layer edits draws the same bytes.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { encodeAll, rasterizeRgba, rasterizeWithFont } from '../image/render.js';
import type { ImageFormat } from '../assets/encode.js';
import { imagesToPdf, pdfPage } from '../assets/pdf.js';
import { deckConfig, checkSlide, drawSlide, type Slide, type SlideType } from '../deck/slides.js';
import { buildIllustration, COMPOSITIONS, illustrationSvg, type Composition, type IllGround } from '../illustrate/render.js';
import { ALIASES, resolveFields, SIZES, TEMPLATES, templateSizes, type ImageFields, type RawImageInput, type TemplateId } from '../image/catalog.js';
import { plainWords, wordColors } from '../image/check.js';
import { SCENE_GROUNDS, STICKER_MODES, subjectNames, WINDOW_BODIES, type SceneFields } from '../image/compose.js';
import { illustrateConfig, imageConfig, type SceneGround } from '../image/config.js';
import { renderScene } from '../image/layout.js';
import { buildScene } from '../image/compose.js';
import { ART_CAN, PICTURE_CAN } from '../image/scene.js';
import { groundColor, WORD_CAN, type Edits } from '../image/words.js';
import { brand } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { merchConfig, merchSlots, merchSvgs } from '../merch/render.js';
import { clipFrameSvg, encodeClip, sceneClip } from '../video/clips.js';
import { ffmpegPath } from '../video/ffmpeg.js';
import { videoConfig } from '../video/motion.js';
import { sheetSvg, type Adapter, type DesignDoc, type DrawnLayer, type Format, type Painter, type TemplateInfo } from './index.js';

const OBJECT = 'object:';
const PICTURES = () => subjectNames().map((n) => `${OBJECT}${n}`);

export function host() {
	try {
		return brand().site ? new URL(brand().site!).host.replace(/^www\./, '') : '';
	} catch {
		return '';
	}
}

const NINE = WORD_CAN.headline!.anchors!;
const LOGO = imageConfig().scene.logoRule.scale;
const grounds = (themes: readonly SceneGround[]) => Object.fromEntries(themes.map((t) => [t, groundColor(t)]));
const YES = ['true', 'false'];

// Images ------------------------------------------------------------------------------------------------------------

/** The slots a layout draws, under the shared ids. */
const COPY: Record<string, string> = { headline: 'the main line', body: 'the line under it', badge: 'a short label over it', button: 'a key under the words', quote: 'the quote', by: 'who said it', cards: 'cards, blank lines between them, each one\'s first line its heading', window: 'the label in the window\'s bar', stat: 'the number', data: 'chart points: "Jan: 120, Feb: 180"', plans: 'plans, blank line between: name, price, features', columns: 'two columns, blank line between: title, points', steps: 'steps, blank line between: title, a line', left: 'the first window\'s label', right: 'the second window\'s label', footer: 'the small line (the brand\'s address when you leave it)' };
const slotId = (key: string) => (key === 'window' ? 'window-bar' : key);
const MAX_OBJECTS = () => imageConfig().stickers.scatter.max;

function layersOf(id: TemplateId): TemplateInfo['layers'] {
	const takes = new Set<string>([...TEMPLATES[id].needs, ...TEMPLATES[id].optional]);
	const out: TemplateInfo['layers'] = [];
	const add = (layer: string, can: DrawnLayer['can']) => out.push({ id: layer, can });
	const hide = { hide: true };
	if (id === 'logo') add('logo', { move: true, scale: [0.3, 1.35], anchors: ['center', ...NINE.filter((a) => a !== 'center')] });
	else if (id === 'cards') add('logo', { scale: [0.8, 1.6], hide: true, anchors: ['bottom-left', 'bottom-right', 'top-left', 'top-right'] });
	else if (takes.has('logo')) add('logo', { move: true, scale: LOGO, hide: true, anchors: id === 'announcement' ? ['top-left', 'top', 'top-right'] : id === 'quote' ? ['top-left', 'top', 'top-right', 'bottom-left', 'bottom-right'] : ['top-left', ...NINE.filter((a) => a !== 'top-left')] });
	if (takes.has('headline')) add('headline', id === 'cards' ? { scale: [0.6, 1.4], align: true } : WORD_CAN.headline!);
	for (const key of ['badge', 'body', 'button'] as const) if (takes.has(key)) add(key, WORD_CAN[key]!);
	if (takes.has('quote')) add('quote', { scale: [0.6, 1.5] });
	if (takes.has('by')) add('by', hide);
	if (id === 'window' || id === 'screenshot') add('picture', PICTURE_CAN);
	if (id === 'quote') add('picture', {});
	if (takes.has('stickers')) {
		add('art', ART_CAN);
		for (let i = 2; i <= MAX_OBJECTS(); i++) add(`art-${i}`, {});
	}
	if (takes.has('window')) add('window-bar', {});
	if (takes.has('footer')) add('footer', hide);
	if (takes.has('cards')) {
		add('cards', {});
		for (let i = 1; i <= (imageConfig().templates.cards.cards!.maxCards ?? 8); i++) for (const part of ['title', 'body']) add(`card-${i}-${part}`, {});
	}
	if (takes.has('number')) add('number', {});
	if (id === 'stat') add('stat', { scale: [0.6, 1.2] });
	if (id === 'chart') {
		add('chart', {});
		for (let i = 1; i <= 12; i++) for (const part of ['label', 'value']) add(`${part}-${i}`, {});
	}
	for (const [t, name, max] of [['pricing', 'plan', 3], ['compare', 'column', 2], ['flow', 'step', 5]] as const) {
		if (id !== t) continue;
		for (let i = 1; i <= max; i++) {
			add(`${name}-${i}`, {});
			for (const part of ['title', 'price']) add(`${name}-${i}-${part}`, {});
			for (let j = 1; j <= 12; j++) add(`${name}-${i}-line-${j}`, {});
		}
	}
	if (id === 'before-after') {
		add('picture-1', {});
		add('picture-2', {});
		add('window-bar', {});
	}
	if (id === 'announcement') {
		add('cap', {});
		add('band', {});
	} else if (takes.has('band')) add('band', hide);
	return out;
}

function optionsOf(id: TemplateId): TemplateInfo['options'] {
	const takes = new Set<string>([...TEMPLATES[id].needs, ...TEMPLATES[id].optional]);
	const out: TemplateInfo['options'] = [];
	if (takes.has('band')) out.push({ id: 'band', values: [...SCENE_GROUNDS, 'none'], description: 'the ground the stepped band at the bottom leads to' });
	if (takes.has('scan')) out.push({ id: 'scan', values: YES, description: 'scanlines on the blue ground' });
	if (takes.has('stickers')) {
		out.push({ id: 'objects', values: id === 'hero' ? [...STICKER_MODES] : STICKER_MODES.filter((m) => m !== 'under'), description: 'how the toon objects sit: preset, scatter (by seed), under (one large one) or none' });
		out.push({ id: 'subjects', description: `which objects, comma-separated: ${subjectNames().join(', ')}` });
		out.push({ id: 'count', range: [1, MAX_OBJECTS()], description: 'scatter: how many objects' });
	}
	if (takes.has('windowBody')) out.push({ id: 'window-body', values: [...WINDOW_BODIES], description: 'the window\'s inside' });
	if (takes.has('toon')) out.push({ id: 'toon', values: YES, description: 'make your picture a toon object' });
	if (takes.has('mark')) out.push({ id: 'mark', values: YES, description: 'the mark alone instead of the lockup' });
	if (takes.has('chart')) out.push({ id: 'chart', values: ['bar', 'line', 'donut'], description: 'the kind of chart' });
	return out;
}

function imageInfo(id: TemplateId, kind: 'image' | 'video'): TemplateInfo {
	const spec = TEMPLATES[id];
	const takes = [...spec.needs, ...spec.optional] as string[];
	const themes = id === 'announcement' ? imageConfig().templates.announcement.cap! : [...SCENE_GROUNDS];
	const needsPicture = id === 'screenshot';
	return {
		id: kind === 'image' ? id : `video-${id}`,
		kind,
		description: kind === 'image' ? spec.summary : `A clip of the ${id} layout. ${spec.summary}`,
		sizes: kind === 'image' ? [...templateSizes(id), 'custom'] : Object.keys(videoConfig().sizes),
		themes: [...themes],
		copy: Object.keys(COPY).filter((c) => takes.includes(c)).map((c) => ({ id: slotId(c), ...((spec.needs as readonly string[]).includes(c) ? { required: true } : {}), description: COPY[c] })),
		images: [
			...(takes.includes('image') || takes.includes('picture') ? [{ id: 'picture', ...(needsPicture || id === 'before-after' ? { required: true } : {}), ...(takes.includes('picture') ? { values: [...(needsPicture || id === 'before-after' ? [] : ['none']), ...PICTURES()] } : {}) }] : []),
			...(takes.includes('image2') ? [{ id: 'picture2', required: true, values: PICTURES() }] : []),
		],
		options: [...optionsOf(id), ...(kind === 'video' ? [{ id: 'seconds', range: [videoConfig().seconds.min, videoConfig().seconds.max] as [number, number], description: 'how long the clip runs' }] : [])],
		layers: kind === 'image' ? layersOf(id) : [],
		grounds: grounds(themes),
		formats: kind === 'image' ? ['png', 'svg', 'jpg', 'webp'] : ['png', 'mp4'],
		...(kind === 'image' ? {} : { layouts: [`${id} clip`, `${id} video`] }),
	};
}

const flag = (v: unknown) => (v === undefined ? undefined : v === true || v === 'true');
const isTemplate = (id: string): id is TemplateId => id in TEMPLATES;
const seeded = (id: TemplateId) => id === 'hero';

/** The engine's own fields for an image (or clip) document, through the same checks as the plain command's flags. */
export function imageFields(doc: DesignDoc, id: TemplateId, dir: string): ImageFields {
	const o = doc.options;
	const pic = doc.images.picture;
	const mode = o.objects as string | undefined;
	// On the hero a seed past zero is another arrangement; zero is the layout's own.
	const scatter = mode === 'scatter' || (mode === undefined && Boolean(doc.seed) && seeded(id) && !pic);
	const raw: Record<string, unknown> = {
		template: id,
		...Object.fromEntries(Object.entries(doc.copy).map(([k, v]) => [k === 'window-bar' ? 'window' : k, v])),
		theme: doc.theme,
		band: o.band,
		scan: flag(o.scan) === false ? false : undefined,
		windowBody: o['window-body'],
		toon: pic && !pic.startsWith(OBJECT) && pic !== 'none' ? flag(o.toon) || undefined : undefined,
		mark: flag(o.mark) || undefined,
		stickers: mode ?? (scatter ? 'scatter' : undefined),
		subjects: o.subjects,
		seed: scatter ? doc.seed : undefined,
		count: scatter ? o.count : undefined,
		image: pic && pic !== 'none' && !pic.startsWith(OBJECT) ? resolve(dir, pic) : undefined,
		picture: pic === 'none' ? 'none' : pic?.startsWith(OBJECT) ? pic.slice(OBJECT.length) : undefined,
		chart: o.chart,
		...(doc.images.picture2 ? (doc.images.picture2.startsWith(OBJECT) ? { picture2: doc.images.picture2.slice(OBJECT.length) } : { image2: resolve(dir, doc.images.picture2) }) : {}),
	};
	return resolveFields(Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== undefined)) as RawImageInput, { footer: host() });
}

const sceneFields = (doc: DesignDoc, id: TemplateId, dir: string, size: string | undefined): SceneFields => ({ ...imageFields(doc, id, dir), size, width: doc.size.width, height: doc.size.height, edits: doc.layers as Edits });

// Slides --------------------------------------------------------------------------------------------------------------

const SLIDE = 'slide-';
const slideSlot = (s: string) => (s === 'window' ? 'window-bar' : s);

function slideLayers(type: SlideType): TemplateInfo['layers'] {
	const tops = ['top-left', 'top', 'top-right'] as const;
	const logo = { id: 'logo', can: { move: true, scale: LOGO, hide: true, anchors: [...tops] } };
	const plain = { move: true, scale: [0.5, 1.5] as [number, number] };
	switch (type) {
		case 'cover':
		case 'statement':
			return [...layersOf('hero').filter((l) => l.id !== 'band' && l.id !== 'number')];
		case 'image':
			return layersOf('window').filter((l) => !/^art|^band|^number/.test(l.id));
		case 'quote':
			return layersOf('quote').filter((l) => !/^band|^number|^footer/.test(l.id));
		case 'cards':
			return layersOf('cards').filter((l) => !/^art|^band|^number/.test(l.id));
		case 'bullets':
			return layersOf('cards').filter((l) => !/^art|^band|^number|^footer|^logo/.test(l.id));
		case 'section':
			return [logo, { id: 'headline', can: plain }, { id: 'number', can: { ...plain, hide: true } }, { id: 'band', can: {} }];
		case 'stat':
			return [logo, { id: 'stat', can: plain }, { id: 'headline', can: plain }, { id: 'band', can: {} }];
		default:
			return [{ id: 'logo', can: { move: true, scale: [0.4, 1.6], hide: true } }, { id: 'headline', can: plain }, { id: 'url', can: { hide: true } }, { id: 'band', can: {} }];
	}
}

function slideInfo(type: SlideType): TemplateInfo {
	const cfg = deckConfig();
	const spec = cfg.slides[type];
	const slots = spec.slots.filter((s) => !['image', 'picture', 'theme'].includes(s));
	return {
		id: `${SLIDE}${type}`,
		kind: 'slide',
		description: spec.about,
		sizes: ['slide'],
		themes: [...cfg.themes[type]],
		copy: slots.map((s) => ({ id: slideSlot(s), ...(spec.needs.includes(s) ? { required: true } : {}), ...(s === 'items' ? { description: COPY.cards } : {}) })),
		images: spec.slots.includes('image') ? [{ id: 'picture', ...(spec.slots.includes('picture') ? { values: ['none', ...PICTURES()] } : {}) }] : [],
		options: [],
		layers: slideLayers(type),
		grounds: grounds(cfg.themes[type]),
		formats: ['png', 'svg', 'jpg', 'webp', 'pdf'],
		layouts: [`${type} slide`],
	};
}

function slideOf(doc: DesignDoc, dir: string): Slide {
	const type = doc.template.slice(SLIDE.length) as SlideType;
	const pic = doc.images.picture;
	const raw: Record<string, unknown> = { type, ...Object.fromEntries(Object.entries(doc.copy).map(([k, v]) => [k === 'window-bar' ? 'window' : k, v])), ...(doc.theme ? { theme: doc.theme } : {}) };
	if (pic === 'none') raw.picture = 'none';
	else if (pic?.startsWith(OBJECT)) raw.picture = pic.slice(OBJECT.length);
	else if (pic) raw.image = resolve(dir, pic);
	return checkSlide(raw, 0);
}

// Merch ---------------------------------------------------------------------------------------------------------------

const MERCH = 'merch-';
const itemOf = (template: string) => merchConfig().items.find((i) => i.id === template.slice(MERCH.length))!;

const merchInfo = (id: string): TemplateInfo => {
	const item = itemOf(`${MERCH}${id}`);
	const themed = item.variants.filter((v) => merchConfig().variants[v]!.ground);
	return {
		id: `${MERCH}${id}`,
		kind: 'merch',
		description: `${item.name}, ${item.size[0]} by ${item.size[1]} in, ${item.method}. A print file at ${merchConfig().dpi} dpi with its bleed.`,
		sizes: ['print'],
		themes: item.variants,
		copy: [...new Set(merchSlots(item))].map((s) => ({ id: s })),
		images: [],
		options: [],
		layers: [],
		...(themed.length ? { grounds: Object.fromEntries(themed.map((v) => [v, groundColor(merchConfig().variants[v]!.ground!)])) } : {}),
		formats: ['png', 'svg', 'pdf'],
		layouts: [item.name],
	};
};

function merchSize(id: string) {
	const item = itemOf(`${MERCH}${id}`);
	const dpi = merchConfig().dpi;
	return { width: Math.round((item.size[0] + item.bleed * 2) * dpi), height: Math.round((item.size[1] + item.bleed * 2) * dpi) };
}

// Illustrations -------------------------------------------------------------------------------------------------------

const ILL = 'illustration-';
const illSizes = () => illustrateConfig().sizes;

const illInfo = (c: Composition): TemplateInfo => ({
	id: `${ILL}${c}`,
	kind: 'illustration',
	description: c === 'object' ? 'One object alone on a clear ground, cropped to its edges.' : (illustrateConfig().compositions[c] ?? c),
	sizes: c === 'object' ? ['object'] : [...Object.keys(illSizes()), 'custom'],
	themes: c === 'object' ? [] : [...illustrateConfig().grounds],
	copy: [],
	images: c === 'object' || c === 'single' || c === 'row' || c === 'scatter' ? [{ id: 'picture' }] : [],
	options: [
		{ id: 'subjects', description: `which objects, comma-separated: ${subjectNames().join(', ')}` },
		...(c === 'object' ? [] : [{ id: 'scan', values: YES, description: 'scanlines on the blue ground' }, { id: 'band', values: [...SCENE_GROUNDS, 'none'], description: 'the stepped band at the bottom' }]),
		...(c === 'scatter' ? [{ id: 'count', range: [1, MAX_OBJECTS()] as [number, number], description: 'how many objects' }] : []),
		...(c === 'single' || c === 'row' ? [{ id: 'rotate', range: [-45, 45] as [number, number], description: 'the tilt, in degrees' }] : []),
		...(c === 'preset' ? [] : [{ id: 'toon', values: YES, description: 'make your picture a toon object (on unless you say no)' }]),
	],
	layers: [],
	...(c === 'object' ? {} : { grounds: grounds(SCENE_GROUNDS) }),
	formats: ['png', 'svg', 'jpg', 'webp'],
});

const DEFAULT_SUBJECT: Record<Composition, string[]> = { object: ['cart'], single: ['cart'], row: ['coins', 'wallet', 'receipt'], preset: [], scatter: [] };

function illustrationOf(doc: DesignDoc, dir: string) {
	const c = doc.template.slice(ILL.length) as Composition;
	const o = doc.options;
	const picture = doc.images.picture && doc.images.picture !== 'none' ? resolve(dir, doc.images.picture) : undefined;
	const named = String(o.subjects ?? '').split(',').map((s) => s.trim()).filter(Boolean);
	return buildIllustration({
		subjects: named.length || picture ? named : DEFAULT_SUBJECT[c],
		image: picture,
		toon: flag(o.toon) !== false,
		composition: c,
		...(c === 'object' ? {} : { width: doc.size.width, height: doc.size.height, ground: doc.theme as IllGround | undefined }),
		scan: flag(o.scan) === false ? false : undefined,
		band: o.band as SceneGround | 'none' | undefined,
		seed: c === 'scatter' ? doc.seed : undefined,
		count: o.count as number | undefined,
		rotate: o.rotate as number | undefined,
	});
}

// The adapter ---------------------------------------------------------------------------------------------------------

const VIDEO = 'video-';

async function encoded(svg: string, width: number, formats: Format[], scale: number) {
	const raster = formats.filter((f): f is ImageFormat & Format => ['png', 'svg', 'jpg', 'webp'].includes(f));
	return (await encodeAll(svg, Math.round(width * scale), raster)) as Record<string, Uint8Array>;
}

/** Every page as drawn, for print and slides. */
async function pdf(svg: string, width: number, widthPt: number, clear: boolean, trim?: { x: number; y: number; w: number; h: number }) {
	const r = await rasterizeRgba(svg, width);
	return imagesToPdf([{ ...pdfPage(r.pixels, r.width, r.height, clear), widthPt, ...(trim ? { trim } : {}) }], widthPt);
}

export function adapter(): Adapter {
	return {
		brand: brand().bin,
		templates: () => [
			...(Object.keys(TEMPLATES) as TemplateId[]).map((id) => imageInfo(id, 'image')),
			...(Object.keys(deckConfig().slides) as SlideType[]).map(slideInfo),
			...merchConfig().items.map((i) => merchInfo(i.id)),
			...COMPOSITIONS.map(illInfo),
			...(Object.keys(TEMPLATES) as TemplateId[]).map((id) => imageInfo(id, 'video')),
		],
		defaults(template, size): Pick<DesignDoc, 'size' | 'theme' | 'seed' | 'options'> {
			if (template.startsWith(SLIDE)) return { size: { id: 'slide', width: deckConfig().width, height: deckConfig().height }, theme: deckConfig().themes[template.slice(SLIDE.length) as SlideType][0], seed: undefined, options: {} };
			if (template.startsWith(MERCH)) return { size: { id: 'print', ...merchSize(template.slice(MERCH.length)) }, theme: itemOf(template).variants[0], seed: undefined, options: {} };
			if (template.startsWith(ILL)) {
				const cfg = illustrateConfig();
				const c = template.slice(ILL.length) as Composition;
				if (c === 'object') {
					const ill = buildIllustration({ subjects: DEFAULT_SUBJECT.object, toon: true, composition: 'object' });
					return { size: { id: 'object', width: ill.width, height: ill.height }, theme: undefined, seed: undefined, options: {} };
				}
				const s = cfg.sizes[size] ?? cfg.sizes[cfg.defaults.size]!;
				return { size: { id: size, ...s }, theme: cfg.defaults.ground, seed: c === 'scatter' ? imageConfig().stickers.scatter.seed : undefined, options: c === 'scatter' ? { count: imageConfig().stickers.scatter.count } : c === 'single' || c === 'row' ? { rotate: cfg.defaults.rotate } : {} };
			}
			const id = (template.startsWith(VIDEO) ? template.slice(VIDEO.length) : template) as TemplateId;
			const theme = imageConfig().templates[id].ground;
			if (template.startsWith(VIDEO)) {
				const s = videoConfig().sizes[size]!;
				return { size: { id: size, width: s.width, height: s.height }, theme, seed: seeded(id) ? 0 : undefined, options: { seconds: videoConfig().seconds.default } };
			}
			const s = SIZES[size] ?? SIZES.og!;
			return { size: { id: size, width: s.width, height: s.height }, theme, seed: seeded(id) ? 0 : undefined, options: {} };
		},
		async render(doc, dir, out) {
			if (doc.template.startsWith(SLIDE)) {
				const drawn = drawSlide(slideOf(doc, dir), 0, doc.layers as Edits);
				const files = await encoded(drawn.svg, doc.size.width, out.formats, out.scale);
				if (out.formats.includes('pdf')) files.pdf = await pdf(drawn.svg, doc.size.width, 960, false);
				return { files, layers: drawn.layers };
			}
			if (doc.template.startsWith(MERCH)) {
				const item = itemOf(doc.template);
				const svgs = merchSvgs(item, doc.theme ?? item.variants[0]!, { copy: doc.copy });
				const files = await encoded(svgs.raster, svgs.width, out.formats.filter((f) => f !== 'svg'), out.scale);
				if (out.formats.includes('svg')) files.svg = Buffer.from(svgs.print);
				const b = item.bleed * 72;
				if (out.formats.includes('pdf')) files.pdf = await pdf(svgs.raster, svgs.width, svgs.inches.width * 72, true, item.bleed ? { x: b, y: b, w: item.size[0] * 72, h: item.size[1] * 72 } : undefined);
				return { files, layers: svgs.layers };
			}
			if (doc.template.startsWith(ILL)) {
				const ill = illustrationOf(doc, dir);
				const files = await encoded(illustrationSvg(ill), ill.width, out.formats, out.scale);
				return { files, layers: ill.items.map((it, i) => ({ id: i ? `art-${i + 1}` : 'art', kind: 'art', box: { x: it.cx - it.w / 2, y: it.cy - it.h / 2, w: it.w, h: it.h }, can: {} })) };
			}
			if (doc.template.startsWith(VIDEO)) {
				const id = doc.template.slice(VIDEO.length) as TemplateId;
				const spec = videoConfig().sizes[doc.size.id];
				const seconds = Number(doc.options.seconds ?? videoConfig().seconds.default);
				const fields = { ...sceneFields(doc, id, dir, spec?.as), edits: {} };
				// The layers (and the checks) are the finished frame's, as the still draws it.
				const layers = renderScene(buildScene(fields)).layers;
				const files: Record<string, Uint8Array> = {};
				if (out.formats.length) {
					const clip = sceneClip(fields, seconds);
					if (out.formats.includes('png')) Object.assign(files, await encoded(clipFrameSvg(clip, seconds - 1 / videoConfig().fps), doc.size.width, ['png'], out.scale));
					if (out.formats.includes('mp4')) files.mp4 = (await encodeClip(clip, ['mp4']))[0]!.data;
				}
				return { files, layers };
			}
			if (!isTemplate(doc.template)) throw new Error(`Unknown template ${doc.template}.`);
			const drawn = renderScene(buildScene(sceneFields(doc, doc.template, dir, doc.size.id)));
			return { files: await encoded(drawn.svg, doc.size.width, out.formats, out.scale), layers: drawn.layers };
		},
		sample(template) {
			const id = template.startsWith(VIDEO) ? template.slice(VIDEO.length) : template;
			const text = (v: unknown): string => (Array.isArray(v) ? v.map((c) => (typeof c === 'string' ? c : [c.title, c.body].filter(Boolean).join('\n'))).join('\n\n') : String(v));
			if (isTemplate(id)) return Object.fromEntries(Object.entries(imageConfig().samples[id]).filter(([k]) => k !== 'picture').map(([k, v]) => [k, text(v)]));
			if (id.startsWith(SLIDE)) return Object.fromEntries(Object.entries(deckConfig().slides[id.slice(SLIDE.length) as SlideType].sample).filter(([k]) => k !== 'picture').map(([k, v]) => [slideSlot(k), text(v)]));
			if (id.startsWith(MERCH)) {
				const all: Record<string, string> = { ...merchConfig().samples, headline: merchConfig().copy.headline ?? '' };
				return Object.fromEntries(merchSlots(itemOf(id)).filter((s) => s !== 'url' && all[s]).map((s) => [s, all[s]!]));
			}
			return {};
		},
		colors: wordColors,
		words: plainWords,
		aliases: {
			sizes: { ...imageConfig().sizeAliases, story: 'vertical', reel: 'vertical', '9:16': 'vertical', landscape: 'wide' },
			themes: { dark: 'ink', black: 'ink', light: 'paper', cream: 'paper' },
			copy: { ...ALIASES, window: 'window-bar', cta: 'button' },
			layers: { objects: 'art', stickers: 'art', key: 'button', subtext: 'body', eyebrow: 'badge' },
		},
	};
}

/** Contact sheets, on the same rasterizer with the shipped face. */
export const paint: Painter = (spec) => rasterizeWithFont(sheetSvg(spec, 'Inter'), spec.width, [readFileSync(pkgPath('brand', 'fonts', 'Inter-Medium.ttf'))]);

export const hasClips = () => Boolean(ffmpegPath());
