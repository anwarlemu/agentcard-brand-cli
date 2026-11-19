import { Window } from "@/components/ui/window";
import { Block, Command, PageBody, PageHead } from "@www/components/chrome";
import { Code } from "@www/components/code";
import { CLI_COMMAND } from "@www/lib/registry";

export const metadata = { title: "Figma" };

const STEPS = [
  ["tokens", "The tokens as Figma variables (one collection, the Site mode) and shadows as effect styles: tokens.json plus use_figma scripts, safe to rerun."],
  ["push", "An illustration, image, slide, component or page as Figma-ready files: SVG for upload_assets, a script for small SVGs, HTML for html_to_figma."],
  ["pull", "The read steps for a frame (create_session, get_variable_defs, get_design_context) and where to save each result."],
  ["check", "Saved Figma values checked against the tokens: every off-brand color, font, size, radius and spacing, with the nearest token. Exits 1 when there are any."],
];

export default function FigmaPage() {
  return (
    <>
      <PageHead eyebrow="Docs" title="Figma" description="Move the brand into Figma and check designs coming back. The CLI never calls Figma: each action writes files and prints the Figma MCP calls to make, in order." />
      <PageBody className="max-w-300">
        <Block title="Actions">
          <Window name="figma.txt" bodyClassName="divide-y divide-line-subtle px-4">
            {STEPS.map(([id, about]) => (
              <div key={id} className="grid gap-1 py-3 text-body-sm sm:grid-cols-[6rem_1fr]">
                <span className="font-mono text-fg">{id}</span>
                <span className="text-fg-muted">{about}</span>
              </div>
            ))}
          </Window>
        </Block>

        <Block title="Variables" description="Run once per file. The scripts find or create the collection and update variables by name.">
          <Command command={`${CLI_COMMAND} figma tokens --out figma`} />
          <Code
            title="steps"
            lang="text"
            code={`1. create_session { fileKey, description }
2. use_figma { code: <figma/tokens-1.js>, skillNames: "figma-use,figma-generate-library" }
3. get_variable_defs { nodeId }   (optional check once something is bound)`}
          />
        </Block>

        <Block title="Push" description="Images, slides and illustrations go in as files; components and pages as self-contained HTML.">
          <Command command={`${CLI_COMMAND} figma push illustration cart --file <fileKey>`} />
          <Command command={`${CLI_COMMAND} figma push asset images/hero-og.svg --file <fileKey>`} />
          <Command command={`${CLI_COMMAND} figma push component button --file <fileKey>`} />
        </Block>

        <Block title="Pull and check" description="Read a frame, save what the tools return, then check it. Build with library components and tokens, never the raw values.">
          <Command command={`${CLI_COMMAND} figma pull "https://figma.com/design/<fileKey>/<name>?node-id=1-2"`} />
          <Command command={`${CLI_COMMAND} figma check figma/variables-1-2.json figma/design-1-2.txt`} />
          <Code title="figma check" lang="text" code={`1 off-brand value:\n  color   #1a1aff is not a brand color; nearest --ds-color-blue-hover`} />
        </Block>
      </PageBody>
    </>
  );
}
