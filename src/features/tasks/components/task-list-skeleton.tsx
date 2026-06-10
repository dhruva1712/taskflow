'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TaskCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 shrink-0 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12" />
            {i === 4 && <Skeleton className="mt-2 h-2 w-full rounded-full" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <Skeleton className="h-8 w-full sm:max-w-xs" />
        <Skeleton className="h-8 w-full sm:w-40" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
