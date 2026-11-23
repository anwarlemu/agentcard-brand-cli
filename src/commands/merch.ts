import { resolve, join } from 'node:path';
import type { Command } from 'commander';
import { parseFormats, prepare, show, writeAll, type Prepared } from '../assets/io.js';
import { imagesToPdf, pdfPage } from '../assets/pdf.js';
import { rasterizeRgba } from '../image/render.js';
import { checkItem, merchConfig, merchSlots, merchSvgs } from '../merch/render.js';
import { cli } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';
import { withDpi } from '../assets/png-dpi.js';

// `merch`: print files at real size with bleed and safe area (SVG in inches, PNG at the print resolution), a proof with
// the guides, and a sticker's cut line. Sizes are vendor conventions, and the output says so.

type Flags = Record<string, string | boolean | undefined>;

export function merchCatalog() {
	const cfg = merchConfig();
	return {
		dpi: cfg.dpi,
		note: cfg.$comment,
		logo: cfg.logo,
		variants: Object.entries(cfg.variants).map(([id, v]) => ({ id, ...v })),
		items: cfg.items.map((i) => ({ id: i.id, name: i.name, trim: { width: i.size[0], height: i.size[1] }, bleed: i.bleed, safe: i.safe, method: i.method, slots: merchSlots(i), variants: i.variants, cut: Boolean(i.cut), source: i.source })),
		slots: Object.keys(cfg.copy).concat('url'),
		formats: ['svg', 'png', 'pdf'],
		copy: 'Only the headline you pass is drawn; the brand address stays on the poster. --sample fills sample copy.',
	};
}

export async function merch(itemsArg: string[], flags: Flags) {
	const cfg = merchConfig();
	if (flags.list) {
		const data = merchCatalog();
		emit({ json: !!flags.json }, data, () => [
			`Merch print files at ${data.dpi} dpi. Sizes are common vendor conventions: confirm with the vendor's template.`,
			...data.items.map((i) => `  ${i.id.padEnd(13)} ${i.trim.width} by ${i.trim.height} in, bleed ${i.bleed}, safe ${i.safe}. ${i.method}. Variants: ${i.variants.join(', ')}`),
			'',
			'Variants',
			...data.variants.map((v) => `  ${v.id.padEnd(9)} ${v.about}`),
			'',
			`${cli()} merch tee-front --variant all`,
		].join('\n'));
		return;
	}
	const ids = cfg.items.map((i) => i.id);
	const items = (itemsArg.length && itemsArg[0] !== 'all' ? itemsArg : ids).map((id) => {
		const hit = cfg.items.find((i) => i.id === id);
		if (!hit) throw unknownName('merch item', id, ids);
		return hit;
	});
	const pickFlag = flags.variant ?? flags.theme;
	const variantFlag = typeof pickFlag === 'string' ? pickFlag : undefined;
	const formats = parseFormats(typeof flags.format === 'string' ? flags.format : undefined, ['svg', 'png'], ['svg', 'png', 'pdf']);
	const dir = resolve(typeof flags.out === 'string' ? flags.out : 'merch');
	const prepared: Prepared[] = [];
	const headline = typeof flags.headline === 'string' ? flags.headline : undefined;
	const url = typeof flags.url === 'string' ? flags.url : undefined;
	const everything = !itemsArg.length || itemsArg[0] === 'all';
	// With every item asked for, copy goes where it has a place; somewhere it must.
	for (const [key, v] of [['headline', headline], ['url', url]] as const) if (v && everything && !items.some((i) => merchSlots(i).includes(key))) throw new Error(`No item has a place for --${key}.`);
	const made: { item: string; variant: string; inches: { width: number; height: number }; px: { width: number; height: number } }[] = [];
	for (const item of items) {
		const errors = checkItem(item);
		if (errors.length) throw new Error(`The brand's merch layout breaks the logo rules: ${errors.join('; ')}`);
		const variants = !variantFlag ? [item.variants[0]!] : variantFlag === 'all' ? item.variants : variantFlag.split(',').map((v) => v.trim());
		for (const v of variants) {
			if (!item.variants.includes(v)) throw unknownName(`variant for ${item.id}`, v, item.variants);
			const takes = merchSlots(item);
			const svgs = merchSvgs(item, v, { headline: everything && !takes.includes('headline') ? undefined : headline, url: everything && !takes.includes('url') ? undefined : url, sample: Boolean(flags.sample) });
			const stem = `${item.id}-${v}`;
			if (formats.includes('svg')) prepared.push({ path: join(dir, `${stem}.svg`), format: 'svg', width: svgs.width, height: svgs.height, data: Buffer.from(svgs.print) });
			if (formats.includes('png')) {
				const [png] = await prepare(dir, stem, svgs.raster, svgs.width, svgs.height, ['png']);
				prepared.push({ ...png!, data: withDpi(png!.data, cfg.dpi) });
			}
			if (formats.includes('pdf')) {
				const r = await rasterizeRgba(svgs.raster, svgs.width);
				const b = item.bleed * 72;
				const page = { ...pdfPage(r.pixels, r.width, r.height, true), widthPt: svgs.inches.width * 72, ...(item.bleed ? { trim: { x: b, y: b, w: item.size[0] * 72, h: item.size[1] * 72 } } : {}) };
				prepared.push({ path: join(dir, `${stem}.pdf`), format: 'pdf', width: svgs.width, height: svgs.height, data: imagesToPdf([page], svgs.inches.width * 72) });
			}
			if (flags.proof !== false) {
				// The proof is for looking at: a tenth of the print resolution's size is enough.
				const [proof] = await prepare(dir, `${stem}-proof`, svgs.proof, svgs.width, svgs.height, ['png'], 0.2);
				prepared.push(proof!);
			}
			if (svgs.cut) prepared.push({ path: join(dir, `${stem}-cut.svg`), format: 'svg', width: svgs.width, height: svgs.height, data: Buffer.from(svgs.cut) });
			made.push({ item: item.id, variant: v, inches: svgs.inches, px: { width: svgs.width, height: svgs.height } });
		}
	}
	const files = writeAll(prepared);
	const doc = { ok: true, dpi: cfg.dpi, note: 'Sizes, bleed and safe areas are common print-vendor conventions, not brand rules. Confirm against the vendor template before ordering.', made, files: files.map((f) => ({ ...f, path: show(f.path) })) };
	emit({ json: !!flags.json }, doc, () => [`Wrote ${files.length} files for ${made.length} print file${made.length === 1 ? '' : 's'} at ${cfg.dpi} dpi.`, doc.note, ...doc.files.map((f) => `  ${f.path}`)].join('\n'));
}

export function registerMerch(program: Command) {
	program
		.command('merch [items...]')
		.description('Merch print files at real size with bleed and safe area: SVG, PNG at 300 dpi, a proof and cut lines')
		.option('--variant <names>', 'a variant, several comma-separated, or all (default: each item\'s first)')
		.option('--theme <names>', 'the same as --variant')
		.option('--headline <text>', 'the line on items that carry one (tee back, poster); left off when you pass none')
		.option('--url <text>', 'the address on the poster (default: the brand site host)')
		.option('--format <formats>', 'svg, png, pdf, comma-separated (default svg,png)')
		.option('--sample', 'fill the line you leave out with sample copy')
		.option('--no-proof', 'skip the proof with trim, bleed and safe guides')
		.option('-o, --out <dir>', 'directory to write (default ./merch)')
		.option('--list', 'list items, sizes and variants')
		.option('--json', 'JSON output')
		.action((items: string[], _o: unknown, cmd: Command) => merch(items ?? [], cmd.optsWithGlobals() as Flags));
}
