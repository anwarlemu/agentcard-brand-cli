// Parse the real component source. Variant names come from cva() calls. States are example exports.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from '@babel/parser';
import { pkgPath } from '../lib/paths.js';
import { loadIndexSync, loadItemSync, type RegistryItem } from './registry.js';

type Ast = { type: string; loc?: { start: { line: number }; end: { line: number } } | null; [key: string]: unknown };

const SKIP = new Set(['loc', 'start', 'end', 'range', 'tokens', 'comments', 'extra']);

function walk(node: unknown, visit: (node: Ast) => void) {
	if (!node || typeof node !== 'object') return;
	const ast = node as Ast;
	if (typeof ast.type === 'string') visit(ast);
	for (const [key, value] of Object.entries(ast)) {
		if (SKIP.has(key)) continue;
		if (Array.isArray(value)) for (const child of value) walk(child, visit);
		else if (value && typeof value === 'object') walk(value, visit);
	}
}

function parseSource(source: string, file: string): Ast {
	try {
		return parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] }) as unknown as Ast;
	} catch (error) {
		throw new Error(`Could not parse ${file}: ${(error as Error).message}`);
	}
}

function slice(source: string, node: Ast): string {
	if (!node.loc) throw new Error('Parser did not record locations.');
	return source.split('\n').slice(node.loc.start.line - 1, node.loc.end.line).join('\n');
}

function propName(prop: Ast): string | undefined {
	if (prop.type !== 'ObjectProperty' || prop.computed) return undefined;
	const key = prop.key as Ast;
	if (key?.type === 'Identifier' && typeof key.name === 'string') return key.name;
	if (key?.type === 'StringLiteral' && typeof key.value === 'string') return key.value;
	return undefined;
}

export type VariantKey = { values: string[]; default?: string };
export type VariantMap = { name: string | null; complete: boolean; keys: Record<string, VariantKey> };

function readCva(call: Ast): { complete: boolean; keys: Record<string, VariantKey>; defaults: Record<string, string> } {
	const args = (call.arguments as Ast[]) ?? [];
	const options = args[1];
	if (!options || options.type !== 'ObjectExpression') return { complete: false, keys: {}, defaults: {} };
	let complete = true;
	const keys: Record<string, VariantKey> = {};
	const defaults: Record<string, string> = {};
	for (const prop of (options.properties as Ast[]) ?? []) {
		if (prop.type !== 'ObjectProperty') {
			complete = false;
			continue;
		}
		const name = propName(prop);
		if (name === 'variants' && (prop.value as Ast)?.type === 'ObjectExpression') {
			for (const group of ((prop.value as Ast).properties as Ast[]) ?? []) {
				if (group.type !== 'ObjectProperty') {
					complete = false;
					continue;
				}
				const groupName = propName(group);
				const body = group.value as Ast;
				if (!groupName || body?.type !== 'ObjectExpression') {
					complete = false;
					continue;
				}
				const values: string[] = [];
				for (const item of (body.properties as Ast[]) ?? []) {
					if (item.type !== 'ObjectProperty') {
						complete = false;
						continue;
					}
					const value = propName(item);
					if (!value) complete = false;
					else values.push(value);
				}
				keys[groupName] = { values };
			}
		} else if (name === 'defaultVariants' && (prop.value as Ast)?.type === 'ObjectExpression') {
			for (const item of ((prop.value as Ast).properties as Ast[]) ?? []) {
				if (item.type !== 'ObjectProperty') continue;
				const key = propName(item);
				const value = item.value as Ast;
				if (key && value?.type === 'StringLiteral' && typeof value.value === 'string') defaults[key] = value.value;
			}
		} else if (name !== 'variants' && name !== 'defaultVariants' && name !== undefined && (prop.value as Ast)?.type === 'ObjectExpression') {
			// compoundVariants and other objects are not prop maps.
		}
	}
	for (const [key, value] of Object.entries(defaults)) if (keys[key]) keys[key].default = value;
	return { complete, keys, defaults };
}

export function variantMaps(source: string, file: string): VariantMap[] {
	const ast = parseSource(source, file);
	const maps: VariantMap[] = [];
	walk(ast, (node) => {
		if (node.type !== 'VariableDeclarator') return;
		const init = node.init as Ast | undefined;
		const callee = init?.callee as Ast | undefined;
		if (init?.type !== 'CallExpression' || callee?.type !== 'Identifier' || callee.name !== 'cva') return;
		const id = node.id as Ast | undefined;
		const read = readCva(init);
		maps.push({ name: id?.type === 'Identifier' && typeof id.name === 'string' ? id.name : null, complete: read.complete, keys: read.keys });
	});
	return maps;
}

export function exportNames(source: string, file: string): string[] {
	const ast = parseSource(source, file);
	const names = new Set<string>();
	const body = ((ast.program as Ast | undefined)?.body as Ast[]) ?? [];
	for (const node of body) {
		if (node.type !== 'ExportNamedDeclaration') continue;
		for (const spec of (node.specifiers as Ast[]) ?? []) {
			const exported = spec.exported as Ast | undefined;
			if (exported?.type === 'Identifier' && typeof exported.name === 'string') names.add(exported.name);
		}
		const declaration = node.declaration as Ast | undefined;
		if (!declaration) continue;
		if ((declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration' || declaration.type === 'TSTypeAliasDeclaration' || declaration.type === 'TSInterfaceDeclaration') && (declaration.id as Ast | undefined)?.type === 'Identifier') {
			const id = declaration.id as Ast;
			if (typeof id.name === 'string') names.add(id.name);
		}
		if (declaration.type === 'VariableDeclaration') {
			for (const decl of (declaration.declarations as Ast[]) ?? []) {
				const id = decl.id as Ast | undefined;
				if (id?.type === 'Identifier' && typeof id.name === 'string') names.add(id.name);
			}
		}
	}
	return [...names];
}

export type ExampleState = { name: string; excerpt: string };

export function exampleStates(source: string, file: string): ExampleState[] {
	const ast = parseSource(source, file);
	const body = ((ast.program as Ast | undefined)?.body as Ast[]) ?? [];
	const states: ExampleState[] = [];
	for (const node of body) {
		if (node.type !== 'ExportNamedDeclaration') continue;
		const declaration = node.declaration as Ast | undefined;
		if (declaration?.type === 'FunctionDeclaration') {
			const id = declaration.id as Ast | undefined;
			if (id?.type === 'Identifier' && typeof id.name === 'string') states.push({ name: id.name, excerpt: slice(source, node) });
		}
		if (declaration?.type === 'VariableDeclaration') {
			for (const decl of (declaration.declarations as Ast[]) ?? []) {
				const id = decl.id as Ast | undefined;
				const init = decl.init as Ast | undefined;
				if (id?.type === 'Identifier' && typeof id.name === 'string' && (init?.type === 'ArrowFunctionExpression' || init?.type === 'FunctionExpression')) {
					states.push({ name: id.name, excerpt: slice(source, node) });
				}
			}
		}
	}
	return states;
}

export function importLines(source: string, file: string): string[] {
	const ast = parseSource(source, file);
	const body = ((ast.program as Ast | undefined)?.body as Ast[]) ?? [];
	return body.filter((node) => node.type === 'ImportDeclaration').map((node) => slice(source, node));
}

export type LibraryItem = {
	name: string;
	title: string;
	description: string;
	type: string;
	surface: string;
	useFor: string;
	constraints: string[];
	exports: string[];
	source?: string;
	documentation?: string;
	files: { path: string; content: string }[];
	examples: { path: string; content: string; exports: string[] }[];
};

const TYPE_DIR: Record<string, string> = { ui: 'components/ui', site: 'components/site', product: 'components/product', visual: 'components/visuals', block: 'components/blocks', hook: 'hooks', lib: 'lib' };

function frontmatter(text: string, file: string): { data: Record<string, string | string[]>; body: string } {
	const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) throw new Error(`${file} has no frontmatter.`);
	const data: Record<string, string | string[]> = {};
	for (const line of match[1].split('\n')) {
		const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
		if (!pair) continue;
		const raw = pair[2].trim();
		if (raw.startsWith('[') && raw.endsWith(']')) {
			const inner = raw.slice(1, -1).trim();
			data[pair[1]] = inner ? inner.split(',').map((part) => part.trim().replace(/^["']|["']$/g, '')).filter(Boolean) : [];
		} else if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) data[pair[1]] = raw.slice(1, -1);
		else if (raw) data[pair[1]] = raw;
	}
	return { data, body: match[2].trim() };
}

function asItem(item: RegistryItem): LibraryItem {
	return {
		name: item.name,
		title: item.title ?? item.name,
		description: item.description ?? '',
		type: item.type,
		surface: item.surface ?? '',
		useFor: item.useFor ?? '',
		constraints: item.constraints ?? [],
		exports: item.exports ?? [],
		source: item.source,
		documentation: item.documentation,
		files: item.files ?? [],
		examples: (item.examples ?? []).map((example) => ({ path: example.path, content: example.content, exports: example.exports ?? [] })),
	};
}

function diskItems(): LibraryItem[] {
	const docs = pkgPath('registry', 'docs');
	if (!existsSync(docs)) return [];
	return readdirSync(docs).filter((name) => name.endsWith('.md')).sort().map((name) => {
		const file = join(docs, name);
		const parsed = frontmatter(readFileSync(file, 'utf8'), `registry/docs/${name}`);
		const data = parsed.data;
		const id = String(data.name ?? name.replace(/\.md$/, ''));
		const type = String(data.type ?? '');
		const listed = Array.isArray(data.files) ? data.files : undefined;
		const ext = type === 'hook' || type === 'lib' ? 'ts' : 'tsx';
		const paths = listed ?? (TYPE_DIR[type] ? [`${TYPE_DIR[type]}/${id}.${ext}`] : []);
		const files = paths.map((path) => {
			const abs = pkgPath('registry', path);
			const alt = abs.endsWith('.ts') && existsSync(abs.replace(/\.ts$/, '.tsx')) ? abs.replace(/\.ts$/, '.tsx') : abs;
			const used = existsSync(abs) ? abs : alt;
			if (!existsSync(used)) throw new Error(`Missing registry/${path} for ${id}.`);
			const rel = used.slice(pkgPath('registry').length + 1).split('\\').join('/');
			return { path: rel, content: readFileSync(used, 'utf8') };
		});
		const examplePath = join(pkgPath('registry', 'examples'), `${id}.tsx`);
		const example = existsSync(examplePath) ? readFileSync(examplePath, 'utf8') : '';
		const exports = [...new Set(files.filter((item) => /\.(tsx|ts)$/.test(item.path)).flatMap((item) => exportNames(item.content, item.path)))];
		return {
			name: id,
			title: String(data.title ?? id),
			description: String(data.description ?? ''),
			type,
			surface: String(data.surface ?? ''),
			useFor: String(data.use_for ?? ''),
			constraints: Array.isArray(data.never) ? data.never : [],
			exports,
			source: typeof data.source === 'string' ? data.source : undefined,
			documentation: parsed.body,
			files,
			examples: example ? [{ path: `examples/${id}.tsx`, content: example, exports: exampleStates(example, `examples/${id}.tsx`).map((state) => state.name) }] : [],
		};
	});
}

let libraryCache: LibraryItem[] | undefined;

export function library(): LibraryItem[] {
	if (libraryCache) return libraryCache;
	const index = loadIndexSync();
	if (index.length) {
		libraryCache = index.map((entry) => {
			const item = loadItemSync(entry.name);
			if (!item) throw new Error(`Registry index lists "${entry.name}" but the item file is missing.`);
			return asItem(item);
		});
	} else libraryCache = diskItems();
	libraryCache = [...libraryCache].sort((a, b) => a.name.localeCompare(b.name));
	return libraryCache;
}

export function libraryItem(name: string): LibraryItem {
	if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Unknown component "${name}". Names are lowercase letters, numbers and hyphens.`);
	const item = library().find((entry) => entry.name === name);
	if (!item) throw new Error(`Unknown component "${name}". Run component list --json.`);
	return item;
}

export type ComponentContract = {
	name: string;
	title: string;
	description: string;
	type: string;
	surface: string;
	useFor: string;
	constraints: string[];
	exports: string[];
	source?: string;
	files: string[];
	states: string[];
	variants: VariantMap[];
	emit: 'variants' | 'state' | 'source-only';
};

export function contractOf(item: LibraryItem): ComponentContract {
	const scripts = item.files.filter((file) => /\.(tsx|ts)$/.test(file.path));
	const variants = scripts.flatMap((file) => variantMaps(file.content, file.path));
	const states = [...new Set(item.examples.flatMap((example) => (example.exports?.length ? example.exports : exampleStates(example.content, example.path).map((state) => state.name))))];
	const usable = variants.some((map) => map.complete && Object.keys(map.keys).length > 0);
	return {
		name: item.name,
		title: item.title,
		description: item.description,
		type: item.type,
		surface: item.surface,
		useFor: item.useFor,
		constraints: item.constraints,
		exports: item.exports,
		source: item.source,
		files: item.files.map((file) => file.path),
		states,
		variants,
		emit: usable ? 'variants' : states.length ? 'state' : 'source-only',
	};
}

function pascal(name: string): string {
	return name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

function pickExport(item: LibraryItem, requested?: string): string {
	if (requested) {
		if (!item.exports.includes(requested)) throw new Error(`Unknown export "${requested}" for ${item.name}. Exports: ${item.exports.join(', ') || 'none'}.`);
		return requested;
	}
	const guess = pascal(item.name);
	if (item.exports.includes(guess)) return guess;
	const candidates = item.exports.filter((name) => /^[A-Z]/.test(name) && !name.endsWith('Variants'));
	if (candidates.length === 1) return candidates[0];
	throw new Error(`Pass --export for ${item.name}. Exports: ${item.exports.join(', ') || 'none'}.`);
}

function pickMap(maps: VariantMap[], requested?: string): VariantMap {
	const usable = maps.filter((map) => Object.keys(map.keys).length > 0);
	if (!usable.length) throw new Error('This component has no variant map. Use --state with an example export.');
	if (requested) {
		const map = usable.find((item) => item.name === requested);
		if (!map) throw new Error(`Unknown variant map "${requested}". Maps: ${usable.map((item) => item.name ?? '(unnamed)').join(', ')}.`);
		return map;
	}
	if (usable.length === 1) return usable[0];
	throw new Error(`Pass --variants. Maps: ${usable.map((item) => item.name ?? '(unnamed)').join(', ')}.`);
}

export function emitComponent(name: string, opts: { state?: string; set?: Record<string, string>; text?: string; exportName?: string; variants?: string }): Record<string, unknown> {
	const item = libraryItem(name);
	const contract = contractOf(item);
	const hasState = Boolean(opts.state);
	const hasSet = Boolean(opts.set && Object.keys(opts.set).length);
	if (hasState === hasSet) throw new Error(hasState ? 'Pass --state or --set, not both.' : 'Pass --state <example export> or --set key=value.');
	if (hasState && (opts.text !== undefined || opts.exportName || opts.variants)) throw new Error('--state copies an example export. Leave --text, --export and --variants off.');
	if (hasState) {
		const example = item.examples.find((entry) => entry.content);
		if (!example) throw new Error(`${item.name} has no example file. There is no state to copy.`);
		const states = exampleStates(example.content, example.path);
		const state = states.find((entry) => entry.name === opts.state);
		if (!state) throw new Error(`Unknown state "${opts.state}" for ${item.name}. States: ${states.map((entry) => entry.name).join(', ') || 'none'}.`);
		return {
			schemaVersion: 1,
			ok: true,
			name: item.name,
			mode: 'state',
			state: state.name,
			generated: false,
			file: example.path,
			imports: importLines(example.content, example.path),
			excerpt: state.excerpt,
			markup: example.content.endsWith('\n') ? example.content : `${example.content}\n`,
			note: 'markup is the example file, copied unchanged. excerpt is the one export. Do not treat other exports in the file as this state.',
		};
	}
	const map = pickMap(contract.variants, opts.variants);
	if (!map.complete) throw new Error(`The variant map ${map.name ?? 'in this file'} is not fully static. emit will not guess the missing keys. Use --state.`);
	const props = opts.set ?? {};
	for (const [key, value] of Object.entries(props)) {
		const group = map.keys[key];
		if (!group) throw new Error(`Unknown variant "${key}" for ${item.name}. Use ${Object.keys(map.keys).join(', ')}.`);
		if (!group.values.includes(value)) throw new Error(`Unknown ${key} "${value}" for ${item.name}. Use ${group.values.join(', ')}.`);
	}
	if (opts.text !== undefined && opts.text.length > 200) throw new Error('text is over 200 characters.');
	const exportName = pickExport(item, opts.exportName);
	const owner = item.files.find((file) => file.path.endsWith(`/${item.name}.tsx`) || file.path.endsWith(`/${item.name}.ts`)) ?? item.files.find((file) => file.content.includes(exportName));
	if (!owner) throw new Error(`No source file for ${item.name}.`);
	const alias = `@/${owner.path.replace(/\.(tsx|ts)$/, '')}`;
	const attrs = Object.entries(props).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(' ');
	const open = attrs ? `<${exportName} ${attrs}` : `<${exportName}`;
	const element = opts.text === undefined ? `${open} />` : `${open}>{${JSON.stringify(opts.text)}}</${exportName}>`;
	const markup = `import { ${exportName} } from ${JSON.stringify(alias)};\n\nexport function Emitted() {\n  return (\n    ${element}\n  );\n}\n`;
	return {
		schemaVersion: 1,
		ok: true,
		name: item.name,
		mode: 'variant',
		generated: true,
		export: exportName,
		variants: map.name,
		props,
		defaults: Object.fromEntries(Object.entries(map.keys).flatMap(([key, value]) => (value.default === undefined ? [] : [[key, value.default]]))),
		text: opts.text ?? null,
		source: owner.path,
		markup,
		note: 'props are keys and values taken from the component variant map. Omitted keys keep the component default. text is the string you passed, not sample copy.',
	};
}
