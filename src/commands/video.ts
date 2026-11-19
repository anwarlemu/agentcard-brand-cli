import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { prepare, sha256, show, writeAll } from '../assets/io.js';
import { typeNote } from '../brand/catalog.js';
import { assertImageInput, resolveFields } from '../image/catalog.js';
import { brand } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';
import { assertVideoInput, resolveVideo, VIDEO_TEMPLATES, videoName } from '../video/catalog.js';
import { clipFrameSvg, encodeClip, LEGACY_CLIPS, SCENE_CLIPS, sceneClip, type Clip } from '../video/clips.js';
import type { Container } from '../video/ffmpeg.js';
import { ffmpegPath } from '../video/ffmpeg.js';
import { videoConfig } from '../video/motion.js';

// `video`: short clips built the way the brand moves (brand/assets/video.json), as MP4 and WebM through ffmpeg (or
// Motion JPEG MP4 in process without it), plus `--still` for one frame as PNG and SVG.

function siteHost() {
	try {
		return brand().site ? new URL(brand().site!).host.replace(/^www\./, '') : '';
	} catch {
		return '';
	}
}

const SCENE_SUMMARY: Record<(typeof SCENE_CLIPS)[number], string> = {
	hero: 'The hero: the lockup and words rise in on the brand ease-out, the toon objects arrive one by one and drift as the site\'s do.',
	window: 'The window layout: the words rise in, then the window; the object in it holds.',
	cards: 'The numbered cards: the title, then each card, staggered.',
};

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
		templates: [
			...SCENE_CLIPS.map((id) => ({ id, family: 'scene', needs: id === 'cards' ? ['headline', 'cards'] : ['headline'], summary: SCENE_SUMMARY[id], fields: 'the image render fields for this template (image list --json)' })),
			...LEGACY_CLIPS.map((id) => ({ id, ...VIDEO_TEMPLATES[id], family: 'first' })),
		],
		exports: ['mp4', 'webm'],
		still: '--still <seconds> writes that frame as PNG and SVG instead of a clip (--still end for the last frame).',
	};
}

export type VideoRenderOpts = Record<string, unknown> & { size?: string; out?: string; name?: string; export?: string; input?: string; dryRun?: boolean; json?: boolean; seconds?: unknown; still?: unknown };

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

function secondsOf(v: unknown): number {
	const cfg = videoConfig().seconds;
	if (v === undefined || v === '') return cfg.default;
	const n = Number(v);
	if (!Number.isFinite(n) || n < cfg.min || n > cfg.max) throw new Error(`--seconds must be from ${cfg.min} to ${cfg.max}.`);
	return n;
}

function clipsFrom(opts: VideoRenderOpts): { clips: { clip: Clip; size: string; width: number; height: number }[]; template: string } {
	const file = readInput(opts.input);
	const { seconds: fileSeconds, ...fileFields } = file;
	const pick = (k: string) => (opts[k] !== undefined && opts[k] !== '' ? opts[k] : fileFields[k]);
	const template = String(pick('template') ?? '').trim().toLowerCase();
	const all = [...SCENE_CLIPS, ...LEGACY_CLIPS] as string[];
	if (!template) throw new Error(`Missing template. Use ${all.join(', ')}.`);
	if (!all.includes(template)) throw unknownName('template', template, all);
	const cfg = videoConfig();
	const sizeRaw = String(pick('size') ?? fileFields.sizes ?? 'square');
	const ids = sizeRaw === 'all' ? Object.keys(cfg.sizes) : sizeRaw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
	for (const id of ids) if (!(id in cfg.sizes)) throw unknownName('size', id, [...Object.keys(cfg.sizes), 'all']);
	const seconds = secondsOf(opts.seconds ?? fileSeconds);
	const noFooter = opts.footer === false || Boolean(opts.noFooter || fileFields.noFooter);
	if ((SCENE_CLIPS as readonly string[]).includes(template)) {
		const keys = ['headline', 'subtext', 'eyebrow', 'button', 'image', 'window', 'ground', 'band', 'windowBody', 'picture', 'stickers', 'subjects', 'seed', 'count', 'cards'];
		const raw: Record<string, unknown> = { template };
		for (const k of keys) if (pick(k) !== undefined) raw[k] = pick(k);
		for (const k of Object.keys(fileFields)) if (![...keys, 'template', 'size', 'sizes', 'footer', 'noFooter', 'scan', 'logo', 'toon'].includes(k)) throw unknownName('video file field', k, [...keys, 'template', 'size', 'footer', 'noFooter', 'scan', 'logo', 'toon', 'seconds']);
		if (!noFooter && pick('footer') !== undefined) raw.footer = pick('footer');
		if (noFooter) raw.noFooter = true;
		if (opts.scan === false || fileFields.scan === false) raw.scan = false;
		if (opts.logo === false || fileFields.logo === false) raw.logo = false;
		if (opts.toon === true || fileFields.toon === true) raw.toon = true;
		const fields = resolveFields(assertImageInput(raw, 'video'), { footer: siteHost() });
		if (fields.image) fields.image = resolve(fields.image);
		return {
			template,
			clips: ids.map((size) => {
				const { width, height } = cfg.sizes[size]!;
				return { size, width, height, clip: sceneClip({ ...fields, template: template as (typeof SCENE_CLIPS)[number], width, height }, seconds) };
			}),
		};
	}
	const merged = assertVideoInput(Object.fromEntries(Object.entries({ template, headline: pick('headline'), subtext: pick('subtext'), eyebrow: pick('eyebrow'), window: pick('window'), footer: noFooter ? undefined : pick('footer'), noFooter: noFooter || undefined }).filter(([, v]) => v !== undefined)), 'video');
	for (const k of Object.keys(fileFields)) if (!['template', 'headline', 'subtext', 'eyebrow', 'window', 'footer', 'noFooter', 'size', 'sizes'].includes(k)) throw unknownName('video file field', k, ['template', 'headline', 'subtext', 'eyebrow', 'window', 'footer', 'noFooter', 'size', 'seconds']);
	const fields = resolveVideo(merged, { footer: siteHost() });
	return { template, clips: ids.map((size) => ({ size, ...cfg.sizes[size]!, clip: { kind: 'legacy' as const, seconds, job: { ...fields, size: size as never, ...cfg.sizes[size]! } } })) };
}

export function videoList(opts: { json?: boolean }) {
	const data = videoCatalog();
	emit(opts, data, () => [
		`Renderer: ${data.renderer.id}, ${data.renderer.fps} fps, ${data.renderer.seconds.default} s by default (${data.renderer.seconds.min} to ${data.renderer.seconds.max}). MP4: ${data.renderer.codecs.mp4}. WebM: ${data.renderer.codecs.webm}.`,
		'',
		'Sizes',
		...data.sizes.map((s) => `  ${s.id.padEnd(10)} ${s.width} by ${s.height}`),
		'',
		'Templates',
		...data.templates.map((t) => `  ${t.id.padEnd(13)} ${t.summary}`),
		'',
		data.still,
		data.renderer.note,
	].join('\n'));
}

export async function videoRender(opts: VideoRenderOpts) {
	const { clips, template } = clipsFrom(opts);
	const name = videoName(opts.name ?? template);
	const out = resolve(opts.out ?? 'videos');
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
		emit(opts, { ok: true, dryRun: false, template, still: true, files }, () => [`Wrote ${files.length} still file${files.length === 1 ? '' : 's'}.`, ...files.map((f) => `  ${f.path}  ${f.width} by ${f.height}`)].join('\n'));
		return;
	}
	const exports = (opts.export ?? 'mp4').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
	for (const e of exports) if (e !== 'mp4' && e !== 'webm') throw unknownName('export', e, ['mp4', 'webm']);
	const fps = videoConfig().fps;
	const planned = clips.flatMap((c) => exports.map((e) => ({ path: show(join(out, `${name}-${c.size}.${e}`)), format: e, size: c.size, width: c.width, height: c.height, template, frames: Math.round(c.clip.seconds * fps), fps, seconds: c.clip.seconds })));
	if (opts.dryRun) {
		emit(opts, { ok: true, dryRun: true, template, files: planned }, () => [`Would write ${planned.length} file${planned.length === 1 ? '' : 's'}.`, ...planned.map((f) => `  ${f.path}  ${f.width} by ${f.height}`)].join('\n'));
		return;
	}
	const made: { path: string; data: Buffer; meta: (typeof planned)[number] & { codec: string } }[] = [];
	let i = 0;
	for (const c of clips) {
		const encoded = await encodeClip(c.clip, exports as Container[]);
		for (const enc of encoded) {
			made.push({ path: join(out, `${name}-${c.size}.${enc.container}`), data: enc.data, meta: { ...planned[i]!, codec: enc.codec } });
			i++;
		}
	}
	mkdirSync(out, { recursive: true });
	for (const m of made) writeFileSync(m.path, m.data);
	const files = made.map((m) => ({ ...m.meta, bytes: m.data.length, sha256: sha256(m.data) }));
	emit(opts, { ok: true, dryRun: false, template, files }, () => [`Wrote ${files.length} file${files.length === 1 ? '' : 's'}.`, ...files.map((f) => `  ${f.path}  ${f.width} by ${f.height}  ${f.codec}  ${f.sha256.slice(0, 12)}`)].join('\n'));
}
