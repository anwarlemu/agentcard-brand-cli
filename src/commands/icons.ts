import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Command } from 'commander';
import { icoOf } from '../assets/ico.js';
import { prepare, show, writeAll, type Prepared } from '../assets/io.js';
import { document, drawLogo, logoBox, rect, tokenColor } from '../image/paint.js';
import { brand, cli } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';
import { pkgPath } from '../lib/paths.js';

// `icons`: the favicon and app icon set made from the brand's mark, and the icon set the library's components use
// (brand/icons, with its licence), as SVG and PNG in a brand color.

type Flags = Record<string, string | boolean | undefined>;
type IconSet = { source: string; licence: string; icons: { id: string; component: string }[] };

const iconSet = (): IconSet => JSON.parse(readFileSync(pkgPath('brand', 'icons', 'icons.json'), 'utf8')) as IconSet;
const COLORS = ['brand', 'ink', 'white', 'current'] as const;

/** The mark centered in a square, taking `share` of it, on a ground or clear. */
function markSvg(size: number, share: number, fill: string, ground?: string, radius = 0) {
	const box = logoBox('mark');
	const w = size * share;
	const h = (w * box.height) / box.width;
	const body = `${ground ? rect(0, 0, size, size, ground, radius) : ''}${drawLogo('mark', (size - w) / 2, (size - h) / 2, h, fill)}`;
	return document(size, size, `${brand().name} icon`, body);
}

export function iconsCatalog() {
	const set = iconSet();
	return {
		favicon: ['favicon.ico (16, 32, 48)', 'favicon.svg (blue, white in dark mode)', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png (180)', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'site.webmanifest'],
		note: 'The favicon is the brand\'s own (the blue mark, white in dark mode). App icons put the white mark on the blue ground, because iOS and Android need an opaque square; the maskable icon keeps the mark inside the middle 80 percent.',
		set: { source: set.source, licence: set.licence, count: set.icons.length, icons: set.icons.map((i) => i.id) },
		colors: [...COLORS],
	};
}

async function favicons(dir: string): Promise<Prepared[]> {
	const blue = tokenColor('brand');
	const white = tokenColor('white');
	const out: Prepared[] = [];
	const add = async (stem: string, svg: string, size: number) => out.push(...(await prepare(dir, stem, svg, size, size, ['png'])));
	const small = (n: number) => markSvg(n, 0.92, blue);
	for (const n of [16, 32]) await add(`favicon-${n}`, small(n), n);
	await add('apple-touch-icon', markSvg(180, 0.62, white, blue), 180);
	await add('icon-192', markSvg(192, 0.62, white, blue), 192);
	await add('icon-512', markSvg(512, 0.62, white, blue), 512);
	await add('icon-maskable-512', markSvg(512, 0.5, white, blue), 512);
	const ico = await Promise.all([16, 32, 48].map(async (n) => ({ size: n, data: (await prepare(dir, 'x', small(n), n, n, ['png']))[0]!.data })));
	out.push({ path: join(dir, 'favicon.ico'), format: 'ico', width: 48, height: 48, data: icoOf(ico) });
	const box = logoBox('mark');
	const svg = markSvg(box.width, 1, blue).replace(`fill="${blue}"`, `fill="${blue}"`).replace('<title>', `<style>path{fill:${blue}}@media (prefers-color-scheme: dark){path{fill:${white}}}</style><title>`);
	out.push({ path: join(dir, 'favicon.svg'), format: 'svg', width: box.width, height: box.width, data: Buffer.from(svg) });
	const manifest = { name: brand().name, icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }], theme_color: blue, background_color: blue, display: 'standalone' };
	out.push({ path: join(dir, 'site.webmanifest'), format: 'json', width: 0, height: 0, data: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`) });
	return out;
}

export async function icons(what: string | undefined, names: string[], flags: Flags) {
	if (flags.list || !what) {
		const data = iconsCatalog();
		emit({ json: !!flags.json }, data, () => [`icons favicon: ${data.favicon.join(', ')}`, data.note, '', `icons set: ${data.set.count} icons the components use (${data.set.source}, ${data.set.licence} licence)`, `  ${data.set.icons.join(', ')}`, '', `${cli()} icons favicon -o public`, `${cli()} icons set credit-card shopping-cart --color brand --format svg,png`].join('\n'));
		return;
	}
	const dir = resolve(typeof flags.out === 'string' ? flags.out : 'icons');
	let prepared: Prepared[];
	if (what === 'favicon') prepared = await favicons(dir);
	else if (what === 'set') {
		const set = iconSet();
		const pool = set.icons.map((i) => i.id);
		const pick = names.length ? names : pool;
		for (const n of pick) if (!pool.includes(n)) throw unknownName('icon', n, pool);
		const color = String(flags.color ?? 'brand');
		if (!(COLORS as readonly string[]).includes(color)) throw unknownName('color', color, [...COLORS]);
		const stroke = color === 'current' ? 'currentColor' : tokenColor(color);
		const size = Number(flags.size ?? 24);
		if (!Number.isInteger(size) || size < 12 || size > 512) throw new Error('--size takes 12 to 512 pixels.');
		const formats = String(flags.format ?? 'svg').split(',').map((f) => f.trim());
		for (const f of formats) if (f !== 'svg' && f !== 'png') throw unknownName('format', f, ['svg', 'png']);
		if (color === 'current' && formats.includes('png')) throw new Error('A PNG needs a color: --color brand, ink or white.');
		prepared = [];
		for (const n of pick) {
			const svg = readFileSync(pkgPath('brand', 'icons', `${n}.svg`), 'utf8').replace('stroke="currentColor"', `stroke="${stroke}"`).replace('width="24" height="24"', `width="${size}" height="${size}"`);
			if (formats.includes('svg')) prepared.push({ path: join(dir, `${n}.svg`), format: 'svg', width: size, height: size, data: Buffer.from(svg) });
			if (formats.includes('png')) prepared.push(...(await prepare(dir, n, svg, size, size, ['png'])));
		}
	} else throw unknownName('icons command', what, ['favicon', 'set']);
	const files = writeAll(prepared);
	emit({ json: !!flags.json }, { ok: true, files: files.map((f) => ({ ...f, path: show(f.path) })) }, () => [`Wrote ${files.length} files.`, ...files.map((f) => `  ${show(f.path)}`)].join('\n'));
}

export function registerIcons(program: Command) {
	program
		.command('icons [what] [names...]')
		.description('The favicon and app icon set from the brand mark (icons favicon), and the icons the components use (icons set)')
		.option('--color <color>', 'icons set: brand, ink, white or current (default brand)')
		.option('--size <px>', 'icons set: the size, 12 to 512 (default 24)')
		.option('--format <formats>', 'icons set: svg, png, or svg,png (default svg)')
		.option('-o, --out <dir>', 'directory to write (default ./icons)')
		.option('--list', 'list what it makes')
		.option('--json', 'JSON output')
		.action((what: string | undefined, names: string[], _o: unknown, cmd: Command) => icons(what, names ?? [], cmd.optsWithGlobals() as Flags));
}
