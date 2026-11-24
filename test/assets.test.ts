import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { encodePng } from '../src/assets/png.js';
import { toonify } from '../src/assets/toon.js';
import { buildScene } from '../src/image/compose.js';
import { SIZES, templateSizes as templateSizesOf } from '../src/image/catalog.js';
import { drawScene, imageConfig } from '../src/image/scene.js';
import { checkItem, logoPlacement, merchConfig } from '../src/merch/render.js';
import { ffmpegPath } from '../src/video/ffmpeg.js';
import { drift, entered, sceneMotion } from '../src/video/motion.js';

const ROOT = join(import.meta.dirname, '..');
const BIN = join(ROOT, 'bin.js');
const dir = mkdtempSync(join(tmpdir(), 'ds-assets-'));
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
const png = (path: string) => {
	const b = readFileSync(path);
	expect(b.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
	return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b };
};
const overlap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

describe('image: the editor layouts', () => {
	it('draws hero, window and cards at every size, the lockup clear of the words', () => {
		for (const [size, s] of Object.entries(SIZES)) {
			for (const template of ['hero', 'window'] as const) {
				if (imageConfig().templates[template].notSizes?.includes(size)) continue;
				const scene = buildScene({ template, width: s.width, height: s.height, headline: 'Let agents buy anything online', badge: 'Issuing', size });
				const drawn = drawScene(scene);
				expect(drawn.logo, `${template} ${size}`).not.toBeNull();
				expect(overlap(drawn.logo!, drawn.text!), `${template} ${size}: logo over words`).toBe(false);
				if (drawn.window) expect(overlap(drawn.window, drawn.text!), `${template} ${size}: window over words`).toBe(false);
			}
		}
	});

	it('is deterministic per seed, and a different seed is a different scatter', () => {
		const a = run(['image', 'render', '--template', 'hero', '--headline', 'Hello', '--stickers', 'scatter', '--seed', '4', '--export', 'png', '-o', 'a']);
		const b = run(['image', 'render', '--template', 'hero', '--headline', 'Hello', '--stickers', 'scatter', '--seed', '4', '--export', 'png', '-o', 'b']);
		const c = run(['image', 'render', '--template', 'hero', '--headline', 'Hello', '--stickers', 'scatter', '--seed', '5', '--export', 'png', '-o', 'c']);
		expect(a.files[0].sha256).toBe(b.files[0].sha256);
		expect(a.files[0].sha256).not.toBe(c.files[0].sha256);
	}, 60000);

	it('takes cards from a JSON file and the social sizes', () => {
		writeFileSync(join(dir, 'cards.json'), JSON.stringify({ template: 'cards', headline: 'How it works', cards: [{ title: 'Save it once', body: 'Stored encrypted.' }, { title: 'Approve each purchase' }] }));
		const out = run(['image', 'render', '-i', 'cards.json', '--size', 'x-banner,linkedin-banner,story', '--export', 'png', '-o', 'cards']);
		expect(out.files.map((f: { width: number; height: number }) => `${f.width}x${f.height}`)).toEqual(['1500x500', '1584x396', '1080x1920']);
	}, 60000);

	it('puts a toon made from the user\'s picture into the hero', () => {
		const px = new Uint8ClampedArray(200 * 160 * 4);
		for (let y = 0; y < 160; y++)
			for (let x = 0; x < 200; x++) {
				const i = (y * 200 + x) * 4;
				const inside = (x - 100) ** 2 + (y - 80) ** 2 < 50 ** 2;
				px.set(inside ? [240, 80, 20, 255] : [235, 232, 225, 255], i);
			}
		writeFileSync(join(dir, 'pic.png'), encodePng({ width: 200, height: 160, data: px }));
		const toon = toonify({ width: 200, height: 160, data: px });
		expect(toon.data[3]).toBe(0);
		expect(toon.data[((80 * toon.width + 100) * 4) + 3]).toBe(255);
		const out = run(['image', 'render', '--template', 'hero', '--headline', 'Hello', '--image', 'pic.png', '--toon', '--export', 'svg', '-o', 'toon']);
		expect(readFileSync(join(dir, out.files[0].path), 'utf8')).toContain('data:image/png;base64');
	}, 60000);

	it('refuses unknown names with the closest one', () => {
		expect(fails(['image', 'render', '--template', 'heroo', '--headline', 'x']).text).toMatch(/Did you mean `hero`/);
		expect(fails(['image', 'render', '--template', 'hero', '--headline', 'x', '--subjects', 'carts']).text).toMatch(/Did you mean `cart`/);
		expect(fails(['image', 'render', '--template', 'hero', '--headline', 'x', '--size', 'storyy']).text).toMatch(/Did you mean `story`/);
		expect(fails(['image', 'render', '--template', 'cards', '--headline', 'x']).text).toMatch(/needs --cards/);
		expect(fails(['image', 'render', '--template', 'headline', '--headline', 'x', '--stickers', 'scatter']).text).toMatch(/does not take --stickers/);
	});
});

describe('illustrate', () => {
	it('writes SVG with a vector ground and a PNG, the same bytes twice', () => {
		const a = run(['illustrate', 'cart', 'coins', '-o', 'ill-a']);
		const b = run(['illustrate', 'cart', 'coins', '-o', 'ill-b']);
		expect(a.files.map((f: { sha256: string }) => f.sha256)).toEqual(b.files.map((f: { sha256: string }) => f.sha256));
		const svg = readFileSync(join(dir, 'ill-a', 'cart-coins.svg'), 'utf8');
		expect(svg).toMatch(/<rect x="0" y="0" width="1080" height="1080" fill="#0000FF"\/>/);
		expect(png(join(dir, 'ill-a', 'cart-coins.png')).width).toBe(1080);
	}, 60000);

	it('makes a clear toon object from a picture, and names the nearest composition', () => {
		const out = run(['illustrate', '--image', 'pic.png', '--composition', 'object', '-o', 'obj', '--format', 'png']);
		const p = png(join(dir, out.files[0].path));
		expect(p.width).toBeLessThan(200);
		expect(fails(['illustrate', 'cart', '--composition', 'singel']).text).toMatch(/Did you mean `single`/);
		expect(fails(['illustrat']).text).toMatch(/Did you mean `illustrate`/);
	}, 60000);
});

describe('deck', () => {
	it('renders the sample deck to a PNG per slide and one PDF, the same bytes twice', () => {
		const a = run(['deck', '--sample', '-o', 'deck-a']);
		const b = run(['deck', '--sample', '-o', 'deck-b']);
		expect(a.slides).toBe(9);
		const pdf = readFileSync(join(dir, 'deck-a', 'deck.pdf'));
		expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
		expect((pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length).toBe(9);
		expect(a.files.map((f: { sha256: string }) => f.sha256)).toEqual(b.files.map((f: { sha256: string }) => f.sha256));
		for (const f of readdirSync(join(dir, 'deck-a')).filter((n) => n.endsWith('.png'))) expect(png(join(dir, 'deck-a', f))).toMatchObject({ width: 1920, height: 1080 });
	}, 180000);

	it('checks slide types and slots', () => {
		writeFileSync(join(dir, 'bad.json'), JSON.stringify({ slides: [{ type: 'covr', title: 'x' }] }));
		expect(fails(['deck', '-i', 'bad.json']).text).toMatch(/Did you mean `cover`/);
		writeFileSync(join(dir, 'bad2.json'), JSON.stringify({ slides: [{ type: 'cover', titel: 'x' }] }));
		expect(fails(['deck', '-i', 'bad2.json']).text).toMatch(/Did you mean `title`/);
	});
});

describe('merch', () => {
	it('keeps every logo to the conventions: minimum width, safe area, clear space', () => {
		for (const item of merchConfig().items) expect(checkItem(item), item.id).toEqual([]);
		const cap = merchConfig().items.find((i) => i.id === 'cap-front')!;
		const lockup = cap.layers.find((l) => l.type === 'logo')!;
		expect(logoPlacement(lockup as never).w).toBeGreaterThanOrEqual(merchConfig().logo.minWidth.lockup);
	});

	it('writes print files at real size and 300 dpi, a proof and a cut line', () => {
		const out = run(['merch', 'tee-front', 'sticker', '-o', 'merch']);
		expect(out.note).toMatch(/conventions/);
		const tee = png(join(dir, 'merch', 'tee-front-brand.png'));
		expect(tee).toMatchObject({ width: 3600, height: 4800 });
		expect(tee.bytes.includes(Buffer.from('pHYs'))).toBe(true);
		expect(readFileSync(join(dir, 'merch', 'tee-front-brand.svg'), 'utf8')).toContain('width="12in" height="16in"');
		expect(png(join(dir, 'merch', 'sticker-blue.png'))).toMatchObject({ width: 975, height: 450 });
		expect(readFileSync(join(dir, 'merch', 'sticker-blue-cut.svg'), 'utf8')).toContain('id="CutContour"');
		expect(existsSync(join(dir, 'merch', 'sticker-blue-proof.png'))).toBe(true);
		expect(fails(['merch', 'tshirt']).status).toBe(1);
		expect(fails(['merch', 'tee-front', '--variant', 'blu']).text).toMatch(/Choose from/);
	}, 120000);
});

describe('video', () => {
	it('moves on the brand ease-out and the site drift, never from nothing', () => {
		expect(entered(0, 0.2)).toBe(0);
		expect(entered(10, 0.2)).toBe(1);
		const early = entered(0.25, 0.2);
		expect(early).toBeGreaterThan(0.25);
		const scene = buildScene({ template: 'hero', width: 1080, height: 1080, headline: 'Hello' });
		const m = sceneMotion(scene, 0);
		expect(Math.min(...m.stickers!.map((s) => s.scale))).toBeGreaterThanOrEqual(0.95);
		const d = drift(0, 4.5);
		expect(Math.abs(d.dx)).toBeLessThanOrEqual(5);
	});

	it.runIf(Boolean(ffmpegPath()))('writes the same MP4 and WebM bytes twice, and a still', () => {
		const a = run(['video', 'render', '--template', 'hero', '--headline', 'Hello', '--seconds', '2', '--size', 'og', '--export', 'mp4,webm', '-o', 'v-a']);
		const b = run(['video', 'render', '--template', 'hero', '--headline', 'Hello', '--seconds', '2', '--size', 'og', '--export', 'mp4,webm', '-o', 'v-b']);
		expect(a.files.map((f: { codec: string }) => f.codec)).toEqual(['h264', 'vp9']);
		expect(a.files.map((f: { sha256: string }) => f.sha256)).toEqual(b.files.map((f: { sha256: string }) => f.sha256));
		expect(a.files[0].frames).toBe(60);
		const still = run(['video', 'render', '--template', 'cards', '--headline', 'How it works', '--cards', 'One\\n\\nTwo', '--still', 'end', '--size', 'square', '-o', 'v-s']);
		expect(still.files.map((f: { format: string }) => f.format).sort()).toEqual(['png', 'svg']);
	}, 300000);
});

describe('figma', () => {
	it('writes the tokens as one Site mode and a script that parses', () => {
		const out = run(['figma', 'tokens', '--out', 'fig']);
		expect(out.modes).toEqual(['Site']);
		expect(out.variables).toBeGreaterThan(100);
		const script = readFileSync(join(dir, 'fig', 'tokens-1.js'), 'utf8');
		expect(() => new Function('figma', `return (async () => {${script}})`)).not.toThrow();
		expect(out.steps.map((s: { tool: string }) => s.tool)).toContain('use_figma');
	});

	it('pushes an illustration, reads a pull URL, and checks values against the tokens', () => {
		const push = run(['figma', 'push', 'illustration', 'cart', '--file', 'abc', '--out', 'fig']);
		expect(push.files.some((f: string) => f.endsWith('.svg'))).toBe(true);
		const pull = run(['figma', 'pull', 'https://www.figma.com/design/AbCdEfGhIjKl1234/Test?node-id=1-2', '--out', 'fig']);
		expect(pull).toMatchObject({ fileKey: 'AbCdEfGhIjKl1234', nodeId: '1:2' });
		writeFileSync(join(dir, 'ctx.txt'), '<div className="bg-[#0000ff] text-[#1a1aff] rounded-[12px]">');
		const r = fails(['figma', 'check', 'ctx.txt']);
		expect(r.status).toBe(1);
		expect(r.text).toMatch(/#1a1aff is not a brand color; nearest --ds-color-/);
	}, 60000);
});

describe('manifest and help', () => {
	it('lists every asset command with its flags, and the brand names it accepts', () => {
		const m = run(['manifest']);
		const paths = m.cli.map((c: { path: string[] }) => c.path.join(' '));
		for (const p of ['image render', 'video render', 'deck', 'merch', 'illustrate', 'figma']) expect(paths).toContain(p);
		expect(m.illustrate.subjects.length).toBe(15);
		expect(m.lockups.colors).toEqual(['blue', 'ink', 'white']);
		expect(m.images.sizes.map((s: { id: string }) => s.id)).toEqual([...Object.keys(imageConfig().sizes), 'custom']);
		const d = run(['describe']);
		expect(d.cli.length).toBe(m.cli.length);
	});

	it('keeps every help row clear of its description', () => {
		for (const cmd of [['image', 'render'], ['video', 'render'], ['deck'], ['merch'], ['illustrate'], ['figma'], []]) {
			const text = execFileSync(process.execPath, [BIN, ...cmd, '--help'], { cwd: dir, encoding: 'utf8' });
			for (const line of text.split('\n').filter((l) => /^ {2}-/.test(l))) expect(line, line).toMatch(/^ {2}\S.*?\S {2,}\S|^ {2}\S+( <[^>]+>| \[[^\]]+\])?$/);
		}
	});
});

describe('the gaps closed', () => {
	it('takes image <template>, the old subcommands, every format, a named file, custom sizes and the shared size names', () => {
		const a = run(['image', 'hero', '--headline', 'Hello', '--size', 'twitter-header', '--format', 'png,jpg,webp', '-o', 'gap-a']);
		expect(a.files.map((f: { format: string; width: number }) => `${f.format} ${f.width}`)).toEqual(['png 1500', 'jpg 1500', 'webp 1500']);
		const webp = readFileSync(join(dir, a.files[2].path));
		expect(webp.subarray(0, 4).toString()).toBe('RIFF');
		expect(webp.subarray(8, 12).toString()).toBe('WEBP');
		expect(readFileSync(join(dir, a.files[1].path)).subarray(0, 2).toString('hex')).toBe('ffd8');
		const b = run(['image', 'render', '--template', 'hero', '--headline', 'Hello', '--size', 'twitter-header', '--format', 'png', '-o', 'gap-b']);
		expect(b.files[0].sha256).toBe(a.files[0].sha256);
		const one = run(['image', 'headline', '--headline', 'Hello', '--out', 'banner.png', '--size', 'x-banner']);
		expect(one.files.map((f: { path: string }) => f.path)).toEqual(['banner.png']);
		const custom = run(['image', 'headline', '--headline', 'Hello', '--size', 'custom', '--width', '1600', '--height', '400', '--format', 'png', '-o', 'gap-c']);
		expect(png(join(dir, custom.files[0].path))).toMatchObject({ width: 1600, height: 400 });
		const sizes = run(['image', 'logo', '--size', 'all', '--format', 'png', '-o', 'gap-d']);
		expect(sizes.files.length).toBe(templateSizesOf('logo').length);
		expect(run(['image', '--list']).sizes.map((s: { id: string }) => s.id)).toContain('youtube-thumbnail');
	}, 120000);

	it('draws only what was passed, and refuses what it cannot draw whole', () => {
		const svg = (args: string[]) => {
			const r = run(['image', ...args, '--format', 'svg', '-o', 'gap-e']);
			return readFileSync(join(dir, r.files[0].path), 'utf8');
		};
		expect(svg(['headline', '--headline', 'Hello', '--no-footer'])).not.toBe(svg(['headline', '--headline', 'Hello']));
		expect(fails(['image', 'headline', '--headline', 'Ship faster 🚀']).text).toMatch(/no character for 🚀/);
		expect(fails(['image', 'headline', '--headline', 'Donaudampfschifffahrtselektrizitätenhauptbetriebswerkbauunterbeamtengesellschaft', '--size', 'square']).text).toMatch(/too long/);
		expect(fails(['image', 'logo', '--headline', 'x']).text).toMatch(/does not take --headline/);
		expect(fails(['image', 'hero', '--headline', 'x', '--footer', 'y']).text).toMatch(/does not take --footer/);
		expect(fails(['image', 'screenshot', '--headline', 'x']).text).toMatch(/empty window/);
		expect(fails(['image', 'cards', '--headline', 'x', '--cards', 'a\n\nb', '--size', 'avatar']).text).toMatch(/not drawn at avatar/);
		const merch = run(['merch', 'tee-back', '--format', 'svg', '--no-proof', '-o', 'gap-m']);
		expect(readFileSync(join(dir, merch.files[0].path), 'utf8')).not.toContain('id="text-headline"');
		expect(fails(['merch', 'cap-front', '--headline', 'x']).text).toMatch(/no place for --headline/);
		writeFileSync(join(dir, 'long.json'), JSON.stringify({ slides: [{ type: 'stat', stat: '1,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456,789,012,345,678,901', title: 'x' }] }));
		expect(fails(['deck', '-i', 'long.json']).text).toMatch(/Slide 1 \(stat\).*Shorten/);
	}, 120000);

	it('makes a numbered carousel with one headline size', () => {
		writeFileSync(join(dir, 'carousel.json'), JSON.stringify({ template: 'headline', theme: 'paper', slides: [{ headline: 'Save it once' }, { headline: 'Every purchase is approved by the person who pays for it, whatever it is' }, { template: 'logo' }] }));
		const out = run(['image', 'carousel', '-i', 'carousel.json', '--size', 'portrait', '--format', 'svg', '-o', 'gap-f']);
		expect(out.files.map((f: { path: string }) => f.path.split('/').pop())).toEqual(['carousel-portrait-01.svg', 'carousel-portrait-02.svg', 'carousel-portrait-03.svg']);
		expect(fails(['image', 'carousel', '-i', 'carousel.json', '--size', 'x-banner']).status).toBe(1);
	}, 120000);

	it('revises a design in plain words, undoes it, and refuses what is off brand', () => {
		const made = run(['design', 'new', 'hero', '--size', 'x-banner', '--headline', 'Let agents buy anything online', '-o', 'b.design.json']);
		expect(made.ok).toBe(true);
		const first = readFileSync(join(dir, 'b.png'));
		expect(first.equals(readFileSync(join(dir, run(['image', 'hero', '--headline', 'Let agents buy anything online', '--size', 'x-banner', '--format', 'png', '-o', 'gap-g']).files[0].path)))).toBe(true);
		expect(run(['design', 'revise', 'b.design.json', 'bigger headline, logo top right, darker theme']).changes.sort()).toEqual(['headline 20% bigger', 'logo top right', 'theme ink']);
		run(['design', 'undo', 'b.design.json']);
		expect(readFileSync(join(dir, 'b.png')).equals(first)).toBe(true);
		expect(fails(['design', 'revise', 'b.design.json', 'make the logo neon green']).text).toMatch(/Nothing was changed/);
		expect(fails(['design', 'edit', 'b.design.json', '--layer', 'headline.scale=3']).text).toMatch(/0.5 to 1.6/);
	}, 120000);
});
