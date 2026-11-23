// The shared design check on what a plain command drew, so `image` and `deck` keep the same rules as `design`.

import { checkDesign, errorsOf } from '../design/check.js';
import type { DesignDoc, DrawnLayer, Finding, TemplateInfo } from '../design/types.js';
import { brand } from '../lib/brand.js';
import { imageConfig, type SceneGround } from './config.js';
import { flatten, hex, parseColor, tokenColor } from './paint.js';
import { groundColor, groundColors } from './words.js';

/** Every color words are drawn in or on, as hex, from the tokens. */
export function wordColors(): string[] {
	const flat = (name: string) => hex(parseColor(tokenColor(name)));
	const grounds = Object.keys(imageConfig().grounds) as SceneGround[];
	const list = [
		...['brand', 'white', 'ink', 'paper', 'sky', 'window-bar', 'window-bar-fg', 'text-secondary', 'text-muted', 'text-label', 'text-on-brand-label'].map(flat),
		...grounds.flatMap((g) => groundColors(g, true)),
		...grounds.filter((g) => imageConfig().grounds[g].dark).map((g) => flatten(tokenColor('text-on-brand-muted'), groundColor(g))),
	];
	return [...new Set(list.map((c) => c.toUpperCase()))];
}

type Drawn = { template: string; kind: DesignDoc['kind']; size: DesignDoc['size']; copy: Record<string, string | undefined>; layers: DrawnLayer[] };

export function findingsFor(d: Drawn): Finding[] {
	const doc = { version: 1, brand: brand().bin, kind: d.kind, template: d.template, size: d.size, copy: Object.fromEntries(Object.entries(d.copy).filter((e): e is [string, string] => Boolean(e[1]?.trim()))), images: {}, options: {}, layers: {}, history: [], future: [] } as DesignDoc;
	return checkDesign({ doc, info: { kind: d.kind } as TemplateInfo, layers: d.layers, adapter: { colors: wordColors } });
}

/** Throws when what was drawn breaks a rule. Nothing has been written yet. */
export function assertClean(d: Drawn, what: string) {
	const errors = errorsOf(findingsFor(d));
	if (errors.length) throw new Error(`${what} breaks a rule, so nothing was written. ${errors.map((e) => `${e.rule}: ${e.message}`).join(' ')}`);
}
