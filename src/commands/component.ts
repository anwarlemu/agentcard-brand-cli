import { emit } from '../lib/output.js';
import { contractOf, emitComponent, library, libraryItem } from '../library/contract.js';

const TYPES = ['ui', 'product', 'site', 'visual', 'block', 'hook', 'lib', 'theme'];

function summary(name: string) {
	const item = libraryItem(name);
	const contract = contractOf(item);
	return { schemaVersion: 1, ...contract, documentation: item.documentation ?? '' };
}

export function componentList(opts: { type?: string; surface?: string; json?: boolean }) {
	const types = opts.type?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
	for (const type of types) if (!TYPES.includes(type)) throw new Error(`Unknown component type "${type}". Use ${TYPES.join(', ')}.`);
	if (opts.surface && !['site', 'product', 'both'].includes(opts.surface)) throw new Error('Unknown surface. Use site, product or both.');
	const items = library()
		.map((item) => contractOf(item))
		.filter((item) => (!types.length || types.includes(item.type)) && (!opts.surface || item.surface === opts.surface || item.surface === 'both'))
		.map(({ name, title, type, surface, description, exports, states, emit: mode }) => ({ name, title, type, surface, description, exports, states, emit: mode }));
	emit(opts, { schemaVersion: 1, count: items.length, items }, () => [...items.map((item) => `${item.name.padEnd(28)} ${item.type.padEnd(8)} ${item.description}`), `${items.length} components. Inspect one with component inspect <name> --json.`].join('\n'));
}

export function componentInspect(name: string | undefined, opts: { json?: boolean }) {
	if (!name) throw new Error('Pass a component name. component list --json lists them.');
	const data = summary(name);
	emit(opts, data, () => {
		const variants = data.variants.flatMap((map) => Object.entries(map.keys).map(([key, value]) => `  ${key}: ${value.values.join(', ')}${value.default ? ` (default ${value.default})` : ''}`));
		return [`${data.title} (${data.name})`, data.description, data.useFor, '', `Exports: ${data.exports.join(', ') || 'none'}`, `States: ${data.states.join(', ') || 'none'}`, variants.length ? `Variants:\n${variants.join('\n')}` : 'Variants: none', data.constraints.length ? `Don't:\n${data.constraints.map((rule) => `- ${rule}`).join('\n')}` : ''].filter(Boolean).join('\n');
	});
}

export function componentEmit(name: string | undefined, opts: { state?: string; set?: string[]; text?: string; export?: string; variants?: string; json?: boolean }) {
	if (!name) throw new Error('Pass a component name.');
	const set: Record<string, string> = {};
	for (const pair of opts.set ?? []) {
		const eq = pair.indexOf('=');
		if (eq <= 0) throw new Error(`--set must be key=value. Received "${pair}".`);
		const key = pair.slice(0, eq).trim();
		const value = pair.slice(eq + 1);
		if (!/^[A-Za-z][\w-]*$/.test(key)) throw new Error(`Unknown variant key "${key}".`);
		if (key in set) throw new Error(`--set ${key} was given twice.`);
		set[key] = value;
	}
	const data = emitComponent(name, { state: opts.state, set: Object.keys(set).length ? set : undefined, text: opts.text, exportName: opts.export, variants: opts.variants });
	emit(opts, data, () => String(data.markup ?? ''));
}
