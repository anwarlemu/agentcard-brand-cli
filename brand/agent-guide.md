# {{brand}} design system: instructions for agents

Use this system to build {{brand}} pages and interfaces from the user's brief. These instructions work with any agent that can read text and edit project files. The CLI is a local Node.js tool; no model account or agent-specific integration is needed for setup, discovery, installation or token checks.

The first command is `{{cli}} manifest --json`. It lists every command, token group, font file, logo rule, image template, video template, component, and site or product principle. `{{cli}} describe --json` is the same command. Do not invent a name that is absent from that JSON. Unknown templates, sizes, components, tokens and JSON fields are errors. The CLI does not substitute a nearby name.

## Start here

1. Read the project instructions and package.json. Identify the framework, package manager, stylesheet and import aliases. Use the user's requirements to decide whether to build new UI or restyle existing UI.
2. Read this guide, then the relevant component references. The library is at {{registry}}/components. Plain text is at {{registry}}/llms.txt; a complete copy is at {{registry}}/llms-full.txt.
3. Reuse the library's components and variants. Do not recreate them from screenshots or guess their props. Each reference contains the actual exports, dependencies, working examples and source code.

## Install and prepare a project

Requires Node.js 20 or later. Run commands from the consuming project root, not the design-system repository.

```sh
npm install --save-dev {{source}}
{{cli}} init
```

`npm install` installs the CLI only. `init` installs styles, fonts and agent instructions without converting existing components or creating conversion review tasks. It preserves other instructions already in the project. Inspect its warnings about a missing stylesheet or alias.

React components require React 19 or later, Tailwind CSS 4 and a working build. The installer follows components.json and TypeScript or JavaScript aliases; without aliases, it uses relative imports. Set up that framework first. Other frameworks can use the CSS tokens and styling guidance, but cannot render the React components.

For an existing interface that the user wants restyled, preview the explicit apply command:

```sh
npx -y {{source}} apply --dry-run
npx -y {{source}} apply
```

The apply command can adapt matching components, convert style values, and install agent rules and hooks. Color conversion is scoped to recognized components; unrelated palettes and artwork remain unchanged. The legacy bare command also converts styles; use explicit commands for setup and discovery. Subsequent runs resume review tasks. `--redo` repeats conversion. Review the diff and test existing behavior after conversion; a successful exit is not proof that the visual review is complete.

## Find, inspect and add components

```sh
{{cli}} list --json
{{cli}} show select
{{cli}} show select --json
{{cli}} add field select button --dry-run --json
{{cli}} add field select button --json
```

The add command above is an example, not the list required for every page. Choose items from `list`. `show` is read-only and works offline using the registry bundled with the CLI. `show --json` returns source, examples, usage rules, exports, dependencies and links. Hooks and helper libraries are included in the JSON index.

`add` copies source files and their transitive dependencies, installs missing npm packages, and wires the theme. Existing files are kept. Use `--overwrite` only when intentionally replacing local component changes. Read the returned file list and warnings. Generated imports and target files follow components.json and the project alias configuration. Existing utility files are preserved; brand helpers use their own names.

For HTTP-only agents, fetch `{{registry}}/r/index.json`, then `{{registry}}/r/<name>.json` or `{{registry}}/r/<name>.md`. Follow `requires` recursively. Each `files[].path` is relative to the source root; `files[].content` is the exact source. Each example lists its own `requires` and `packages`; install these too when using that example. Do not copy the example file as the component implementation. The CLI handles dependency ordering and theme installation for you.

The component reference states its source. `{{registry}}/r/audit.json` records the reference basis for all components. Some controls extend shared Agentcard patterns because the public site has no standalone equivalent. Select uses the site’s field styling with a portable Radix menu; the reference site’s menu is native to the browser. Do not describe extensions as exact copies of live controls.

## Compose the interface

- Follow the user's brief. For new pages, add the required content and behavior. When only restyling an existing page, preserve its content, links, order and behavior unless the user requests changes.
- Use component props and variants shown in the source. Read the named example functions before composing compound components. Keep client state inside a client component when using Next.js; imports of client components can still be rendered by server pages.
- Use design tokens for custom styles. `{{cli}} tokens <term> --json` finds values; `{{cli}} look <element-or-file> --json` explains styling by role. Use `var(--ds-*)` in CSS or the matching Tailwind utilities.
- For a picture rather than a component, render it with the CLI. See "Render images" and "Render videos" below. Do not invent a second palette for social, Open Graph or video art.
- Body text uses Inter; headings, labels and buttons use the display font stack. Use the provided blue and white/paper grounds, button bevels, windows and stepped band divider. Do not introduce unrelated colors, shadows or type scales.
- The installed stylesheet imports `./_{{bin}}/brand.css` and `./_{{bin}}/theme.css` beside the main stylesheet. `brand.css` includes tokens and base styles. Keep both imports after `@import "tailwindcss"`. Let the installer configure fonts; do not add a second font loader.
- Put one control in each Field. Field connects labels, help, errors and required state. Validation and submission belong to your form. For Select use `value` and `onValueChange`, SelectTrigger with SelectValue, and SelectContent with SelectItem; values must be non-empty strings. Give the root a `name` for FormData. Use `defaultValue` only for uncontrolled input.
- Connect every action to its intended behavior. Handle empty, loading, disabled, invalid, success and error states. Preserve keyboard controls, focus return, accessible names and native form semantics. Never present a preview's local demo action as a completed backend operation.
- Use the provided portal behavior. Surface is for an isolated preview or a scoped theme; ordinary pages do not need an extra Surface wrapper. Mount one Toaster per application when using toast notifications.

## Render images

Use this when the brief needs an Open Graph image, a social post or a profile banner. The command reads the brand tokens, the shipped logo, the shipped Inter files and the brand's toon objects. It does not open a browser. The same content always writes the same bytes, so it can run in CI or a sandbox.

```sh
{{cli}} image --list --json
{{cli}} image hero --headline "Let agents buy anything online" --size all --json
{{cli}} image hero --headline "Let agents buy anything online" --size x-banner --out banner.png --json
{{cli}} image window --badge "Issuing" --headline "Create one-time and multi-use cards" --picture card --json
{{cli}} image cards --input cards.json --size landscape --json
{{cli}} image hero --headline "A title" --seed 4 --size square --json
{{cli}} image hero --headline "A title" --image ./photo.jpg --toon --size story --json
{{cli}} image screenshot --headline "A feature" --image ./screen.png --json
{{cli}} image logo --size avatar --json
{{cli}} image carousel --input carousel.json --size portrait --json
```

Templates: `hero`, `window` and `cards` are the brand's image editor layouts (the hero with toon objects round the words, words beside a sky-barred window, numbered cards); `headline`, `subtext`, `screenshot`, `quote` and `announcement` are the first templates; `logo` is the lockup alone (the mark on the profile picture). `image <template>` and `image render --template <template>` are the same. Sizes are the shared platform sizes: `og`, `square`, `portrait`, `story`, `landscape`, `x-banner`, `linkedin`, `linkedin-banner`, `linkedin-page`, `youtube` (channel art), `youtube-thumbnail`, `email` and `avatar`, or `custom` with `--width` and `--height`, several comma-separated, or `all`. Each keeps clear of what its platform covers (the profile picture on a banner, a story's bars, YouTube's safe area); `image --list --json` lists them with their sources.

Pass copy as flags (`--headline --body --badge --button`; `--subtext` and `--eyebrow` still work), or as a JSON object with `--input` (flags override it). Only the copy you pass is drawn: nothing is made up, and a slot a template cannot draw is an error. `--sample` fills the empty slots with sample copy on purpose. Words are drawn whole: they shrink to a readable floor and re-wrap, and when they still do not fit, the command fails and says what to shorten. Characters the shipped font cannot draw (emoji, Chinese, Arabic) are refused, never drawn as boxes. Cards are a list of `{ "title", "body" }`, or text with a blank line between cards. `--stickers` arranges the toon objects: `preset` (the hero's seven), `under` (one large object beside or under the words), `scatter` (seeded: `--seed` alone asks for it) or `none`; objects never touch the words, the logo, each other or the edge, and one with no room is left out and named. `--image` puts your PNG or JPEG in the window (the window takes its shape and shows it whole) or, on the hero, in as the object; `--toon` makes it a toon object first. Themes are `blue`, `paper`, `white` and `ink` (`--theme`, or `--ground`); `--band` adds the stepped band toward another ground. Formats are `png`, `svg`, `jpg` and `webp` (`--format`, default png and svg); `--out banner.png` names one file; `--scale 2` doubles the pixels. A PNG over the platform's upload limit is named in the result. `image carousel --input carousel.json` makes a numbered set (square, portrait or story) that shares one headline size. `--dry-run` checks everything and writes nothing.

The display face named in the tokens is not included, so images set it in the shipped Inter. Do not download a stand-in, do not redraw the logo, and never put a third-party logo, a real person's name or a real quote into an image: use Acme for samples. An unknown template, size, subject, ground or field exits 1 and names the closest choice.

## Revising a design

When a person wants a graphic they can adjust (a banner, a post, a slide, a print file), make a design file instead of a one-off picture, and change that file until they are happy:

```sh
{{cli}} design new hero --size x-banner --headline "Let agents buy anything online" -o banner.design.json
{{cli}} design revise banner.design.json "bigger headline, logo top right, darker theme"
{{cli}} design edit banner.design.json --set body="Every purchase is approved." --layer headline.align=left
{{cli}} design undo banner.design.json
{{cli}} design variants banner.design.json --by theme
{{cli}} design sizes banner.design.json --to og,square,story,linkedin-banner
{{cli}} design check banner.design.json --json
```

Make it, look at the PNG beside the file, change it, check it, and repeat. `revise` takes plain words and refuses any part it does not understand (nothing changes, and it lists what you can say); agents that reason should use `edit`. Every write is checked: off-brand colors, lost words, overlaps, the logo's clear space, contrast, small text and the parts a platform covers are errors and change nothing. `--allow <rule>` accepts a composition rule for one design; brand rules can never be allowed. Never edit the PNG or SVG by hand: change the design and draw it again. `design templates` lists what a design can start from (images, slides as `slide-*`, merch as `merch-*`, illustrations as `illustration-*`, clips as `video-*`).

## Make slides

```sh
{{cli}} deck --list --json
{{cli}} deck --input deck.json --out deck --json
{{cli}} deck --sample --out deck
```

A deck file is `{ "slides": [ { "type": "cover", "headline": "...", "body": "..." } ] }` (`title` still works for `headline`). Types: `cover`, `section`, `statement`, `bullets`, `stat`, `quote`, `image`, `cards` and `end`; `deck --list --json` lists each type's slots. Slides are 1920 by 1080: one PNG per slide (`--format png,svg,jpg,webp`) and one `deck.pdf`. Each slide may set a `theme`; `--theme` sets it for the rest. Copy is fitted or refused, never cut. An unknown type or slot exits 1 with the closest name.

## Make illustrations

The brand illustrates with toon objects: everyday things of buying and paying, rendered as glossy 3D toys. Read `brand/illustration.md` (in this package) for the rules.

```sh
{{cli}} illustrate --list --json
{{cli}} illustrate cart --ground blue --json
{{cli}} illustrate coins wallet receipt --ground paper --json
{{cli}} illustrate --composition scatter --seed 5 --size og --json
{{cli}} illustrate --image ./photo.jpg --composition object --json
```

Subjects are the fifteen objects (`card`, `cart`, `coins`, `gift`, `wallet`, `bag`, `sale-tag`, `phone`, `cash`, `parcel`, `terminal`, `purse`, `cardholder`, `receipt`, `checkout`). Compositions: `single`, `row`, `preset`, `scatter` and `object` (the object alone on a clear ground). `--image` turns any picture into a toon object. Output is SVG (vector ground, the objects as embedded pictures, since they are 3D renders) and PNG.

## Make merch print files

```sh
{{cli}} merch --list --json
{{cli}} merch tee-front --variant all --json
{{cli}} merch poster sticker --json
```

Items: `tee-front`, `tee-back`, `hoodie-front`, `cap-front`, `tote`, `mug-wrap`, `sticker`, `sticker-mark` and `poster`. Each writes an SVG at real size in inches, a PNG at 300 dpi (`--format pdf` adds a print PDF with its trim box), a proof with the trim, bleed and safe guides, and for stickers a CutContour line. Only a headline you pass is printed (`--sample` fills one); the poster keeps the brand's address. Only the approved lockup and mark in blue, ink or white are used. The sizes are common vendor conventions, not brand rules: tell the person to confirm them against the vendor's template.

## Read the brand system

```sh
{{cli}} brand --json
{{cli}} brand tokens --group color --json
{{cli}} brand tokens --name=--ds-color-brand --json
{{cli}} brand fonts --json
{{cli}} brand logos --json
{{cli}} brand voice --json
```

Token groups are `color`, `type`, `space`, `radius`, `motion`, `shadow`, `band`, `glass` and `other`. `--name` must use the equals form, because a bare `--ds-...` is parsed as a flag. A missing token or an unknown group is an error. Logo usage rules come from the logo component. Voice is the Voice section of the principle file, including the quoted words to avoid.

## Render videos

Use this for a short clip that moves the way the brand does: words and objects arrive on the brand's ease-out (`--ds-easing-out` over `--ds-duration-slow`, staggered), the objects then drift like the site's sticker field, and the band's grain jumps. Nothing eases in and nothing starts from nothing.

```sh
{{cli}} video list --json
{{cli}} video hero --headline "Let agents buy anything online" --size square,vertical --format mp4,webm --json
{{cli}} video cards --input cards.json --size landscape --seconds 6 --json
{{cli}} video hero --headline "A title" --still end --json
```

Templates: every image layout, with its fields (`social` and `product` are the older names of `headline` and `screenshot`). `video render --template <id>` still works. Sizes: `square`, `vertical`, `landscape`, `portrait` and `og`. Clips run 2 to 12 seconds (default 4) at 30 fps. MP4 is H.264 and WebM is VP9 through ffmpeg, single-threaded and bit-exact, so the same input writes the same bytes on the same ffmpeg. Without ffmpeg, MP4 falls back to Motion JPEG and WebM is refused. `--still <seconds>` (or `end`) writes one frame as PNG and SVG.

## Work in Figma

The CLI never calls Figma itself: each action writes files and prints the Figma MCP calls to make, in order.

```sh
{{cli}} figma tokens --out figma --json
{{cli}} figma push illustration cart --file <fileKey> --json
{{cli}} figma push asset images/hero-og.svg --file <fileKey> --json
{{cli}} figma push component button --file <fileKey> --json
{{cli}} figma pull "https://figma.com/design/<fileKey>/<name>?node-id=1-2" --json
{{cli}} figma check figma/variables-1-2.json figma/design-1-2.txt --json
```

`tokens` writes the tokens as Figma variables (one collection, mode Site) with use_figma scripts that are safe to rerun. `push` prepares an illustration, image, slide, component or page (SVG for upload_assets, a script for small SVGs, HTML for html_to_figma). `pull` prints the read steps and where to save each result; `check` lists every off-brand color, font, size, radius and spacing in the saved results with the nearest token, and exits 1 when there are any. Load the Figma skills the steps name before calling use_figma or get_design_context.

## Components, without guessing props

`{{cli}} list` and `{{cli}} show` remain the way to install and to read full source. When you need the prop map before writing UI, use the component commands. They read the bundled library and do not fetch the network.

```sh
{{cli}} component list --json
{{cli}} component inspect button --json
{{cli}} component emit button --state Site --json
{{cli}} component emit button --set variant=primary --set size=sm --text "Start free" --json
```

`inspect` returns exports, variant keys and values, example state names, usage and constraints. `emit --state` copies that example file unchanged and also returns the one export. `emit --set` builds markup only from keys and values that exist on a complete variant map. An unknown key, an unknown value, or a map that is not fully static is an error. Use `--state` for the real example when `--set` is refused. Do not invent a prop that `inspect` does not list.

## Design principles

```sh
{{cli}} principles --json
{{cli}} principles --surface site --json
{{cli}} principles --surface product --json
```

The site object is the website rules, the do list, the don't list, the element rules and the review rubric, copied from the brand files. The product object says whether a product system is defined. If `product.defined` is false, there is no product principle set to follow. `mentions` are existing lines and element records that contain the word. Do not write a product system from those mentions.

## Verify before finishing

1. Run the consuming project's type checks, tests and production build.
2. Run `{{cli}} check --json`. Exit 0 means no token violations; exit 1 means unresolved violations or a command error. Read the JSON result, fix the findings and rerun. A token check does not test accessibility or behavior.
3. Test every interaction with mouse and keyboard. Submit invalid and valid forms, choose options, open and close overlays, and test loading/error paths. Check desktop and phone widths, focus visibility, overflow and reduced-motion behavior.
4. Compare screenshots against the relevant library previews and reference. `{{cli}} review http://localhost:3000 --any` can capture and review a running page. It requires playwright-core and Chromium. Automated scoring uses an available supported reviewer; if none is available, read the saved screenshots and report a manual review. Never claim an independent score that was not produced.
5. Report what changed, which checks passed, and any remaining limitations. If conversion left follow-up tasks, complete or report them explicitly.

## Instructions and hooks

`init` and conversion install AGENTS.md and a local `.ds/agent-guide.md`, plus supported agent instruction files and hook configuration. Agents that do not load those files automatically should read them explicitly. Hooks support Claude Code, Codex and Cursor when enabled by that tool; other agents run the CLI checks directly. Codex hook activation may require the user's `/hooks` trust step. No hook integration is required to use the components correctly.

Read-only commands: `manifest`, `describe`, `guide`, `brand`, `principles`, `component list`, `component inspect`, `component emit`, `list`, `show`, `look`, `tokens`, `check` without `--fix`, `image --list` and `video --list`, and `design show`, `history` and `check`.
Commands that write project files: `init`, `add`, `apply`, the legacy bare conversion command, `check --fix`, review/snapshot state updates, `image` (image files only, to `--out`), `video` (video files only, to `--out`) and `design` (the design file and its pictures). Use `--dry-run` with `init`, `add`, conversion, `image`, `video` or `design new|revise|edit` to inspect planned writes. JSON goes to stdout and progress goes to stderr. Installation/build failures return a nonzero exit code.

## Project configuration and agent handoff

Start with `{{cli}} info --json`, then `search <term> --json` and `view <names...> --json`. These commands are read-only. `show` and `inspect` remain aliases of `view`.

`add` respects components.json, inherited TypeScript or JavaScript aliases, the target stylesheet and the package manager. It emits JSX/JS when `tsx` is false, installs the theme and agent guidance, and preserves differing local files. Use `add <names...> --diff` to review changes before `--overwrite`. Use `--cwd <app>` from a repository root. For shared workspace packages, use the upstream installer described below.

`create --template vite --name <directory>` scaffolds a new app and installs brand components. `init` configures an existing app; `init button card` also adds components. `apply --dry-run --json` previews a requested conversion of existing styles. Do not run conversion to discover or install the library.

Portable skills are installed in `.agents/skills/{{bin}}/SKILL.md` and `.claude/skills/{{bin}}/SKILL.md`; the full guide is `.ds/agent-guide.md`. Read `add --view` or the installed source for imports resolved to this project's paths. The installed brand utility is separate from the application's existing `lib/utils` exports.

The standard shadcn registry is configured under `@{{bin}}` in components.json. For workspace routing, install with `{{cli}} shadcn add @{{bin}}/theme @{{bin}}/button`. Include the theme explicitly with upstream shadcn so existing font and color aliases are updated. Native `add` applies it automatically.

Advanced operations use pinned shadcn 4.22.1: `shadcn <args...>`, `mcp`, `registry`, `preset`, `migrate`, `eject`, and `build`. These need network access on first use and preserve upstream output formats. Native brand commands accept `--json`. Preset/base changes are upstream operations that may change the brand; use them only when requested. MCP configuration alone does not prove the agent host has loaded its server.

The explicit `apply` command scopes color conversion to recognized components and preserves unrelated artwork and shared palette data. The legacy bare-command conversion remains for compatibility; use `apply` for new restyling tasks.
