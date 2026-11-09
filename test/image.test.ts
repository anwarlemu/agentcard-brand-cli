import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { imageRender } from '../src/commands/image.js';
import { SIZES, TEMPLATES, type SizeId, type TemplateId } from '../src/image/catalog.js';
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
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});

	it('answers image render --help', () => {
		expect(execFileSync(process.execPath, [BIN, 'image', 'render', '--help'], { encoding: 'utf8' })).toMatch(/--template/);
		expect(execFileSync(process.execPath, [BIN, 'image', 'list', '--help'], { encoding: 'utf8' })).toMatch(/Usage/);
	});
});
