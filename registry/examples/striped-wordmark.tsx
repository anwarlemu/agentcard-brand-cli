import { StripedWordmark } from "@/components/visuals/striped-wordmark";
import { Surface } from "@/lib/surface";

export function Site() {
  return (
    <div className="grid gap-6">
      <Surface ground="blue" className="overflow-hidden rounded-panel">
        <StripedWordmark />
      </Surface>
      <Surface ground="blue" className="overflow-hidden rounded-panel">
        <StripedWordmark text="VAULT" />
      </Surface>
    </div>
  );
}
