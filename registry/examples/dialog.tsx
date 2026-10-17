import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function NewCard({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button>New card</Button>
      </DialogTrigger>
      <DialogContent name="card.new">
        <DialogHeader>
          <DialogTitle>Give an agent a card</DialogTitle>
          <DialogDescription>Name the card and set the most it can spend at one checkout. You can change both later.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4">
          <Field label="Card name" htmlFor="dialog-name">
            <Input id="dialog-name" defaultValue="Travel agent" />
          </Field>
          <Field label="Per purchase limit" htmlFor="dialog-limit">
            <Input id="dialog-limit" defaultValue="$250" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Create card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Site() {
  return <NewCard />;
}

export function Open() {
  return (
    <div className="h-130">
      <NewCard defaultOpen />
    </div>
  );
}
