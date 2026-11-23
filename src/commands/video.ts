import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import type { Command } from 'commander';
import { prepare, sha256, show, writeAll } from '../assets/io.js';
import { typeNote } from '../brand/catalog.js';
import { assertImageInput, resolveFields, safeName, TEMPLATES, type TemplateId } from '../image/catalog.js';
import { SCENE_TEMPLATES, type SceneFields } from '../image/compose.js';
import { cli } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';
import { clipFrameSvg, encodeClip, sceneClip, type Clip } from '../video/clips.js';
import type { Container } from '../video/ffmpeg.js';
import { ffmpegPath } from '../video/ffmpeg.js';
import { videoConfig } from '../video/motion.js';
import { mergeInput, siteHost } from './image.js';

// `video <template>`: short clips of the image layouts, moving the way the brand does (brand/assets/video.json), as MP4
// and WebM through ffmpeg (or Motion JPEG MP4 in process without it), plus `--still` for one frame as PNG and SVG.

const MOVES: Partial<Record<TemplateId, string>> = {
	hero: 'The lockup and words rise in on the brand ease-out, the toon objects arrive one by one and drift as the site\'s do.',
	window: 'The words rise in, then the window; the object in it holds.',
	cards: 'The title, then each card, staggered.',
	quote: 'The window rises in with the quote.',
	screenshot: 'The words rise in, then the window with your screenshot.',
	logo: 'The lockup fades in on the ground.',
};

export const VIDEO_TEMPLATES = SCENE_TEMPLATES;

export function videoCatalog() {
	const cfg = videoConfig();
	return {
		ok: true as const,
		renderer: {
			id: ffmpegPath() ? 'resvg-ffmpeg' : 'resvg-mjpeg',
			fps: cfg.fps,
			seconds: cfg.seconds,
			ffmpeg: Boolean(ffmpegPath()),
			codecs: { mp4: ffmpegPath() ? 'h264' : 'mjpeg (no ffmpeg found)', webm: ffmpegPath() ? 'vp9' : 'needs ffmpeg' },
			note: `Frames are SVG, rasterized by resvg with system fonts off, then encoded by ffmpeg single-threaded and bit-exact (same frames, same bytes on the same ffmpeg). Without ffmpeg, MP4 is Motion JPEG muxed in process. ${typeNote()}`,
		},
		motion: { source: cfg.source, enter: cfg.enter, drift: cfg.drift, grain: { interval: cfg.grain.interval, jumps: cfg.grain.jumps.length } },
		sizes: Object.entries(cfg.sizes).map(([id, s]) => ({ id, ...s })),
		templates: VIDEO_TEMPLATES.map((id) => ({ id, aliases: Object.entries(cfg.templates.aliases).filter(([, to]) => to === id).map(([name]) => name), needs: TEMPLATES[id].needs, summary: MOVES[id] ?? 'The lockup and words rise in, one after another.', fields: 'the image fields for this template (image --list --json)' })),
		aliases: cfg.templates.aliases,
		exports: ['mp4', 'webm'],
		formats: ['mp4', 'webm'],
		still: '--still <seconds> writes that frame as PNG and SVG instead of a clip (--still end for the last frame).',
	};
}

export type VideoRenderOpts = Record<string, unknown> & { out?: string; name?: string; export?: string; format?: string; input?: string; dryRun?: boolean; json?: boolean; seconds?: unknown; still?: unknown };

function readInput(file: string | undefined): Record<string, unknown> {
	if (!file) return {};
	let raw: unknown;
	try {
		raw = JSON.parse(file === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(file), 'utf8'));
	} catch (error) {
		throw new Error(error instanceof SyntaxError ? 'Video input is not valid JSON.' : `Could not read ${file}.`);
	}
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('video file input must be a JSON object.');
	return raw as Record<string, unknown>;
}

export function secondsOf(v: unknown): number {
	const cfg = videoConfig().seconds;
	if (v === undefined || v === '') return cfg.default;
	const n = Number(v);
	if (!Number.isFinite(n) || n < cfg.min || n > cfg.max) throw new Error(`--seconds must be from ${cfg.min} to ${cfg.max}.`);
	return n;
}

export function videoSizes(value: string): string[] {
	const cfg = videoConfig().sizes;
	if (value.trim().toLowerCase() === 'all') return Object.keys(cfg);
	const out: string[] = [];
	for (const raw of value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)) {
		const id = raw in cfg ? raw : Object.entries(cfg).find(([, s]) => s.aliases?.includes(raw))?.[0];
		if (!id) throw unknownName('size', raw, [...Object.keys(cfg), 'all']);
		if (!out.includes(id)) out.push(id);
	}
	if (!out.length) throw new Error(`Pick a size: ${Object.keys(cfg).join(', ')}.`);
	return out;
}

/** The template a clip name means: an image layout, or one of the first clips' names. */
export function videoTemplate(raw: unknown): TemplateId {
	const aliases = videoConfig().templates.aliases;
	const all = [...VIDEO_TEMPLATES, ...Object.keys(aliases)];
	const name = String(raw ?? '').trim().toLowerCase();
	if (!name) throw new Error(`Missing template. Use ${all.join(', ')}.`);
	if (!all.includes(name)) throw unknownName('template', name, all);
	return (aliases[name] ?? name) as TemplateId;
}

type ClipJob = { clip: Clip; size: string; width: number; height: number };

export function clipsFrom(opts: VideoRenderOpts): { clips: ClipJob[]; template: string } {
	const { seconds: fileSeconds, ...fileFields } = readInput(opts.input);
	const name = String(opts.template ?? fileFields.template ?? '').trim().toLowerCase();
	const template = videoTemplate(name);
	for (const key of ['width', 'height']) if (opts[key] !== undefined || key in fileFields) throw new Error(`Clips come in ${Object.keys(videoConfig().sizes).join(', ')}: leave ${key} off.`);
	const merged = mergeInput({ ...opts, template }, assertImageInput({ ...fileFields, template }, 'video file'));
	const ids = videoSizes(merged.size ?? 'square');
	const seconds = secondsOf(opts.seconds ?? fileSeconds);
	const fields = resolveFields(merged, { footer: siteHost() });
	if (fields.image) fields.image = resolve(fields.image);
	return {
		template: name,
		clips: ids.map((size) => {
			const { width, height, as } = videoConfig().sizes[size]!;
			return { size, width, height, clip: sceneClip({ ...fields, size: as, width, height } as SceneFields, seconds) };
		}),
	};
}

export function videoList(opts: { json?: boolean }) {
	const data = videoCatalog();
	emit(opts, data, () =>
		[
			`Renderer: ${data.renderer.id}, ${data.renderer.fps} fps, ${data.renderer.seconds.default} s by default (${data.renderer.seconds.min} to ${data.renderer.seconds.max}). MP4: ${data.renderer.codecs.mp4}. WebM: ${data.renderer.codecs.webm}.`,
			'',
			'Sizes',
			...data.sizes.map((s) => `  ${s.id.padEnd(10)} ${s.width} by ${s.height}`),
			'',
			'Templates',
			...data.templates.map((t) => `  ${t.id.padEnd(13)} ${t.summary}${t.aliases.length ? ` (also ${t.aliases.join(', ')})` : ''}`),
			'',
			data.still,
			data.renderer.note,
			'',
			`${cli()} video hero --headline "..." --size square,vertical --json`,
		].join('\n'),
	);
}

export async function videoRender(opts: VideoRenderOpts) {
	const { clips, template } = clipsFrom(opts);
	const notes = clips.flatMap((c) => c.clip.scene.notes);
	const ext = extname(opts.out ?? '').slice(1).toLowerCase();
	const isFile = ext === 'mp4' || ext === 'webm';
	if (isFile && (clips.length > 1 || opts.still !== undefined)) throw new Error('--out names one clip, and this makes something else. Pass a folder.');
	const name = safeName(opts.name ?? template);
	const out = resolve(isFile ? join(opts.out!, '..') : (opts.out ?? 'videos'));
	const stem = (size: string) => (isFile ? opts.out!.split('/').pop()!.slice(0, -ext.length - 1) : `${name}-${size}`);
	if (opts.still !== undefined && opts.still !== false) {
		const at = opts.still === true || opts.still === 'end' ? undefined : Number(opts.still);
		if (at !== undefined && (!Number.isFinite(at) || at < 0)) throw new Error('--still takes a time in seconds, or end.');
		const prepared = [];
		for (const c of clips) {
			const t = at ?? Math.max(0, c.clip.seconds - 1 / videoConfig().fps);
			if (t > c.clip.seconds) throw new Error(`--still ${t} is past the clip's ${c.clip.seconds} seconds.`);
			prepared.push(...(await prepare(out, `${name}-${c.size}-still`, clipFrameSvg(c.clip, t), c.width, c.height, ['png', 'svg'])));
		}
		if (opts.dryRun) {
			emit(opts, { ok: true, dryRun: true, template, files: prepared.map((f) => ({ path: show(f.path), format: f.format, width: f.width, height: f.height })) }, () => `Would write ${prepared.length} files.`);
			return;
		}
		const files = writeAll(prepared).map((f) => ({ ...f, path: show(f.path) }));
		emit(opts, { ok: true, dryRun: false, template, still: true, files, warnings: notes }, () => [`Wrote ${files.length} still file${files.length === 1 ? '' : 's'}.`, ...files.map((f) => `  ${f.path}  ${f.width} by ${f.height}`)].join('\n'));
		return;
	}
	const asked = opts.format ?? opts.export;
	if (isFile && asked && asked !== ext) throw new Error(`--out ends in .${ext} and --format says ${asked}. Make them agree.`);
	const exports = (asked ?? (isFile ? ext : 'mp4')).split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
	for (const e of exports) if (e !== 'mp4' && e !== 'webm') throw unknownName('format', e, ['mp4', 'webm']);
	const fps = videoConfig().fps;
	const planned = clips.flatMap((c) => exports.map((e) => ({ path: show(join(out, `${stem(c.size)}.${e}`)), format: e, size: c.size, width: c.width, height: c.height, template, frames: Math.round(c.clip.seconds * fps), fps, seconds: c.clip.seconds })));
	if (opts.dryRun) {
		emit(opts, { ok: true, dryRun: true, template, files: planned }, () => [`Would write ${planned.length} file${planned.length === 1 ? '' : 's'}.`, ...planned.map((f) => `  ${f.path}  ${f.width} by ${f.height}`)].join('\n'));
		return;
	}
	const made: { path: string; data: Buffer; meta: (typeof planned)[number] & { codec: string } }[] = [];
	let i = 0;
	for (const c of clips) {
		const encoded = await encodeClip(c.clip, exports as Container[]);
		for (const enc of encoded) {
			made.push({ path: join(out, `${stem(c.size)}.${enc.container}`), data: enc.data, meta: { ...planned[i]!, codec: enc.codec } });
			i++;
		}
	}
	mkdirSync(out, { recursive: true });
	for (const m of made) writeFileSync(m.path, m.data);
	const files = made.map((m) => ({ ...m.meta, bytes: m.data.length, sha256: sha256(m.data) }));
	emit(opts, { ok: true, dryRun: false, template, files, warnings: notes }, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'}.`, ...files.map((f) => `  ${f.path}  ${f.width} by ${f.height}  ${f.codec}  ${f.sha256.slice(0, 12)}`)].join('\n'));
}

function videoOptions(cmd: Command): Command {
	return cmd
		.option('-t, --template <id>', 'the template, when it is not the first word')
		.option('-s, --size <sizes>', 'square, vertical, landscape, portrait, og, or all (comma-separated)')
		.option('--seconds <n>', 'clip length, 2 to 12 (default 4)')
		.option('--still [seconds]', 'write the frame at this time (or the end) as PNG and SVG')
		.option('--headline <text>', 'main line (the title on cards)')
		.option('--body <text>', 'supporting line (also --subtext)')
		.option('--badge <text>', 'short label above the headline (also --eyebrow)')
		.option('--subtext <text>', 'the same as --body')
		.option('--eyebrow <text>', 'the same as --badge')
		.option('--button <text>', 'a key under the words')
		.option('--quote <text>', 'quote: the quote')
		.option('--by <text>', 'quote: who said it')
		.option('--cards <text>', 'cards: blank-line-separated cards, heading first')
		.option('--image <file>', 'PNG or JPEG: the window picture, the screenshot or the hero object')
		.option('--toon', 'make --image a toon object')
		.option('--picture <subject>', 'window and screenshot: the toon object in the window, or none')
		.option('--window <name>', 'window bar label')
		.option('--window-body <body>', 'window: blue, sky or white')
		.option('--stickers <mode>', 'preset, under, scatter or none')
		.option('--subjects <names>', 'toon objects to use, comma-separated')
		.option('--seed <n>', 'scatter: the arrangement')
		.option('--count <n>', 'scatter: how many objects')
		.option('--theme <theme>', 'blue, paper, white or ink (also --ground)')
		.option('--ground <ground>', 'the same as --theme')
		.option('--band <ground>', 'stepped band at the bottom toward a ground, or none')
		.option('--mark', 'logo: the mark alone')
		.option('--no-scan', 'leave the scanlines off the blue ground')
		.option('--no-logo', 'leave the lockup off')
		.option('--footer <text>', 'small line; default is the brand site host')
		.option('--no-footer', 'leave the footer line off')
		.option('--sample', 'fill the copy you leave out with sample copy')
		.option('-o, --out <path>', 'directory to write (default videos), or one .mp4 or .webm file')
		.option('-n, --name <name>', 'file name prefix; default is the template')
		.option('--format <formats>', 'mp4, webm, or mp4,webm (default mp4)')
		.option('--export <formats>', 'the same as --format')
		.option('-i, --input <file>', 'JSON object of the same fields; flags override it; - reads stdin')
		.option('--dry-run', 'list the files and write nothing')
		.option('--json', 'JSON output');
}

export function registerVideo(program: Command) {
	const video = videoOptions(program.command('video [template]').description('Short on-brand clips of the image layouts')).option('--list', 'list sizes, templates and the renderer');
	video.addHelpText('after', '\nExamples:\n  video hero --headline "Let agents buy anything online" --size square,vertical --format mp4,webm\n  video cards --input cards.json --size landscape --seconds 6\n  video hero --headline "..." --still end\n');
	video.action((template: string | undefined, _o: unknown, cmd: Command) => {
		const opts = cmd.optsWithGlobals() as VideoRenderOpts;
		if (opts.list) return videoList(opts as { json?: boolean });
		if (!template && !opts.template && !opts.input) return cmd.help();
		if (template && opts.template && template !== opts.template) throw new Error(`The template is named twice: ${template} and --template ${String(opts.template)}. Pass one.`);
		return videoRender({ ...opts, ...(template ? { template } : {}) });
	});
	video.command('list').description('List sizes, templates and the renderer').option('--json', 'JSON output').action((_o: unknown, cmd: Command) => videoList(cmd.optsWithGlobals()));
	videoOptions(video.command('render').description('The same as video <template>, with --template')).action((_o: unknown, cmd: Command) => videoRender(cmd.optsWithGlobals() as VideoRenderOpts));
}
