import { cli } from '../lib/brand.js';
import { emit } from '../lib/output.js';
import { fonts, logos, tokenByName, TOKEN_GROUPS, tokensByGroup, voice } from '../brand/catalog.js';
import { manifest } from '../brand/manifest.js';
import { principles } from '../brand/principles.js';

export function manifestCommand(opts: { json?: boolean }) {
	const data = manifest();
	emit(opts, data, () =>
		[
			`${data.name} ${data.version}`,
			`Start here: ${data.entry}`,
			`Commands: ${data.commands.length}. Token groups: ${data.tokens.groups.map((group) => group.id).join(', ')}.`,
			`Images: ${data.images.templates.map((item) => item.id).join(', ')}.`,
			`Videos: ${data.videos.templates.map((item) => item.id).join(', ')} at ${data.videos.sizes.map((item) => item.id).join(', ')}.`,
			`Components: ${data.components.length}. Principles: site${data.principles.product.defined ? ' and product' : ', product is not defined'}.`,
			data.gaps.length ? `Gaps: ${data.gaps.map((gap) => gap.id).join(', ')}.` : 'Gaps: none.',
			`Pass --json for the full catalog. ${cli()} describe --json is the same command.`,
		].join('\n'),
	);
}

export function brandCommand(opts: { json?: boolean }) {
	const data = { schemaVersion: 1, tokens: tokensByGroup(), fonts: fonts(), logos: logos(), voice: voice() };
	emit(opts, data, () => [`Tokens, fonts, logos and voice. Groups: ${TOKEN_GROUPS.join(', ')}, other.`, 'Pass --json. brand tokens, brand fonts, brand logos and brand voice read one part.'].join('\n'));
}

export function brandTokens(opts: { group?: string; name?: string; json?: boolean }) {
	if (opts.name && opts.group) {
		const row = tokenByName(opts.name);
		if (row.group !== opts.group) throw new Error(`Token ${opts.name} is in ${row.group}, not ${opts.group}.`);
		emit(opts, { schemaVersion: 1, token: row }, () => `${row.name}  ${row.value}  (${row.group})`);
		return;
	}
	if (opts.name) {
		const row = tokenByName(opts.name);
		emit(opts, { schemaVersion: 1, token: row }, () => `${row.name}  ${row.value}  (${row.group})`);
		return;
	}
	const groups = tokensByGroup(opts.group);
	emit(opts, { schemaVersion: 1, groups }, () => groups.map((group) => [`${group.label}`, ...group.tokens.map((token) => `  ${token.name.padEnd(36)} ${token.value}`), ''].join('\n')).join('\n'));
}

export function brandFonts(opts: { json?: boolean }) {
	const data = { schemaVersion: 1, ...fonts() };
	emit(opts, data, () => [data.files.map((file) => `${file.file}  ${file.family} ${file.subfamily}  weight ${file.weight ?? 'unknown'}`).join('\n'), '', ...data.tokens.map((token) => `${token.token}  ${token.status}${token.unshippedFamilies.length ? `  missing ${token.unshippedFamilies.join(', ')}` : ''}`), data.license ? `License: ${data.license}` : ''].filter(Boolean).join('\n'));
}

export function brandLogos(opts: { json?: boolean }) {
	const data = { schemaVersion: 1, ...logos() };
	emit(opts, data, () => [data.files.map((file) => `${file.file}  viewBox ${file.viewBox ?? 'missing'}  ${file.paths} paths`).join('\n'), '', data.useFor ?? '', ...(data.never ?? []).map((rule) => `- ${rule}`), '', data.notes ?? data.gap ?? ''].join('\n'));
}

export function brandVoice(opts: { json?: boolean }) {
	const data = { schemaVersion: 1, ...voice() };
	emit(opts, data, () => [data.text, '', data.avoid.length ? `Avoid: ${data.avoid.join(', ')}` : 'No quoted avoid-list in the Voice section.'].join('\n'));
}

export function principlesCommand(opts: { surface?: string; json?: boolean }) {
	if (opts.surface && opts.surface !== 'site' && opts.surface !== 'product') throw new Error('Unknown surface. Use site or product.');
	const data = principles();
	const body = opts.surface === 'site' ? { schemaVersion: 1, surface: 'site', ...data.site } : opts.surface === 'product' ? { schemaVersion: 1, surface: 'product', ...data.product } : data;
	emit(opts, body, () => {
		if (opts.surface === 'product') return data.product.defined ? 'Product principles are defined.' : data.product.reason;
		const site = [`Site`, ...data.site.do.map((rule) => `  Do: ${rule}`), ...data.site.dont.map((rule) => `  Don't: ${rule}`)];
		if (opts.surface === 'site') return site.join('\n');
		return [...site, '', data.product.defined ? 'Product principles are defined.' : `Product: ${data.product.reason}`].join('\n');
	});
}
