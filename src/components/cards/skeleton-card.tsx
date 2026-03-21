import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonRecommendationCard() {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[12px] p-[16px]" aria-hidden="true">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex items-center gap-3 mt-3">
        <Skeleton className="h-[24px] w-[80px] rounded-full" />
        <Skeleton className="h-[24px] w-[60px] rounded-full" />
        <Skeleton className="h-3 w-20 ml-auto" />
      </div>
    </div>
  );
}

export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-[12px]">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRecommendationCard key={i} />
      ))}
    </div>
  );
}
