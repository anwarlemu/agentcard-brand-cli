"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const showCopied = () => toast.success("Key copied", { id: "key-copied", toasterId: "toast-example", description: "ac_live_7Hq2", duration: Infinity });

const showCardCreated = () =>
  toast.success("Card created", {
    id: "card-created",
    toasterId: "toast-action",
    description: "Travel agent",
    duration: Infinity,
    action: { label: "View card", onClick: () => {} },
  });

// Toasts raised on load and held, each in a Toaster pinned to its frame (`absolute` instead of the viewport's `fixed`)
// so it shows here. In an app, mount one <Toaster /> near the root and call toast() from anywhere.
export function Site() {
  useEffect(() => {
    showCopied();
  }, []);
  return (
    <div className="relative h-40">
      <Button variant="secondary" onClick={showCopied}>
        Copy key
      </Button>
      <Toaster id="toast-example" style={{ position: "absolute" }} offset={{ left: 0, bottom: 0 }} mobileOffset={{ left: 0, bottom: 0 }} />
    </div>
  );
}

export function Action() {
  useEffect(() => {
    showCardCreated();
  }, []);
  return (
    <div className="relative h-40">
      <Button variant="secondary" onClick={showCardCreated}>
        Create card
      </Button>
      <Toaster id="toast-action" style={{ position: "absolute" }} offset={{ left: 0, bottom: 0 }} mobileOffset={{ left: 0, bottom: 0 }} />
    </div>
  );
}
