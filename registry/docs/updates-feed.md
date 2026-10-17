---
name: updates-feed
title: Updates feed
type: site
surface: site
description: "Dated release notes grouped by change type."
kinds: [table, chip, body-text, caption, media-frame]
use_for: "Use for changelogs or activity updates. Provide dates, change groups and optional media. Place in a Prose column or another readable content width."
never: [Rounded or filled tags, Colors other than blue ink and red for tags, Cards around each day, Long paragraphs instead of bullets]
source: "agentcard.sh/updates (computed: .v7-upd-feed, .v7-upd-day, .v7-upd-tag, .v7-upd-group, .v7-upd-video); not in the agentcard-website source yet"
---

`UpdatesFeed` props: `days` (`{ date, dateTime?, entries }[]`); each entry is `{ tag, tone?, title?, body?, items?,
media? }`. `tag` is any word; Added, New, Improved, Changed, Fixed and Removed pick their color, `tone` (`blue` | `ink`
| `heart`) overrides it. `media` is framed with a hairline; an iframe keeps 16:9.

`UpdateTag` is exported for a tag on its own.
