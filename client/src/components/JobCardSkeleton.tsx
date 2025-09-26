import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface JobCardSkeletonProps {
  count?: number;
}

export default function JobCardSkeleton({ count = 1 }: JobCardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} variant="status" className="animate-pulse">
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>

            {/* Compensation & Duration */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-12 mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <div>
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Location */}
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-border">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}