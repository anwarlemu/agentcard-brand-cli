import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { imageRender } from '../src/commands/image.js';
import { SIZES, TEMPLATES, type SizeId, type TemplateId } from '../src/image/catalog.js';
import { brandFonts, drawText, fitText } from '../src/image/paint.js';
import { tokens } from '../src/lib/brand.js';

const ROOT = join(import.meta.dirname, '..');
const BIN = join(ROOT, 'bin.js');
const TINY_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

function pngSize(buf: Buffer) {
	expect(buf.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
	return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function quiet(run: () => Promise<void>) {
	const write = process.stdout.write.bind(process.stdout);
	process.stdout.write = (() => true) as typeof process.stdout.write;
	try {
		await run();
	} finally {
		process.stdout.write = write;
	}
}

const copy: Record<TemplateId, Record<string, string>> = {
	headline: { headline: 'Let agents buy anything online' },
	subtext: { headline: 'Powering payments for agentic startups', subtext: 'Teams run their agents purchases in one place.' },
	screenshot: { headline: 'Issuing', subtext: 'One-time cards for an agent checkout.' },
	quote: { quote: 'The agent pauses the payment. The cardholder approves on their phone.', by: 'A checkout note' },
	announcement: { eyebrow: 'New', headline: 'Checkout on more stores', subtext: 'Paste a product page and the agent shops it like any catalog item.' },
};

describe('images', () => {
	it('renders every template at every size with the right pixel size', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'ds-image-'));
		const shot = join(dir, 'shot.png');
		writeFileSync(shot, TINY_PNG);
		const brandBlue = tokens().site['--ds-color-brand'];
		try {
			for (const template of Object.keys(TEMPLATES) as TemplateId[]) {
				const out = join(dir, template);
				await quiet(() => imageRender({ ...copy[template], template, size: 'all', out, export: 'png,svg', json: true, ...(template === 'screenshot' ? { image: shot } : {}) }));
				for (const size of Object.keys(SIZES) as SizeId[]) {
					const png = readFileSync(join(out, `${template}-${size}.png`));
					const svg = readFileSync(join(out, `${template}-${size}.svg`), 'utf8');
					expect(pngSize(png), `${template} ${size}`).toEqual({ width: SIZES[size].width, height: SIZES[size].height });
					expect(svg).toContain(`width="${SIZES[size].width}"`);
					expect(svg).toContain(`height="${SIZES[size].height}"`);
					expect(svg).toContain(brandBlue);
					expect(svg).not.toContain('NaN');
				}
			}
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	}, 120000);

	it('is deterministic, accepts a JSON file, and refuses a missing field', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'ds-image-'));
		try {
			await quiet(() => imageRender({ template: 'headline', headline: 'One line', out: join(dir, 'a'), export: 'png', json: true }));
			await quiet(() => imageRender({ template: 'headline', headline: 'One line', out: join(dir, 'b'), export: 'png', json: true }));
			expect(readFileSync(join(dir, 'a', 'headline-og.png')).equals(readFileSync(join(dir, 'b', 'headline-og.png')))).toBe(true);
			writeFileSync(join(dir, 'card.json'), JSON.stringify({ template: 'quote', quote: 'A short quote.', size: 'square' }));
			await quiet(() => imageRender({ input: join(dir, 'card.json'), out: join(dir, 'from-json'), export: 'svg', json: true }));
			const svg = readFileSync(join(dir, 'from-json', 'quote-square.svg'), 'utf8');
			expect(svg).toContain('width="1080"');
			expect(svg).toContain('height="1080"');
			await expect(quiet(() => imageRender({ template: 'subtext', headline: 'Only a title', out: dir, json: true }))).rejects.toThrow(/subtext/);
			await expect(quiet(() => imageRender({ template: 'announcement', headline: 'Hello', ground: 'blue', out: dir, json: true }))).rejects.toThrow(/ground/);
			await quiet(() => imageRender({ template: 'headline', headline: 'Dry', out: join(dir, 'missing'), dryRun: true, json: true }));
			expect(existsSync(join(dir, 'missing'))).toBe(false);
			await quiet(() => imageRender({ template: 'screenshot', headline: 'Empty window', out: join(dir, 'empty'), export: 'png', json: true }));
			expect(pngSize(readFileSync(join(dir, 'empty', 'screenshot-og.png')))).toEqual({ width: 1200, height: 630 });
			await quiet(() => imageRender({ template: 'Headline', headline: 'Case', size: 'OG', export: 'svg', out: join(dir, 'case'), json: true }));
			expect(existsSync(join(dir, 'case', 'headline-og.svg'))).toBe(true);
			const withFooter = join(dir, 'footer');
			const noFooter = join(dir, 'no-footer');
			await quiet(() => imageRender({ template: 'headline', headline: 'Footer', footer: 'Shown', out: withFooter, export: 'svg', json: true }));
			await quiet(() => imageRender({ template: 'headline', headline: 'Footer', footer: false, out: noFooter, export: 'svg', json: true }));
			expect(readFileSync(join(withFooter, 'headline-og.svg'), 'utf8')).not.toBe(readFileSync(join(noFooter, 'headline-og.svg'), 'utf8'));
			const titled = join(dir, 'titled');
			await quiet(() => imageRender({ template: 'headline', headline: 'A & B < C', out: titled, export: 'svg', json: true }));
			const titledSvg = readFileSync(join(titled, 'headline-og.svg'), 'utf8');
			expect(titledSvg).toContain('<title>A &amp; B &lt; C</title>');
			await expect(quiet(() => imageRender({ template: 'headline', headline: 'No shot', image: join(dir, 'unused.png'), out: join(dir, 'wrong'), json: true }))).rejects.toThrow(/screenshot template/);
			writeFileSync(join(dir, 'notes.txt'), 'not a picture');
			await expect(quiet(() => imageRender({ template: 'screenshot', headline: 'Bad file', image: join(dir, 'notes.txt'), out: join(dir, 'bad'), json: true }))).rejects.toThrow(/PNG or JPEG/);
			expect(existsSync(join(dir, 'bad'))).toBe(false);
			await expect(quiet(() => imageRender({ template: 'screenshot', headline: 'Missing file', image: join(dir, 'missing.png'), out: join(dir, 'gone'), json: true }))).rejects.toThrow(/Could not read/);
			expect(existsSync(join(dir, 'gone'))).toBe(false);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('draws the round quote, not the square default', () => {
		const block = fitText(brandFonts().medium, '\u201C', 300, 160, { start: 120, min: 40, leading: 1, maxLines: 1, role: 'quote' });
		expect(drawText(block, 0, 0, 'left', 300, '#0000FF')).toMatch(/Q/);
	});

	it('answers image render --help and writes from the built command', () => {
		expect(execFileSync(process.execPath, [BIN, 'image', 'render', '--help'], { encoding: 'utf8' })).toMatch(/--template/);
		expect(execFileSync(process.execPath, [BIN, 'image', 'list', '--help'], { encoding: 'utf8' })).toMatch(/Usage/);
		const dir = mkdtempSync(join(tmpdir(), 'ds-image-cli-'));
		try {
			const out = execFileSync(process.execPath, [BIN, 'image', 'render', '--template', 'headline', '--headline', 'From the command', '--no-footer', '--export', 'svg', '--out', dir, '--json'], { encoding: 'utf8' });
			const parsed = JSON.parse(out) as { ok: boolean; files: { path: string }[] };
			expect(parsed.ok).toBe(true);
			expect(parsed.files).toHaveLength(1);
			expect(existsSync(join(dir, 'headline-og.svg'))).toBe(true);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});
