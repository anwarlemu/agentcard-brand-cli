import Link from "next/link";

import { Block, Command, PageBody, PageHead } from "@www/components/chrome";
import { CLI_COMMAND, GROUPS, INSTALL_COMMAND, items, registryName } from "@www/lib/registry";

const KEY =
  "flex h-full min-h-11 items-center rounded-control border border-hairline bg-surface px-4 py-2.5 font-display text-body-sm leading-snug font-medium text-fg shadow-key outline-none transition-[background-color] duration-150 ease-out hover:bg-sky-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none";

export default function Home() {
  return (
    <>
      <PageHead
        eyebrow="Design system"
        title={`${registryName} design system`}
        description={`Components, page sections, tokens and a CLI for building ${registryName} pages, drawn from agentcard.sh. ${items.length} items, each with live examples, usage notes and source.`}
      />
      <PageBody className="max-w-240">
        <Block title="Install the CLI" description="Run once from the project root. It adds the brand stylesheet, the fonts and the agent instructions.">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-2">
            <Command command={INSTALL_COMMAND} />
            <Command command="npx agentcard-ds init" />
          </div>
        </Block>
        <Block title="Add components" description="Components need React 19.2 or later, Tailwind CSS 4 and the @/* source alias. The CLI copies the source and installs what each one needs.">
          <Command command={`${CLI_COMMAND} add button card field input`} />
        </Block>
        {GROUPS.map((g) => {
          const list = items.filter((i) => i.type === g.type).sort((a, b) => a.title.localeCompare(b.title));
          if (!list.length) return null;
          return (
            <Block key={g.type} id={g.id} title={g.label} description={g.blurb}>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3">
                {list.map((i) => (
                  <li key={i.name}>
                    <Link href={`/components/${i.name}`} className={KEY}>
                      {i.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Block>
          );
        })}
      </PageBody>
    </>
  );
}
