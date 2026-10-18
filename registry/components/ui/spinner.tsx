import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

// A thin ring turning once a second, in the color of the text around it (white inside the blue key, blue on white).
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <Loader2 role="status" aria-label="Loading" data-slot="spinner" className={cn("size-4 animate-spin motion-reduce:animate-none", className)} strokeWidth={1.75} {...props} />;
}

export { Spinner };
