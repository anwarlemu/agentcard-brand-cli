import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { manifest } from '../src/brand/manifest.js';
import { tokenByName, tokensByGroup } from '../src/brand/catalog.js';
import { principlesCommand } from '../src/commands/system.js';
import { componentEmit, componentInspect, componentList } from '../src/commands/component.js';
import { imageRender } from '../src/commands/image.js';
import { videoRender } from '../src/commands/video.js';
import { contractOf, libraryItem } from '../src/library/contract.js';
import { VIDEO_SIZES, VIDEO_TEMPLATES, type VideoSizeId, type VideoTemplateId } from '../src/video/catalog.js';
import { frameProgress, frameSvg } from '../src/video/frames.js';
import { muxMjpeg } from '../src/video/mp4.js';
import { tokens } from '../src/lib/brand.js';

const ROOT = join(import.meta.dirname, '..');
const BIN = join(ROOT, 'bin.js');

function capture(run: () => void): string {
	let out = '';
	const write = process.stdout.write.bind(process.stdout);
	process.stdout.write = ((chunk: string | Uint8Array) => {
		out += String(chunk);
		return true;
	}) as typeof process.stdout.write;
	try {
		run();
	} finally {
		process.stdout.write = write;
	}
	return out;
}

async function captureAsync(run: () => Promise<void>): Promise<string> {
	let out = '';
	const write = process.stdout.write.bind(process.stdout);
	process.stdout.write = ((chunk: string | Uint8Array) => {
		out += String(chunk);
		return true;
	}) as typeof process.stdout.write;
	try {
		await run();
	} finally {
		process.stdout.write = write;
	}
	return out;
}

const copy: Record<VideoTemplateId, Record<string, string>> = {
	social: { headline: 'Let agents buy anything online' },
	announcement: { eyebrow: 'New', headline: 'Checkout on more stores', subtext: 'Paste a product page and the agent shops it like any catalog item.' },
	product: { headline: 'Issuing', subtext: 'One-time cards for an agent checkout.' },
};

describe('manifest', () => {
	it('lists templates, sizes, components, token groups and the product gap', () => {
		const data = manifest();
		expect(data.entry).toMatch(/manifest --json/);
		expect(data.tokens.groups.map((group) => group.id)).toEqual(expect.arrayContaining(['color', 'type', 'space', 'radius', 'motion']));
		expect(data.images.templates.map((item) => item.id).sort()).toEqual(['announcement', 'headline', 'quote', 'screenshot', 'subtext']);
		expect(data.images.sizes.map((item) => item.id).sort()).toEqual(['landscape', 'og', 'portrait', 'square']);
		expect(data.videos.templates.map((item) => item.id).sort()).toEqual(['announcement', 'product', 'social']);
		expect(data.videos.sizes.map((item) => item.id)).toEqual(['square', 'vertical', 'landscape']);
		expect(data.videos.renderer.frames).toBe(12);
		expect(data.components.map((item) => item.name)).toContain('button');
		const button = data.components.find((item) => item.name === 'button');
		expect(button?.variants[0]?.keys.variant).toEqual(expect.arrayContaining(['primary', 'secondary', 'on-brand', 'ghost']));
		expect(button?.states).toContain('Site');
		expect(data.principles.site.defined).toBe(true);
		expect(data.principles.site.do.length).toBeGreaterThan(0);
		expect(data.principles.site.dont.join(' ')).toMatch(/Gradients behind text/);
		expect(data.principles.product.defined).toBe(false);
		expect(data.gaps.map((gap) => gap.id)).toContain('product-surface');
		expect(data.gaps.some((gap) => gap.id.startsWith('font:'))).toBe(true);
		expect(data.fonts.files.map((file) => file.file).sort()).toEqual(['brand/fonts/Inter-Medium.ttf', 'brand/fonts/Inter-Regular.ttf']);
		expect(data.logos.files.map((file) => file.id).sort()).toEqual(['lockup', 'mark']);
		expect(data.logos.never.join(' | ')).toContain('blue, ink or white');
		expect(data.voice.avoid).toContain('seamless');
		expect(JSON.stringify(data)).toBe(JSON.stringify(manifest()));
	});

	it('rejects unknown groups, tokens, surfaces and component names', () => {
		expect(() => tokensByGroup('colour')).toThrow(/Unknown token group/);
		expect(() => tokenByName('--ds-color-nope')).toThrow(/Unknown token/);
		expect(tokenByName('--ds-color-brand').value).toBe(tokens().site['--ds-color-brand']);
		expect(() => principlesCommand({ surface: 'app', json: true })).toThrow(/Unknown surface/);
		expect(() => libraryItem('not-a-component')).toThrow(/Unknown component/);
		expect(contractOf(libraryItem('button')).states).toContain('Site');
	});
});

describe('components', () => {
	it('emits a real example and refuses an unknown variant', () => {
		let json = '';
		const write = process.stdout.write.bind(process.stdout);
		process.stdout.write = ((chunk: string | Uint8Array) => {
			json += String(chunk);
			return true;
		}) as typeof process.stdout.write;
		try {
			componentEmit('button', { state: 'Site', json: true });
		} finally {
			process.stdout.write = write;
		}
		const state = JSON.parse(json) as { generated: boolean; markup: string; excerpt: string };
		expect(state.generated).toBe(false);
		expect(state.markup).toContain('export function Site');
		expect(state.excerpt).toContain('Start free');
		expect(() => componentEmit('button', { state: 'Hover', json: true })).toThrow(/Unknown state/);
		json = '';
		process.stdout.write = ((chunk: string | Uint8Array) => {
			json += String(chunk);
			return true;
		}) as typeof process.stdout.write;
		try {
			componentEmit('button', { set: ['variant=primary', 'size=sm'], text: 'Start free', json: true });
		} finally {
			process.stdout.write = write;
		}
		const variant = JSON.parse(json) as { generated: boolean; markup: string; props: Record<string, string> };
		expect(variant.generated).toBe(true);
		expect(variant.props).toEqual({ variant: 'primary', size: 'sm' });
		expect(variant.markup).toContain('variant="primary"');
		expect(variant.markup).toContain('size="sm"');
		expect(variant.markup).toContain('"Start free"');
		expect(variant.markup).not.toContain('ghost');
		expect(() => componentEmit('button', { set: ['variant=pill'], json: true })).toThrow(/Unknown variant/);
		expect(() => componentEmit('button', { json: true })).toThrow(/Pass --state/);
		const listed = capture(() => componentList({ json: true }));
		const list = JSON.parse(listed) as { items: { name: string }[] };
		expect(list.items.map((item) => item.name)).toContain('button');
		const inspected = capture(() => componentInspect('button', { json: true }));
		expect(JSON.parse(inspected).variants[0].keys.size.values).toEqual(expect.arrayContaining(['md', 'sm', 'icon']));
	});
});

describe('images stay strict', () => {
	it('rejects an unknown field, template and a missing template', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'ds-image-strict-'));
		try {
			await expect(captureAsync(() => imageRender({ template: 'poster', headline: 'Hello', out: dir, json: true }))).rejects.toThrow(/Unknown template/);
			await expect(captureAsync(() => imageRender({ template: 'headline', headline: 'Hello', subtext: 'Not used', out: dir, json: true }))).rejects.toThrow(/does not take --subtext/);
			await expect(captureAsync(() => imageRender({ headline: 'Hello', out: dir, json: true }))).rejects.toThrow(/Missing template/);
			writeFileSync(join(dir, 'card.json'), JSON.stringify({ template: 'headline', headline: 'Hello', palette: 'neon' }));
			await expect(captureAsync(() => imageRender({ input: join(dir, 'card.json'), out: dir, json: true }))).rejects.toThrow(/Unknown image file field/);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});

describe('video', () => {
	it('draws every template at every size from tokens and rejects bad input', () => {
		const blue = tokens().site['--ds-color-brand'];
		const steps = Array.from({ length: 12 }, (_, frame) => frameProgress(frame));
		expect(steps[0]).toBe(0);
		expect(steps.at(-1)).toBe(1);
		for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1]);
		for (const template of Object.keys(VIDEO_TEMPLATES) as VideoTemplateId[]) {
			for (const size of Object.keys(VIDEO_SIZES) as VideoSizeId[]) {
				const svg = frameSvg({ ...copy[template], template, footer: 'example.test', size, width: VIDEO_SIZES[size].width, height: VIDEO_SIZES[size].height }, 11);
				expect(svg, `${template} ${size}`).toContain(`width="${VIDEO_SIZES[size].width}"`);
				expect(svg).toContain(`height="${VIDEO_SIZES[size].height}"`);
				expect(svg).toContain(blue);
				expect(svg).not.toContain('NaN');
			}
		}
		expect(frameSvg({ ...copy.social, template: 'social', footer: '', size: 'square', width: 1080, height: 1080 }, 0)).not.toBe(frameSvg({ ...copy.social, template: 'social', footer: '', size: 'square', width: 1080, height: 1080 }, 11));
		const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
		const left = muxMjpeg([jpeg, jpeg], 16, 16, 12);
		const right = muxMjpeg([jpeg, Buffer.from(jpeg)], 16, 16, 12);
		expect(left.equals(right)).toBe(true);
		expect(left.subarray(4, 8).toString()).toBe('ftyp');
		expect(left.includes(Buffer.from('moov'))).toBe(true);
		expect(left.includes(Buffer.from('mdat'))).toBe(true);
	});

	it('writes byte-identical mp4 files and rejects unknown options', async () => {
		const dir = mkdtempSync(join(tmpdir(), 'ds-video-'));
		try {
			const first = await captureAsync(() => videoRender({ template: 'social', headline: 'One line', size: 'square', out: join(dir, 'a'), export: 'mp4', json: true }));
			const second = await captureAsync(() => videoRender({ template: 'social', headline: 'One line', size: 'square', out: join(dir, 'b'), json: true }));
			const a = JSON.parse(first) as { ok: boolean; files: { sha256: string; width: number; height: number; frames: number }[] };
			const b = JSON.parse(second) as { files: { sha256: string }[] };
			expect(a.ok).toBe(true);
			expect(a.files[0]).toMatchObject({ width: 1080, height: 1080, frames: 12 });
			expect(a.files[0].sha256).toBe(b.files[0].sha256);
			expect(readFileSync(join(dir, 'a', 'social-square.mp4')).equals(readFileSync(join(dir, 'b', 'social-square.mp4')))).toBe(true);
			await expect(captureAsync(() => videoRender({ template: 'social', headline: 'One line', size: 'og', out: dir, json: true }))).rejects.toThrow(/Unknown size/);
			await expect(captureAsync(() => videoRender({ template: 'trailer', headline: 'One line', size: 'square', out: dir, json: true }))).rejects.toThrow(/Unknown template/);
			await expect(captureAsync(() => videoRender({ template: 'social', size: 'square', out: dir, json: true }))).rejects.toThrow(/headline/);
			await expect(captureAsync(() => videoRender({ template: 'social', headline: 'One line', eyebrow: 'Now', window: 'nope', size: 'square', out: dir, json: true }))).rejects.toThrow(/does not take --window/);
			await captureAsync(() => videoRender({ template: 'product', headline: 'Dry', size: 'square', out: join(dir, 'missing'), dryRun: true, json: true }));
			expect(existsSync(join(dir, 'missing'))).toBe(false);
			expect(readFileSync(join(dir, 'a', 'social-square.mp4')).subarray(4, 8).toString()).toBe('ftyp');
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	}, 120000);
});

describe('cli catalog', () => {
	it('answers manifest --json and rejects an unknown video flag', () => {
		const out = execFileSync(process.execPath, [BIN, 'manifest', '--json'], { cwd: ROOT, encoding: 'utf8' });
		const data = JSON.parse(out) as { components: { name: string }[]; videos: { templates: { id: string }[] } };
		expect(data.components.some((item) => item.name === 'button')).toBe(true);
		expect(data.videos.templates.map((item) => item.id)).toContain('social');
		const failed = (args: string[]) => {
			try {
				execFileSync(process.execPath, [BIN, ...args], { cwd: ROOT, encoding: 'utf8' });
			} catch (error) {
				const err = error as { stdout?: string; stderr?: string };
				return `${err.stdout ?? ''}\n${err.stderr ?? ''}`;
			}
			throw new Error(`expected ${args.join(' ')} to fail`);
		};
		expect(failed(['video', 'render', '--template', 'social', '--headline', 'Hi', '--size', 'square', '--duration', '4', '--json'])).toMatch(/unknown option/i);
		const brandOut = execFileSync(process.execPath, [BIN, 'brand', 'tokens', '--group', 'motion', '--json'], { cwd: ROOT, encoding: 'utf8' });
		const motion = JSON.parse(brandOut) as { groups: { id: string; tokens: { name: string }[] }[] };
		expect(motion.groups[0].id).toBe('motion');
		expect(motion.groups[0].tokens.some((token) => token.name === '--ds-easing-out')).toBe(true);
		expect(failed(['brand', 'tokens', '--group', 'colour', '--json'])).toMatch(/Unknown token group/);
		expect(failed(['component', 'inspect', 'not-a-component', '--json'])).toMatch(/Unknown component/);
	});
});
