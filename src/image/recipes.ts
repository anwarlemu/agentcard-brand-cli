// Every image template as compose blocks: proof that a composition can make anything a template makes. Copy keys are
// the templates' slots; the words are kept whole.

import type { ComposeBlock, DesignState } from '../design/types.js';
import { PLATFORMS } from '../design/platforms.js';

type Recipe = Pick<DesignState, 'blocks' | 'copy'> & Partial<Pick<DesignState, 'grid' | 'theme' | 'layers'>>;

const at = (col: number, row: number, cols: number, rows: number): ComposeBlock['at'] => ({ col, row, cols, rows });
const c = (id: string, slot: string, v?: string) => (v?.trim() ? { [`${id}.${slot}`]: v } : {});
const blocksOf = (s?: string) => (s ?? '').replace(/\\n/g, '\n').split(/\n\s*\n/).map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean)).filter((b) => b.length);

export function recipeFor(template: string, size: string, copy: Record<string, string>): Recipe | undefined {
	const p = PLATFORMS.find((x) => x.id === size);
	const tall = p ? p.height > p.width * 1.1 : false;
	const strip = p ? p.width / p.height > 2.2 : false;
	const words = (top: number) => [
		...(copy.badge ? [{ id: 'badge', type: 'badge', at: at(0, top, 6, 1) }] : []),
		{ id: 'headline', type: 'headline', at: at(0, top + (copy.badge ? 1 : 0), tall ? 12 : 7, tall ? 3 : 4) },
		...(copy.body ? [{ id: 'body', type: 'body', at: at(0, top + (copy.badge ? 1 : 0) + (tall ? 3 : 4), tall ? 12 : 7, 2) }] : []),
		...(copy.button ? [{ id: 'button', type: 'button', at: at(0, top + (copy.badge ? 1 : 0) + (tall ? 3 : 4) + (copy.body ? 2 : 0), 4, 1) }] : []),
	];
	const wordsCopy = { ...c('badge', 'text', copy.badge), ...c('headline', 'text', copy.headline), ...c('body', 'text', copy.body), ...c('button', 'text', copy.button) };
	const logo = { id: 'logo', type: 'logo', at: at(0, 0, strip ? 3 : 4, 1) };
	if (strip && template !== 'logo') return { theme: template === 'subtext' || template === 'window' || template === 'quote' ? 'paper' : 'blue', grid: { cols: 12, rows: 6 }, blocks: [logo, { id: 'headline', type: 'headline', at: at(3, 1, 9, 3) }, ...(copy.body ? [{ id: 'body', type: 'body', at: at(3, 4, 9, 2) }] : [])], copy: { ...c('headline', 'text', copy.headline ?? copy.quote ?? copy.stat), ...c('body', 'text', copy.body) } };
	// The data layouts: the words at the top (badge, headline, line), the content under them.
	const topWords = [...(copy.badge ? [{ id: 'badge', type: 'badge', at: at(0, 1, 6, 1) }] : []), { id: 'headline', type: 'headline', at: at(0, copy.badge ? 2 : 1, 12, 2) }, ...(copy.body ? [{ id: 'body', type: 'body', at: at(0, copy.badge ? 4 : 3, 12, 1) }] : [])];
	const below = 1 + (copy.badge ? 1 : 0) + 2 + (copy.body ? 1 : 0) + 1;
	const topCopy = { ...c('badge', 'text', copy.badge), ...c('headline', 'text', copy.headline), ...c('body', 'text', copy.body) };
	switch (template) {
		case 'hero':
			return { theme: 'blue', blocks: [{ id: 'object', type: 'object', at: tall ? at(0, 10, 4, 2) : at(0, 6, 2, 4) }, { id: 'object-2', type: 'object', at: tall ? at(8, 10, 4, 2) : at(10, 6, 2, 4) }, logo, ...words(tall ? 3 : 2).map((b) => ({ ...b, at: { ...b.at, col: tall ? 0 : 2, cols: tall ? 12 : 8 } }))], copy: wordsCopy, layers: { headline: { align: 'center' }, ...(copy.body ? { body: { align: 'center' } } : {}), ...(copy.badge ? { badge: { align: 'center' } } : {}) } };
		case 'headline':
		case 'subtext':
		case 'announcement':
			return { theme: template === 'headline' ? 'blue' : 'paper', blocks: [logo, ...words(tall ? 3 : 2).map((b) => ({ ...b, at: { ...b.at, cols: 12 } })), ...(template === 'announcement' ? [] : [{ id: 'divider', type: 'divider', at: at(0, 11, 12, 1) }])], copy: wordsCopy };
		case 'window':
		case 'screenshot':
			return { theme: template === 'window' ? 'paper' : 'blue', blocks: [logo, ...(tall ? words(2) : words(3).map((b) => ({ ...b, at: { ...b.at, cols: 6 } }))), { id: 'picture', type: 'picture', at: tall ? at(0, 7, 12, 5) : at(6, 0, 6, 12) }], copy: { ...wordsCopy, ...c('picture', 'label', copy['window-bar']) } };
		case 'quote':
			return { theme: 'paper', blocks: [logo, { id: 'quote', type: 'quote', at: tall ? at(0, 3, 12, 6) : at(0, 2, 12, 9) }], copy: { ...c('quote', 'text', copy.quote), ...c('quote', 'attribution', copy.by), ...c('quote', 'label', copy['window-bar']) } };
		case 'cards': {
			const cards = blocksOf(copy.cards).slice(0, 4);
			return { theme: 'blue', blocks: [...(copy.headline ? [{ id: 'headline', type: 'headline', at: at(0, 0, 12, 2) }] : []), ...cards.map((_, i) => ({ id: `card-${i + 1}`, type: 'card', at: tall ? at(0, 2 + i * 2, 12, 2) : at((i % 2) * 6, 2 + Math.floor(i / 2) * 4, 6, 4) })), { id: 'logo', type: 'logo', at: at(0, 11, 3, 1) }], copy: { ...c('headline', 'text', copy.headline), ...Object.assign({}, ...cards.map(([h, ...rest], i) => ({ ...c(`card-${i + 1}`, 'heading', h), ...c(`card-${i + 1}`, 'text', rest.join(' ')), [`card-${i + 1}.number`]: String(i + 1) }))) } };
		}
		case 'stat':
			return { theme: 'blue', blocks: [logo, ...(copy.badge ? [{ id: 'badge', type: 'badge', at: at(0, 2, 6, 1) }] : []), { id: 'stat', type: 'stat', at: at(0, 3, 12, copy.body ? 6 : 7) }, ...(copy.body ? [{ id: 'body', type: 'body', at: at(0, 9, 12, 2) }] : [])], copy: { ...c('badge', 'text', copy.badge), ...c('stat', 'value', copy.stat), ...c('stat', 'label', copy.headline), ...c('body', 'text', copy.body) } };
		case 'chart':
			return { theme: 'paper', blocks: [logo, ...topWords, { id: 'chart', type: 'chart', at: at(0, below, 12, 12 - below) }], copy: { ...topCopy, ...c('chart', 'data', copy.data) } };
		case 'pricing':
		case 'compare':
		case 'flow': {
			const list = blocksOf(copy.plans ?? copy.columns ?? copy.steps);
			const n = Math.max(1, list.length);
			const rows = 12 - below;
			return { theme: template === 'flow' ? 'blue' : 'paper', blocks: [logo, ...topWords, ...list.map((_, i) => ({ id: `card-${i + 1}`, type: 'card', at: tall ? at(0, below + i * Math.floor(rows / n), 12, Math.floor(rows / n)) : at(i * Math.floor(12 / n), below, Math.floor(12 / n), rows) }))], copy: { ...topCopy, ...Object.assign({}, ...list.map(([h, ...rest], i) => ({ ...c(`card-${i + 1}`, 'heading', h), ...c(`card-${i + 1}`, 'text', rest.join(' ')), ...(template === 'flow' ? { [`card-${i + 1}.number`]: String(i + 1) } : {}) }))) } };
		}
		case 'before-after':
			return { theme: 'paper', blocks: [logo, ...topWords, { id: 'picture', type: 'picture', at: tall ? at(0, below, 12, Math.floor((12 - below) / 2)) : at(0, below, 6, 12 - below) }, { id: 'picture-2', type: 'picture', at: tall ? at(0, below + Math.floor((12 - below) / 2), 12, 12 - below - Math.floor((12 - below) / 2)) : at(6, below, 6, 12 - below) }], copy: { ...topCopy, ...c('picture', 'label', copy.left), ...c('picture-2', 'label', copy.right) } };
		case 'logo':
			return { theme: 'blue', blocks: [{ id: 'logo', type: 'logo', at: at(2, 5, 8, 2) }], copy: {}, layers: { logo: { align: 'center' } } };
		default:
			return undefined;
	}
}
