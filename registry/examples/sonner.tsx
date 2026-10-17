"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/components/ui/copy-button";
import { Toaster } from "@/components/ui/sonner";

export function Site() {
  const { copy } = useCopy();
  return <div className="relative h-40">
    <Button variant="secondary" onClick={async () => {
      const copied = await copy("ac_demo_7Hq2");
      if (copied) toast.success("Key copied", { id: "key-copied", toasterId: "toast-example", description: "ac_demo_7Hq2" });
      else toast.error("Could not copy the key", { id: "key-copied", toasterId: "toast-example", description: "Check clipboard access and try again." });
    }}>Copy key</Button>
    <Toaster id="toast-example" style={{ position: "absolute" }} offset={{ left: 0, bottom: 0 }} mobileOffset={{ left: 0, bottom: 0 }} />
  </div>;
}
export function Action() {
  const [viewing, setViewing] = useState(false);
  return <div className="relative min-h-40">
    <Button variant="secondary" onClick={() => {
      setViewing(false);
      toast.success("Card created", { id: "card-created", toasterId: "toast-action", description: "Travel agent", duration: Infinity,
        action: { label: "View card", onClick: () => setViewing(true) } });
    }}>Create card</Button>
    {viewing && <p className="mt-3 text-body-sm" role="status">Travel agent · Active · $250 per purchase</p>}
    <Toaster id="toast-action" style={{ position: "absolute" }} offset={{ left: 0, bottom: 0 }} mobileOffset={{ left: 0, bottom: 0 }} />
  </div>;
}
