// Writes the icons the library uses (lucide-react, ISC licence) as plain SVG files into brand/icons, with the licence
// and the list, so `icons set` works offline and an app gets exactly the icons the brand's components draw.
// Run after a library change: node scripts/build-icons.mjs
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const walk = (dir) => readdirSync(join(root, dir)).flatMap((f) => (statSync(join(root, dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const names = new Set();
for (const file of walk('registry').filter((f) => /\.tsx?$/.test(f))) {
	for (const m of readFileSync(join(root, file), 'utf8').matchAll(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/g)) {
		for (const part of m[1].split(',')) {
			const name = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
			if (name && name !== 'LucideIcon' && /^[A-Z]/.test(name)) names.add(name);
		}
	}
}
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Za-z])([0-9])/g, '$1-$2').toLowerCase();
const lucide = join(root, 'node_modules', 'lucide-react');
const version = JSON.parse(readFileSync(join(lucide, 'package.json'), 'utf8')).version;
const out = join(root, 'brand', 'icons');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const icons = [];
for (const name of [...names].sort()) {
	let file = join(lucide, 'dist', 'esm', 'icons', `${kebab(name)}.mjs`);
	let text;
	try {
		text = readFileSync(file, 'utf8');
	} catch {
		// Older names are aliases in lucide: find the file that exports the name.
		const alias = readFileSync(join(lucide, 'dist', 'esm', 'lucide-react.mjs'), 'utf8').match(new RegExp(`default as ${name}(?:,| )[^']*'\\./icons/([^']+)\\.mjs'`));
		if (!alias) throw new Error(`No lucide icon for ${name}`);
		file = join(lucide, 'dist', 'esm', 'icons', `${alias[1]}.mjs`);
		text = readFileSync(file, 'utf8');
	}
	// A renamed icon re-exports the new file.
	for (let hop = text.match(/export \{ default \} from '\.\/([^']+)\.mjs'/); hop; hop = text.match(/export \{ default \} from '\.\/([^']+)\.mjs'/)) text = readFileSync(join(lucide, 'dist', 'esm', 'icons', `${hop[1]}.mjs`), 'utf8');
	const data = text.match(/const __iconData = (\{[\s\S]*?\n\});/);
	if (!data) throw new Error(`Cannot read ${file}`);
	const { node } = Function(`return ${data[1]}`)();
	const body = node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`).join('');
	const id = kebab(name);
	writeFileSync(join(out, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`);
	icons.push({ id, component: name });
}
writeFileSync(join(out, 'icons.json'), `${JSON.stringify({ source: `lucide-react ${version} (the icon set the library's components import)`, licence: 'ISC', licenceText: readFileSync(join(lucide, 'LICENSE'), 'utf8'), icons }, null, '\t')}\n`);
console.log(`icons: ${icons.length} in brand/icons (lucide ${version}, ISC)`);
