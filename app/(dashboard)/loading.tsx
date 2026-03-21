import { CardSkeleton, ListSkeleton } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="h-14 border-b border-border bg-surface" />
      <div className="space-y-3 px-4 pt-4">
        <CardSkeleton />
        <CardSkeleton />
        <ListSkeleton rows={3} />
      </div>
    </div>
  );
}
