import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { brand, cli } from '../lib/brand.js';
import { emit } from '../lib/output.js';
import { assertImageInput, catalog, parseExports, parseSizes, resolveFields, safeName, SIZES, templateSizes, type ImageJob } from '../image/catalog.js';
import { showPath, writeImages } from '../image/render.js';

function siteHost() {
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

export type ImageRenderOpts = {
	template?: unknown;
	headline?: unknown;
	subtext?: unknown;
	eyebrow?: unknown;
	quote?: unknown;
	by?: unknown;
	image?: unknown;
	window?: unknown;
	footer?: unknown;
	ground?: unknown;
	noFooter?: boolean;
	size?: string;
	sizes?: unknown;
	button?: unknown;
	band?: unknown;
	scan?: unknown;
	logo?: unknown;
	windowBody?: unknown;
	picture?: unknown;
	toon?: unknown;
	stickers?: unknown;
	subjects?: unknown;
	seed?: unknown;
	count?: unknown;
	cards?: unknown;
	out?: string;
	name?: string;
	export?: string;
	input?: string;
	dryRun?: boolean;
	json?: boolean;
};

function asText(value: unknown): string | undefined {
	if (Array.isArray(value)) return value.map(String).join(',');
	if (typeof value === 'string' && value.trim()) return value;
	return undefined;
}

// Fields a flag and the JSON file share. Booleans that default on (scan, logo) arrive from --no-scan and --no-logo as false.
const SHARED = ['template', 'headline', 'subtext', 'eyebrow', 'quote', 'by', 'image', 'window', 'ground', 'button', 'band', 'windowBody', 'picture', 'stickers', 'subjects', 'seed', 'count', 'cards'] as const;

function jobsFrom(opts: ImageRenderOpts): ImageJob[] {
	const file = assertImageInput(readInput(opts.input), 'image file');
	const pick = (flag: unknown, fromFile: unknown) => (flag !== undefined && flag !== '' ? flag : fromFile);
	// `--no-footer` arrives as footer:false. An empty flag falls through to the file.
	const noFooter = opts.footer === false || Boolean(opts.noFooter || file.noFooter);
	const merged: Record<string, unknown> = {};
	for (const key of SHARED) merged[key] = pick(opts[key], file[key]);
	merged.footer = noFooter ? undefined : pick(opts.footer, file.footer);
	merged.noFooter = noFooter ? true : undefined;
	merged.scan = opts.scan === false ? false : file.scan;
	merged.logo = opts.logo === false ? false : file.logo;
	merged.toon = opts.toon === true ? true : file.toon;
	merged.size = pick(opts.size, file.size);
	merged.sizes = file.sizes;
	const checked = assertImageInput(Object.fromEntries(Object.entries(merged).filter(([, value]) => value !== undefined)), 'image');
	const fields = resolveFields(checked, { footer: siteHost() });
	if (fields.image) fields.image = resolve(String(fields.image));
	const requested = asText(opts.size) ?? asText(file.sizes) ?? asText(file.size);
	const allowed = templateSizes(fields.template);
	const sizes = parseSizes(requested).filter((size) => {
		if (allowed.includes(size)) return true;
		if (requested === 'all') return false;
		throw new Error(`The ${fields.template} template is not drawn at ${size}. Use ${allowed.join(', ')}.`);
	});
	return sizes.map((size) => ({ ...fields, size, width: SIZES[size]!.width, height: SIZES[size]!.height }));
}

export function imageList(opts: { json?: boolean }) {
	const data = catalog();
	emit(opts, data, () => {
		const sizes = data.sizes.map((size) => `  ${size.id.padEnd(12)} ${size.width} by ${size.height}  ${size.use}`);
		const templates = data.templates.map((template) => `  ${template.id.padEnd(14)} needs ${template.needs.join(', ')}. ${template.summary}`);
		return [`Sizes`, ...sizes, '', `Templates`, ...templates, '', `Subjects (toon objects): ${data.subjects.join(', ')}`, `Sticker modes: ${data.stickerModes.join(', ')}. Grounds: ${data.grounds.join(', ')}.`, '', `Exports: png and svg. Default size is og. Default export is both.`, data.type.note, '', `${cli()} image render --template hero --headline "..." --json`].join('\n');
	});
}

export async function imageRender(opts: ImageRenderOpts) {
	const jobs = jobsFrom(opts);
	const formats = parseExports(opts.export);
	const name = safeName(opts.name ?? jobs[0].template);
	const out = opts.out ?? 'images';
	const planned = jobs.flatMap((job) => formats.map((format) => ({ path: showPath(resolve(out, `${name}-${job.size}.${format}`)), format, size: job.size, width: job.width, height: job.height, template: job.template })));
	if (opts.dryRun) {
		emit(opts, { ok: true, dryRun: true, template: jobs[0].template, files: planned }, () => [`Would write ${planned.length} file${planned.length === 1 ? '' : 's'}.`, ...planned.map((file) => `  ${file.path}  ${file.width} by ${file.height}`)].join('\n'));
		return;
	}
	const written = await writeImages(jobs, { out, name, formats });
	const files = written.map((file) => ({ ...file, path: showPath(file.path), sha256: createHash('sha256').update(readFileSync(file.path)).digest('hex') }));
	emit(opts, { ok: true, dryRun: false, template: jobs[0].template, files }, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'}.`, ...files.map((file) => `  ${file.path}  ${file.width} by ${file.height}`)].join('\n'));
}
