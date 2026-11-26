# Spinner
Loading indicator that inherits the surrounding text color.

Install: npx agentcard-ds add spinner
Requires: theme, utils
Packages: lucide-react
Exports: Spinner
Client boundary: not required by this entry file
Reference: Extension using the site text colors and reduced-motion behavior; no standalone spinner found on the current public site


## Usage
Use during a pending operation. Pair it with a label, prevent duplicate submissions when needed and restore the control when the operation finishes.
- Avoid: Spinners for whole pages (use skeletons)
- Avoid: Colored spinners that ignore their text


## Examples
Example components: npx agentcard-ds add spinner button
[Site](https://agentcard-ds.vercel.app/preview/spinner/Site)

examples/spinner.tsx

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Site() {
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  return <div className="grid justify-items-start gap-3">
    <Button disabled={pending} aria-busy={pending} onClick={() => {
      setPending(true);
      setCreated(false);
      timeout.current = setTimeout(() => { setPending(false); setCreated(true); }, 800);
    }}>{pending && <Spinner />}{pending ? "Creating card" : "Create card"}</Button>
    <p role="status" className="text-body-sm text-fg-muted">{created ? "Demo card created." : pending ? "Creating your demo card…" : "Create a demo card to see the loading state."}</p>
  </div>;
}

```

## Source

components/ui/spinner.tsx

```tsx
import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

// A thin ring turning once a second, in the color of the text around it (white inside the blue key, blue on white).
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <Loader2 role="status" aria-label="Loading" data-slot="spinner" className={cn("size-4 animate-spin motion-reduce:animate-none", className)} strokeWidth={1.75} {...props} />;
}

export { Spinner };

```
