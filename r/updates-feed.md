# Updates feed
Dated release notes grouped by change type.

Install: npx agentcard-ds add updates-feed
Requires: theme, utils
Packages: none
Exports: UpdatesFeed, UpdateTag, UpdateDay, UpdateEntry, UpdatesFeedProps
Client boundary: not required by this entry file
Reference: agentcard.sh/updates (computed: .v7-upd-feed, .v7-upd-day, .v7-upd-tag, .v7-upd-group, .v7-upd-video); not in the agentcard-website source yet


## Usage
Use for changelogs or activity updates. Provide dates, change groups and optional media. Place in a Prose column or another readable content width.
- Avoid: Rounded or filled tags
- Avoid: Colors other than blue ink and red for tags
- Avoid: Cards around each day
- Avoid: Long paragraphs instead of bullets
`UpdatesFeed` props: `days` (`{ date, dateTime?, entries }[]`); each entry is `{ tag, tone?, title?, body?, items?,
media? }`. `tag` is any word; Added, New, Improved, Changed, Fixed and Removed pick their color, `tone` (`blue` | `ink`
| `heart`) overrides it. `media` is framed with a hairline; an iframe keeps 16:9.

`UpdateTag` is exported for a tag on its own.

## Examples
Example components: npx agentcard-ds add updates-feed
[Site](https://agentcard-ds.vercel.app/preview/updates-feed/Site)

examples/updates-feed.tsx

```tsx
import { UpdatesFeed } from "@/components/site/updates-feed";

const DAYS = [
  {
    date: "Wed Oct 14",
    dateTime: "2026-10-14",
    entries: [
      {
        tag: "Added",
        items: [
          "A company can now sell through its own agent: a new purchase package gives the agent one buy tool for each shopper, and every approval goes straight to the shopper.",
          "A company can name its shopper agent, and the name shows on every message the agent sends.",
          "Purchase API answers now carry the merchant's order number once the order is placed.",
        ],
      },
      {
        tag: "Improved",
        items: ["A shopper with no login merges into their account the first time they sign in.", "A company now opens up to 10,000 cards at once."],
      },
      {
        tag: "Fixed",
        items: ["An iPhone with its passkey in a second keychain approves on the first try.", "A card payment no longer fails when the merchant retries it."],
      },
    ],
  },
  {
    date: "Tue Oct 13",
    dateTime: "2026-10-13",
    entries: [{ tag: "Fixed", items: ["The Purchase API now answers out-of-stock items with the closest match.", "On a vague shopping request the agent asks one question before it searches."] }],
  },
  {
    date: "Fri Feb 27",
    dateTime: "2026-02-27",
    entries: [
      {
        tag: "Added",
        title: "Set up from your editor",
        body: "One command adds the card tools to your coding agent and walks you through the first purchase.",
        media: (
          <div role="img" aria-label="A screen recording of the setup" className="flex aspect-video items-center justify-center bg-brand">
            <span className="flex size-14 items-center justify-center rounded-pill bg-white text-fg-brand shadow-key">▶</span>
          </div>
        ),
      },
    ],
  },
];

export function Site() {
  return (
    <div className="mx-auto max-w-(--ds-layout-text) px-5 py-16 sm:px-0">
      <UpdatesFeed days={DAYS} />
    </div>
  );
}

```

## Source

components/site/updates-feed.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// The changelog (agentcard.sh/updates, .v7-upd-feed): one ruled row per day, the date in small caps display type at
// left, and the day's changes at right grouped under square caps tags: Added in blue, Improved in ink, Fixed in the
// heart red. Each group is a short bulleted list in 14px text; a group may also carry a title, a body and media (a
// video or a screenshot in a hairline frame). On phones the date sits above the changes.

type Tone = "blue" | "ink" | "heart";

type UpdateEntry = {
  /** The caps tag: Added, Improved, Fixed (any word works; those three pick their color). */
  tag: string;
  /** Overrides the tag's color. */
  tone?: Tone;
  /** An optional headline for the group, in the display face. */
  title?: React.ReactNode;
  /** An optional paragraph under the title. */
  body?: React.ReactNode;
  /** The changes, one bullet each. */
  items?: React.ReactNode[];
  /** A video (iframe, <video>) or image, framed with a hairline. Video frames keep 16:9. */
  media?: React.ReactNode;
};

type UpdateDay = {
  /** The date as shown (Wed Oct 14); set in caps. */
  date: React.ReactNode;
  /** A machine date for the <time> element (2026-10-14). */
  dateTime?: string;
  entries: UpdateEntry[];
};

const TAG_TONE: Record<string, Tone> = { added: "blue", new: "blue", improved: "ink", changed: "ink", fixed: "heart", removed: "heart" };

const TONES: Record<Tone, string> = {
  blue: "border-brand text-fg-brand",
  ink: "border-ink text-fg",
  heart: "border-heart text-heart",
};

function UpdateTag({ tag, tone, className }: { tag: string; tone?: Tone; className?: string }) {
  const t = tone ?? TAG_TONE[tag.toLowerCase()] ?? "ink";
  return <span className={cn("w-fit border px-2 pt-0.75 pb-0.5 font-display text-micro [line-height:1.75] tracking-caps uppercase", TONES[t], className)}>{tag}</span>;
}

function Entry({ entry }: { entry: UpdateEntry }) {
  return (
    <div className="flex flex-col gap-2">
      <UpdateTag tag={entry.tag} tone={entry.tone} />
      {entry.title ? <h3 className="mt-1 font-display text-h5 leading-snug font-medium tracking-tight">{entry.title}</h3> : null}
      {entry.body ? <p className="text-body-sm leading-relaxed text-fg-secondary">{entry.body}</p> : null}
      {entry.items?.length ? (
        <ul className="m-0 flex list-disc flex-col gap-2.5 pl-4.5">
          {entry.items.map((item, i) => (
            <li key={i} className="text-body-sm leading-relaxed text-ink/80">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {entry.media ? (
        <div className="mt-2 overflow-hidden border border-ink/18 [&_iframe]:block [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_img]:block [&_img]:h-auto [&_img]:w-full [&_video]:block [&_video]:w-full">
          {entry.media}
        </div>
      ) : null}
    </div>
  );
}

type UpdatesFeedProps = Omit<React.ComponentProps<"div">, "children"> & { days: UpdateDay[] };

function UpdatesFeed({ days, className, ...props }: UpdatesFeedProps) {
  return (
    <div data-slot="updates-feed" className={cn("flex flex-col", className)} {...props}>
      {days.map((day, i) => (
        <section key={i} className="grid grid-cols-1 gap-2.5 border-b border-ink/18 py-6.5 sm:grid-cols-[9.375rem_minmax(0,1fr)] sm:gap-5">
          <h2 className="m-0 pt-0.75 font-display text-caption leading-body font-normal tracking-caps text-ink/62 uppercase">
            {day.dateTime ? <time dateTime={day.dateTime}>{day.date}</time> : day.date}
          </h2>
          <div className="flex min-w-0 flex-col gap-4.5">
            {day.entries.map((entry, j) => (
              <Entry key={j} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export { UpdatesFeed, UpdateTag };
export type { UpdateDay, UpdateEntry, UpdatesFeedProps };

```
