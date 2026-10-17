---
name: banner
title: Banner
type: ui
surface: site
description: "A notice drawn as the guides' note: a small window with a file-like bar over a sheet. `info` is the sky bar over a pale sky sheet, `brand` the blue bar over white, `alert` the rose bar over white with a red title."
kinds: [window-bar]
use_for: "One notice at the top of a page or a section, or a note inside a page: news (`info`), the announcement that matters (`brand`), or trouble that needs a look (`alert`). `name` labels the bar (voice.beta, agent.paused); actions are small keys at the end."
never: [More than one banner at a time, Banners for marketing copy that belongs in a section, Bold titles, Gradients]
source: "agentcard-website src/app/globals.css (.v7-guide-note, .v7-guide-note-body, .v7-guide-cta-title, --guide-shadow); src/components/v7/guide-body.tsx (note)"
---
