---
name: code-window
title: Code window
type: ui
surface: site
description: "Code on the ink ground, as on the home page's integrations: 8px corners, a 30px bar with three small squares and the file name, the code in the 12px display face at 88 percent white, the deep drop that lifts it off a blue panel, and light highlighting (comments faint, strings sky). An optional copy key."
kinds: [code-window]
use_for: "Any code, command or request a page shows: an integration snippet on a blue panel, a guide's code block, an API request. Pass `code` as a string (highlighted and copyable) or pre-rendered children."
never: [A full syntax theme with many colors, A light code window, Rounded corners above 8px, Code set in a monospace other than the display face]
source: "agentcard-website src/components/v7/integrations.tsx (CodePane), src/app/globals.css:3341 (.v7-intg-code); agentcard.sh / (computed: .v7-intg-stage [class*=code])"
---

`CodeWindow` props: `title` (the file name in the bar), `code` (string) or `children`, `language` (only picks the comment
marker for highlighting: `ts`, `sh`, `py`, `sql`, `text`...), `copy` (adds the copy key; needs `code`), `preClassName`
(a fixed height or the home stage's 60px of bottom room, `pb-15`). It also exports `tokenize(code, language)`.

On the brand's page the window sits at 88 percent of a blue panel (`bg-brand`, 12px corners, 32px padding). The site
has no separate terminal style live (the guides are not published), so there is no `Terminal` export: use a code window
titled `Terminal` with `language="sh"`.
