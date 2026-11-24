// Renders the docs site's asset gallery from the CLI's own renderers: share images, deck slides, illustrations, merch
// proofs and one clip, as small JPEGs (and the clip as MP4) in apps/www/public/assets, with gallery.json describing
// each one and the command that makes it. Run after a change to the asset engine or brand/assets: npm run gallery.
import jpeg from 'jpeg-js';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { sampleDeck, slideSvg } from '../src/deck/slides.js';
import { parseCards } from '../src/image/compose.js';
import { renderSvg } from '../src/image/layout.js';
import { assertImageInput, resolveFields, SIZES, type TemplateId } from '../src/image/catalog.js';
import { rasterizeRgba } from '../src/image/render.js';
import { illustrateConfig } from '../src/image/scene.js';
import { buildIllustration, illustrationSvg } from '../src/illustrate/render.js';
import { brand, cli } from '../src/lib/brand.js';
import { merchConfig, merchSlots, merchSvgs } from '../src/merch/render.js';

const root = new URL('..', import.meta.url).pathname;
const out = join(root, 'apps', 'www', 'public', 'assets');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const host = new URL(brand().site!).host.replace(/^www\./, '');

type Entry = { file: string; title: string; command: string; width: number; height: number; group: string };
const entries: Entry[] = [];

async function save(group: string, file: string, svg: string, width: number, height: number, title: string, command: string, thumb = 960) {
	const w = Math.min(thumb, width);
	const r = await rasterizeRgba(svg, w);
	const rgb = new Uint8Array(r.pixels);
	// A clear ground (an object alone, a garment print) shows on the docs' paper, flattened before JPEG.
	for (let i = 0; i < rgb.length; i += 4) {
		const a = rgb[i + 3]! / 255;
		if (a < 1) for (let c = 0; c < 3; c++) rgb[i + c] = Math.round(rgb[i + c]! * a + [242, 241, 236][c]! * (1 - a));
		rgb[i + 3] = 255;
	}
	writeFileSync(join(out, file), Buffer.from(jpeg.encode({ data: rgb, width: r.width, height: r.height }, 84).data));
	entries.push({ file: `/assets/${file}`, title, command, width, height, group });
}

const cards = parseCards('Save it once, not in the chat\nYour user adds their card a single time. It is stored encrypted, never pasted into a conversation.\n\nThe agent never sees the number\nIt asks to buy. The card pays at checkout.\n\nEvery purchase is approved\nWith a passkey, Face ID or their voice, tied to that exact cart.\n\nIt is still their card\nPoints land as usual. Disputes go through their bank.');
const images: [TemplateId, string, Record<string, unknown>, string][] = [
	['hero', 'og', { headline: 'Let agents buy anything online' }, '--template hero --headline "Let agents buy anything online"'],
	['window', 'og', { badge: 'Issuing', headline: 'Create one-time and multi-use cards' }, '--template window --badge Issuing --headline "Create one-time and multi-use cards"'],
	['cards', 'landscape', { headline: 'How to safely share your users’ cards with an agent', cards }, '--template cards --input cards.json --size landscape'],
	['hero', 'story', { badge: 'New', headline: 'Purchase Agent', body: 'Integrate our agent into yours and enable purchases from the stores people already use.', stickers: 'under' }, '--template hero --badge New --headline "Purchase Agent" --body "..." --stickers under --size story'],
	['window', 'square', { badge: 'Vault', headline: 'Store customers’ cards and make purchases with agents safely', picture: 'wallet', windowBody: 'sky', window: 'vault.product' }, '--template window --badge Vault --headline "..." --picture wallet --window-body sky --window vault.product --size square'],
	['hero', 'x-banner', { headline: 'Let agents buy anything online' }, '--template hero --headline "..." --size x-banner'],
	['hero', 'linkedin-banner', { headline: 'Let agents buy anything online', ground: 'ink' }, '--template hero --headline "..." --ground ink --size linkedin-banner'],
	['hero', 'portrait', { headline: 'Every purchase is approved', ground: 'ink', stickers: 'scatter', seed: 8, count: 6 }, '--template hero --headline "..." --ground ink --stickers scatter --seed 8 --count 6 --size portrait'],
	['subtext', 'og', { headline: 'Let agents buy anything online', body: 'Cards your agent can use, with every purchase approved.' }, '--template subtext --headline "..." --body "..."'],
	['quote', 'square', { quote: 'Our agents finally buy what people ask for, and every purchase is approved.', by: 'Head of product, Acme' }, '--template quote --quote "..." --by "Head of product, Acme" --size square'],
];
for (const [i, [template, size, fields, flags]] of images.entries()) {
	const { width, height } = SIZES[size]!;
	const { ground, ...rest } = fields as { ground?: string };
	const resolved = resolveFields(assertImageInput({ template, ...rest, ...(ground ? { theme: ground } : {}) }), { footer: host });
	const command = `${cli()} image ${flags.replace('--template ', '').replace('--ground', '--theme')}`;
	await save('image', `image-${i + 1}-${template}-${size}.jpg`, renderSvg({ ...resolved, size, width, height }), width, height, `${template}, ${size} (${width} by ${height})`, `${command}${size === 'og' || flags.includes('--size') ? '' : ` --size ${size}`}`);
}

for (const [i, slide] of sampleDeck().entries()) await save('deck', `deck-${String(i + 1).padStart(2, '0')}-${slide.type}.jpg`, slideSvg(slide, i), 1920, 1080, `${slide.type}`, `${cli()} deck --sample`, 640);

const ills: [string, Parameters<typeof buildIllustration>[0], string][] = [
	['cart', { subjects: ['cart'], toon: true }, 'illustrate cart'],
	['row', { subjects: ['coins', 'wallet', 'receipt'], toon: true, ground: 'paper' }, 'illustrate coins wallet receipt --ground paper'],
	['preset', { subjects: [], toon: true, composition: 'preset', width: 1200, height: 630 }, 'illustrate --composition preset --size og'],
	['scatter', { subjects: [], toon: true, composition: 'scatter', seed: 5, width: 1200, height: 630, ground: 'ink' }, 'illustrate --composition scatter --seed 5 --size og --ground ink'],
	['band', { subjects: ['gift'], toon: true, band: 'paper' }, 'illustrate gift --band paper'],
	['terminal', { subjects: ['terminal'], toon: true, ground: 'white' }, 'illustrate terminal --ground white'],
];
for (const [name, input, flags] of ills) {
	const ill = buildIllustration(input);
	await save('illustration', `illustration-${name}.jpg`, illustrationSvg(ill), ill.width, ill.height, name, `${cli()} ${flags}`, 720);
}
for (const id of Object.keys(illustrateConfig().subjects)) {
	const ill = buildIllustration({ subjects: [id], toon: true, composition: 'object' });
	await save('subject', `subject-${id}.jpg`, illustrationSvg(ill), ill.width, ill.height, illustrateConfig().subjects[id]!.label, `${cli()} illustrate ${id}`, 320);
}

for (const item of merchConfig().items) {
	const variant = item.variants[0]!;
	const svgs = merchSvgs(item, variant, { sample: true });
	await save(item.group === 'document' ? 'print' : 'merch', `merch-${item.id}-${variant}.jpg`, svgs.proof, svgs.width, svgs.height, `${item.name} (${item.size[0]} by ${item.size[1]} in, ${variant})`, `${cli()} merch ${item.id} --variant ${variant}${merchSlots(item).includes('headline') ? ' --headline "..."' : ''}`, 600);
}

// The data layouts and the ads, through the same engine as the image command.
const more: [TemplateId, string, Record<string, unknown>, string, string][] = [
	['stat', 'square', { stat: '40%', headline: 'fewer abandoned carts at Acme' }, '--stat 40% --headline "fewer abandoned carts at Acme" --size square', 'data'],
	['chart', 'og', { headline: 'Purchases approved', data: 'Jan: 120, Feb: 180, Mar: 260, Apr: 310' }, '--headline "Purchases approved" --data "Jan: 120, Feb: 180, Mar: 260, Apr: 310"', 'data'],
	['chart', 'square', { headline: 'Where purchases come from', data: 'Agents: 62, Voice: 23, Web: 15', chart: 'donut' }, '--headline "..." --data "Agents: 62, Voice: 23, Web: 15" --chart donut --size square', 'data'],
	['pricing', 'og', { headline: 'Pricing', plans: 'Starter\n$0\nOne agent\nPay per purchase\n\nPro\n$49 / month\nTen agents\nVoice approvals' }, '--headline Pricing --plans "..."', 'data'],
	['compare', 'og', { headline: 'Pasting the card vs Agentcard', columns: 'Pasting the card\nThe number sits in the chat\nNo approval per purchase\n\nAgentcard\nThe agent never sees the number\nEvery purchase approved' }, '--headline "..." --columns "..."', 'data'],
	['flow', 'og', { headline: 'How it works', steps: 'Save it once\nThe card is stored encrypted.\n\nThe agent asks\nIt never sees the number.\n\nYou approve\nWith a passkey.' }, '--headline "How it works" --steps "..."', 'data'],
	['headline', 'ad-300x250', { headline: 'Let agents buy anything online', button: 'Start free' }, '--headline "..." --button "Start free" --size ad-300x250', 'ads'],
	['headline', 'ad-728x90', { headline: 'Let agents buy anything online', button: 'Start free' }, '--headline "..." --button "Start free" --size ad-728x90', 'ads'],
	['hero', 'ad-300x600', { headline: 'Let agents buy anything online' }, '--headline "..." --size ad-300x600', 'ads'],
	['hero', 'meeting', { headline: 'Acme' }, '--headline Acme --size meeting', 'ads'],
];
for (const [i, [template, size, fields, flags, group]] of more.entries()) {
	const { width, height } = SIZES[size]!;
	const resolved = resolveFields(assertImageInput({ template, ...fields }), { footer: host });
	await save(group, `${group}-${i + 1}-${template}-${size}.jpg`, renderSvg({ ...resolved, size, width, height }), width, height, `${template}, ${size} (${width} by ${height})`, `${cli()} image ${template} ${flags}`);
}

// One clip, rendered through the CLI itself so the gallery shows exactly what an app gets.
execFileSync(process.execPath, [join(root, 'bin.js'), 'video', 'hero', '--headline', 'Let agents buy anything online', '--size', 'og', '--seconds', '4', '--format', 'mp4', '--out', out, '--name', 'clip'], { stdio: 'inherit' });
entries.push({ file: '/assets/clip-og.mp4', title: 'hero clip, og', command: `${cli()} video hero --headline "Let agents buy anything online" --size og --format mp4,webm`, width: 1200, height: 630, group: 'video' });

// A real design session: made, revised in plain words, edited exactly, undone, and an off-brand ask refused.
{
	const { adapter, paint } = await import('../src/design/adapter.js');
	const { runDesign } = await import('../src/design/index.js');
	const { mkdtempSync, readFileSync } = await import('node:fs');
	const { tmpdir } = await import('node:os');
	const cwd = mkdtempSync(join(tmpdir(), 'gallery-design-'));
	const steps: [string, string[]][] = [
		['New X banner', ['new', 'hero', '--size', 'x-banner', '--headline', 'Let agents buy anything online', '-o', 'banner.design.json']],
		['bigger headline, logo top right', ['revise', 'banner.design.json', 'bigger headline, logo top right']],
		['darker theme', ['revise', 'banner.design.json', 'darker theme']],
		['add a badge and a line', ['revise', 'banner.design.json', 'add a badge "New", body "Every purchase is approved."']],
		['another version', ['revise', 'banner.design.json', 'another version']],
		['a key, words on the left', ['edit', 'banner.design.json', '--set', 'button=Start free', '--layer', 'headline.align=left']],
		['undo', ['undo', 'banner.design.json']],
	];
	let n = 0;
	for (const [title, argv] of steps) {
		const said: string[] = [];
		const code = await runDesign(argv, adapter(), { cwd, bin: cli(), out: (t) => said.push(t), err: (t) => said.push(t), paint });
		if (code) throw new Error(`design ${argv.join(' ')} failed: ${said.join(' ')}`);
		n++;
		const svgFree = readFileSync(join(cwd, 'banner.png'));
		const file = `design-${n}.png`;
		writeFileSync(join(out, file), svgFree);
		const shown = argv.map((a) => (/\s/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)).join(' ');
		entries.push({ file: `/assets/${file}`, title, command: `${cli()} design ${shown}`, width: 1500, height: 500, group: 'design' });
	}
	const refused: string[] = [];
	await runDesign(['revise', 'banner.design.json', 'make the logo neon green'], adapter(), { cwd, bin: cli(), out: (t) => refused.push(t), err: (t) => refused.push(t), paint });
	entries.push({ file: '', title: refused.join(' ').replace(/\s+/g, ' ').trim(), command: `${cli()} design revise banner.design.json "make the logo neon green"`, width: 0, height: 0, group: 'design-refused' });
}

writeFileSync(join(out, 'gallery.json'), `${JSON.stringify(entries, null, '\t')}\n`);
console.log(`gallery: ${entries.length} entries in apps/www/public/assets`);
