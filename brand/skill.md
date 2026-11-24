---
name: {{bin}}
description: Build or restyle interfaces with the {{brand}} design system. Use when the project uses {{bin}} or the user requests {{brand}} components, tokens, or visual styling.
---

Use the project's configured components and brand tokens. Preserve the user's requested content and behavior.

Read project context with `npx {{bin}} info --json`. It reports the framework, stylesheet, aliases, installed components and registry. If the CLI is missing, use `npx -y {{source}}` in its place.

Find suitable components with `search <term> --json`, then read `view <names...> --json`. The response contains exact source and working examples. Inspect variant names, callback signatures and example dependencies instead of assuming another library's API.

Install with `add <names...> --dry-run --json`, then `add <names...> --json`. Existing local files are preserved. Use `add <names...> --diff` to compare updates; use `--overwrite` only when replacing those local changes is intended.

For new applications, `create --template vite --name <directory>` scaffolds the framework and installs the brand. Existing applications use `init`. Use `apply --dry-run` only when the user requests conversion of existing styles; package installation and restyling are different operations.

Read `guide` for brand rules and `tokens <term> --json` for custom styling. A box you make scroll (a list, a panel body, code) never cuts content off at a hard edge: give the scrolling element `fade-y`, `fade-x` or `fade-xy` from the theme, and its edges fade only where more content lies past them. Keep colors scoped to component roles; preserve artwork, chart data and unrelated palettes. Use `check --json` and the application's build and interaction tests to verify the result.

Read the whole system with `manifest --json` before choosing a token, template, component or rule. `describe --json` is the same command. `brand --json` is tokens, fonts, logos and voice. `brand tokens --name=--ds-color-brand --json` looks up one token and errors if the name is missing. `principles --json` is the website do and don't list. If `product.defined` is false, do not invent product rules.

`component list --json`, `component inspect <name> --json` and `component emit <name> --json` read the bundled library. `--state` copies an example file. `--set key=value` emits markup only for variant keys that exist. Unknown keys and values error.

Render images with `image --list --json`, then `image <template> --json` (`image render --template` is the same). Templates are `hero`, `window` and `cards` (the brand's image editor layouts, with the toon objects), `headline`, `subtext`, `screenshot`, `quote`, `announcement` and `logo`. Sizes are the shared platform sizes (`og`, `square`, `portrait`, `story`, `landscape`, `x-banner`, `linkedin`, `linkedin-banner`, `linkedin-page`, `youtube`, `youtube-thumbnail`, `email`, `avatar`, `custom`), several comma-separated, or `all`. Pass copy as flags (`--headline --body --badge`) or `--input <file>`; only what you pass is drawn, and words that do not fit fail with what to shorten. Output is PNG, SVG, JPG or WebP with no browser, the same bytes for the same input.

Revising a design: when a person will want changes, use `design new <template> ... -o name.design.json`, look at the PNG, then `design revise <file> "bigger headline, logo top right"` (plain words) or `design edit <file> --set ... --layer logo.anchor=top-right` (exact), `design undo`, `design variants`, `design sizes`, `design check`. Every write is checked against the brand and errors change nothing. Never edit the PNG or SVG by hand.

Render clips with `video <template> --json` (MP4 and WebM through ffmpeg, 2 to 12 seconds, `--still` for one frame). Make slides with `deck --input deck.json` (a PNG per slide and a PDF), illustrations with `illustrate <subjects...>` or `illustrate --image <file>` (rules in `brand/illustration.md`), merch print files with `merch <items...>` (vendor-convention sizes, 300 dpi, proofs and cut lines), and Figma files with `figma tokens|push|pull|check` (the CLI prints the Figma MCP calls; it never calls Figma). Every list is in `manifest --json`; an unknown name exits 1 with the closest choice.

The standard shadcn registry is `{{registry}}/r/shadcn/{name}.json`, under `@{{bin}}` in components.json. Use `npx shadcn@4.22.1 add @{{bin}}/theme @{{bin}}/<name>` for shadcn's workspace routing and ecosystem integrations. The same registry works with its MCP server. Component references are at `{{registry}}/components`.

With the upstream installer, include the theme explicitly so existing shadcn font and color aliases are updated. Native add applies it automatically.

Everything else: `compose` designs for layouts no template has (`design new compose`, `design compose add`), whole pages (`design page compose outline.json`), print documents (`print <item> --set name=...`), icons (`icons favicon`, `icons set`), emails (`email <template>`), GIFs and walkthroughs (`video ... --format gif`, `video walkthrough`). The agent guide has a table: I need X, run Y.
