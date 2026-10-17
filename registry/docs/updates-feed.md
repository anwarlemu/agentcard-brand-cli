---
name: updates-feed
title: Updates feed
type: site
surface: site
description: "The changelog: one ruled row per day, the date in small caps display type at left, the changes at right grouped under square caps tags (Added in blue, Improved in ink, Fixed in red), each group a short bulleted list in 14px text, with an optional title, body and framed video or image."
kinds: [table, chip, body-text, caption, media-frame]
use_for: "A changelog, release notes or a dated activity log. Put it in a `Prose` column (`wide`) or any 680 to 820px column."
never: [Rounded or filled tags, Colors other than blue ink and red for tags, Cards around each day, Long paragraphs instead of bullets]
source: "agentcard.sh/updates (computed: .v7-upd-feed, .v7-upd-day, .v7-upd-tag, .v7-upd-group, .v7-upd-video); not in the agentcard-website source yet"
---

`UpdatesFeed` props: `days` (`{ date, dateTime?, entries }[]`); each entry is `{ tag, tone?, title?, body?, items?,
media? }`. `tag` is any word; Added, New, Improved, Changed, Fixed and Removed pick their color, `tone` (`blue` | `ink`
| `heart`) overrides it. `media` is framed with a hairline; an iframe keeps 16:9.

`UpdateTag` is exported for a tag on its own.
