import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Command } from 'commander';
import { parseImageFormats, type ImageFormat } from '../assets/encode.js';
import { ALIASES, assertImageInput, canonical, catalog, chooseSizes, IMAGE_FIELDS, resolveFields, safeName, TEMPLATES, type ImageJob, type RawImageInput, type TemplateId } from '../image/catalog.js';
import { buildScene } from '../image/compose.js';
import { planOut, showPath, stemFor, writeImages } from '../image/render.js';
import { layoutOf } from '../image/scene.js';
import { brand, cli } from '../lib/brand.js';
import { emit } from '../lib/output.js';

// `image <template>`: stills from copy at any of the platform sizes. `image render` and `image list` are the older names.

export function siteHost() {
	const site = brand().site;
	if (!site) return '';
	try {
		return new URL(site).host.replace(/^www\./, '');
	} catch {
		return '';
	}
}

function readInput(file: string | undefined): unknown {
	if (!file) return {};
	let text = '';
	try {
		text = file === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(file), 'utf8');
	} catch {
		throw new Error(`Could not read ${file}.`);
	}
	try {
		return JSON.parse(text) as unknown;
	} catch (error) {
		if (error instanceof SyntaxError) throw new Error('Image input is not valid JSON.');
		throw error;
	}
}

export type ImageRenderOpts = Record<string, unknown> & { out?: string; name?: string; export?: string; format?: string; input?: string; dryRun?: boolean; json?: boolean; scale?: unknown };

function asText(value: unknown): string | undefined {
	if (Array.isArray(value)) return value.map(String).join(',');
	if (typeof value === 'string' && value.trim()) return value;
	return undefined;
}

// Fields a flag and the JSON file share. Booleans that default on (scan, logo) arrive from --no-scan and --no-logo as false.
const SHARED = IMAGE_FIELDS.filter((f) => !['footer', 'noFooter', 'scan', 'logo', 'toon', 'mark', 'sample', 'size', 'sizes'].includes(f));

/** Flags over a JSON file over nothing, under one name each. */
export function mergeInput(opts: Record<string, unknown>, file: RawImageInput): RawImageInput {
	const pick = (flag: unknown, fromFile: unknown) => (flag !== undefined && flag !== '' ? flag : fromFile);
	const given = canonical(Object.fromEntries(Object.entries(opts).filter(([k, v]) => (k in ALIASES || (IMAGE_FIELDS as readonly string[]).includes(k)) && v !== undefined && v !== '')));
	const from = file as Record<string, unknown>;
	// `--no-footer` arrives as footer:false. An empty flag falls through to the file.
	const noFooter = given.footer === false || Boolean(opts.noFooter || file.noFooter);
	const merged: Record<string, unknown> = {};
	for (const key of SHARED) merged[key] = pick(given[key], from[key]);
	merged.footer = noFooter ? undefined : pick(given.footer, file.footer);
	merged.noFooter = noFooter ? true : undefined;
	for (const key of ['scan', 'logo']) merged[key] = given[key] === false ? false : from[key];
	for (const key of ['toon', 'mark', 'sample']) merged[key] = given[key] === true ? true : from[key];
	merged.size = asText(given.size) ?? asText(file.sizes) ?? asText(file.size);
	return assertImageInput(Object.fromEntries(Object.entries(merged).filter(([, value]) => value !== undefined)), 'image');
}

export function jobsFrom(opts: ImageRenderOpts): ImageJob[] {
	const checked = mergeInput(opts, assertImageInput(readInput(opts.input), 'image file'));
	const fields = resolveFields(checked, { footer: siteHost() });
	if (fields.image) fields.image = resolve(String(fields.image));
	if (fields.image2) fields.image2 = resolve(String(fields.image2));
	return chooseSizes(fields.template, checked.size, checked.width, checked.height).map(({ id, width, height }) => ({ ...fields, size: id, width, height }));
}

export function scaleOf(value: unknown): number {
	if (value === undefined || value === '') return 1;
	const n = Number(value);
	if (!Number.isFinite(n) || n < 0.25 || n > 4) throw new Error('--scale must be from 0.25 to 4.');
	return n;
}

export function imageList(opts: { json?: boolean }) {
	const data = catalog();
	emit(opts, data, () => {
		const sizes = data.sizes.map((size) => `  ${size.id.padEnd(18)} ${size.use}`);
		const templates = data.templates.map((template) => `  ${template.id.padEnd(14)} ${template.needs.length ? `needs ${template.needs.join(', ')}. ` : ''}${template.summary}`);
		return [`Sizes`, ...sizes, '', `Templates`, ...templates, '', `Subjects (toon objects): ${data.subjects.join(', ')}`, `Sticker modes: ${data.stickerModes.join(', ')}. Themes: ${data.themes.join(', ')}.`, '', data.copy, `Formats: ${data.formats.join(', ')}. Default size is og. Default formats are png and svg.`, data.type.note, '', `${cli()} image hero --headline "..." --json`, `${cli()} image carousel --input carousel.json --size square --json`].join('\n');
	});
}

type Out = { out: string; name: string; formats: ImageFormat[]; scale: number };

function outOf(opts: ImageRenderOpts, fallback: string): Out {
	const out = opts.out ?? 'images';
	const plan = planOut(out);
	const asked = opts.format ?? opts.export;
	const formats = parseImageFormats(asked, plan.format ? [plan.format] : ['png', 'svg']);
	if (plan.format && asked && (formats.length > 1 || formats[0] !== plan.format)) throw new Error(`--out ends in .${plan.format} and --format says ${formats.join(', ')}. Make them agree, or pass a folder.`);
	return { out, name: safeName(opts.name ?? fallback), formats, scale: scaleOf(opts.scale) };
}

async function write(opts: ImageRenderOpts, jobs: ImageJob[], o: Out, stems?: string[]) {
	const template = jobs[0]!.template;
	const plan = planOut(o.out);
	if (opts.dryRun) {
		const planned = jobs.flatMap((job, i) => o.formats.map((format) => ({ path: showPath(resolve(plan.dir, `${plan.stem ?? stems?.[i] ?? stemFor(o.name, job)}.${format}`)), format, size: job.size, width: job.width, height: job.height, template: job.template })));
		for (const job of jobs) buildScene(job);
		emit(opts, { ok: true, dryRun: true, template, files: planned }, () => [`Would write ${planned.length} file${planned.length === 1 ? '' : 's'}.`, ...planned.map((file) => `  ${file.path}  ${file.width} by ${file.height}`)].join('\n'));
		return;
	}
	const { files: written, warnings } = await writeImages(jobs, { ...o, stems });
	const files = written.map((file) => ({ ...file, path: showPath(file.path), sha256: createHash('sha256').update(readFileSync(file.path)).digest('hex') }));
	emit(opts, { ok: true, dryRun: false, template, files, warnings }, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'}.`, ...files.map((file) => `  ${file.path}  ${file.width} by ${file.height}`), ...warnings.map((w) => `Note: ${w}`)].join('\n'));
}

export async function imageRender(opts: ImageRenderOpts) {
	const jobs = jobsFrom(opts);
	await write(opts, jobs, outOf(opts, jobs[0]!.template));
}

export const CAROUSEL_SIZES = ['square', 'portrait', 'story'];

/** Several images of one set: shared fields, one size of headline, one arrangement per template, and numbers (1/5). */
export function carouselJobs(opts: ImageRenderOpts): { jobs: ImageJob[]; stems: (name: string) => string[] } {
	const raw = readInput(opts.input ?? undefined) as Record<string, unknown>;
	if (!opts.input) throw new Error('Pass --input carousel.json: { "slides": [ { "template", "headline", ... } ] } plus any fields every slide shares.');
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('A carousel file is a JSON object with a slides list.');
	const { slides, numbers, ...shared } = raw;
	if (!Array.isArray(slides) || slides.length < 2) throw new Error('A carousel needs a slides list with at least two slides.');
	if (slides.length > 20) throw new Error('Keep a carousel to 20 slides.');
	if (numbers !== undefined && typeof numbers !== 'boolean') throw new Error('numbers must be true or false.');
	const sharedIn = canonical(shared);
	const size = asText(opts.size) ?? asText(sharedIn.sizes) ?? asText(sharedIn.size) ?? 'square';
	delete sharedIn.size;
	delete sharedIn.sizes;
	const jobs: ImageJob[] = [];
	const perSlide = slides.map((slide, i) => {
		if (!slide || typeof slide !== 'object' || Array.isArray(slide)) throw new Error(`Slide ${i + 1} must be an object.`);
		const own = canonical(slide as Record<string, unknown>);
		for (const key of ['size', 'sizes', 'number', 'width', 'height']) if (key in own) throw new Error(`Slide ${i + 1}: ${key} is set for the whole carousel, not per slide.`);
		const template = String(own.template ?? sharedIn.template ?? '').trim().toLowerCase();
		const t = TEMPLATES[template as TemplateId];
		// A shared field a slide's template has no place for stays off that slide; a field the slide itself names is checked.
		const takes = t ? new Set<string>(['template', 'footer', 'noFooter', 'theme', ...t.needs, ...t.optional]) : undefined;
		const base = Object.fromEntries(Object.entries(sharedIn).filter(([k]) => !takes || takes.has(k)));
		const given = mergeInput({ theme: opts.theme ?? opts.ground }, assertImageInput({ ...base, ...own, ...(numbers === false || (t && !(t.optional as readonly string[]).includes('number')) ? {} : { number: `${i + 1}/${slides.length}` }) }, `slide ${i + 1}`));
		try {
			const fields = resolveFields(given, { footer: siteHost() });
			if (fields.image) fields.image = resolve(fields.image);
			if (fields.image2) fields.image2 = resolve(fields.image2);
			return fields;
		} catch (error) {
			throw new Error(`Slide ${i + 1}: ${(error as Error).message}`);
		}
	});
	const index: number[] = [];
	for (const { id, width, height } of chooseSizes(perSlide[0]!.template, size, opts.width, opts.height)) {
		if (id !== 'custom' && !/^\d+x\d+$/.test(id) && !CAROUSEL_SIZES.includes(id)) throw new Error(`A carousel is ${CAROUSEL_SIZES.join(', ')} (or a custom size), not ${id}.`);
		const set: ImageJob[] = perSlide.map((fields, i) => {
			chooseSizes(fields.template, id === 'custom' ? `${width}x${height}` : id);
			index.push(i);
			return { ...fields, size: id, width, height };
		});
		// The smallest headline the set needs, per template, is the size every slide of that template uses.
		const fitted = new Map<string, number>();
		set.forEach((job, i) => {
			try {
				const S = layoutOf(buildScene(job)).words?.m.S;
				if (S) fitted.set(job.template, Math.min(fitted.get(job.template) ?? Infinity, S));
			} catch (error) {
				throw new Error(`Slide ${i + 1}: ${(error as Error).message}`);
			}
		});
		jobs.push(...set.map((job) => ({ ...job, headlineSize: fitted.get(job.template) })));
	}
	const pad = (n: number) => String(n).padStart(2, '0');
	return { jobs, stems: (name) => jobs.map((job, j) => `${stemFor(name, job)}-${pad(index[j]! + 1)}`) };
}

export async function imageCarousel(opts: ImageRenderOpts) {
	const { jobs, stems } = carouselJobs(opts);
	const o = outOf(opts, 'carousel');
	await write(opts, jobs, o, stems(o.name));
}

const SIZE_HELP = 'og, square, portrait, story, landscape, x-banner, linkedin, linkedin-banner, linkedin-page, youtube, youtube-thumbnail, email, avatar, custom, 1600x400, or all (comma-separated)';

/** The flags `image` and `image render` share. */
function imageOptions(cmd: Command): Command {
	return cmd
		.option('-t, --template <id>', 'the template, when it is not the first word')
		.option('-s, --size <sizes>', SIZE_HELP)
		.option('--width <px>', 'custom size: the width')
		.option('--height <px>', 'custom size: the height')
		.option('--headline <text>', 'main line (the title on cards)')
		.option('--body <text>', 'supporting line (also --subtext)')
		.option('--badge <text>', 'short label above the headline (also --eyebrow)')
		.option('--subtext <text>', 'the same as --body')
		.option('--eyebrow <text>', 'the same as --badge')
		.option('--button <text>', 'a key under the words')
		.option('--quote <text>', 'quote text, for the quote template')
		.option('--by <text>', 'who said the quote')
		.option('--cards <text>', 'cards: blank-line-separated cards, heading on the first line')
		.option('--image <file>', 'PNG or JPEG: the screenshot or window picture, or the hero object')
		.option('--toon', 'make --image a toon object (cut out, plastic, lit, with thickness)')
		.option('--picture <subject>', 'window and screenshot: the toon object in the window, or none')
		.option('--window <name>', 'window bar label, such as issuing.product')
		.option('--window-body <body>', 'window: blue, sky or white')
		.option('--stickers <mode>', 'preset, under, scatter or none')
		.option('--subjects <names>', 'toon objects to use, comma-separated')
		.option('--seed <n>', 'scatter: the arrangement (same seed, same picture)')
		.option('--count <n>', 'scatter: how many objects, 1 to 14')
		.option('--theme <theme>', 'blue, paper, white or ink (also --ground)')
		.option('--ground <ground>', 'the same as --theme')
		.option('--band <ground>', 'stepped band at the bottom toward a ground, or none')
		.option('--mark', 'logo: the mark alone instead of the lockup')
		.option('--no-scan', 'leave the scanlines off the blue ground')
		.option('--no-logo', 'leave the lockup off')
		.option('--footer <text>', 'small line; default is the brand site host')
		.option('--no-footer', 'leave the footer line off')
		.option('--number <text>', 'a small number, such as 2/5')
		.option('--stat <text>', 'stat: the number, such as 40%')
		.option('--data <points>', 'chart: "Jan: 120, Feb: 180, Mar: 260"')
		.option('--chart <kind>', 'chart: bar, line or donut')
		.option('--plans <text>', 'pricing: plans, blank line between, each its name, price, then features')
		.option('--columns <text>', 'compare: two columns, blank line between, each its title then points')
		.option('--steps <text>', 'flow: steps, blank line between, each its title then a line')
		.option('--image2 <file>', 'before-after: the second picture')
		.option('--picture2 <subject>', 'before-after: a toon object as the second picture')
		.option('--left <text>', 'before-after: the first window\'s label')
		.option('--right <text>', 'before-after: the second window\'s label')
		.option('--sample', 'fill the copy you leave out with sample copy')
		.option('-o, --out <path>', 'directory to write (default images), or one file such as banner.png')
		.option('-n, --name <name>', 'file name prefix; default is the template')
		.option('--format <formats>', 'png, svg, jpg, webp, comma-separated (default png,svg)')
		.option('--export <formats>', 'the same as --format')
		.option('--scale <n>', 'multiply the pixels of png, jpg and webp (0.25 to 4)')
		.option('-i, --input <file>', 'JSON object of the same fields; flags override it; - reads stdin')
		.option('--dry-run', 'check everything, list the files and write nothing')
		.option('--json', 'JSON output');
}

export function registerImage(program: Command) {
	const image = imageOptions(program.command('image [template]').description('On-brand link previews, social posts, banners and profile pictures from your copy')).option('--list', 'list sizes, templates and the fields each template takes');
	image.addHelpText('after', '\nExamples:\n  image hero --headline "Let agents buy anything online" --size all\n  image hero --headline "..." --size x-banner --out banner.png\n  image window --badge Issuing --headline "..." --picture card\n  image cards --input cards.json --size landscape\n  image hero --headline "..." --seed 4\n  image hero --headline "..." --image ./photo.jpg --toon\n  image screenshot --image ./screen.png --headline "..."\n  image logo --size avatar\n  image carousel --input carousel.json --size portrait\n');
	image.action((template: string | undefined, _o: unknown, cmd: Command) => {
		const opts = cmd.optsWithGlobals() as ImageRenderOpts;
		if (opts.list) return imageList(opts as { json?: boolean });
		if (!template && !opts.template && !opts.input) return cmd.help();
		if (template && opts.template && template !== opts.template) throw new Error(`The template is named twice: ${template} and --template ${String(opts.template)}. Pass one.`);
		return imageRender({ ...opts, ...(template ? { template } : {}) });
	});
	image.command('list').description('List sizes, templates and the fields each template takes').option('--json', 'JSON output').action((_o: unknown, cmd: Command) => imageList(cmd.optsWithGlobals()));
	imageOptions(image.command('render').description('The same as image <template>, with --template')).action((_o: unknown, cmd: Command) => imageRender(cmd.optsWithGlobals() as ImageRenderOpts));
	imageOptions(image.command('carousel').description('A numbered set of square, portrait or story images from one JSON file')).action((_o: unknown, cmd: Command) => imageCarousel(cmd.optsWithGlobals() as ImageRenderOpts));
}
