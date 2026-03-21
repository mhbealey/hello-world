import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonChart() {
  return (
    <div className="w-full" aria-hidden="true">
      <Skeleton className="w-full h-[200px] rounded-[12px]" />
      <div className="flex gap-2 mt-3 justify-center">
        {["1D", "1W", "1M", "3M", "YTD", "1Y"].map((label) => (
          <Skeleton key={label} className="h-8 w-10 rounded-full" />
        ))}
      </div>
    </div>
  );
}
