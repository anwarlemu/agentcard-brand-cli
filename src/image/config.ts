// The image data in brand/assets/image.json and illustrate.json, and what follows from a size alone: its scale unit,
// the safe frame a platform leaves, and the smallest words that still read at the width the size is shown at.

import { readFileSync } from 'node:fs';
import type { Rect } from '../design/types.js';
import { pkgPath } from '../lib/paths.js';
import type { GrainSpec, ScanSpec } from './effects.js';

export type SceneGround = 'blue' | 'paper' | 'white' | 'ink';
export type SceneTemplate = 'hero' | 'window' | 'cards' | 'headline' | 'subtext' | 'screenshot' | 'quote' | 'announcement' | 'logo';
export type WindowBody = 'blue' | 'sky' | 'white';
export type Card = { title: string; body: string };

export type Fraction = number | { wide: number; tall: number };

export type SafeSpec = { inset: [number, number, number, number]; avoid?: [number, number, number, number][]; circle?: boolean; unit?: 'safe'; basis: 'published' | 'approximate'; note: string };
export type SizeSpec = { width: number; height: number; label: string; use: string; shown: number; aliases?: string[]; limit?: { bytes: number; where: string }; safe?: SafeSpec };

export type TemplateSpec = {
	label: string;
	ground: SceneGround;
	scan: boolean;
	band: SceneGround | 'none' | 'contrast';
	textSize: Fraction;
	textWidth?: Fraction;
	textX?: number;
	textY?: number;
	stickers?: string;
	windowBody?: WindowBody;
	picture?: string;
	notSizes?: string[];
	/** The first layouts' band: four flat steps, no grain. */
	flatBand?: boolean;
	cap?: SceneGround[];
	body?: SceneGround;
	share?: { lockup: number; mark: number; height: number };
	cards?: { pad: number; badge: number; heading: number; body: number; gapX: number; gapY: number; radius: string; shadow: string; edge: string; footer: number; titleLeading: number; maxCards: number };
};

export type ImageConfig = {
	unit: { width: number; height: number };
	sizes: Record<string, SizeSpec>;
	custom: { min: number; max: number };
	grounds: Record<SceneGround, { token: string; dark: boolean }>;
	bandContrast: Record<SceneGround, SceneGround>;
	scene: {
		margin: number;
		logo: number;
		logoRule: { clear: number; min: number; scale: [number, number]; note: string };
		small: { size: number; shown: number; note: string };
		footer: number;
		wideRatio: number;
		eyebrow: { size: number; gap: number; tracking: string; caps: boolean };
		headline: { leading: string; gap: number; maxLines: number; maxLinesTight: number; min: number };
		body: { min: number; max: number; ratio: number; width: number; gap: number; leading: string };
		key: { height: number; size: number; padX: number; radius: string; onBlue: string; onLight: string };
		band: { step: number; minStep: number; steps: number };
		flatBand: { step: number; share: number; maxShare: number; steps: number };
		scan: ScanSpec & { line: string };
		grain: GrainSpec;
		window: { radius: string; bar: number; name: number; inset: number; pictureFit: number; shadow: string; rule: string; edge: string; arrowAlpha: number; maxAspect: number; minAspect: number; pictureMin: number; pictureMax: number };
	};
	templates: Record<SceneTemplate, TemplateSpec>;
	stickers: {
		preset: { subject: string; x: number; y: number; size: number; rotate: number }[];
		under: { subject: string; textY: number; rotate: number; maxSize: number };
		scatter: { count: number; max: number; seed: number; minSize: number; spread: number; tilt: number; gap: number; tries: number };
		fit: { gap: number; clear: number; minScale: number; maxShift: number };
	};
	samples: Record<SceneTemplate, Record<string, unknown>>;
	notes: string[];
	source: string;
};

export type IllustrateConfig = {
	subjects: Record<string, { file: string; label: string; source: string }>;
	compositions: Record<string, string>;
	sizes: Record<string, { width: number; height: number }>;
	grounds: string[];
	defaults: { composition: string; size: string; ground: string; scan: boolean; rotate: number };
	source: string;
};

let imageCfg: ImageConfig | undefined;
export function imageConfig(): ImageConfig {
	imageCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'image.json'), 'utf8')) as ImageConfig;
	return imageCfg;
}

let illustrateCfg: IllustrateConfig | undefined;
export function illustrateConfig(): IllustrateConfig {
	illustrateCfg ??= JSON.parse(readFileSync(pkgPath('brand', 'assets', 'illustrate.json'), 'utf8')) as IllustrateConfig;
	return illustrateCfg;
}

/** The scale of an image: 1 at 1200 by 630, growing with its area. */
export const unitOf = (w: number, h: number) => {
	const u = imageConfig().unit;
	return Math.sqrt((w * h) / (u.width * u.height));
};
export const isWide = (w: number, h: number) => w / h >= imageConfig().scene.wideRatio;

export type Stage = {
	k: number;
	/** The box the layout is proportioned to: the canvas, or the safe box of a size whose outside is often cropped away. */
	box: Rect;
	/** Words, logo and art stay inside this. */
	frame: Rect;
	/** Parts of the frame a platform covers (a profile picture, a duration label). */
	avoid: Rect[];
	circle: boolean;
	wide: boolean;
	/** The smallest words that read at the width this size is shown at. */
	small: number;
};

/** The stage for a canvas. `size` is a size id whose platform rules apply; without one the whole canvas is open. */
export function stageFor(W: number, H: number, size?: string): Stage {
	const cfg = imageConfig();
	const spec = size ? cfg.sizes[size] : undefined;
	// A size's platform rules hold at that size's shape only (a deck or a custom canvas passes none).
	const safe = spec && Math.abs(spec.width / spec.height - W / H) < 0.02 ? spec.safe : undefined;
	const r = spec ? W / spec.width : 1;
	const inset = (safe?.inset ?? [0, 0, 0, 0]).map((v) => v * r) as [number, number, number, number];
	const box: Rect = safe?.unit === 'safe' ? { x: inset[3], y: inset[0], w: W - inset[1] - inset[3], h: H - inset[0] - inset[2] } : { x: 0, y: 0, w: W, h: H };
	const k = unitOf(box.w, box.h);
	const m = cfg.scene.margin * k;
	const edge = (v: number) => (safe?.unit === 'safe' ? v + m * 0.4 : Math.max(v, v > m * 0.6 ? v : m));
	const x = edge(inset[3]);
	const y = edge(inset[0]);
	const frame: Rect = { x, y, w: W - x - edge(inset[1]), h: H - y - edge(inset[2]) };
	const avoid = (safe?.avoid ?? []).map(([ax, ay, aw, ah]) => ({ x: ax * r, y: ay * r, w: aw * r, h: ah * r }));
	const small = spec ? Math.max(14 * k, (cfg.scene.small.shown * W) / spec.shown) : cfg.scene.small.size * 0.9 * k;
	return { k, box, frame, avoid, circle: Boolean(safe?.circle), wide: isWide(box.w, box.h), small };
}

export const pick = (f: Fraction | undefined, wide: boolean, fallback: number) => (f === undefined ? fallback : typeof f === 'number' ? f : wide ? f.wide : f.tall);
