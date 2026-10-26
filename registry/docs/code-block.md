---
name: code-block
title: Code Block
type: ui
surface: site
description: "Code on the ink ground, as the code window draws it: a bar with three squares, a file name and a copy key, then light highlighting and line numbers."
use_for: "Use for code a person reads or copies: SDK calls, curl commands, API responses. Give it a CodeBlockHeader with CodeBlockTitle (the file name, or Terminal) and a CodeBlockCopyButton, then CodeBlockContent with the code. Pass wrap for long values and a max-h class for long files. It is shadcn's CodeBlock API in the CodeWindow look; on a page it sits on a blue panel as on the home page."
never: [A light code block, A full syntax theme with many colors, Rounded corners above 8px, Code in Inter]
source: "Agentcard code window: agentcard-website src/components/v7/integrations.tsx (CodePane), src/app/globals.css (.v7-intg-code); agentcard.sh / (computed)"
---
