"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function NewCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [created, setCreated] = useState("");
  const formId = useId();
  return <div className="grid gap-3">
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>New card</Button></DialogTrigger>
      <DialogContent name="card.new">
        <DialogHeader>
          <DialogTitle>Give an agent a card</DialogTitle>
          <DialogDescription>Name the card and set the most it can spend at one checkout. You can change both later.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} className="grid gap-4" onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setCreated(`${String(data.get("name")).trim()} created with a $${Number(data.get("limit")).toFixed(2)} purchase limit.`);
            setOpen(false);
          }}>
            <Field label="Card name" required><Input name="name" defaultValue="Travel agent" pattern=".*\S.*" /></Field>
            <Field label="Per purchase limit" required help="Amount in USD."><Input name="limit" type="number" min="0.01" step="0.01" defaultValue="250" /></Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
          <Button type="submit" form={formId}>Create card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <p role="status" className="text-body-sm text-fg-muted empty:hidden">{created}</p>
  </div>;
}
export function Site() { return <NewCard />; }
export function Open() { return <div className="h-130"><NewCard defaultOpen /></div>; }
