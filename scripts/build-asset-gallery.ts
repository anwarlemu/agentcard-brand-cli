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
import { TEMPLATES } from '../src/image/catalog.js';
import { rasterizeRgba } from '../src/image/render.js';
import { illustrateConfig } from '../src/image/scene.js';
import { buildIllustration, illustrationSvg } from '../src/illustrate/render.js';
import { brand, cli } from '../src/lib/brand.js';
import { merchConfig, merchSvgs } from '../src/merch/render.js';

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

const SIZES = { og: [1200, 630], square: [1080, 1080], portrait: [1080, 1350], landscape: [1200, 675], story: [1080, 1920], 'x-banner': [1500, 500], 'linkedin-banner': [1584, 396] } as const;
const cards = parseCards('Save it once, not in the chat\nYour user adds their card a single time. It is stored encrypted, never pasted into a conversation.\n\nThe agent never sees the number\nIt asks to buy. The card pays at checkout.\n\nEvery purchase is approved\nWith a passkey, Face ID or their voice, tied to that exact cart.\n\nIt is still their card\nPoints land as usual. Disputes go through their bank.');
const images: [string, keyof typeof SIZES, Record<string, unknown>, string][] = [
	['hero', 'og', { headline: 'Let agents buy anything online' }, '--template hero --headline "Let agents buy anything online"'],
	['window', 'og', { eyebrow: 'Issuing', headline: 'Create one-time and multi-use cards' }, '--template window --eyebrow Issuing --headline "Create one-time and multi-use cards"'],
	['cards', 'landscape', { headline: 'How to safely share your users’ cards with an agent', cards }, '--template cards --input cards.json --size landscape'],
	['hero', 'story', { eyebrow: 'New', headline: 'Purchase Agent', subtext: 'Integrate our agent into yours and enable purchases from the stores people already use.', stickers: 'under' }, '--template hero --eyebrow New --headline "Purchase Agent" --subtext "..." --stickers under --size story'],
	['window', 'square', { eyebrow: 'Vault', headline: 'Store customers’ cards and make purchases with agents safely', picture: 'wallet', windowBody: 'sky', window: 'vault.product' }, '--template window --eyebrow Vault --headline "..." --picture wallet --window-body sky --window vault.product --size square'],
	['hero', 'x-banner', { headline: 'Let agents buy anything online' }, '--template hero --headline "..." --size x-banner'],
	['hero', 'linkedin-banner', { headline: 'Let agents buy anything online', ground: 'ink' }, '--template hero --headline "..." --ground ink --size linkedin-banner'],
	['hero', 'portrait', { headline: 'Every purchase is approved', ground: 'ink', stickers: 'scatter', seed: 8, count: 6 }, '--template hero --headline "..." --ground ink --stickers scatter --seed 8 --count 6 --size portrait'],
	['subtext', 'og', { headline: 'Let agents buy anything online', subtext: 'Cards your agent can use, with every purchase approved.' }, '--template subtext --headline "..." --subtext "..."'],
	['quote', 'square', { quote: 'Our agents finally buy what people ask for, and every purchase is approved.', by: 'Head of product, Acme' }, '--template quote --quote "..." --by "Head of product, Acme" --size square'],
];
for (const [i, [template, size, fields, flags]] of images.entries()) {
	const [width, height] = SIZES[size];
	await save('image', `image-${i + 1}-${template}-${size}.jpg`, renderSvg({ template: template as never, size, width, height, footer: host, ground: (TEMPLATES as Record<string, { ground: string }>)[template]!.ground === 'split' ? undefined : (TEMPLATES as Record<string, { ground: string }>)[template]!.ground, ...fields } as never), width, height, `${template}, ${size} (${width} by ${height})`, `${cli()} image render ${flags}${size === 'og' || flags.includes('--size') ? '' : ` --size ${size}`}`);
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
	const svgs = merchSvgs(item, variant);
	await save('merch', `merch-${item.id}-${variant}.jpg`, svgs.proof, svgs.width, svgs.height, `${item.name} (${item.size[0]} by ${item.size[1]} in, ${variant})`, `${cli()} merch ${item.id} --variant ${variant}`, 600);
}

// One clip, rendered through the CLI itself so the gallery shows exactly what an app gets.
execFileSync(process.execPath, [join(root, 'bin.js'), 'video', 'render', '--template', 'hero', '--headline', 'Let agents buy anything online', '--size', 'og', '--seconds', '4', '--export', 'mp4', '--out', out, '--name', 'clip'], { stdio: 'inherit' });
entries.push({ file: '/assets/clip-og.mp4', title: 'hero clip, og', command: `${cli()} video render --template hero --headline "Let agents buy anything online" --size og --export mp4,webm`, width: 1200, height: 630, group: 'video' });

writeFileSync(join(out, 'gallery.json'), `${JSON.stringify(entries, null, '\t')}\n`);
console.log(`gallery: ${entries.length} entries in apps/www/public/assets`);
