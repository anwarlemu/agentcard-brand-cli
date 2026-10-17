"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const showCardCreated = () =>
  toast("Card created", {
    id: "card-created",
    toasterId: "toast-example",
    description: "Travel agent can now spend up to $250 a purchase.",
    duration: Infinity,
    action: { label: "View card", onClick: () => {} },
    cancel: { label: "Undo", onClick: () => {} },
  });

// A toast raised on load and held, in a Toaster pinned to this frame (`absolute` instead of the viewport's `fixed`) so
// it shows here. In an app, mount one <Toaster /> near the root and call toast() from anywhere.
export function Site() {
  useEffect(() => {
    showCardCreated();
  }, []);
  return (
    <div className="relative flex h-56 justify-center">
      <Button variant="secondary" onClick={showCardCreated}>
        Create card
      </Button>
      <Toaster id="toast-example" style={{ position: "absolute" }} />
    </div>
  );
}
