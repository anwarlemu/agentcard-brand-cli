import { readFileSync } from 'node:fs';
import type { Outline } from '../design/compose.js';
import type { SectionInfo } from '../design/types.js';
import { brand } from '../lib/brand.js';
import { pkgPath } from '../lib/paths.js';

// Pages from the library's site sections, for `design page compose`: an outline (checked by the core) becomes a React
// page that imports the installed components (`add` them first), and a plain HTML page that needs nothing but the brand
// stylesheet. Only the outline's words go on the page; links default to "#".

export const SECTIONS: SectionInfo[] = [
	{ type: 'header', description: 'The site header: the lockup, links and the one key.', copy: [{ id: 'action' }, { id: 'action-href' }], items: { count: [0, 6], copy: [{ id: 'label', required: true }, { id: 'href' }] } },
	{ type: 'hero', description: 'The blue hero with its scanlines: eyebrow, title, a line and the key, stepping down into the page.', copy: [{ id: 'title', required: true }, { id: 'eyebrow' }, { id: 'subtitle' }, { id: 'primary' }, { id: 'primary-href' }, { id: 'secondary' }, { id: 'secondary-href' }] },
	{ type: 'text', description: 'A section heading with a paragraph.', copy: [{ id: 'title', required: true }, { id: 'eyebrow' }, { id: 'body' }] },
	{ type: 'steps', description: 'Numbered steps as white cards.', copy: [{ id: 'title' }, { id: 'description' }], items: { count: [2, 6], copy: [{ id: 'title', required: true }, { id: 'description' }] } },
	{ type: 'stats', description: 'Two to four numbers with a line each.', copy: [{ id: 'title' }], items: { count: [2, 4], copy: [{ id: 'value', required: true }, { id: 'label', required: true }] } },
	{ type: 'testimonials', description: 'Customer quotes in windows (use Acme, never a real company or person).', copy: [{ id: 'title' }], items: { count: [1, 4], copy: [{ id: 'name', required: true }, { id: 'quote', required: true }, { id: 'context' }, { id: 'tag' }] } },
	{ type: 'pricing', description: 'Plans in windows with their features.', copy: [{ id: 'title' }], items: { count: [1, 4], copy: [{ id: 'name', required: true }, { id: 'price' }, { id: 'unit' }, { id: 'line' }, { id: 'features' }, { id: 'action' }, { id: 'action-href' }] } },
	{ type: 'faq', description: 'Questions and answers in the help window.', copy: [{ id: 'title', required: true }, { id: 'lead' }], items: { count: [1, 20], copy: [{ id: 'question', required: true }, { id: 'answer', required: true }] } },
	{ type: 'cta', description: 'The closing band on the blue ground.', copy: [{ id: 'title', required: true }, { id: 'description' }, { id: 'primary' }, { id: 'primary-href' }] },
	{ type: 'footer', description: 'The blue footer with the sitemap.', copy: [{ id: 'description' }], items: { count: [1, 16], copy: [{ id: 'group', required: true }, { id: 'label', required: true }, { id: 'href' }] } },
];

type Section = Outline['sections'][number];
const js = (s: string) => JSON.stringify(s);
const jsx = (s: string) => `{${js(s)}}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const href = (v?: string) => v?.trim() || '#';
const split = (v?: string) => (v ? v.split('|').map((x) => x.trim()).filter(Boolean) : []);
const groups = (items: Record<string, string>[]) => {
	const out: { title: string; links: { label: string; href: string }[] }[] = [];
	for (const i of items) {
		let g = out.find((x) => x.title === i.group);
		if (!g) out.push((g = { title: i.group!, links: [] }));
		g.links.push({ label: i.label!, href: href(i.href) });
	}
	return out;
};

function react(o: Outline): Record<string, string> {
	const imports = new Map<string, Set<string>>();
	const use = (file: string, ...names: string[]) => {
		const set = imports.get(file) ?? new Set<string>();
		for (const n of names) set.add(n);
		imports.set(file, set);
	};
	const parts: string[] = [];
	const header = o.sections.find((s) => s.type === 'header');
	for (const s of o.sections as Section[]) {
		const c = s.copy ?? {};
		const items = s.items ?? [];
		const key = (label: string | undefined, to: string | undefined, variant: string) => {
			if (!label) return '';
			use('@/components/ui/button', 'Button');
			return `<Button asChild variant="${variant}"><a href=${jsx(href(to))}>${jsx(label)}</a></Button>`;
		};
		const headerJsx = () => {
			if (!header) return '';
			use('@/components/site/site-header', 'SiteHeader');
			const hc = header.copy ?? {};
			return `<SiteHeader ground="blue"${header.items?.length ? ` links={${JSON.stringify(header.items.map((i) => ({ label: i.label, href: href(i.href) })))}}` : ''}${hc.action ? ` action={{ label: ${js(hc.action)}, href: ${js(href(hc['action-href']))} }}` : ''} />`;
		};
		switch (s.type) {
			case 'header':
				if (!o.sections.some((x) => x.type === 'hero')) {
					use('@/components/site/site-header', 'SiteHeader');
					parts.push(headerJsx().replace('ground="blue"', 'ground="white" overlay={false}'));
				}
				break;
			case 'hero': {
				use('@/components/site/hero', 'Hero');
				const actions = [key(c.primary, c['primary-href'], 'on-brand'), key(c.secondary, c['secondary-href'], 'secondary')].filter(Boolean);
				parts.push(`<Hero${header ? ` header={${headerJsx()}}` : ''} title=${jsx(c.title!)}${c.eyebrow ? ` eyebrow=${jsx(c.eyebrow)}` : ''}${c.subtitle ? ` subtitle=${jsx(c.subtitle)}` : ''}${actions.length ? ` actions={<>${actions.join('')}</>}` : ''} />`);
				break;
			}
			case 'text':
				use('@/components/site/section', 'SiteSection', 'SectionHeading');
				parts.push(`<SiteSection><SectionHeading title=${jsx(c.title!)}${c.eyebrow ? ` eyebrow=${jsx(c.eyebrow)}` : ''}${c.body ? ` description=${jsx(c.body)}` : ''} /></SiteSection>`);
				break;
			case 'steps':
				use('@/components/site/steps', 'Steps');
				parts.push(`<Steps${c.title ? ` title=${jsx(c.title)}` : ''}${c.description ? ` description=${jsx(c.description)}` : ''} steps={${JSON.stringify(items.map((i) => ({ title: i.title, ...(i.description ? { description: i.description } : {}) })))}} />`);
				break;
			case 'stats':
				use('@/components/site/stats', 'Stats');
				parts.push(`<Stats${c.title ? ` title=${jsx(c.title)}` : ''} stats={${JSON.stringify(items.map((i) => ({ value: i.value, label: i.label })))}} />`);
				break;
			case 'testimonials':
				use('@/components/site/section', 'SiteSection', 'SectionHeading');
				use('@/components/site/testimonials', 'Testimonials');
				parts.push(`<SiteSection ground="paper">${c.title ? `<SectionHeading title=${jsx(c.title)} className="mb-10" />` : ''}<Testimonials cases={${JSON.stringify(items.map((i) => ({ name: i.name, quote: i.quote, ...(i.context ? { context: i.context } : {}), ...(i.tag ? { tag: i.tag } : {}) })))}} /></SiteSection>`);
				break;
			case 'pricing':
				use('@/components/site/section', 'SiteSection');
				use('@/components/site/pricing', 'Pricing');
				parts.push(`<SiteSection ground="paper"><Pricing${c.title ? ` title=${jsx(c.title)}` : ''} products={${JSON.stringify([{ label: c.title ?? 'Plans', plans: items.map((i) => ({ name: i.name, ...(i.price ? { price: i.price } : {}), ...(i.unit ? { unit: i.unit } : {}), ...(i.line ? { line: i.line } : {}), features: split(i.features).map((t) => ({ title: t })), ...(i.action ? { action: { label: i.action, href: href(i['action-href']) } } : {}) })) }])}} /></SiteSection>`);
				break;
			case 'faq':
				use('@/components/site/section', 'SiteSection');
				use('@/components/site/faq', 'Faq');
				parts.push(`<SiteSection ground="paper"><Faq title=${jsx(c.title!)}${c.lead ? ` lead=${jsx(c.lead)}` : ''} topics={${JSON.stringify([{ label: 'All', items: items.map((i) => ({ question: i.question, answer: i.answer })) }])}} /></SiteSection>`);
				break;
			case 'cta':
				use('@/components/site/cta', 'Cta');
				parts.push(`<Cta title=${jsx(c.title!)}${c.description ? ` description=${jsx(c.description)}` : ''}${c.primary ? ` actions={${key(c.primary, c['primary-href'], 'on-brand')}}` : ''} />`);
				break;
			case 'footer':
				use('@/components/site/site-footer', 'SiteFooter');
				parts.push(`<SiteFooter groups={${JSON.stringify(groups(items))}}${c.description ? ` description=${jsx(c.description)}` : ''} />`);
				break;
		}
	}
	const head = [...imports].sort(([a], [b]) => (a < b ? -1 : 1)).map(([file, names]) => `import { ${[...names].sort().join(', ')} } from "${file}";`).join('\n');
	return { 'page.tsx': `${head}\n\n// Written by \`design page compose\`${o.title ? ` for "${o.title.replace(/"/g, "'")}"` : ''}. Install what it imports with \`add\` first.\nexport default function Page() {\n  return (\n    <main>\n${parts.map((p) => `      ${p}`).join('\n')}\n    </main>\n  );\n}\n` };
}

function html(o: Outline): Record<string, string> {
	const css = readFileSync(pkgPath('build', 'tokens.css'), 'utf8') + readFileSync(pkgPath('build', 'site.css'), 'utf8');
	const out: string[] = [];
	const a = (label?: string, to?: string, cls = 'ds-key') => (label ? `<a class="${cls}" href="${esc(href(to))}">${esc(label)}</a>` : '');
	const header = o.sections.find((s) => s.type === 'header');
	const nav = header ? `<header class="ds-header"><a class="ds-logo" href="/">${esc(brand().name)}</a><nav>${(header.items ?? []).map((i) => a(i.label, i.href, 'ds-link')).join('')}</nav>${a(header.copy?.action, header.copy?.['action-href'])}</header>` : '';
	for (const s of o.sections as Section[]) {
		const c = s.copy ?? {};
		const items = s.items ?? [];
		const head = (t?: string, d?: string) => (t ? `<h2>${esc(t)}</h2>${d ? `<p class="ds-lead">${esc(d)}</p>` : ''}` : '');
		switch (s.type) {
			case 'header':
				if (!o.sections.some((x) => x.type === 'hero')) out.push(nav);
				break;
			case 'hero':
				out.push(`<section data-ds-hero class="ds-hero">${nav}${c.eyebrow ? `<p class="ds-label">${esc(c.eyebrow)}</p>` : ''}<h1>${esc(c.title!)}</h1>${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ''}<div class="ds-actions">${a(c.primary, c['primary-href'], 'ds-key ds-key-white')}${a(c.secondary, c['secondary-href'], 'ds-link')}</div></section>`);
				break;
			case 'text':
				out.push(`<section>${c.eyebrow ? `<p class="ds-label">${esc(c.eyebrow)}</p>` : ''}${head(c.title, c.body)}</section>`);
				break;
			case 'steps':
				out.push(`<section class="ds-paper">${head(c.title, c.description)}<ol class="ds-grid">${items.map((i, n) => `<li class="ds-card"><span class="ds-num">${n + 1}</span><h3>${esc(i.title!)}</h3>${i.description ? `<p>${esc(i.description)}</p>` : ''}</li>`).join('')}</ol></section>`);
				break;
			case 'stats':
				out.push(`<section>${head(c.title)}<dl class="ds-stats">${items.map((i) => `<div><dt>${esc(i.label!)}</dt><dd>${esc(i.value!)}</dd></div>`).join('')}</dl></section>`);
				break;
			case 'testimonials':
				out.push(`<section class="ds-paper">${head(c.title)}<div class="ds-grid">${items.map((i) => `<figure class="ds-card">${i.context ? `<p class="ds-note">${esc(i.context)}</p>` : ''}<blockquote>${esc(i.quote!)}</blockquote><figcaption>${esc(i.name!)}${i.tag ? ` <span class="ds-label">${esc(i.tag)}</span>` : ''}</figcaption></figure>`).join('')}</div></section>`);
				break;
			case 'pricing':
				out.push(`<section class="ds-paper">${head(c.title)}<div class="ds-grid">${items.map((i) => `<article class="ds-card"><h3>${esc(i.name!)}</h3>${i.line ? `<p class="ds-note">${esc(i.line)}</p>` : ''}${i.price ? `<p class="ds-price">${esc(i.price)}${i.unit ? ` <span>${esc(i.unit)}</span>` : ''}</p>` : ''}${split(i.features).length ? `<ul>${split(i.features).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}${a(i.action, i['action-href'])}</article>`).join('')}</div></section>`);
				break;
			case 'faq':
				out.push(`<section class="ds-paper">${head(c.title, c.lead)}${items.map((i) => `<details class="ds-card"><summary>${esc(i.question!)}</summary><p>${esc(i.answer!)}</p></details>`).join('')}</section>`);
				break;
			case 'cta':
				out.push(`<section class="ds-on-blue ds-cta">${head(c.title, c.description)}<div class="ds-actions">${a(c.primary, c['primary-href'], 'ds-key ds-key-white')}</div></section>`);
				break;
			case 'footer':
				out.push(`<footer class="ds-on-blue ds-footer"><p class="ds-logo">${esc(brand().name)}</p>${c.description ? `<p>${esc(c.description)}</p>` : ''}${groups(items).map((g) => `<nav><h3>${esc(g.title)}</h3>${g.links.map((l) => a(l.label, l.href, 'ds-link')).join('')}</nav>`).join('')}</footer>`);
				break;
		}
	}
	const title = esc(o.title ?? brand().name);
	return { 'index.html': `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${title}</title>\n<link rel="stylesheet" href="${esc(brand().fonts.css)}">\n<style>\n${css}\n${PAGE_CSS}</style>\n</head>\n<body>\n<main>\n${out.join('\n')}\n</main>\n</body>\n</html>\n` };
}

/** The few layout rules a plain page needs beyond the brand stylesheet: the column, sections, a grid, the key. Tokens only. */
const PAGE_CSS = `section,header,footer{padding:var(--ds-space-16) var(--ds-layout-gutter)}
section>*,footer>*{max-width:var(--ds-frame-column);margin-inline:auto}
.ds-header{display:flex;flex-wrap:wrap;gap:var(--ds-space-6);align-items:center;justify-content:space-between;padding:var(--ds-space-4) 0}
.ds-header nav,.ds-footer nav{display:flex;flex-wrap:wrap;gap:var(--ds-space-4)}
.ds-logo{font-family:var(--ds-font-display);font-weight:var(--ds-font-weight-medium);color:inherit;text-decoration:none}
.ds-hero{text-align:center;padding-top:0}.ds-hero p{max-width:40rem;margin-inline:auto}
.ds-paper{background:var(--ds-color-paper)}
.ds-label{font-family:var(--ds-font-display);font-size:var(--ds-text-caption);letter-spacing:var(--ds-tracking-label);color:var(--ds-color-text-label)}
.ds-lead,.ds-note{color:var(--ds-color-text-muted)}
.ds-actions{display:flex;flex-wrap:wrap;gap:var(--ds-space-3);justify-content:center;margin-top:var(--ds-space-6)}
.ds-key{display:inline-flex;align-items:center;min-height:2.75rem;padding:0 var(--ds-space-5);border-radius:var(--ds-radius-control);background:var(--ds-color-brand);color:var(--ds-color-white);font-family:var(--ds-font-display);text-decoration:none;box-shadow:var(--ds-shadow-key-brand);transition:background-color 150ms ease-out}
.ds-key:hover{background:var(--ds-color-blue-hover)}.ds-key-white{background:var(--ds-color-white);color:var(--ds-color-brand);box-shadow:var(--ds-shadow-key)}.ds-key-white:hover{background:var(--ds-color-white)}
.ds-link{color:inherit}
.ds-grid{display:grid;gap:var(--ds-space-4);grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));padding:0;list-style:none;margin-top:var(--ds-space-8)}
.ds-card{background:var(--ds-color-white);color:var(--ds-color-text-default);border:1px solid var(--ds-color-border-hairline);border-radius:var(--ds-radius-card);padding:var(--ds-space-6);box-shadow:var(--ds-shadow-card)}
.ds-num{display:inline-grid;place-items:center;width:1.75rem;height:1.75rem;border-radius:999px;background:var(--ds-color-brand);color:var(--ds-color-white);font-family:var(--ds-font-display)}
.ds-stats{display:grid;gap:var(--ds-space-6);grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))}.ds-stats div{display:flex;flex-direction:column-reverse;border-top:1px solid var(--ds-color-border-rule);padding-top:var(--ds-space-5)}.ds-stats dd{margin:0;font-family:var(--ds-font-display);font-size:var(--ds-text-h1);color:var(--ds-color-text-brand)}
.ds-price{font-family:var(--ds-font-display);font-size:var(--ds-text-h2);color:var(--ds-color-text-brand)}
.ds-cta{text-align:center}
.ds-footer{display:grid;gap:var(--ds-space-8);grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))}.ds-footer nav{flex-direction:column}
@media (prefers-reduced-motion:reduce){.ds-key{transition:none}}
`;

export async function writePage(o: Outline, flavor: string): Promise<Record<string, string>> {
	return flavor === 'react' ? react(o) : html(o);
}
