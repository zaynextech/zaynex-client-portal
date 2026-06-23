import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />

      <Skeleton className="h-40 w-full" />

      <Skeleton className="h-40 w-full" />
    </div>
  );
}