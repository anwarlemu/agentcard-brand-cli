import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Command } from 'commander';
import { parseFormats, sha256, show } from '../assets/io.js';
import type { ImageFormat } from '../assets/encode.js';
import { imagesToPdf, pdfPage } from '../assets/pdf.js';
import { checkSlide, deckConfig, drawSlide, sampleDeck, type Slide } from '../deck/slides.js';
import { encodeAll, rasterizeRgba } from '../image/render.js';
import { cli } from '../lib/brand.js';
import { unknownName } from '../lib/names.js';
import { emit } from '../lib/output.js';

// `deck`: slides from a JSON file (or the sample deck), one PNG per slide (SVG too with --format) and one PDF.

type Flags = Record<string, string | boolean | undefined>;

export function deckCatalog() {
	const cfg = deckConfig();
	return {
		width: cfg.width,
		height: cfg.height,
		slides: Object.entries(cfg.slides).map(([id, s]) => ({ id, name: s.name, about: s.about, slots: s.slots, needs: s.needs, themes: cfg.themes[id as keyof typeof cfg.themes] })),
		aliases: cfg.aliases,
		formats: ['png', 'svg', 'jpg', 'webp', 'pdf'],
		input: '{ "slides": [ { "type": "cover", "headline": "...", "body": "..." }, ... ] }',
		outputs: ['slide-NN-<type>.png', 'slide-NN-<type>.svg (with --format svg)', 'deck.pdf'],
	};
}

function readSlides(file: string): Slide[] {
	let raw: unknown;
	try {
		raw = JSON.parse(file === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(file), 'utf8'));
	} catch (error) {
		throw new Error(error instanceof SyntaxError ? `${file} is not valid JSON.` : `Could not read ${file}.`);
	}
	const list = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? (raw as { slides?: unknown }).slides : undefined;
	if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
		const extra = Object.keys(raw).filter((k) => k !== 'slides');
		if (extra.length) throw new Error(`Unknown deck field "${extra[0]}". A deck file has slides.`);
	}
	if (!Array.isArray(list) || !list.length) throw new Error('A deck file needs a slides list.');
	if (list.length > 60) throw new Error('Keep a deck to 60 slides.');
	return list.map((s, i) => checkSlide(s, i));
}

export async function deck(flags: Flags) {
	if (flags.list) {
		const data = deckCatalog();
		emit({ json: !!flags.json }, data, () => [`Slides at ${data.width} by ${data.height}`, ...data.slides.map((s) => `  ${s.id.padEnd(10)} ${s.about} Slots: ${s.slots.join(', ')}.`), '', `Input: ${data.input}`, `${cli()} deck --input deck.json --out deck`, `${cli()} deck --sample --out deck`].join('\n'));
		return;
	}
	if (!flags.input && !flags.sample) throw new Error('Pass --input deck.json (or - for stdin), or --sample for the sample deck.');
	const slides = flags.sample && !flags.input ? sampleDeck().map((s, i) => checkSlide(s, i)) : readSlides(String(flags.input));
	const formats = parseFormats(typeof flags.format === 'string' ? flags.format : undefined, ['png'], ['png', 'svg', 'jpg', 'webp', 'pdf']);
	const theme = typeof flags.theme === 'string' ? flags.theme : undefined;
	if (theme && !slides.some((s) => deckConfig().themes[s.type].includes(theme as never))) throw unknownName('theme', theme, [...new Set(slides.flatMap((s) => deckConfig().themes[s.type]))]);
	const dir = resolve(typeof flags.out === 'string' ? flags.out : 'deck');
	const { width, height } = deckConfig();
	const files: { path: string; data: Buffer; format: string }[] = [];
	const pages: { rgb: Buffer; width: number; height: number }[] = [];
	const warnings: string[] = [];
	for (const [i, raw] of slides.entries()) {
		// --theme is the ground of every slide that does not set its own.
		const slide = theme && raw.theme === undefined && deckConfig().themes[raw.type].includes(theme as never) ? { ...raw, theme } : raw;
		const drawn = drawSlide(slide, i);
		const svg = drawn.svg;
		warnings.push(...drawn.notes.map((n) => `Slide ${i + 1}: ${n}`));
		const stem = `slide-${String(i + 1).padStart(2, '0')}-${slide.type}`;
		const made = await encodeAll(svg, width, formats.filter((f): f is ImageFormat => f !== 'pdf'));
		for (const f of ['svg', 'png', 'jpg', 'webp'] as const) if (made[f]) files.push({ path: join(dir, `${stem}.${f}`), data: made[f]!, format: f });
		if (flags.pdf !== false) {
			const px = await rasterizeRgba(svg, width);
			pages.push(pdfPage(px.pixels, px.width, px.height));
		}
	}
	// A 16:9 page 13.333 inches wide (960 points), the common widescreen slide size.
	if (pages.length) files.push({ path: join(dir, 'deck.pdf'), data: imagesToPdf(pages, 960), format: 'pdf' });
	mkdirSync(dir, { recursive: true });
	for (const f of files) writeFileSync(f.path, f.data);
	const doc = { ok: true, warnings, slides: slides.length, width, height, files: files.map((f) => ({ path: show(f.path), format: f.format, bytes: f.data.length, sha256: sha256(f.data) })) };
	emit({ json: !!flags.json }, doc, () => [`Wrote ${slides.length} slide${slides.length === 1 ? '' : 's'} (${width} by ${height}).`, ...doc.files.map((f) => `  ${f.path}`), ...warnings.map((w) => `Note: ${w}`)].join('\n'));
}

export function registerDeck(program: Command) {
	program
		.command('deck')
		.description('Slides at 1920 by 1080 from a JSON file: a PNG per slide and one PDF')
		.option('-i, --input <file>', 'deck JSON: { "slides": [ { "type", ...slots } ] }; - reads stdin')
		.option('--sample', 'render the sample deck (every slide type)')
		.option('--format <formats>', 'png, svg, jpg, webp for the slides, comma-separated (default png); pdf is always written unless --no-pdf')
		.option('--theme <theme>', 'the ground of every slide that does not set its own')
		.option('--no-pdf', 'skip deck.pdf')
		.option('-o, --out <dir>', 'directory to write (default ./deck)')
		.option('--list', 'list slide types and their slots')
		.option('--json', 'JSON output')
		.action((_o: unknown, cmd: Command) => deck(cmd.optsWithGlobals() as Flags));
}
