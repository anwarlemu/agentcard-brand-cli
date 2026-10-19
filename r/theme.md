# Agentcard theme
The Agentcard tokens and the Tailwind names that read them.

Install: npx agentcard-ds add theme
Requires: none
Packages: none
Exports: See source
Client boundary: not required by this entry file

## Usage



## Source

styles/tokens.css

```css
/* Written by agentcard-ds from its brand files. Do not edit; run the CLI again to update. */
:root {
	/* Core: one electric blue, one ink, one paper, one sky, and white. */
	--ds-color-brand: #0000FF;
	--ds-color-black: #000000;
	--ds-color-white: #FFFFFF;
	--ds-color-ink: #171818;
	--ds-color-paper: #F2F1EC;
	--ds-color-sky: #CCDBFF;
	/* The blue mixed toward ink (a key's edge), toward white (a key's hover) and very pale (a selected row). */
	--ds-color-blue-edge: #0607BE;
	--ds-color-blue-hover: #1F1FFF;
	--ds-color-blue-5: #EDEDFF;
	--ds-color-blue-10: #E5E5FF;
	--ds-color-blue-mid: #4B50F4;
	--ds-color-blue-mist: #ECEAF7;
	--ds-color-sky-wash: color-mix(in srgb, var(--ds-color-sky) 45%, var(--ds-color-white));
	--ds-color-bg-search-selected: color-mix(in srgb, var(--ds-color-sky) 55%, var(--ds-color-white));
	/* The heart, the one warm accent, and the window tints (one pale hue per window bar in a grid of apps). */
	--ds-color-heart: #F24656;
	--ds-color-tint-sage: #CFE3C9;
	--ds-color-tint-rose: #EFCFD3;
	--ds-color-tint-teal: #C6DFE2;
	--ds-color-tint-peach: #F1D8C6;
	--ds-color-tint-butter: #ECE3C0;

	/* Surfaces: white sections on the paper page, the blue ground for heroes, panels and the footer. */
	--ds-color-bg-default: #FFFFFF;
	--ds-color-bg-page: #F2F1EC;
	--ds-color-bg-subtle: #F3F3F3;
	--ds-color-bg-frame: #F2F1EC;
	--ds-color-bg-canvas: #F2F1EC;
	--ds-color-bg-tint: #EDEDFF;
	--ds-color-bg-brand: #0000FF;
	--ds-color-bg-inverse: #171818;
	--ds-color-bg-dark: #171818;
	--ds-color-bg-code: #171818;
	--ds-color-bg-scrim: rgb(23 24 24 / 0.4);
	--ds-color-bg-glass: rgb(23 24 24 / 0.42);
	/* A note in a guide: sky at 22 percent on white. */
	--ds-color-bg-note: #F4F7FF;
	/* A guide's code block: ink at 94 percent on white. */
	--ds-color-bg-code-soft: #252626;
	--ds-color-bg-raised-on-brand: rgb(255 255 255 / 0.07);

	/* Text: ink, and ink at 80, 68, 60 and 45 percent on white (solid, so they read the same on any white); white and
	   sky on the blue. */
	--ds-color-text-default: #171818;
	--ds-color-text-secondary: #454646;
	--ds-color-text-muted: #616262;
	--ds-color-text-subtle: #747575;
	--ds-color-text-nav: #171818;
	--ds-color-text-faint: #979898;
	--ds-color-text-inverse: #FFFFFF;
	--ds-color-text-brand: #0000FF;
	--ds-color-text-on-brand: #FFFFFF;
	--ds-color-text-on-brand-muted: rgb(255 255 255 / 0.72);
	--ds-color-text-label: #0000FF;
	--ds-color-text-on-brand-label: #CCDBFF;

	/* Lines */
	--ds-color-border-default: rgb(23 24 24 / 0.14);
	--ds-color-border-subtle: rgb(23 24 24 / 0.08);
	--ds-color-border-strong: rgb(23 24 24 / 0.35);
	/* Customer windows, case cards and the dotted rules in plans. */
	--ds-color-border-mid: rgb(23 24 24 / 0.22);
	/* The rule under a page's head (the guides). */
	--ds-color-border-rule: rgb(23 24 24 / 0.18);
	/* A search field's edge, and its edge under the pointer (the guides' search). */
	--ds-color-border-field: rgb(23 24 24 / 0.12);
	--ds-color-border-field-hover: rgb(23 24 24 / 0.24);
	--ds-color-border-hairline: rgb(23 24 24 / 0.16);
	/* A white key's edge: the hairline, kept when a blue ground re-points the hairline to white. */
	--ds-color-border-key: rgb(23 24 24 / 0.16);
	--ds-color-border-brand: #0000FF;
	--ds-color-border-brand-edge: #0607BE;
	--ds-color-border-on-brand: rgb(255 255 255 / 0.22);
	--ds-color-border-on-brand-strong: rgb(255 255 255 / 0.45);
	--ds-color-border-window: rgb(0 0 255 / 0.25);
	--ds-color-wash-hover: rgb(23 24 24 / 0.04);
	--ds-color-wash-pill: rgb(23 24 24 / 0.07);
	--ds-color-wash-selected: rgb(0 0 255 / 0.07);
	--ds-color-wash-on-brand: rgb(255 255 255 / 0.14);
	--ds-color-wash-glass-hover: rgb(255 255 255 / 0.17);
	--ds-color-ring-tint: rgb(0 0 255 / 0.2);

	/* Actions and states. The main action is the blue key; on the blue ground it is the white key. */
	--ds-color-action-primary: #0000FF;
	--ds-color-action-primary-hover: #1F1FFF;
	--ds-color-action-primary-fg: #FFFFFF;
	--ds-color-status-success: #15803D;
	--ds-color-status-warning: #B45309;
	--ds-color-status-danger: #D92D3F;
	--ds-color-focus-ring: #0000FF;
	--ds-color-chart-series-1: #0000FF;
	--ds-color-chart-series-2: #4B50F4;
	--ds-color-chart-series-3: #4DB8FF;
	--ds-color-chart-series-4: #F24656;
	/* The window: a title bar in sky with blue marks, or in blue with white ones for the window that matters. */
	--ds-color-window-bar: #CCDBFF;
	--ds-color-window-bar-fg: #0000FF;

	/* Type: Inter for text, Neue Haas Grotesk Display (Helvetica Neue where it is not installed) for headings,
	   labels, buttons and small print. Display type is 500 and tracked tight; nothing is bold. */
	--ds-font-sans: var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif;
	--ds-font-display: "Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
	/* Code is set in the display face too, as on the brand's code windows. */
	--ds-font-mono: "Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
	/* Code in the guides' code blocks: the system monospace. */
	--ds-font-code: ui-monospace, SFMono-Regular, Menlo, monospace;
	--ds-font-weight-regular: 400;
	--ds-font-weight-medium: 500;
	/* Headings, labels and keys in the display face are set at 500. */
	--ds-font-weight-heading: 500;
	--ds-text-display: 7rem;
	--ds-text-hero: 4.5rem;
	--ds-text-h1: 3.25rem;
	--ds-text-h2: 2.25rem;
	--ds-text-h3: 1.5rem;
	--ds-text-h4: 1.25rem;
	--ds-text-h5: 1.125rem;
	--ds-text-body-lg: 1.1875rem;
	--ds-text-body: 1rem;
	--ds-text-body-sm: 0.875rem;
	--ds-text-caption: 0.75rem;
	--ds-text-micro: 0.625rem;
	--ds-leading-tight: 1;
	--ds-leading-heading: 1.05;
	--ds-leading-display: 1.1;
	--ds-leading-snug: 1.3;
	--ds-leading-body: 1.6;
	--ds-leading-relaxed: 1.6;
	--ds-leading-code: 1.7;
	--ds-tracking-display: -0.055em;
	--ds-tracking-tighter: -0.035em;
	--ds-tracking-tight: -0.02em;
	--ds-tracking-normal: 0;
	--ds-tracking-label: 0.02em;
	/* Caps on a small tag, and the arrow in a window bar. */
	--ds-tracking-caps: 0.14em;
	--ds-tracking-mark: 0.3em;

	/* Space (rem, so it follows the root) */
	--ds-space-0: 0;
	--ds-space-px: 1px;
	--ds-space-0-5: 0.125rem;
	--ds-space-1: 0.25rem;
	--ds-space-1-5: 0.375rem;
	--ds-space-2: 0.5rem;
	--ds-space-2-5: 0.625rem;
	--ds-space-3: 0.75rem;
	--ds-space-3-5: 0.875rem;
	--ds-space-4: 1rem;
	--ds-space-5: 1.25rem;
	--ds-space-6: 1.5rem;
	--ds-space-7: 1.75rem;
	--ds-space-8: 2rem;
	--ds-space-9: 2.25rem;
	--ds-space-10: 2.5rem;
	--ds-space-12: 3rem;
	--ds-space-14: 3.5rem;
	--ds-space-16: 4rem;
	--ds-space-20: 5rem;
	--ds-space-24: 6rem;
	--ds-space-28: 7rem;
	--ds-space-32: 8rem;

	/* Layout: a 1200px column with at least 40px of gutter; reading text and FAQ lists at 680px. */
	--ds-layout-column: 75rem;
	--ds-layout-gutter: 2.5rem;
	--ds-layout-text: 42.5rem;
	--ds-layout-heading: 42rem;
	--ds-layout-header: 4rem;
	/* The content column: 1200px with at least the gutter on each side (20px on phones, site.css). Containers use it. */
	--ds-frame-column: min(100% - 2 * var(--ds-layout-gutter), var(--ds-layout-column));

	/* Shape: an 8px key, 12px windows and panels, 20px for the large product cards. */
	--ds-radius-chip: 2px;
	--ds-radius-sm: 0.375rem;
	--ds-radius-menu: 0.3125rem;
	--ds-radius-control: 0.5rem;
	--ds-radius-card: 0.75rem;
	--ds-radius-panel: 0.75rem;
	--ds-radius-shell: 1.25rem;
	--ds-radius-pill: 9999px;
	/* The bevel: every button and tab is a raised key with a light inner top, a darker inner bottom and a soft drop.
	   A press sinks it. Blue on white, white on blue, pale for an unselected tab. */
	--ds-shadow-key: inset 0 1px 0 #FFFFFF, inset 0 -2px 0 rgb(23 24 24 / 0.08), 0 1px 2px rgb(23 24 24 / 0.22), 0 3px 8px rgb(23 24 24 / 0.1);
	--ds-shadow-key-brand: inset 0 1px 0 rgb(255 255 255 / 0.34), inset 0 -2px 0 rgb(23 24 24 / 0.16), 0 1px 2px rgb(23 24 24 / 0.24), 0 3px 8px rgb(0 0 255 / 0.18);
	--ds-shadow-key-muted: inset 0 1px 0 rgb(255 255 255 / 0.8), inset 0 -1px 0 rgb(23 24 24 / 0.06);
	--ds-shadow-pressed: inset 0 2px 3px rgb(23 24 24 / 0.22), inset 0 -1px 0 rgb(255 255 255 / 0.18);
	/* A sunken track (tabs, a selected row's well). */
	--ds-shadow-well: inset 0 1px 2px rgb(23 24 24 / 0.08), inset 0 -1px 0 #FFFFFF;
	/* The guides' windows: the bevel's light top and a lighter drop than a card's. */
	--ds-shadow-guide: inset 0 1px 0 #FFFFFF, inset 0 -1px 0 rgb(23 24 24 / 0.05), 0 1px 2px rgb(23 24 24 / 0.07), 0 4px 10px -6px rgb(23 24 24 / 0.14);
	/* A search field's faint inner shadow. */
	--ds-shadow-inset: inset 0 1px 2px rgb(23 24 24 / 0.06);
	/* Cards: the window's soft drop, and the large card's hard offset shadow. */
	--ds-shadow-card: inset 0 1px 0 #FFFFFF, inset 0 -2px 0 rgb(23 24 24 / 0.06), 0 1px 2px rgb(23 24 24 / 0.14), 0 12px 32px -18px rgb(23 24 24 / 0.4);
	--ds-shadow-raised: inset 0 1px 0 #FFFFFF, inset 0 -2px 0 rgb(23 24 24 / 0.06), 7px 7px 0 rgb(23 24 24 / 0.1);
	/* A code window lifted off the blue panel it sits on. */
	--ds-shadow-code: 0 16px 36px -14px rgb(23 24 24 / 0.6);
	/* A plan window: the bevel and a darker hard offset. */
	--ds-shadow-plan: inset 0 1px 0 #FFFFFF, inset 0 -2px 0 rgb(23 24 24 / 0.06), 6px 6px 0 rgb(23 24 24 / 0.22);
	--ds-shadow-tile: 0 1px 2px rgb(23 24 24 / 0.08), 0 6px 16px rgb(23 24 24 / 0.06);
	/* Glass: the floating dock and its menus. */
	--ds-shadow-floating: inset 0 1px 0 rgb(255 255 255 / 0.32), 0 8px 24px rgb(23 24 24 / 0.2);
	--ds-shadow-glass-hover: inset 0 1px 0 rgb(255 255 255 / 0.42), inset 0 0 0 1px rgb(255 255 255 / 0.16), 0 1px 2px rgb(23 24 24 / 0.24);
	--ds-shadow-tooltip: 0 1px 2px rgb(23 24 24 / 0.14), 0 8px 24px rgb(23 24 24 / 0.16);
	--ds-shadow-ring-hover: 0 0 0 3px rgb(0 0 255 / 0.2);
	--ds-glass-sheen: linear-gradient(180deg, rgb(255 255 255 / 0.14), transparent 60%);
	--ds-glass-blur: blur(12px) saturate(1.4);

	/* The band divider: four 9px steps between two grounds, each a further mix toward the ground below. */
	--ds-band-step: 9px;
	--ds-band-mix-1: 24%;
	--ds-band-mix-2: 48%;
	--ds-band-mix-3: 70%;
	--ds-band-mix-4: 88%;

	/* Motion: a strong ease-out for every hover, press and entrance; in-out only for what travels on screen (a tab
	   thumb). Never ease-in. */
	--ds-duration-fast: 160ms;
	--ds-duration-base: 200ms;
	--ds-duration-moderate: 260ms;
	--ds-duration-slow: 300ms;
	--ds-easing-out: cubic-bezier(0.22, 1, 0.36, 1);
	--ds-easing-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}

```

styles/theme.css

```css
/* Written by agentcard-ds from its brand files. Do not edit; run the CLI again to update. */
@theme inline {
	--color-brand: var(--ds-color-brand);
	--color-black: var(--ds-color-black);
	--color-white: var(--ds-color-white);
	--color-primary: var(--ds-color-action-primary);
	--color-primary-hover: var(--ds-color-action-primary-hover);
	--color-on-primary: var(--ds-color-action-primary-fg);
	--color-focus-ring: var(--ds-color-focus-ring);
	--color-surface: var(--ds-color-bg-default);
	--color-subtle: var(--ds-color-bg-subtle);
	--color-frame: var(--ds-color-bg-frame);
	--color-canvas: var(--ds-color-bg-canvas);
	--color-tint: var(--ds-color-bg-tint);
	--color-inverse: var(--ds-color-bg-inverse);
	--color-dark: var(--ds-color-bg-dark);
	--color-code: var(--ds-color-bg-code);
	--color-scrim: var(--ds-color-bg-scrim);
	--color-fg: var(--ds-color-text-default);
	--color-fg-secondary: var(--ds-color-text-secondary);
	--color-fg-muted: var(--ds-color-text-muted);
	--color-fg-subtle: var(--ds-color-text-subtle);
	--color-fg-faint: var(--ds-color-text-faint);
	--color-fg-nav: var(--ds-color-text-nav);
	--color-fg-inverse: var(--ds-color-text-inverse);
	--color-fg-brand: var(--ds-color-text-brand);
	--color-on-brand: var(--ds-color-text-on-brand);
	--color-line: var(--ds-color-border-default);
	--color-line-subtle: var(--ds-color-border-subtle);
	--color-line-strong: var(--ds-color-border-strong);
	--color-hairline: var(--ds-color-border-hairline);
	--color-success: var(--ds-color-status-success);
	--color-warning: var(--ds-color-status-warning);
	--color-danger: var(--ds-color-status-danger);
	--color-ink: var(--ds-color-ink);
	--color-paper: var(--ds-color-paper);
	--color-sky: var(--ds-color-sky);
	--color-blue-edge: var(--ds-color-blue-edge);
	--color-blue-hover: var(--ds-color-blue-hover);
	--color-blue-5: var(--ds-color-blue-5);
	--color-blue-10: var(--ds-color-blue-10);
	--color-blue-mid: var(--ds-color-blue-mid);
	--color-blue-mist: var(--ds-color-blue-mist);
	--color-sky-wash: var(--ds-color-sky-wash);
	--color-search-selected: var(--ds-color-bg-search-selected);
	--color-heart: var(--ds-color-heart);
	--color-tint-sage: var(--ds-color-tint-sage);
	--color-tint-rose: var(--ds-color-tint-rose);
	--color-tint-teal: var(--ds-color-tint-teal);
	--color-tint-peach: var(--ds-color-tint-peach);
	--color-tint-butter: var(--ds-color-tint-butter);
	--color-page: var(--ds-color-bg-page);
	--color-glass: var(--ds-color-bg-glass);
	--color-note: var(--ds-color-bg-note);
	--color-code-soft: var(--ds-color-bg-code-soft);
	--color-raised-on-brand: var(--ds-color-bg-raised-on-brand);
	--color-fg-on-brand-muted: var(--ds-color-text-on-brand-muted);
	--color-fg-label: var(--ds-color-text-label);
	--color-fg-on-brand-label: var(--ds-color-text-on-brand-label);
	--color-line-mid: var(--ds-color-border-mid);
	--color-line-rule: var(--ds-color-border-rule);
	--color-line-field: var(--ds-color-border-field);
	--color-line-field-hover: var(--ds-color-border-field-hover);
	--color-line-key: var(--ds-color-border-key);
	--color-line-brand: var(--ds-color-border-brand);
	--color-line-brand-edge: var(--ds-color-border-brand-edge);
	--color-line-on-brand: var(--ds-color-border-on-brand);
	--color-line-on-brand-strong: var(--ds-color-border-on-brand-strong);
	--color-line-window: var(--ds-color-border-window);
	--color-wash-hover: var(--ds-color-wash-hover);
	--color-wash-pill: var(--ds-color-wash-pill);
	--color-wash-selected: var(--ds-color-wash-selected);
	--color-wash-on-brand: var(--ds-color-wash-on-brand);
	--color-wash-glass-hover: var(--ds-color-wash-glass-hover);
	--color-ring-tint: var(--ds-color-ring-tint);
	--color-series-1: var(--ds-color-chart-series-1);
	--color-series-2: var(--ds-color-chart-series-2);
	--color-series-3: var(--ds-color-chart-series-3);
	--color-series-4: var(--ds-color-chart-series-4);
	--color-window-bar: var(--ds-color-window-bar);
	--color-window-bar-fg: var(--ds-color-window-bar-fg);
	--font-sans: var(--ds-font-sans);
	--font-display: var(--ds-font-display);
	--font-mono: var(--ds-font-mono);
	--font-code: var(--ds-font-code);
	--text-display: var(--ds-text-display);
	--text-hero: var(--ds-text-hero);
	--text-h1: var(--ds-text-h1);
	--text-h2: var(--ds-text-h2);
	--text-h3: var(--ds-text-h3);
	--text-h4: var(--ds-text-h4);
	--text-h5: var(--ds-text-h5);
	--text-body-lg: var(--ds-text-body-lg);
	--text-body: var(--ds-text-body);
	--text-body-sm: var(--ds-text-body-sm);
	--text-caption: var(--ds-text-caption);
	--text-micro: var(--ds-text-micro);
	--leading-tight: var(--ds-leading-tight);
	--leading-heading: var(--ds-leading-heading);
	--leading-display: var(--ds-leading-display);
	--leading-snug: var(--ds-leading-snug);
	--leading-body: var(--ds-leading-body);
	--leading-relaxed: var(--ds-leading-relaxed);
	--leading-code: var(--ds-leading-code);
	--tracking-display: var(--ds-tracking-display);
	--tracking-tighter: var(--ds-tracking-tighter);
	--tracking-tight: var(--ds-tracking-tight);
	--tracking-normal: var(--ds-tracking-normal);
	--tracking-label: var(--ds-tracking-label);
	--tracking-caps: var(--ds-tracking-caps);
	--tracking-mark: var(--ds-tracking-mark);
	--radius-chip: var(--ds-radius-chip);
	--radius-sm: var(--ds-radius-sm);
	--radius-menu: var(--ds-radius-menu);
	--radius-control: var(--ds-radius-control);
	--radius-card: var(--ds-radius-card);
	--radius-panel: var(--ds-radius-panel);
	--radius-shell: var(--ds-radius-shell);
	--radius-pill: var(--ds-radius-pill);
	--shadow-key: var(--ds-shadow-key);
	--shadow-key-brand: var(--ds-shadow-key-brand);
	--shadow-key-muted: var(--ds-shadow-key-muted);
	--shadow-pressed: var(--ds-shadow-pressed);
	--shadow-well: var(--ds-shadow-well);
	--shadow-guide: var(--ds-shadow-guide);
	--shadow-inset: var(--ds-shadow-inset);
	--shadow-card: var(--ds-shadow-card);
	--shadow-raised: var(--ds-shadow-raised);
	--shadow-code: var(--ds-shadow-code);
	--shadow-plan: var(--ds-shadow-plan);
	--shadow-tile: var(--ds-shadow-tile);
	--shadow-floating: var(--ds-shadow-floating);
	--shadow-glass-hover: var(--ds-shadow-glass-hover);
	--shadow-tooltip: var(--ds-shadow-tooltip);
	--shadow-ring-hover: var(--ds-shadow-ring-hover);
	--ease-out: var(--ds-easing-out);
	--ease-in-out: var(--ds-easing-in-out);
}

@theme {
	--animate-pop-in: ds-pop-in var(--ds-duration-fast) var(--ds-easing-out);
	--animate-fade-in: ds-fade-in var(--ds-duration-fast) var(--ds-easing-out);
	--animate-content-in: ds-content-in var(--ds-duration-base) var(--ds-easing-out);
	--animate-shimmer: ds-shimmer 1.6s var(--ds-easing-in-out) infinite;
	--animate-spin-slow: spin 0.8s linear infinite;
	--animate-accordion-down: ds-accordion-down var(--ds-duration-base) var(--ds-easing-out);
	--animate-accordion-up: ds-accordion-up var(--ds-duration-fast) var(--ds-easing-out);
	--animate-chart-line: ds-chart-line 900ms var(--ds-easing-out) backwards;
	--animate-chart-area: ds-fade-in 600ms var(--ds-easing-out) 250ms backwards;
	--animate-chart-tip: ds-chart-tip 360ms var(--ds-easing-out) backwards;
	--animate-chart-bar: ds-chart-bar 420ms var(--ds-easing-out) backwards;

	@keyframes ds-pop-in {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
	}

	@keyframes ds-fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-content-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@keyframes ds-sheet-right {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
	}

	@keyframes ds-sheet-left {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
	}

	@keyframes ds-accordion-down {
		from {
			height: 0;
		}
		to {
			height: var(--radix-accordion-content-height);
		}
	}

	@keyframes ds-accordion-up {
		from {
			height: var(--radix-accordion-content-height);
		}
		to {
			height: 0;
		}
	}

	@keyframes ds-chart-line {
		from {
			stroke-dashoffset: 1;
		}
	}

	@keyframes ds-chart-tip {
		from {
			opacity: 0;
			transform: scale(0.4);
		}
	}

	@keyframes ds-chart-bar {
		from {
			transform: scaleY(0.04);
		}
	}

	@keyframes ds-shimmer {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	@keyframes ds-pop-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-content-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-right {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-left {
		from {
			opacity: 0;
		}
	}
}

```
