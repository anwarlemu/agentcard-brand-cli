import { Skeleton } from "@/components/ui/skeleton";

export function Site() {
  return (
    <div className="grid max-w-md gap-4 rounded-card border border-hairline bg-surface p-6 shadow-card">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="mt-2 h-10 w-32 rounded-control" />
    </div>
  );
}
