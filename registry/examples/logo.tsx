import { Lockup, LogoMark } from "@/components/ui/logo";
import { Surface } from "@/lib/surface";

export function Site() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex min-h-40 flex-col items-start justify-center gap-6 rounded-panel border border-hairline bg-surface p-8">
        <Lockup tone="brand" />
        <Lockup tone="ink" />
      </div>
      <Surface ground="blue" className="flex min-h-40 flex-col items-start justify-center gap-6 rounded-panel p-8">
        <Lockup tone="white" />
        <div className="flex items-center gap-4">
          <LogoMark tone="white" />
          <LogoMark tone="white" className="w-6" />
        </div>
      </Surface>
    </div>
  );
}
