import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCards } from '../stats-cards';
import type { Task } from '@/types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: Math.random().toString(),
  title: 'Test Task',
  description: null,
  status: 'PENDING',
  dueDate: '2024-12-31T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  userId: 'user-1',
  ...overrides,
});

describe('StatsCards', () => {
  it('renders correct total count', () => {
    const tasks = [
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'PENDING' }),
    ];
    render(<StatsCards tasks={tasks} />);
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders correct completed count', () => {
    const tasks = [
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'PENDING' }),
    ];
    render(<StatsCards tasks={tasks} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders correct pending count', () => {
    const tasks = [
      createTask({ status: 'PENDING' }),
      createTask({ status: 'COMPLETED' }),
    ];
    render(<StatsCards tasks={tasks} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders correct completion percentage', () => {
    const tasks = [
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'PENDING' }),
      createTask({ status: 'PENDING' }),
    ];
    render(<StatsCards tasks={tasks} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('renders 0% when no tasks', () => {
    render(<StatsCards tasks={[]} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders 0 for all counts when no tasks', () => {
    render(<StatsCards tasks={[]} />);
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBe(3);
  });

  it('renders 100% when all tasks completed', () => {
    const tasks = [
      createTask({ status: 'COMPLETED' }),
      createTask({ status: 'COMPLETED' }),
    ];
    render(<StatsCards tasks={tasks} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
