---
name: logo
title: Logo
type: ui
surface: site
description: "The brand's lockup (the agentcard wordmark with the hand drawn in lines) and the mark alone, inlined from its SVG and drawn in currentColor: blue or ink on white, white on the blue."
kinds: []
use_for: "The header and footer (`Lockup`, 160px wide), the phone bar and tight spots (`LogoMark`). Pass `label={null}` when a link around it already names it (\"Agentcard, home\")."
never: [The logo in a color other than blue, ink or white, The mark stretched or outlined, A drop shadow or glow behind the logo, The wordmark retyped in a font]
source: agentcard-brand-cli brand/logo (lockup.svg, mark.svg); agentcard.sh / (header a, 160x28)
---

`Lockup` and `LogoMark` take every SVG prop plus `label` (string or null, default "Agentcard") and `tone`
("current" | "brand" | "white" | "ink", default "current"). Size them by width (`className="w-40"`); the height follows.
The site's white header sets the lockup in ink, the hero and footer in white.
