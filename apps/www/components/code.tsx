import { CodeWindow } from "@/components/ui/code-window";
import { cn } from "@/lib/utils";

// Code in the library's own code window: the ink ground, the file name in its bar, a copy key, the brand's light
// highlighting. Long files scroll inside a fixed height.
export function Code({ code, title, tall = false, className }: { code: string; title?: string; tall?: boolean; className?: string }) {
  return <CodeWindow title={title ?? "code"} code={code.trim()} language="tsx" copy className={className} preClassName={cn("overflow-auto", tall ? "max-h-140" : "max-h-96")} />;
}
