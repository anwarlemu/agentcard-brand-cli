// The kinds added for coverage: emails, icons, print documents, page compose and the GIF and walkthrough clips.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { encodePng } from '../src/assets/png.js';
import { flatOver } from '../src/commands/email.js';
import { ffmpegPath } from '../src/video/ffmpeg.js';

const ROOT = join(import.meta.dirname, '..');
const BIN = join(ROOT, 'bin.js');
const dir = mkdtempSync(join(tmpdir(), 'ds-coverage-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const run = (args: string[]) => JSON.parse(execFileSync(process.execPath, [BIN, ...args, '--json'], { cwd: dir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const fails = (args: string[]) => {
	try {
		execFileSync(process.execPath, [BIN, ...args], { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
	} catch (error) {
		const e = error as { status: number; stdout?: string; stderr?: string };
		return { status: e.status, text: `${e.stdout ?? ''}${e.stderr ?? ''}` };
	}
	throw new Error(`expected ${args.join(' ')} to fail`);
};
const size = (path: string) => {
	const b = readFileSync(path);
	expect(b.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
	return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};
// Every color a written file uses must be one of the brand's token values.
const TOKEN_HEX = new Set((readFileSync(join(ROOT, 'brand', 'tokens.css'), 'utf8').match(/#[0-9a-f]{6}\b/gi) ?? []).map((h) => h.toLowerCase()));
const offPalette = (text: string) => [...new Set((text.match(/#[0-9a-f]{6}\b/gi) ?? []).map((h) => h.toLowerCase()))].filter((h) => !TOKEN_HEX.has(h));

describe('email', () => {
	it('writes every template as table HTML in the brand colors, with the copy given and nothing invented', () => {
		const cases: [string, string[]][] = [
			['newsletter', ['--headline', 'This week at Acme', '--items', 'One\nA line\n\nTwo\nAnother line']],
			['announcement', ['--headline', 'Acme ships cards', '--body', 'Every purchase approved.', '--button', 'Read more', '--button-url', 'https://example.com']],
			['receipt', ['--headline', 'Your receipt', '--items', 'Pro plan | $49', '--total', '$49']],
			['password-reset', ['--headline', 'Reset your password', '--button', 'Reset', '--button-url', 'https://example.com/r']],
			['signature', ['--name', 'Alex Doe', '--role', 'Founder', '--email', 'alex@acme.com']],
		];
		for (const [template, args] of cases) {
			const out = run(['email', template, ...args, '-o', 'em']);
			const html = readFileSync(join(dir, out.files[0]), 'utf8');
			expect(html, template).toContain('<table');
			expect(offPalette(html).filter((h) => h !== flatOver('border-hairline', 'white').toLowerCase()), template).toEqual([]);
			expect(html, template).not.toMatch(/—/);
			for (const value of args.filter((a, i) => i % 2 === 1 && !a.startsWith('http'))) for (const line of value.split('\n').filter(Boolean)) expect(html, `${template}: ${line}`).toContain(line.split(' | ')[0]!.replace('&', '&amp;'));
		}
		expect(fails(['email', 'newsleter']).text).toMatch(/newsletter/);
	}, 120000);
});

describe('icons', () => {
	it('makes the favicon set at its sizes, and the component icons in brand colors only', () => {
		const fav = run(['icons', 'favicon', '-o', 'fav']);
		const sized = Object.fromEntries(fav.files.filter((f: { width?: number }) => f.width).map((f: { path: string; width: number }) => [f.path.split('/').pop(), f.width]));
		expect(sized).toMatchObject({ 'favicon-16.png': 16, 'favicon-32.png': 32, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512, 'icon-maskable-512.png': 512 });
		expect(existsSync(join(dir, 'fav', 'favicon.ico'))).toBe(true);
		expect(JSON.parse(readFileSync(join(dir, 'fav', 'site.webmanifest'), 'utf8')).icons.length).toBeGreaterThanOrEqual(2);
		const set = run(['icons', 'set', 'check', 'x', '--size', '32', '--format', 'svg,png', '-o', 'set']);
		expect(set.files).toHaveLength(4);
		for (const f of set.files) if (f.format === 'png') expect(size(join(dir, f.path))).toEqual({ width: 32, height: 32 });
		for (const f of set.files) if (f.format === 'svg') expect(offPalette(readFileSync(join(dir, f.path), 'utf8'))).toEqual([]);
		expect(fails(['icons', 'set', 'checkk']).status).toBe(1);
	}, 120000);
});

describe('print documents', () => {
	it('writes stationery at real size and 300 dpi, with the sample copy only when asked', () => {
		const out = run(['print', 'business-card-front', 'letterhead', 'certificate', '--sample', '-o', 'pr']);
		const px = Object.fromEntries(out.made.map((m: { item: string; px: { width: number; height: number } }) => [m.item, m.px]));
		expect(px['business-card-front']).toEqual({ width: 1125, height: 675 });
		expect(px.letterhead).toEqual({ width: 2550, height: 3300 });
		expect(px.certificate).toEqual({ width: 3375, height: 2625 });
		expect(size(join(dir, 'pr', 'letterhead-brand.png'))).toEqual({ width: 2550, height: 3300 });
	}, 120000);
});

describe('page compose', () => {
	it('writes the page from the library sections in React and plain HTML, and refuses an unknown section or slot', () => {
		const outline = {
			title: 'Acme cards',
			sections: [
				{ type: 'header', copy: { action: 'Get started' }, items: [{ label: 'Pricing', href: '#pricing' }] },
				{ type: 'hero', copy: { title: 'Let agents buy anything online', primary: 'Get started' } },
				{ type: 'steps', copy: { title: 'How it works' }, items: [{ title: 'Save it once', description: 'Stored encrypted.' }, { title: 'You approve', description: 'With a passkey.' }] },
				{ type: 'cta', copy: { title: 'Start today', primary: 'Get started' } },
				{ type: 'footer', copy: { description: 'Cards for agents.' }, items: [{ group: 'Product', label: 'Pricing' }] },
			],
		};
		writeFileSync(join(dir, 'outline.json'), JSON.stringify(outline));
		const out = run(['design', 'page', 'compose', 'outline.json', '-o', 'page']);
		expect(out.sections).toEqual(['header', 'hero', 'steps', 'cta', 'footer']);
		const tsx = readFileSync(join(dir, 'page', 'page.tsx'), 'utf8');
		expect(tsx).toContain('@/components/site/hero');
		expect(tsx).toContain('Let agents buy anything online');
		const html = readFileSync(join(dir, 'page', 'index.html'), 'utf8');
		expect(html).toContain('How it works');
		expect(offPalette(html)).toEqual([]);
		writeFileSync(join(dir, 'bad.json'), JSON.stringify({ sections: [{ type: 'heroo' }] }));
		expect(fails(['design', 'page', 'compose', 'bad.json']).status).toBe(1);
		writeFileSync(join(dir, 'bad2.json'), JSON.stringify({ sections: [{ type: 'hero', copy: { titel: 'x' } }] }));
		expect(fails(['design', 'page', 'compose', 'bad2.json']).status).toBe(1);
	}, 120000);
});

describe('motion additions', () => {
	it.runIf(Boolean(ffmpegPath()))('writes the same GIF bytes twice, and a walkthrough of screenshots', () => {
		const a = run(['video', 'hero', '--headline', 'Hello', '--seconds', '2', '--size', 'square', '--format', 'gif', '-o', 'g-a']);
		const b = run(['video', 'hero', '--headline', 'Hello', '--seconds', '2', '--size', 'square', '--format', 'gif', '-o', 'g-b']);
		expect(a.files[0].codec).toBe('gif');
		expect(a.files[0].sha256).toBe(b.files[0].sha256);
		const shot = (name: string, rgb: [number, number, number]) => {
			const w = 320;
			const h = 200;
			const px = new Uint8ClampedArray(w * h * 4);
			for (let i = 0; i < w * h; i++) px.set([...rgb, 255], i * 4);
			writeFileSync(join(dir, name), encodePng({ width: w, height: h, data: px }));
		};
		shot('one.png', [242, 241, 236]);
		shot('two.png', [255, 255, 255]);
		const w = run(['video', 'walkthrough', '--images', 'one.png,two.png', '--headline', 'How it works', '--seconds', '3', '--size', 'og', '-o', 'wt']);
		expect(w.files[0]).toMatchObject({ template: 'walkthrough', width: 1200, height: 630, frames: 90 });
		expect(fails(['video', 'walkthrough', '--images', 'one.png', '--headline', 'x']).status).toBe(1);
	}, 300000);
});
