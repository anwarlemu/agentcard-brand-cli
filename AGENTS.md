# Using this CLI

An agent that is handed this CLI should start with one command and then only use what that command lists. Do not invent tokens, templates, sizes, components, props or rules.

```sh
npx agentcard-ds manifest --json
```

`describe --json` is the same catalog. Pass `--json` on every agent-facing command. JSON is on stdout. Errors are JSON when `--json` is set, and the process exits nonzero. Unknown templates, sizes, components, tokens, groups, surfaces, exports and JSON fields fail with the allowed list. The CLI does not substitute a nearby name.

## What the catalog covers

1. Brand system. `brand --json` returns tokens, fonts, logos and voice. `brand tokens --json` lists groups: color, type, space, radius, motion, shadow, band, glass, and other. `brand tokens --group color --json` is one group. `brand tokens --name=--ds-color-brand --json` is one token. Use the equals form. A bare `--ds-...` is parsed as a flag. `brand fonts --json` lists the font files that ship and the font tokens whose families do not. `brand logos --json` lists the files in `brand/logo` and the usage rules stored with the logo component. `brand voice --json` is the Voice section, including the quoted words to avoid.

2. Images. `image list --json` lists sizes (`og` 1200 by 630, `square` 1080 by 1080, `portrait` 1080 by 1350, `landscape` 1200 by 675) and templates (`headline`, `subtext`, `screenshot`, `quote`, `announcement`). `image render` requires `--template`. The default size is `og`. Output is PNG and SVG. Text is outlined from the shipped font files. The same inputs write the same bytes. A missing template, an unknown template, an unknown size, an unknown JSON field, or a field the template does not list is an error.

3. Video. `video list --json` lists templates (`social`, `announcement`, `product`) and sizes (`square` 1080 by 1080, `vertical` 1080 by 1920, `landscape` 1920 by 1080). `--size` is required. `video render` writes Motion JPEG in an MP4: 12 frames at 12 fps, eased with `--ds-easing-out`. There is no duration flag and no browser. The same inputs write the same bytes. Sample files are in `examples/videos/`, one per template family. Still samples are in `examples/images/`.

4. Components. `component list --json` lists the bundled library. `component inspect <name> --json` returns exports, variant maps, example states, usage and constraints. `component emit <name> --state <State> --json` copies that example file unchanged. `component emit <name> --set key=value --text "..." --json` emits markup only from keys and values that exist on a complete variant map. Unknown keys and values error. `list`, `show`, `search` and `view` remain for the registry record and for installing into an app.

5. Principles. `principles --json` returns website rules, do and don't lists, element rules and the review rubric. `principles --surface site --json` is the site only. `principles --surface product --json` reports whether a product system is defined. If `product.defined` is false, do not invent product principles. `mentions` are lines and element records that already exist in the site files.

## Gaps the catalog already names

Read `gaps` in the manifest and stop there. Do not download a stand-in font, do not draw a new logo, and do not write a product principle the files do not contain.

- Display and mono font tokens name families that are not in `brand/fonts`. Only the Inter files ship. Images and videos outline text with those files.
- `brand.json` lists the site surface only. `brand/principles.md` has no Product section.
- Video is Motion JPEG, not H.264. Players that accept MJPEG in MP4 can open it. A browser video element may not.
- `component emit --set` covers static variant keys only. Use `--state` for the real example markup. A component without a complete variant map refuses `--set`.
- Clip length is fixed at 12 frames and 12 fps. Duration tokens are for interface transitions and are not stretched into the clip.

## Working in this repository

`npm run ci` builds, checks limits, builds the registry and runs tests. Do not commit `build/`, `dist/` or `node_modules/`. Do not put the brand name or the bin name in `src/`. Read them from `brand/brand.json`. No em dashes. American spelling. Sentence case.

The short contract installed into consumer apps is `brand/contract.md` (12 lines or fewer). The long instructions those apps receive are `brand/agent-guide.md` and `brand/skill.md`.
