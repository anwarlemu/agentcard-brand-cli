// The one catalog an agent can read before it calls anything else.

import { readFileSync } from 'node:fs';
import { fonts, logos, tokenRows, tokensByGroup, voice } from './catalog.js';
import { principles } from './principles.js';
import { catalog as imageCatalog } from '../image/catalog.js';
import { brand, cli } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { contractOf, library } from '../library/contract.js';
import { videoCatalog } from '../commands/video.js';
import type { Command, Option } from 'commander';
import { deckCatalog } from '../commands/deck.js';
import { illustrateCatalog } from '../commands/illustrate.js';
import { merchCatalog } from '../commands/merch.js';
import { FIGMA_ACTIONS, PUSH_KINDS } from '../commands/figma.js';
import { imageConfig } from '../image/scene.js';

let program: Command | undefined;
/** The CLI hands its command tree over, so the manifest lists every command and flag from the definitions themselves. */
export function attachProgram(p: Command) {
	program = p;
}

const flagOf = (o: Option) => o.long?.replace(/^--/, '') ?? o.short?.replace(/^-/, '') ?? o.flags;

function commandTree(cmd: Command, prefix: string[] = []): { path: string[]; usage: string; summary: string; flags: string[]; aliases: string[] }[] {
	return cmd.commands.flatMap((c) => {
		const path = [...prefix, c.name()];
		const row = { path, usage: `${cli()} ${path.join(' ')}${c.usage() ? ` ${c.usage()}` : ''}`, summary: c.description(), flags: [...new Set(c.options.map(flagOf))], aliases: c.aliases() };
		return [row, ...commandTree(c, path)];
	});
}

export const COMMANDS = [
	{ path: ['manifest'], summary: 'List every command, token, template, size, component and rule.', reads: true, writes: false, json: true },
	{ path: ['describe'], summary: 'Same as manifest.', reads: true, writes: false, json: true },
	{ path: ['brand'], summary: 'Tokens, fonts, logos and voice.', reads: true, writes: false, json: true },
	{ path: ['brand', 'tokens'], summary: 'Token groups. --group selects one. --name looks up one token and errors if it is missing.', reads: true, writes: false, json: true },
	{ path: ['brand', 'fonts'], summary: 'Font files that ship, and font tokens whose families do not.', reads: true, writes: false, json: true },
	{ path: ['brand', 'logos'], summary: 'Logo files and the usage rules stored with the logo component.', reads: true, writes: false, json: true },
	{ path: ['brand', 'voice'], summary: 'Voice and the quoted words the principle file tells agents to avoid.', reads: true, writes: false, json: true },
	{ path: ['principles'], summary: 'Website rules, do and dont lists, element rules, and the product gap when product is not defined.', reads: true, writes: false, json: true },
	{ path: ['image', 'list'], summary: 'Open Graph and social sizes, templates and fields.', reads: true, writes: false, json: true },
	{ path: ['image', 'render'], summary: 'Write a PNG and SVG. Unknown templates, sizes, exports and JSON fields error.', reads: false, writes: true, json: true },
	{ path: ['video', 'list'], summary: 'Video sizes, templates, frame count and renderer.', reads: true, writes: false, json: true },
	{ path: ['video', 'render'], summary: 'Write an MP4 or WebM clip (ffmpeg; Motion JPEG MP4 without it), or one frame with --still. Unknown templates, sizes and fields error.', reads: false, writes: true, json: true },
	{ path: ['deck'], summary: 'Slides at 1920 by 1080 from a JSON file: a PNG per slide and one PDF. --list names the slide types and slots.', reads: false, writes: true, json: true },
	{ path: ['merch'], summary: 'Merch print files at real size with bleed and safe area (SVG, 300 dpi PNG, proof, cut line). --list names items and variants.', reads: false, writes: true, json: true },
	{ path: ['illustrate'], summary: 'Toon object illustrations from the brand\'s objects or any picture (SVG and PNG). --list names subjects and compositions.', reads: false, writes: true, json: true },
	{ path: ['figma', 'tokens'], summary: 'The tokens as Figma variables: tokens.json and use_figma scripts, plus the MCP steps.', reads: false, writes: true, json: true },
	{ path: ['figma', 'push'], summary: 'An illustration, image, slide, component or page as Figma-ready files, plus the MCP steps.', reads: false, writes: true, json: true },
	{ path: ['figma', 'pull'], summary: 'The MCP read steps for a Figma node and where to save each result.', reads: true, writes: false, json: true },
	{ path: ['figma', 'check'], summary: 'Saved Figma variables or design context checked against the tokens; off-brand values name the nearest token and exit 1.', reads: true, writes: false, json: true },
	{ path: ['component', 'list'], summary: 'Every bundled component.', reads: true, writes: false, json: true },
	{ path: ['component', 'inspect'], summary: 'Exports, variant maps, example states, usage and constraints for one component.', reads: true, writes: false, json: true },
	{ path: ['component', 'emit'], summary: 'Copy an example state, or emit markup whose props are keys from that variant map.', reads: true, writes: false, json: true },
	{ path: ['guide'], summary: 'Portable agent workflow.', reads: true, writes: false, json: true },
	{ path: ['tokens'], summary: 'Search tokens by a substring of the name or value.', reads: true, writes: false, json: true },
	{ path: ['list'], summary: 'Search the component index.', reads: true, writes: false, json: true },
	{ path: ['search'], summary: 'Search the component index.', reads: true, writes: false, json: true },
	{ path: ['show'], summary: 'Full registry record, including source. inspect and view are the same command.', reads: true, writes: false, json: true },
	{ path: ['look'], summary: 'Element styling for a file or an element id.', reads: true, writes: false, json: true },
	{ path: ['check'], summary: 'Token check. --fix writes replacements.', reads: true, writes: true, json: true },
	{ path: ['info'], summary: 'Project configuration for the current app.', reads: true, writes: false, json: true },
	{ path: ['init'], summary: 'Install styles, fonts and agent instructions.', reads: false, writes: true, json: true },
	{ path: ['add'], summary: 'Copy components into an app.', reads: false, writes: true, json: true },
	{ path: ['apply'], summary: 'Restyle an existing app.', reads: false, writes: true, json: true },
	{ path: ['review'], summary: 'Screenshot a running page and score it. Needs a browser.', reads: false, writes: true, json: true },
] as const;

export function manifest() {
	const info = brand();
	const version = JSON.parse(readFileSync(pkgPath('package.json'), 'utf8')).version as string;
	const fontReport = fonts();
	const logoReport = logos();
	const rules = principles();
	const components = library().map((item) => {
		const contract = contractOf(item);
		return {
			name: contract.name,
			title: contract.title,
			type: contract.type,
			surface: contract.surface,
			description: contract.description,
			useFor: contract.useFor,
			constraints: contract.constraints,
			exports: contract.exports,
			states: contract.states,
			variants: contract.variants.map((map) => ({
				name: map.name,
				complete: map.complete,
				keys: Object.fromEntries(Object.entries(map.keys).map(([key, value]) => [key, value.values])),
				defaults: Object.fromEntries(Object.entries(map.keys).flatMap(([key, value]) => (value.default === undefined ? [] : [[key, value.default]]))),
			})),
			emit: contract.emit,
		};
	});
	const gaps = [
		...fontReport.tokens.filter((token) => token.status === 'not-shipped').map((token) => ({ id: `font:${token.token}`, detail: `${token.token} names ${token.unshippedFamilies.join(', ')}. No file for those families is in brand/fonts.` })),
		...(rules.product.defined ? [] : [{ id: 'product-surface', detail: rules.product.reason }]),
		...(logoReport.gap ? [{ id: 'logo-usage', detail: logoReport.gap }] : []),
	];
	return {
		schemaVersion: 1,
		name: info.name,
		bin: info.bin,
		version,
		entry: `${cli()} manifest --json`,
		alias: [`${cli()} describe --json`],
		gaps,
		commands: COMMANDS,
		tokens: { count: tokenRows().length, groups: tokensByGroup() },
		fonts: fontReport,
		logos: logoReport,
		voice: voice(),
		validation: 'Every asset command checks its inputs: an unknown command, template, size, subject, slide type, slot, merch item, variant, composition, ground or export exits 1 and names the closest match. Nothing is substituted.',
		cli: program ? commandTree(program) : [],
		images: imageCatalog(),
		videos: videoCatalog(),
		decks: deckCatalog(),
		merch: merchCatalog(),
		illustrate: illustrateCatalog(),
		figma: { actions: [...FIGMA_ACTIONS], pushKinds: [...PUSH_KINDS], note: 'The CLI never calls Figma: each action writes files and prints the Figma MCP tool calls to make, in order.', workflow: 'brand/agent-guide.md (Figma)' },
		themes: Object.keys(imageConfig().grounds),
		lockups: { files: ['brand/logo/lockup.svg', 'brand/logo/mark.svg'], colors: ['blue', 'ink', 'white'], merchVariants: merchCatalog().variants.map((v) => v.id), rules: merchCatalog().logo.note },
		rules: { illustration: 'brand/illustration.md', images: imageConfig().notes, motion: videoCatalog().motion.source },
		components,
		principles: rules,
	};
}
