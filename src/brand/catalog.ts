// Tokens, fonts, logos and voice, read from brand/ and the logo docs. Nothing here is invented.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import opentype from 'opentype.js';
import { brand, tokens } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { loadItemSync } from '../library/registry.js';

export const TOKEN_GROUPS = ['color', 'type', 'space', 'radius', 'motion', 'shadow', 'band', 'glass'] as const;
export type TokenGroup = (typeof TOKEN_GROUPS)[number] | 'other';

const GROUP_LABEL: Record<TokenGroup, string> = {
	color: 'Color',
	type: 'Type',
	space: 'Spacing',
	radius: 'Radii',
	motion: 'Motion',
	shadow: 'Shadow',
	band: 'Band',
	glass: 'Glass',
	other: 'Other',
};

export function groupOf(name: string): TokenGroup {
	if (name.startsWith('--ds-color-')) return 'color';
	if (/^--ds-(font|text|leading|tracking)-/.test(name)) return 'type';
	if (name.startsWith('--ds-space-') || name.startsWith('--ds-layout-') || name.startsWith('--ds-frame-')) return 'space';
	if (name.startsWith('--ds-radius-')) return 'radius';
	if (name.startsWith('--ds-duration-') || name.startsWith('--ds-easing-')) return 'motion';
	if (name.startsWith('--ds-shadow-')) return 'shadow';
	if (name.startsWith('--ds-band-')) return 'band';
	if (name.startsWith('--ds-glass-')) return 'glass';
	return 'other';
}

export type TokenRow = { name: string; value: string; group: TokenGroup };

export function tokenRows(): TokenRow[] {
	return Object.entries(tokens().site).map(([name, value]) => ({ name, value, group: groupOf(name) }));
}

export function tokensByGroup(group?: string): { id: TokenGroup; label: string; tokens: { name: string; value: string }[] }[] {
	if (group && group !== 'other' && !(TOKEN_GROUPS as readonly string[]).includes(group)) {
		throw new Error(`Unknown token group "${group}". Use ${TOKEN_GROUPS.join(', ')}, or other.`);
	}
	const rows = tokenRows().filter((row) => !group || row.group === group);
	const ids = group ? [group as TokenGroup] : [...TOKEN_GROUPS, 'other' as const];
	return ids
		.map((id) => ({ id, label: GROUP_LABEL[id], tokens: rows.filter((row) => row.group === id).map(({ name, value }) => ({ name, value })) }))
		.filter((entry) => !group || entry.id === group || entry.tokens.length > 0);
}

export function tokenByName(name: string): TokenRow {
	const row = tokenRows().find((item) => item.name === name);
	if (!row) throw new Error(`Unknown token "${name}". Names look like --ds-color-brand. Run brand tokens --json for the list.`);
	return row;
}

type NamedFont = {
	names?: { fontFamily?: Record<string, string>; fontSubfamily?: Record<string, string> };
	tables?: { os2?: { usWeightClass?: number } };
};

function english(record?: Record<string, string>): string {
	if (!record) return '';
	return record.en || record['en-US'] || record.en_US || Object.values(record)[0] || '';
}

function familyMatches(fileFamily: string, quoted: string): boolean {
	if (!fileFamily || !quoted) return false;
	return fileFamily === quoted || fileFamily.startsWith(`${quoted} `) || quoted.startsWith(`${fileFamily} `);
}

export type FontFile = { file: string; family: string; subfamily: string; weight: number | null };
export type FontToken = { token: string; value: string; status: 'shipped' | 'not-shipped' | 'system'; files: string[]; unshippedFamilies: string[] };

let fontCache: { files: FontFile[]; license: string | null; tokens: FontToken[]; weights: { name: string; value: string }[] } | undefined;

export function fonts() {
	if (fontCache) return fontCache;
	const dir = pkgPath('brand', 'fonts');
	const names = readdirSync(dir).filter((name) => /\.(ttf|otf)$/i.test(name)).sort();
	const files: FontFile[] = names.map((name) => {
		const buf = readFileSync(join(dir, name));
		const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)) as NamedFont;
		const weight = font.tables?.os2?.usWeightClass;
		return { file: `brand/fonts/${name}`, family: english(font.names?.fontFamily), subfamily: english(font.names?.fontSubfamily), weight: typeof weight === 'number' ? weight : null };
	});
	const tokenNames = Object.keys(tokens().site).filter((name) => name.startsWith('--ds-font-') && !name.startsWith('--ds-font-weight-')).sort();
	const mapped: FontToken[] = tokenNames.map((token) => {
		const value = tokens().site[token];
		const quoted = [...value.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
		const matched = files.filter((file) => quoted.some((name) => familyMatches(file.family, name)));
		const unshippedFamilies = quoted.filter((name) => !files.some((file) => familyMatches(file.family, name)));
		const status = quoted.length === 0 ? 'system' : unshippedFamilies.length === 0 ? 'shipped' : 'not-shipped';
		return { token, value, status, files: matched.map((file) => file.file), unshippedFamilies };
	});
	const weights = tokenRows().filter((row) => row.name.startsWith('--ds-font-weight-')).map(({ name, value }) => ({ name, value }));
	fontCache = { files, license: existsSync(join(dir, 'OFL.txt')) ? 'brand/fonts/OFL.txt' : null, tokens: mapped, weights };
	return fontCache;
}

/** What image and video rendering can actually draw with. */
export function typeNote(): string {
	const report = fonts();
	const shipped = report.files.map((file) => `${file.family} ${file.subfamily} weight ${file.weight ?? 'unknown'}`).join(', ');
	const missing = [...new Set(report.tokens.flatMap((token) => token.unshippedFamilies))];
	const used = `Generated images and videos outline text with the shipped font files${shipped ? `: ${shipped}` : ''}. Logos are the shipped vectors.`;
	if (!missing.length) return used;
	return `Font tokens name families with no file in brand/fonts: ${missing.join(', ')}. ${used}`;
}

function quotedBody(text: string): string {
	const match = text.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
	return (match ? match[1] : text).trim();
}

export function logos() {
	const dir = pkgPath('brand', 'logo');
	const files = readdirSync(dir).filter((name) => name.endsWith('.svg')).sort().map((name) => {
		const text = readFileSync(join(dir, name), 'utf8');
		const box = text.match(/viewBox="([^"]+)"/)?.[1] ?? null;
		const paths = [...text.matchAll(/<path\b/g)].length;
		return { id: name.replace(/\.svg$/, ''), file: `brand/logo/${name}`, viewBox: box, paths };
	});
	const item = loadItemSync('logo');
	const docPath = pkgPath('registry', 'docs', 'logo.md');
	const doc = existsSync(docPath) ? readFileSync(docPath, 'utf8') : '';
	const useFor = doc.match(/^use_for:\s*"([\s\S]*?)"\s*$/m)?.[1] ?? null;
	const neverLine = doc.match(/^never:\s*(\[[^\n]*\])\s*$/m)?.[1] ?? '';
	const never = [...neverLine.matchAll(/"([^"]*)"/g)].map((match) => match[1]);
	const notes = (item?.documentation ?? (doc ? quotedBody(doc) : '')).trim();
	return {
		files,
		component: item?.name ?? (doc ? 'logo' : null),
		useFor: item?.useFor || useFor,
		never: item?.constraints?.length ? item.constraints : never,
		notes: notes || null,
		gap: notes ? null : 'Logo files are in brand/logo. Usage prose was not in the bundled registry item or registry/docs/logo.md.',
	};
}

export function voice() {
	const text = readFileSync(pkgPath('brand', 'principles.md'), 'utf8').replace(/\r\n/g, '\n');
	const section = text.split(/^## /m).find((part) => part.startsWith('Voice'));
	if (!section) throw new Error('brand/principles.md has no Voice section.');
	const body = section.replace(/^Voice\n/, '').trim();
	const avoid = [...body.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
	return { source: 'brand/principles.md', heading: 'Voice', text: body, avoid };
}
