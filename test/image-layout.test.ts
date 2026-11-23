// What every layout must hold at every size: the words whole, nothing over anything else, the platform's covered parts
// and the logo's clear space left alone, and every word readable. Read from what the drawing code reports it drew.
import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll } from 'vitest';
import { encodePng } from '../src/assets/png.js';
import type { DrawnLayer, Rect } from '../src/design/types.js';
import { SIZES, TEMPLATES, templateSizes, type TemplateId } from '../src/image/catalog.js';
import { buildScene, type SceneFields } from '../src/image/compose.js';
import { stageFor } from '../src/image/config.js';
import { parseColor } from '../src/image/paint.js';
import { drawScene } from '../src/image/scene.js';

const dir = mkdtempSync(join(tmpdir(), 'ds-layout-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const picture = (name: string, w: number, h: number) => {
	const data = new Uint8ClampedArray(w * h * 4).fill(200);
	const path = join(dir, name);
	writeFileSync(path, encodePng({ width: w, height: h, data }));
	return path;
};
const wide = picture('wide.png', 1440, 900);
const tall = picture('tall phone.png', 390, 844);

const LONG = 'Everything your agents need to search, buy and reply in one place';
const BODY = 'Cards your agent can use at checkout on any store, with every purchase approved by the person who pays.';
const CARDS = [
	{ title: 'Save it once', body: 'Your user adds their card a single time.' },
	{ title: 'Every purchase is approved', body: 'With a passkey, tied to that exact cart.' },
];
const cases: Record<string, (t: TemplateId) => Partial<SceneFields>> = {
	short: () => ({ headline: 'Ship faster', quote: 'It works.', cards: CARDS }),
	long: () => ({ headline: LONG, quote: BODY, by: 'Head of product, Acme', cards: CARDS }),
	full: () => ({ badge: 'New this week', headline: LONG, body: BODY, button: 'Start free', quote: BODY, by: 'Head of product, Acme', cards: CARDS, footer: 'example.test', number: '2/5' }),
	marks: () => ({ headline: 'Q&A: “Tom’s” <carts> & 100% of Ünïcødé, Ελληνικά, Кириллица', quote: '“Why?” & ‘how’', cards: [{ title: 'A & B <c>', body: '“Quoted”' }] }),
};

const overlaps = (a: Rect, b: Rect, gap = 0) => a.x < b.x + b.w + gap - 0.6 && a.x + a.w + gap - 0.6 > b.x && a.y < b.y + b.h + gap - 0.6 && a.y + a.h + gap - 0.6 > b.y;
const lum = (hex: string) => {
	const c = parseColor(hex);
	const f = (v: number) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
	return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const contrast = (a: string, b: string) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

export function problems(layers: DrawnLayer[], W: number, H: number, size: string): string[] {
	const out: string[] = [];
	const stage = stageFor(W, H, size);
	const inks = (l: DrawnLayer) => l.ink ?? [l.box];
	for (const l of layers) {
		if (l.bleeds) continue;
		for (const r of inks(l)) {
			if (r.x < -0.6 || r.y < -0.6 || r.x + r.w > W + 0.6 || r.y + r.h > H + 0.6) out.push(`${l.id} leaves the canvas`);
			if (l.kind !== 'art' && stage.avoid.some((a) => overlaps(r, a))) out.push(`${l.id} sits under the platform's own`);
			const s = stage.frame;
			const slack = l.kind === 'art' ? 24 * stage.k : 2 * stage.k;
			if (r.x < s.x - slack || r.y < s.y - slack || r.x + r.w > s.x + s.w + slack || r.y + r.h > s.y + s.h + slack) out.push(`${l.id} leaves the safe frame`);
		}
		if (l.text) {
			if (flat(l.text.asked) !== flat(l.text.drawn)) out.push(`${l.id} lost words: "${l.text.drawn}"`);
			const k = l.text.size / stage.k;
			for (const g of l.text.ground) if (contrast(l.text.color, g) < (k >= 24 ? 3 : 4.5)) out.push(`${l.id} contrast ${contrast(l.text.color, g).toFixed(2)} on ${g}`);
			if (l.text.size < stage.small - 0.01) out.push(`${l.id} is ${l.text.size.toFixed(1)}px, under ${stage.small.toFixed(1)}`);
		}
	}
	for (let i = 0; i < layers.length; i++)
		for (let j = i + 1; j < layers.length; j++) {
			const a = layers[i]!;
			const b = layers[j]!;
			if (a.over?.includes(b.id) || b.over?.includes(a.id)) continue;
			const pad = a.logo ? a.logo.clear : b.logo ? b.logo.clear : 0;
			const gap = a.bleeds || b.bleeds ? 0 : pad;
			if (inks(a).some((x) => inks(b).some((y) => overlaps(x, y, gap)))) out.push(`${a.id} touches ${b.id}`);
		}
	const art = layers.find((l) => l.id === 'art')?.ink ?? [];
	art.forEach((x, i) => art.slice(i + 1).forEach((y) => overlaps(x, y) && out.push('objects overlap')));
	return out;
}

const allowed = (t: TemplateId, f: Partial<SceneFields>): Partial<SceneFields> => {
	const spec = TEMPLATES[t];
	const takes = new Set<string>([...spec.needs, ...spec.optional]);
	return Object.fromEntries(Object.entries(f).filter(([k]) => takes.has(k)));
};

describe('every layout at every size', () => {
	for (const template of Object.keys(TEMPLATES) as TemplateId[])
		it(`${template}: words whole, nothing over anything, readable and clear of the platform`, () => {
			const failures: string[] = [];
			for (const size of templateSizes(template))
				for (const [name, make] of Object.entries(cases)) {
					const { width, height } = SIZES[size]!;
					const variants: Partial<SceneFields>[] = [{}];
					if (template === 'hero') variants.push({ stickers: 'scatter', seed: 3 }, { stickers: 'under' }, { image: tall });
					if (template === 'window') variants.push({ image: wide }, { image: tall });
					if (template === 'screenshot') variants.splice(0, 1, { image: wide }, { image: tall }, { picture: 'checkout' });
					for (const extra of variants) {
						const label = `${size} ${name} ${JSON.stringify(Object.keys(extra))}`;
						try {
							const scene = buildScene({ template, width, height, size, ...allowed(template, make(template)), ...extra, ...(name === 'full' ? {} : { footer: template === 'hero' || template === 'window' || template === 'logo' ? '' : 'example.test', footerOptional: true }) });
							for (const p of problems(drawScene(scene).layers, width, height, size)) failures.push(`${label}: ${p}`);
						} catch (error) {
							// Refusing is allowed for crowded copy in a shallow banner; short copy must always draw.
							if (name === 'short' || !/Shorten|fewer|room/.test((error as Error).message)) failures.push(`${label}: ${(error as Error).message}`);
							else refused.push(`${template} ${label}: ${(error as Error).message.slice(0, 90)}`);
						}
					}
				}
			expect(failures).toEqual([]);
		}, 120000);
	const refused: string[] = [];
	it('refuses only where the words cannot be read', () => {
		// Only shallow sizes may refuse.
		if (process.env.DS_SHOW) console.log(refused.join('\n'));
		expect(refused.filter((r) => !/linkedin-page|linkedin-banner|youtube|email|x-banner/.test(r))).toEqual([]);
	});
});

describe('the logo keeps its clear space', () => {
	it('from the words and the objects at every anchor, size and template', () => {
		const failures: string[] = [];
		for (const template of ['hero', 'window', 'headline', 'subtext', 'screenshot', 'quote', 'announcement', 'cards'] as TemplateId[]) {
			const anchors = template === 'announcement' ? ['top-left', 'top', 'top-right'] : template === 'quote' ? ['top-left', 'top', 'top-right', 'bottom-left', 'bottom-right'] : template === 'cards' ? ['bottom-left', 'bottom-right', 'top-left', 'top-right'] : ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];
			for (const size of ['og', 'x-banner', 'story', 'square', 'linkedin-banner'].filter((s) => templateSizes(template).includes(s)))
				for (const anchor of anchors) {
					const { width, height } = SIZES[size]!;
					try {
						const scene = buildScene({ template, width, height, size, ...allowed(template, cases.full!(template)), ...(template === 'screenshot' ? { image: wide } : {}), edits: { logo: { anchor: anchor as never } } });
						const layers = drawScene(scene).layers;
						const logo = layers.find((l) => l.id === 'logo');
						if (!logo) continue;
						const clear = logo.logo!.clear;
						const box = { x: logo.box.x - clear, y: logo.box.y - clear, w: logo.box.w + clear * 2, h: logo.box.h + clear * 2 };
						for (const l of layers) {
							if (l === logo || l.bleeds || logo.over?.includes(l.id) || l.over?.includes('logo')) continue;
							if ((l.ink ?? [l.box]).some((r) => overlaps(r, box))) failures.push(`${template} ${size} logo ${anchor}: ${l.id} is inside its clear space`);
						}
					} catch (error) {
						if (!/Shorten|fewer|room|too long/.test((error as Error).message)) failures.push(`${template} ${size} ${anchor}: ${(error as Error).message}`);
					}
				}
		}
		expect(failures).toEqual([]);
	}, 240000);
});
