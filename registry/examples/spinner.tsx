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
