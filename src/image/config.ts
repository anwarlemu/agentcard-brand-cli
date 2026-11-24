// The image data in brand/assets/image.json and illustrate.json, and what follows from a size alone: its scale unit,
// the safe frame a platform leaves, and the smallest words that still read at the width the size is shown at.

import { readFileSync } from 'node:fs';
import { SMALL_FLOOR } from '../design/check.js';
import { PLATFORMS, platformOf, zonePx, type Platform } from '../design/platforms.js';
import type { Rect } from '../design/types.js';
import { pkgPath } from '../lib/paths.js';
import type { GrainSpec, ScanSpec } from './effects.js';

export type SceneGround = 'blue' | 'paper' | 'white' | 'ink';
export type SceneTemplate = 'hero' | 'window' | 'cards' | 'headline' | 'subtext' | 'screenshot' | 'quote' | 'announcement' | 'logo' | 'stat' | 'chart' | 'pricing' | 'compare' | 'flow' | 'before-after';
export type WindowBody = 'blue' | 'sky' | 'white';
export type Card = { title: string; body: string };

export type Fraction = number | { wide: number; tall: number };

export type SizeSpec = { width: number; height: number; label: string; use: string; shown: number; aliases: string[]; limit?: { bytes: number; where: string; official: boolean }; zones?: { name: string; official: boolean; rect: Rect }[]; source?: string; note?: string };

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
	/** The shared platform sizes (src/design/platforms.ts), with this brand's older names. */
	sizes: Record<string, SizeSpec>;
	sizeAliases: Record<string, string>;
	extraSizes: { list: Platform[] };
	custom: { min: number; max: number };
	grounds: Record<SceneGround, { token: string; dark: boolean }>;
	bandContrast: Record<SceneGround, SceneGround>;
	scene: {
		margin: number;
		logo: number;
		logoRule: { clear: number; min: number; scale: [number, number]; note: string };
		small: { size: number; note: string };
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
		scatter: { count: number; max: number; seed: number; minSize: number; spread: number; tilt: number; gap: number; tries: number; air: number };
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

/** The shared sizes, then the ones only this table has so far. */
export const allPlatforms = (cfg: Pick<ImageConfig, 'extraSizes'>): Platform[] => [...PLATFORMS, ...cfg.extraSizes.list.filter((p) => !PLATFORMS.some((q) => q.id === p.id))];
export function imageConfig(): ImageConfig {
	if (!imageCfg) {
		imageCfg = JSON.parse(readFileSync(pkgPath('brand', 'assets', 'image.json'), 'utf8')) as ImageConfig;
		const older = Object.entries(imageCfg.sizeAliases);
		imageCfg.sizes = Object.fromEntries(
			allPlatforms(imageCfg).map((p) => [
				p.id,
				{
					width: p.width,
					height: p.height,
					label: p.label,
					use: `${p.label}, ${p.width} by ${p.height}`,
					shown: p.shown,
					aliases: [...p.aliases, ...older.filter(([, to]) => to === p.id).map(([name]) => name)],
					...(p.limit ? { limit: { bytes: p.limit.bytes, where: p.label, official: p.limit.official } } : {}),
					...(p.avoid.length || p.safe ? { zones: [...p.avoid, ...(p.safe ? [p.safe] : [])] } : {}),
					...(p.source ? { source: p.source } : {}),
					...(p.note ? { note: p.note } : {}),
				},
			]),
		);
	}
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
	/** So shallow that the logo, the words and a button sit in one row (a leaderboard ad, a page cover). */
	row: boolean;
	/** The smallest words that read at the width this size is shown at. */
	small: number;
};

/** The stage for a canvas. `size` is a size id whose platform rules apply; without one the whole canvas is open. */
export function stageFor(W: number, H: number, size?: string): Stage {
	const cfg = imageConfig();
	const found = size ? allPlatforms(cfg).find((p) => p.id === size) : undefined;
	// A size's platform rules hold at that size's shape only (a deck or a custom canvas passes none).
	const platform = found && Math.abs(found.width / found.height - W / H) < 0.02 ? found : undefined;
	const zones = (platform?.avoid ?? []).map((z) => zonePx(z, W, H));
	// A zone across a whole side is a margin; the rest are parts to lay out around.
	const inset = { top: 0, right: 0, bottom: 0, left: 0 };
	const avoid: Rect[] = [];
	for (const z of zones) {
		const across = z.x <= 0.5 && z.x + z.w >= W - 0.5;
		const down = z.y <= 0.5 && z.y + z.h >= H - 0.5;
		if (across && z.y <= 0.5) inset.top = Math.max(inset.top, z.h);
		else if (across) inset.bottom = Math.max(inset.bottom, H - z.y);
		else if (down && z.x <= 0.5) inset.left = Math.max(inset.left, z.w);
		else if (down) inset.right = Math.max(inset.right, W - z.x);
		else avoid.push(z);
	}
	const circle = size === 'avatar' && Boolean(platform);
	const safe = platform?.safe ? zonePx(platform.safe, W, H) : undefined;
	const box: Rect = safe && !circle ? safe : { x: 0, y: 0, w: W, h: H };
	const k = unitOf(box.w, box.h);
	const m = cfg.scene.margin * k;
	const edge = (v: number) => (v > 0 ? Math.max(v + 4 * k, v > m * 0.6 ? 0 : m) : m);
	let frame: Rect;
	if (safe) {
		const pad = circle ? 4 * k : m * 0.4;
		frame = { x: safe.x + pad, y: safe.y + pad, w: safe.w - pad * 2, h: safe.h - pad * 2 };
	} else {
		const [x, y] = [edge(inset.left), edge(inset.top)];
		frame = { x, y, w: W - x - edge(inset.right), h: H - y - edge(inset.bottom) };
	}
	// The shared check reads sizes it does not know yet at a default width: keep to the stricter of the two.
	const shown = Math.min(platform ? platform.shown : Infinity, platformOf(platform && PLATFORMS.some((p) => p.id === size) ? size! : 'custom', W, H).shown);
	const small = Math.max(13 * k, (SMALL_FLOOR * 1.01 * W) / shown);
	return { k, box, frame, avoid, circle, wide: isWide(box.w, box.h), row: box.w / box.h >= 4.5, small };
}

export const pick = (f: Fraction | undefined, wide: boolean, fallback: number) => (f === undefined ? fallback : typeof f === 'number' ? f : wide ? f.wide : f.tall);
