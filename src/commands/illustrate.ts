import { resolve } from 'node:path';
import type { Command } from 'commander';
import { parseFormats, prepare, show, writeAll } from '../assets/io.js';
import { SCENE_GROUNDS } from '../image/compose.js';
import { illustrateConfig, type SceneGround } from '../image/scene.js';
import { buildIllustration, COMPOSITIONS, illustrationSvg, type Composition, type IllGround } from '../illustrate/render.js';
import { cli } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';

// `illustrate`: the brand's toon objects, or any picture made into one, arranged on a ground. SVG (vector ground and
// band, the objects as placed art) and PNG. `--list` prints the subjects, compositions, sizes and grounds.

type Flags = Record<string, string | boolean | undefined>;

export function illustrateCatalog() {
	const cfg = illustrateConfig();
	return {
		subjects: Object.entries(cfg.subjects).map(([id, s]) => ({ id, label: s.label, source: s.source })),
		compositions: Object.entries(cfg.compositions).filter(([id]) => (COMPOSITIONS as readonly string[]).includes(id)).map(([id, about]) => ({ id, about })).concat([{ id: 'object', about: 'The object alone on a clear ground, cropped to its edges (a toon made from --image, or one subject).' }]),
		sizes: Object.entries(cfg.sizes).map(([id, s]) => ({ id, ...s })),
		grounds: cfg.grounds,
		formats: ['svg', 'png', 'jpg', 'webp'],
		rules: 'brand/illustration.md',
		source: cfg.source,
		note: 'The objects are rendered art (raster, with alpha), so the SVG carries them as embedded pictures over a vector ground; only the ground, scanlines and band are vector shapes.',
	};
}

function sizeOf(value: string | undefined) {
	if (!value) return {};
	const cfg = illustrateConfig();
	if (value in cfg.sizes) return { width: cfg.sizes[value]!.width, height: cfg.sizes[value]!.height };
	if (value === 'landscape') return { width: cfg.sizes.wide!.width, height: cfg.sizes.wide!.height };
	const m = /^(\d{2,4})x(\d{2,4})$/i.exec(value);
	if (!m) throw unknownName('size', value, [...Object.keys(cfg.sizes), 'WIDTHxHEIGHT']);
	const width = Number(m[1]);
	const height = Number(m[2]);
	if (width < 64 || height < 64 || width > 4000 || height > 4000) throw new Error('Width and height must be 64 to 4000 pixels.');
	return { width, height };
}

const int = (v: unknown, name: string) => {
	if (v === undefined) return undefined;
	const n = Number(v);
	if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error(`--${name} must be a whole number.`);
	return n;
};

export async function illustrate(subjects: string[], flags: Flags) {
	if (flags.list) {
		const data = illustrateCatalog();
		emit({ json: !!flags.json }, data, () => [
			'Subjects (the brand\'s toon objects)',
			...data.subjects.map((s) => `  ${s.id.padEnd(12)} ${s.label}`),
			'',
			'Compositions',
			...data.compositions.map((c) => `  ${c.id.padEnd(12)} ${c.about}`),
			'',
			`Sizes: ${data.sizes.map((s) => `${s.id} ${s.width}x${s.height}`).join(', ')}, or WIDTHxHEIGHT`,
			`Grounds: ${data.grounds.join(', ')}`,
			data.note,
			'',
			`${cli()} illustrate cart --ground blue`,
			`${cli()} illustrate --image photo.jpg --composition object`,
		].join('\n'));
		return;
	}
	const composition = flags.composition === undefined ? undefined : String(flags.composition);
	if (composition && !(COMPOSITIONS as readonly string[]).includes(composition)) throw unknownName('composition', composition, [...COMPOSITIONS]);
	if (flags.ground !== undefined && flags.theme !== undefined) throw new Error('--theme and --ground are the same. Pass one of them.');
	const groundFlag = flags.theme ?? flags.ground;
	const ground = groundFlag === undefined ? undefined : String(groundFlag);
	if (ground && !(illustrateConfig().grounds as string[]).includes(ground)) throw unknownName('theme', ground, illustrateConfig().grounds);
	const bandName = flags.band === undefined ? undefined : String(flags.band);
	if (bandName && ![...SCENE_GROUNDS, 'none'].includes(bandName)) throw unknownName('band', bandName, [...SCENE_GROUNDS, 'none']);
	const image = typeof flags.image === 'string' ? resolve(flags.image) : undefined;
	if (!subjects.length && !image && composition !== 'preset' && composition !== 'scatter' && composition !== undefined) throw new Error(`Name a subject (${Object.keys(illustrateConfig().subjects).join(', ')}) or pass --image.`);
	const ill = buildIllustration({
		subjects,
		image,
		toon: flags.toon !== false,
		composition: composition as Composition | undefined,
		...sizeOf(typeof flags.size === 'string' ? flags.size : undefined),
		ground: ground as IllGround | undefined,
		scan: flags.scan === false ? false : undefined,
		band: bandName as SceneGround | 'none' | undefined,
		seed: int(flags.seed, 'seed'),
		count: int(flags.count, 'count'),
		rotate: int(flags.rotate, 'rotate'),
	});
	const formats = parseFormats(typeof flags.format === 'string' ? flags.format : undefined);
	const name = typeof flags.name === 'string' ? flags.name : subjects.length ? subjects.join('-') : image ? 'toon' : 'illustration';
	const dir = resolve(typeof flags.out === 'string' ? flags.out : 'illustrations');
	const files = writeAll(await prepare(dir, name, illustrationSvg(ill), ill.width, ill.height, formats));
	const doc = { ok: true, width: ill.width, height: ill.height, ground: ill.ground, objects: ill.items.map((i) => i.art.name), files: files.map((f) => ({ ...f, path: show(f.path) })) };
	emit({ json: !!flags.json }, doc, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'} (${ill.width} by ${ill.height}, ${ill.items.length} object${ill.items.length === 1 ? '' : 's'}).`, ...doc.files.map((f) => `  ${f.path}`)].join('\n'));
}

export function registerIllustrate(program: Command) {
	program
		.command('illustrate [subjects...]')
		.description('Toon object illustrations: the brand\'s objects, or any picture made into one, on a ground (SVG and PNG)')
		.option('--image <file>', 'PNG or JPEG to make into a toon object')
		.option('--no-toon', 'use --image as it is, without the toon treatment')
		.option('--composition <name>', 'object, single, row, preset or scatter')
		.option('--size <size>', 'square, og, portrait, story, landscape (wide), or WIDTHxHEIGHT')
		.option('--theme <theme>', 'blue, paper, white, ink or none (clear); also --ground')
		.option('--ground <ground>', 'the same as --theme')
		.option('--band <ground>', 'stepped band at the bottom toward a ground, or none')
		.option('--no-scan', 'leave the scanlines off the blue ground')
		.option('--seed <n>', 'scatter: the arrangement')
		.option('--count <n>', 'scatter: how many objects')
		.option('--rotate <deg>', 'single and row: the tilt')
		.option('--format <formats>', 'svg, png, jpg, webp, comma-separated (default svg,png)')
		.option('-o, --out <dir>', 'directory to write (default ./illustrations)')
		.option('-n, --name <name>', 'file name')
		.option('--list', 'list subjects, compositions, sizes and grounds')
		.option('--json', 'JSON output')
		.action((subjects: string[], _o: unknown, cmd: Command) => illustrate(subjects ?? [], cmd.optsWithGlobals() as Flags));
}
