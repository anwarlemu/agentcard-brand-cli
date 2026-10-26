"use client";

import { Button } from "@/components/ui/button";
import { ToastAction, Toaster, toast } from "@/components/ui/toast";

export function Site() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Card frozen",
            description: "Travel agent cannot buy until you unfreeze it.",
            action: (
              <ToastAction altText="Undo freezing the card" onClick={() => toast({ title: "Card unfrozen" })}>
                Undo
              </ToastAction>
            ),
          })
        }
      >
        Freeze card
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "destructive",
            title: "Purchase declined",
            description: "Delta, $412.90, over the $250 limit.",
            action: <ToastAction altText="Raise the limit">Raise limit</ToastAction>,
          })
        }
      >
        Decline a purchase
      </Button>
      <Toaster />
    </div>
  );
}
