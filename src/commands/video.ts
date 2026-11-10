import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { brand } from '../lib/brand.js';
import { emit } from '../lib/output.js';
import { showPath } from '../image/render.js';
import { assertVideoInput, parseVideoSizes, resolveVideo, videoCatalog, videoName, VIDEO_FPS, VIDEO_FRAMES, type VideoJob, VIDEO_SIZES } from '../video/catalog.js';
import { writeVideos } from '../video/render.js';

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
	} catch {
		throw new Error('Video input is not valid JSON.');
	}
}

function asText(value: unknown): string | undefined {
	if (typeof value === 'string' && value.trim()) return value;
	return undefined;
}

export type VideoRenderOpts = {
	template?: unknown;
	headline?: unknown;
	subtext?: unknown;
	eyebrow?: unknown;
	window?: unknown;
	footer?: unknown;
	noFooter?: boolean;
	size?: string;
	out?: string;
	name?: string;
	export?: string;
	input?: string;
	dryRun?: boolean;
	json?: boolean;
};

function jobsFrom(opts: VideoRenderOpts): VideoJob[] {
	const file = assertVideoInput(readInput(opts.input), 'video file');
	const pick = (flag: unknown, fromFile: unknown) => (flag !== undefined && flag !== '' ? flag : fromFile);
	const noFooter = opts.footer === false || Boolean(opts.noFooter || file.noFooter);
	const merged = assertVideoInput(
		{
			template: pick(opts.template, file.template),
			headline: pick(opts.headline, file.headline),
			subtext: pick(opts.subtext, file.subtext),
			eyebrow: pick(opts.eyebrow, file.eyebrow),
			window: pick(opts.window, file.window),
			footer: noFooter ? undefined : pick(opts.footer, file.footer),
			noFooter: noFooter || undefined,
			size: pick(opts.size, file.size),
			sizes: file.sizes,
		},
		'video',
	);
	if (opts.export && opts.export.split(',').some((item) => item.trim().toLowerCase() !== 'mp4')) throw new Error(`Unknown export "${opts.export}". Videos export mp4.`);
	const fields = resolveVideo(merged, { footer: siteHost() });
	const requested = asText(opts.size) ?? asText(merged.size) ?? asText(merged.sizes);
	return parseVideoSizes(requested).map((size) => ({ ...fields, size, width: VIDEO_SIZES[size].width, height: VIDEO_SIZES[size].height }));
}

export function videoList(opts: { json?: boolean }) {
	const data = videoCatalog();
	emit(opts, data, () => {
		const sizes = data.sizes.map((size) => `  ${size.id.padEnd(12)} ${size.width} by ${size.height}  ${size.use}`);
		const templates = data.templates.map((template) => `  ${template.id.padEnd(14)} needs ${template.needs.join(', ')}. ${template.summary}`);
		return [`Renderer: ${data.renderer.id}, ${data.renderer.frames} frames at ${data.renderer.fps} fps, ${data.renderer.codec} in ${data.renderer.container}.`, '', 'Sizes', ...sizes, '', 'Templates', ...templates, '', data.renderer.note].join('\n');
	});
}

export async function videoRender(opts: VideoRenderOpts) {
	const jobs = jobsFrom(opts);
	const name = videoName(opts.name ?? jobs[0].template);
	const out = opts.out ?? 'videos';
	const planned = jobs.map((job) => ({ path: showPath(resolve(out, `${name}-${job.size}.mp4`)), format: 'mp4' as const, size: job.size, width: job.width, height: job.height, template: job.template, frames: VIDEO_FRAMES, fps: VIDEO_FPS }));
	if (opts.dryRun) {
		emit(opts, { ok: true, dryRun: true, template: jobs[0].template, files: planned }, () => [`Would write ${planned.length} file${planned.length === 1 ? '' : 's'}.`, ...planned.map((file) => `  ${file.path}  ${file.width} by ${file.height}`)].join('\n'));
		return;
	}
	const written = await writeVideos(jobs, { out: resolve(out), name });
	const files = written.map((file) => ({ path: showPath(file.path), format: 'mp4' as const, size: file.job.size, width: file.job.width, height: file.job.height, template: file.job.template, frames: VIDEO_FRAMES, fps: VIDEO_FPS, bytes: file.bytes, sha256: file.sha256 }));
	emit(opts, { ok: true, dryRun: false, template: jobs[0].template, files }, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'}.`, ...files.map((file) => `  ${file.path}  ${file.width} by ${file.height}  ${file.sha256.slice(0, 12)}`)].join('\n'));
}
