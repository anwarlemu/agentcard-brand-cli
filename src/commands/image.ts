import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { brand, cli } from '../lib/brand.js';
import { emit } from '../lib/output.js';
import { catalog, parseExports, parseSizes, resolveFields, safeName, SIZES, type ImageJob, type RawImageInput } from '../image/catalog.js';
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

function readInput(file: string | undefined): RawImageInput {
	if (!file) return {};
	let text = '';
	try {
		text = file === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(file), 'utf8');
	} catch {
		throw new Error(`Could not read ${file}.`);
	}
	try {
		const data = JSON.parse(text) as unknown;
		if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Image input must be a JSON object.');
		return data as RawImageInput;
	} catch (error) {
		if (error instanceof SyntaxError) throw new Error(`Image input is not valid JSON.`);
		throw error;
	}
}

export type ImageRenderOpts = RawImageInput & {
	size?: string;
	sizes?: unknown;
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

function jobsFrom(opts: ImageRenderOpts): ImageJob[] {
	const file = readInput(opts.input) as RawImageInput & { size?: unknown; sizes?: unknown };
	const pick = (flag: unknown, fromFile: unknown) => (flag !== undefined && flag !== '' ? flag : fromFile);
	// `--no-footer` arrives as footer:false. An empty flag falls through to the file.
	const noFooter = opts.footer === false || Boolean(opts.noFooter || file.noFooter);
	const fields = resolveFields(
		{
			template: pick(opts.template, file.template),
			headline: pick(opts.headline, file.headline),
			subtext: pick(opts.subtext, file.subtext),
			eyebrow: pick(opts.eyebrow, file.eyebrow),
			quote: pick(opts.quote, file.quote),
			by: pick(opts.by, file.by),
			image: pick(opts.image, file.image),
			window: pick(opts.window, file.window),
			footer: noFooter ? undefined : pick(opts.footer, file.footer),
			ground: pick(opts.ground, file.ground),
			noFooter,
		},
		{ footer: siteHost() },
	);
	if (fields.image) fields.image = resolve(String(fields.image));
	const requested = asText(opts.size) ?? asText(file.sizes) ?? asText(file.size);
	return parseSizes(requested).map((size) => ({ ...fields, size, width: SIZES[size].width, height: SIZES[size].height }));
}

export function imageList(opts: { json?: boolean }) {
	const data = catalog();
	emit(opts, data, () => {
		const sizes = data.sizes.map((size) => `  ${size.id.padEnd(12)} ${size.width} by ${size.height}  ${size.use}`);
		const templates = data.templates.map((template) => `  ${template.id.padEnd(14)} needs ${template.needs.join(', ')}. ${template.summary}`);
		return [`Sizes`, ...sizes, '', `Templates`, ...templates, '', `Exports: png and svg. Default size is og. Default export is both.`, data.type.note, '', `${cli()} image render --template headline --headline "..." --json`].join('\n');
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
	const files = written.map((file) => ({ ...file, path: showPath(file.path) }));
	emit(opts, { ok: true, dryRun: false, template: jobs[0].template, files }, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'}.`, ...files.map((file) => `  ${file.path}  ${file.width} by ${file.height}`)].join('\n'));
}
