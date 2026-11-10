// Website and product principles, taken from the brand files. Product is reported only when the files define it.

import { readFileSync } from 'node:fs';
import { brand, elements } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';
import { voice } from './catalog.js';

type Section = { title: string; body: string };

function sections(text: string): Section[] {
	const normalized = text.replace(/\r\n/g, '\n').trim();
	const chunks = normalized.split(/^## /m);
	const intro = chunks.shift() ?? '';
	const out: Section[] = [{ title: intro.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '', body: intro.replace(/^#.+$/m, '').trim() }];
	for (const chunk of chunks) {
		const breakAt = chunk.indexOf('\n');
		const title = (breakAt === -1 ? chunk : chunk.slice(0, breakAt)).trim();
		out.push({ title, body: breakAt === -1 ? '' : chunk.slice(breakAt + 1).trim() });
	}
	return out;
}

function bullets(body: string): string[] {
	return body.split('\n').map((line) => line.trim()).filter((line) => line.startsWith('- ')).map((line) => line.slice(2).trim());
}

function section(all: Section[], title: string): Section {
	const found = all.find((item) => item.title === title);
	if (!found?.body) throw new Error(`brand/principles.md is missing the "${title}" section.`);
	return found;
}

export function principles() {
	const principleText = readFileSync(pkgPath('brand', 'principles.md'), 'utf8');
	const rubricText = readFileSync(pkgPath('brand', 'rubric.md'), 'utf8');
	const all = sections(principleText);
	const site = section(all, 'The site');
	const always = section(all, 'Always');
	const refuse = section(all, 'Refuse');
	const siteRules = bullets(site.body);
	const doRules = bullets(always.body);
	const dontRules = bullets(refuse.body);
	if (!siteRules.length || !doRules.length || !dontRules.length) throw new Error('brand/principles.md has an empty site, Always, or Refuse list.');
	const idea = all.find((item) => item.title === 'The idea');
	const review = sections(rubricText).filter((item) => item.title).map((item) => ({ title: item.title, text: item.body }));
	const elementRules = Object.entries(elements().site).map(([id, element]) => ({ id, name: element.name, rules: element.rules, source: element.source }));
	const surfaces = brand().surfaces ?? ['site', 'product'];
	const productElements = elementRules.filter((element) => /\bproduct\b/i.test(element.name) || element.rules.some((rule) => /\bproduct\b/i.test(rule)));
	const productLines = [...siteRules, ...doRules, ...dontRules, ...(idea ? [idea.body] : [])].filter((line) => /\bproduct\b/i.test(line));
	const rubricLines = review.flatMap((item) => item.text.split('\n').map((line) => line.trim()).filter((line) => /\bproduct\b/i.test(line))).map((text) => ({ source: 'brand/rubric.md', text }));
	const inSurfaces = surfaces.includes('product');
	const productHeading = all.some((item) => item.title === 'Product' || item.title === 'The product');
	return {
		schemaVersion: 1,
		sources: ['brand/principles.md', 'brand/rubric.md', 'brand/elements.json'],
		voice: voice(),
		site: {
			defined: true,
			summary: idea?.body ?? '',
			rules: siteRules,
			do: doRules,
			dont: dontRules,
			elements: elementRules,
			review,
		},
		product: {
			defined: inSurfaces && productHeading,
			inSurfaces,
			reason: inSurfaces
				? 'brand.json lists a product surface, and the principle document has no Product section. Do not invent one.'
				: 'brand.json surfaces does not include product. There is no separate product principle document. mentions are lines and element records in the site files that contain the word product.',
			mentions: [
				...productLines.map((text) => ({ kind: 'line' as const, source: 'brand/principles.md', text })),
				...rubricLines.map((line) => ({ kind: 'line' as const, source: line.source, text: line.text })),
				...productElements.map((element) => ({ kind: 'element' as const, source: 'brand/elements.json', id: element.id, name: element.name, rules: element.rules, elementSource: element.source })),
			],
		},
	};
}
