import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { encodePng } from '../../src/assets/png.js';
import { adapter, paint } from '../../src/design/adapter.js';
import { resolveFields, type TemplateId } from '../../src/image/catalog.js';
import { renderJob } from '../../src/image/layout.js';
import { rasterize } from '../../src/image/render.js';
import { siteHost } from '../../src/commands/image.js';
import { drawSlide, checkSlide } from '../../src/deck/slides.js';
import { buildIllustration, illustrationSvg } from '../../src/illustrate/render.js';
import { merchConfig, merchSvgs } from '../../src/merch/render.js';
import { designConformance } from './conformance.js';

const dir = mkdtempSync(join(tmpdir(), 'design-pic-'));
const picture = join(dir, 'screen shot.png');
writeFileSync(picture, encodePng({ width: 640, height: 400, data: new Uint8ClampedArray(640 * 400 * 4).fill(210) }));

const CARDS = 'Save it once\nYour user adds their card a single time.\n\nEvery purchase is approved\nWith a passkey, tied to that exact cart.';
const copy = (long: boolean) => (t: { id: string; copy: { id: string }[] }) =>
	Object.fromEntries(
		t.copy
			.filter((c) => c.id !== 'footer' && c.id !== 'url')
			.map((c) => [c.id, c.id === 'data' ? 'Jan: 120, Feb: 180, Mar: 260' : c.id === 'plans' ? 'Starter\n$0\nOne agent\n\nPro\n$49\nTen agents' : c.id === 'columns' ? 'Before\nThe number in the chat\n\nAfter\nThe agent never sees it' : c.id === 'steps' ? 'Save it once\nStored encrypted.\n\nYou approve\nWith a passkey.' : c.id === 'left' ? 'Before' : c.id === 'right' ? 'After' : c.id === 'cards' || c.id === 'items' ? CARDS : c.id === 'stat' ? '42%' : c.id === 'number' ? '01' : c.id === 'badge' ? 'New' : c.id === 'button' ? 'Start free' : c.id === 'by' ? 'Head of product, Acme' : c.id === 'window-bar' ? 'acme.app' : c.id === 'body' ? (long ? 'A second line that says a little more about it' : 'One line about it') : long ? 'Everything your agents need to search, buy and reply in one place' : 'Ship your next idea today']),
	);

designConformance(adapter(), {
	paint,
	picture,
	timeout: 600_000,
	// Print files are tens of millions of pixels: one small one stands for the rest in the byte checks.
	skip: (t) => t.kind === 'merch' && t.id !== 'merch-sticker',
	short: copy(false),
	long: copy(true),
	async plain(doc) {
		const { id, ...size } = doc.size;
		if (doc.kind === 'image') {
			const { 'window-bar': window, ...rest } = doc.copy;
			const pic = doc.images.picture;
			const raw = { template: doc.template, ...rest, ...(window ? { window } : {}), ...(pic ? (pic.startsWith('object:') ? { picture: pic.slice(7) } : { image: pic }) : {}) };
			const fields = resolveFields(raw as never, { footer: siteHost() });
			return rasterize(renderJob({ ...fields, template: doc.template as TemplateId, size: id, ...size }).svg, size.width);
		}
		if (doc.kind === 'slide') {
			const { 'window-bar': window, ...rest } = doc.copy;
			const slide = checkSlide({ type: doc.template.slice(6), ...rest, ...(window ? { window } : {}) }, 0);
			return rasterize(drawSlide(slide, 0).svg, size.width);
		}
		if (doc.kind === 'merch') {
			const item = merchConfig().items.find((i) => `merch-${i.id}` === doc.template)!;
			return rasterize(merchSvgs(item, item.variants[0]!, { copy: doc.copy }).raster, size.width);
		}
		if (doc.template === 'illustration-single') return rasterize(illustrationSvg(buildIllustration({ subjects: ['cart'], toon: true, composition: 'single' })), size.width);
		return undefined;
	},
});
