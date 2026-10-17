---
name: sonner
title: Toast
type: ui
surface: site
description: "The brand's toast: one 40px white line at the bottom left with a hairline and 8px corners, a 24px blue key with a tick, the title in the 14px display face beside its 12px line."
kinds: []
use_for: "A brief note that something happened (a key copied, a card created), at most one small action. Mount one Toaster near the root and call toast.success() from anywhere."
never: [Toasts for errors that need an answer (use a dialog or a banner), More than one action, Dark toasts, Long sentences in a toast]
source: "agentcard-website src/app/globals.css (.v7-toast, .v7-toast-icon), src/components/v7/guide-client.tsx (GuideToaster)"
---
