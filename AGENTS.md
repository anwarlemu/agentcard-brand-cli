# Using this CLI

An agent that is handed this CLI should start with one command and then only use what that command lists. Do not invent tokens, templates, sizes, components, props or rules.

```sh
npx agentcard-ds manifest --json
```

`describe --json` is the same catalog. Pass `--json` on every agent-facing command. JSON is on stdout. Errors are JSON when `--json` is set, and the process exits nonzero. Unknown templates, sizes, components, tokens, groups, surfaces, exports and JSON fields fail with the allowed list. The CLI does not substitute a nearby name.

## What the catalog covers

1. Brand system. `brand --json` returns tokens, fonts, logos and voice. `brand tokens --json` lists groups: color, type, space, radius, motion, shadow, band, glass, and other. `brand tokens --group color --json` is one group. `brand tokens --name=--ds-color-brand --json` is one token. Use the equals form. A bare `--ds-...` is parsed as a flag. `brand fonts --json` lists the font files that ship and the font tokens whose families do not. `brand logos --json` lists the files in `brand/logo` and the usage rules stored with the logo component. `brand voice --json` is the Voice section, including the quoted words to avoid.

2. Images. `image list --json` lists sizes (`og`, `square`, `portrait`, `landscape`, `story`, `x-banner`, `linkedin-banner`) and templates (`hero`, `window`, `cards` from the brand's image editor, plus `headline`, `subtext`, `screenshot`, `quote`, `announcement`). `image render` requires `--template`. Output is PNG and SVG; text is outlined from the shipped font files; the toon objects come from `brand/illustration/objects`. The same inputs write the same bytes (a scatter's `--seed` included). Unknown names exit 1 with the closest choice.

3. Video, decks, illustrations, merch, Figma. `video render` writes MP4 (H.264) and WebM (VP9) through ffmpeg, single-threaded and bit-exact, 2 to 12 seconds at 30 fps, with motion from `brand/assets/video.json` (ease-out entrances, the sticker drift, the grain jumps); without ffmpeg MP4 falls back to Motion JPEG. `deck` renders slides from JSON to PNG and PDF. `illustrate` draws toon objects (rules in `brand/illustration.md`). `merch` writes print files at vendor-convention sizes. `figma` writes files and prints Figma MCP steps; it never calls Figma. Layouts and sizes for all of them are data in `brand/assets/*.json`.

4. Components. `component list --json` lists the bundled library. `component inspect <name> --json` returns exports, variant maps, example states, usage and constraints. `component emit <name> --state <State> --json` copies that example file unchanged. `component emit <name> --set key=value --text "..." --json` emits markup only from keys and values that exist on a complete variant map. Unknown keys and values error. `list`, `show`, `search` and `view` remain for the registry record and for installing into an app.

5. Principles. `principles --json` returns website rules, do and don't lists, element rules and the review rubric. `principles --surface site --json` is the site only. `principles --surface product --json` reports whether a product system is defined. If `product.defined` is false, do not invent product principles. `mentions` are lines and element records that already exist in the site files.

## Gaps the catalog already names

Read `gaps` in the manifest and stop there. Do not download a stand-in font, do not draw a new logo, and do not write a product principle the files do not contain.

- Display and mono font tokens name families that are not in `brand/fonts`. Only the Inter files ship. Images and videos outline text with those files.
- `brand.json` lists the site surface only. `brand/principles.md` has no Product section.
- Without ffmpeg, MP4 is Motion JPEG and WebM is refused.
- `component emit --set` covers static variant keys only. Use `--state` for the real example markup. A component without a complete variant map refuses `--set`.
- The toon objects are rendered pictures: illustration SVGs carry them as embedded images over a vector ground.

## Working in this repository

`npm run ci` builds, checks limits, builds the registry and runs tests. Do not commit `build/`, `dist/` or `node_modules/`. Do not put the brand name or the bin name in `src/`. Read them from `brand/brand.json`. No em dashes. American spelling. Sentence case.

The short contract installed into consumer apps is `brand/contract.md` (12 lines or fewer). The long instructions those apps receive are `brand/agent-guide.md` and `brand/skill.md`.
