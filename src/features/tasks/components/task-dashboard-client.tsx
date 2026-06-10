'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/header';
import { StatsCards } from './stats-cards';
import { TaskFilters } from './task-filters';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { TaskListSkeleton, StatsCardsSkeleton } from './task-list-skeleton';
import { Button } from '@/components/ui/button';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hooks/use-tasks';
import type { Task, TaskFilters as Filters } from '@/types';
import type { CreateTaskInput } from '@/lib/validations';

interface TaskDashboardClientProps {
  initialTasks: Task[];
}

export function TaskDashboardClient({
  initialTasks,
}: TaskDashboardClientProps) {
  const [filters, setFilters] = useState<Filters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const hasActiveFilters = !!(filters.status || filters.search);

  const { data: tasks, isLoading, isFetching } = useTasks({
    filters,
    initialData: initialTasks,
  });

  const displayTasks = tasks ?? initialTasks;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleNewTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleToggleStatus = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      data: {
        status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
      },
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleFormSubmit = (data: CreateTaskInput) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createTask.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  const showSkeleton = isLoading && hasActiveFilters && !displayTasks.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {showSkeleton ? (
            <StatsCardsSkeleton />
          ) : (
            <StatsCards tasks={displayTasks} />
          )}

          <TaskFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onNewTask={handleNewTask}
          />

          {showSkeleton ? (
            <TaskListSkeleton />
          ) : displayTasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-lg font-medium text-slate-900">
                {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {hasActiveFilters
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first task.'}
              </p>
              {!hasActiveFilters && (
                <Button
                  onClick={handleNewTask}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Create your first task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}

          {isFetching && !isLoading && (
            <div className="fixed bottom-4 right-4 rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white shadow-lg">
              Updating...
            </div>
          )}
        </div>
      </main>

      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
        isLoading={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
}
