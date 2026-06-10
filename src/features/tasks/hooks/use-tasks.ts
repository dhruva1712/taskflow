'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Task, TaskFilters } from '@/types';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations';
import * as tasksService from '../services/tasks';

interface UseTasksOptions {
  filters?: TaskFilters;
  initialData?: Task[];
}

export function useTasks(options?: UseTasksOptions) {
  const { filters, initialData } = options || {};

  const hasFilters = filters?.status || filters?.search;

  return useQuery({
    queryKey: ['tasks', filters ?? {}],
    queryFn: () => tasksService.fetchTasks(filters),
    initialData: hasFilters ? undefined : initialData,
    staleTime: hasFilters ? 0 : 60 * 1000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      tasksService.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueriesData<Task[]>({
        queryKey: ['tasks'],
      });

      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
        old?.map((task) =>
          task.id === id
            ? {
                ...task,
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && {
                  description: data.description,
                }),
                ...(data.status !== undefined && { status: data.status }),
                ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
              }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || 'Failed to update task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      toast.success('Task updated successfully');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksService.deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueriesData<Task[]>({
        queryKey: ['tasks'],
      });

      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
        old?.filter((task) => task.id !== id)
      );

      return { previousTasks };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || 'Failed to delete task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
  });
}
