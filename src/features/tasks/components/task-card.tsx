'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({
  task,
  onEdit,
  onToggleStatus,
  onDelete,
}: TaskCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isOverdue =
    task.status === 'PENDING' &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  return (
    <>
      <Card
        className={`transition-shadow hover:shadow-md ${isOverdue ? 'border-l-4 border-l-red-400' : ''}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleStatus(task)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  task.status === 'COMPLETED'
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-slate-300 hover:border-blue-400'
                }`}
                aria-label={
                  task.status === 'COMPLETED'
                    ? 'Mark as pending'
                    : 'Mark as completed'
                }
              >
                {task.status === 'COMPLETED' && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <CardTitle
                className={`text-base font-medium line-clamp-1 ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'}`}
              >
                {task.title}
              </CardTitle>
            </div>
            <div className="flex gap-1.5">
              {isOverdue && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  Overdue
                </Badge>
              )}
              <Badge
                variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}
                className={
                  task.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                }
              >
                {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {task.description}
            </p>
          )}
          <p
            className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}
          >
            Due: {formattedDate}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(task)}
              className="text-xs"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(task.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
