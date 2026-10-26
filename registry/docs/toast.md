---
name: toast
title: Toast
type: ui
surface: site
description: "The Radix toast in the brand's toast: a white card at the bottom left with a display-face title and a small blue action."
use_for: "Use only where the older toast API is needed; prefer Sonner. Mount Toaster once and call toast({ title, description, action }). Use variant destructive for failures and keep messages to a line."
never: [Toasts for errors that need a decision, Several actions in one toast, Long messages]
source: "agentcard-website globals.css .v7-toast (as sonner.tsx)"
---
