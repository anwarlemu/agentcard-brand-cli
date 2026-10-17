---
name: logo
title: Logo
type: ui
surface: site
description: "Agentcard wordmark and standalone mark."
kinds: []
use_for: "Use Lockup in headers and footers, and LogoMark in smaller spaces. Set label={null} when the containing link already has an accessible name."
never: [The logo in a color other than blue, ink or white, The mark stretched or outlined, A drop shadow or glow behind the logo, The wordmark retyped in a font]
source: agentcard-brand-cli brand/logo (lockup.svg, mark.svg); agentcard.sh / (header a, 160x28)
---

`Lockup` and `LogoMark` take every SVG prop plus `label` (string or null, default "Agentcard") and `tone`
("current" | "brand" | "white" | "ink", default "current"). Size them by width (`className="w-40"`); the height follows.
The site's white header sets the lockup in ink, the hero and footer in white.
