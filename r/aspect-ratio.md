# Aspect Ratio
Holds an image or screen at a fixed shape while the width changes.

Install: npx agentcard-ds add aspect-ratio
Requires: theme
Packages: @radix-ui/react-aspect-ratio
Exports: AspectRatio
Client boundary: yes
Reference: Radix AspectRatio; framing from the brand's windows


## Usage
Use for product shots, screens inside windows and media previews so the layout does not jump while they load. Round and frame the media inside with the brand's 12px corners and hairline, or put it in a window.
- Avoid: Stretching media to fill
- Avoid: Styling the frame itself


## Examples
Example components: npx agentcard-ds add aspect-ratio
[Site](https://agentcard-ds.vercel.app/preview/aspect-ratio/Site)

examples/aspect-ratio.tsx

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Site() {
  return (
    <div className="grid w-full max-w-120 items-start gap-4 sm:grid-cols-2">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-card border border-hairline bg-sky-wash">
        <div className="flex size-full items-end p-4 font-display text-body-sm text-fg-brand">16 by 9: a product screen</div>
      </AspectRatio>
      <AspectRatio ratio={1} className="overflow-hidden rounded-card border border-hairline bg-paper">
        <div className="flex size-full items-end p-4 font-display text-body-sm text-fg">1 by 1: a card image</div>
      </AspectRatio>
    </div>
  );
}

```

## Source

components/ui/aspect-ratio.tsx

```tsx
"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

// Holds media at a fixed shape (a product shot, a screen inside a window). The frame takes no style of its own; round
// and clip the media inside it as the brand frames images: 12px corners and a 16 percent ink hairline, or a window.
function AspectRatio(props: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };

```
