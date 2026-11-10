// Fixed video templates and sizes. Motion samples the brand easing across a fixed frame count.

import { z } from 'zod';
import { typeNote } from '../brand/catalog.js';
import { parseSchema } from '../lib/schema.js';
import { cleanText, safeName } from '../image/catalog.js';

export const VIDEO_SIZES = {
	square: { width: 1080, height: 1080, ratio: '1:1', label: 'Square', use: 'Feed clips, 1080 by 1080' },
	vertical: { width: 1080, height: 1920, ratio: '9:16', label: 'Vertical', use: 'Stories and reels, 1080 by 1920' },
	landscape: { width: 1920, height: 1080, ratio: '16:9', label: 'Landscape', use: 'Landscape clips, 1920 by 1080' },
} as const;

export const VIDEO_FRAMES = 12;
export const VIDEO_FPS = 12;
export const JPEG_QUALITY = 85;
/** Same label the still screenshot uses when window is omitted. */
export const DEFAULT_WINDOW = 'screen.preview';

export const VIDEO_TEMPLATES = {
	social: {
		label: 'Social clip',
		family: 'social',
		needs: ['headline'],
		optional: ['eyebrow', 'footer'],
		summary: 'Blue ground, lockup, headline and the stepped band. The band and the headline ease in.',
	},
	announcement: {
		label: 'Announcement clip',
		family: 'announcement',
		needs: ['headline'],
		optional: ['eyebrow', 'subtext', 'footer'],
		summary: 'Blue cap, stepped band, then the headline on paper. The band and the type ease in. Ground is fixed.',
	},
	product: {
		label: 'Product clip',
		family: 'product',
		needs: ['headline'],
		optional: ['subtext', 'window', 'footer'],
		summary: 'Headline and a window holding the mark, on the blue ground. The window eases in.',
	},
} as const;

export type VideoSizeId = keyof typeof VIDEO_SIZES;
export type VideoTemplateId = keyof typeof VIDEO_TEMPLATES;

export type VideoFields = {
	template: VideoTemplateId;
	headline: string;
	subtext?: string;
	eyebrow?: string;
	window?: string;
	footer: string;
};

export type VideoJob = VideoFields & { size: VideoSizeId; width: number; height: number };

export const VIDEO_FIELDS = ['template', 'headline', 'subtext', 'eyebrow', 'window', 'footer', 'noFooter', 'size', 'sizes'] as const;

export const videoInputSchema = z.object({
	template: z.string().optional(),
	headline: z.string().optional(),
	subtext: z.string().optional(),
	eyebrow: z.string().optional(),
	window: z.string().optional(),
	footer: z.string().optional(),
	noFooter: z.boolean().optional(),
	size: z.string().optional(),
	sizes: z.string().optional(),
}).strict();

export function assertVideoInput(value: unknown, label = 'video'): z.infer<typeof videoInputSchema> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} input must be a JSON object.`);
	return parseSchema(videoInputSchema, value, label, VIDEO_FIELDS);
}

export function parseVideoSizes(value: string | undefined): VideoSizeId[] {
	if (!value?.trim()) throw new Error(`Missing size. Use ${Object.keys(VIDEO_SIZES).join(', ')}, or all.`);
	const raw = value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
	if (raw.length === 1 && raw[0] === 'all') return Object.keys(VIDEO_SIZES) as VideoSizeId[];
	const ids: VideoSizeId[] = [];
	for (const id of raw) {
		if (!(id in VIDEO_SIZES)) throw new Error(`Unknown size "${id}". Use ${Object.keys(VIDEO_SIZES).join(', ')}, or all.`);
		if (!ids.includes(id as VideoSizeId)) ids.push(id as VideoSizeId);
	}
	return ids;
}

export function resolveVideo(raw: z.infer<typeof videoInputSchema>, defaults: { footer: string }): VideoFields {
	if (typeof raw.template !== 'string' || !raw.template.trim()) throw new Error(`Missing template. Use ${Object.keys(VIDEO_TEMPLATES).join(', ')}.`);
	const template = raw.template.trim().toLowerCase();
	if (!(template in VIDEO_TEMPLATES)) throw new Error(`Unknown template "${template}". Use ${Object.keys(VIDEO_TEMPLATES).join(', ')}.`);
	const id = template as VideoTemplateId;
	const spec = VIDEO_TEMPLATES[id];
	const fields: VideoFields = {
		template: id,
		headline: cleanText(raw.headline, 'headline') ?? '',
		subtext: cleanText(raw.subtext, 'subtext'),
		eyebrow: cleanText(raw.eyebrow, 'eyebrow'),
		window: cleanText(raw.window, 'window'),
		footer: raw.noFooter ? '' : cleanText(raw.footer, 'footer') ?? defaults.footer,
	};
	if (!fields.headline) fields.headline = '';
	const optional = spec.optional as readonly string[];
	const needs = spec.needs as readonly string[];
	for (const key of ['subtext', 'eyebrow', 'window'] as const) {
		if (fields[key] && !needs.includes(key) && !optional.includes(key)) throw new Error(`The ${id} template does not take --${key}.`);
	}
	if (!fields.window && optional.includes('window')) fields.window = DEFAULT_WINDOW;
	const missing = spec.needs.filter((key) => !fields[key as keyof VideoFields]);
	if (missing.length) throw new Error(`The ${id} template needs ${missing.map((key) => `--${key}`).join(' and ')}.`);
	return fields;
}

export function videoName(value: string): string {
	return safeName(value);
}

export function videoCatalog() {
	const type = typeNote();
	return {
		ok: true as const,
		renderer: {
			id: 'resvg-mjpeg',
			container: 'mp4',
			codec: 'mjpeg',
			frames: VIDEO_FRAMES,
			fps: VIDEO_FPS,
			quality: JPEG_QUALITY,
			easing: '--ds-easing-out',
			note: `Frames are SVG, rasterized by resvg with system fonts off, then muxed as Motion JPEG. The frame count and the easing token are fixed. Duration tokens are for interface transitions and are not stretched into the clip. ${type}`,
		},
		sizes: Object.entries(VIDEO_SIZES).map(([id, size]) => ({ id, ...size })),
		templates: Object.entries(VIDEO_TEMPLATES).map(([id, template]) => ({ id, ...template })),
		exports: ['mp4'],
		fields: VIDEO_FIELDS,
		type: { note: type },
	};
}
