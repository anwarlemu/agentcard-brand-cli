import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Site() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Spinner className="text-fg-brand" />
      <Button disabled>
        <Spinner />
        Creating card
      </Button>
    </div>
  );
}
