import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/5 border border-white/5', className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-2xl p-5 flex flex-col gap-4 border border-white/5', className)}
      style={{ background: '#0D1E38' }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse py-2">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <Skeleton className="flex-1 h-4" />
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

/** Skeleton analytics dashboard MillTrack */
export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-2xl p-5 border border-white/5', className)}
      style={{ background: '#0D1E38' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-5 w-32 animate-pulse" />
        <Skeleton className="h-5 w-20 animate-pulse" />
      </div>
      <Skeleton className="h-44 w-full animate-pulse" />
    </div>
  );
}
