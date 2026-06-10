import type { Task, TaskFilters } from '@/types';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations';

const BASE_URL = '/api/tasks';

export async function fetchTasks(filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'ALL') {
    params.set('status', filters.status);
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch tasks');
  }

  return res.json();
}

export async function fetchTask(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch task');
  }

  return res.json();
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create task');
  }

  return res.json();
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update task');
  }

  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete task');
  }
}
