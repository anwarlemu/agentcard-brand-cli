---
name: cta
title: CTA
type: site
surface: site
description: "A closing band on the blue: the stepped bands in and out, a centered 52px display headline, one 19px line, the white key and optional imagery, under the scanlines the blue grounds wear."
kinds: [button-on-brand]
use_for: "The last band before the footer on a long page, when the page needs one more ask. The live agentcard.sh has no closing call to action; this is the simplest band true to the system."
never: [More than one per page, Two keys of equal weight, A blue key on the blue, A gradient or glow behind the headline, Long copy]
source: agentcard-website src/app/globals.css:1288 (.cta, an earlier closing stage); built from the hero's ground and the band divider (agentcard.sh has no closing CTA)
---

`Cta` props: `title`, `description`, `actions` (the on-brand Button), `media`, `bandFrom` and `bandTo` (default white;
null for none), `scan` (default true), plus section props.
