"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

// A person, as on the About page's team and angels (agentcard.sh/about, .v7-about-cell img): a square photo with no
// corners and no edge, in grayscale; 40px in a list, 64px (`lg`) for the people a page leads with. Until the photo
// loads, or without one, their initials in the display face, blue on sky like a window bar's marks.
const SIZES = { md: "size-10 text-caption", lg: "size-16 text-body" } as const;

function Avatar({ className, size = "md", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: keyof typeof SIZES }) {
  return <AvatarPrimitive.Root data-slot="avatar" className={cn("relative flex shrink-0 overflow-hidden rounded-none", SIZES[size], className)} {...props} />;
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full object-cover grayscale", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={cn("flex size-full items-center justify-center bg-window-bar font-display leading-none text-window-bar-fg", className)} {...props} />;
}

export { Avatar, AvatarFallback, AvatarImage };
