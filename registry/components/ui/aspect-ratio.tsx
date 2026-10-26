"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

// Holds media at a fixed shape (a product shot, a screen inside a window). The frame takes no style of its own; round
// and clip the media inside it as the brand frames images: 12px corners and a 16 percent ink hairline, or a window.
function AspectRatio(props: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
