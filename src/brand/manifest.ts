// The one catalog an agent can read before it calls anything else.

import { readFileSync } from 'node:fs';
import { fonts, logos, tokenRows, tokensByGroup, voice } from './catalog.js';
import { principles } from './principles.js';
import { catalog as imageCatalog } from '../image/catalog.js';
import { brand, cli } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { contractOf, library } from '../library/contract.js';
import { videoCatalog } from '../video/catalog.js';

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
	{ path: ['video', 'render'], summary: 'Write an MP4. Sizes are square, vertical and landscape. Unknown templates, sizes and fields error.', reads: false, writes: true, json: true },
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
		images: imageCatalog(),
		videos: videoCatalog(),
		components,
		principles: rules,
	};
}
