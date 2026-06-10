'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Task } from '@/types';

interface StatsCardsProps {
  tasks: Task[];
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pending = tasks.filter((t) => t.status === 'PENDING').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Total Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-slate-900">{total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{completed}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-2xl font-bold text-blue-600">
            {completionRate}%
          </p>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
