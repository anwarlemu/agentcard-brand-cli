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
