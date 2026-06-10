'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TaskFilters as Filters } from '@/types';

interface TaskFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onNewTask: () => void;
}

export function TaskFilters({
  filters,
  onFiltersChange,
  onNewTask,
}: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters, onFiltersChange]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={filters.status || 'ALL'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value as Filters['status'],
            })
          }
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onNewTask} className="bg-blue-600 hover:bg-blue-700">
        New Task
      </Button>
    </div>
  );
}
