'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateTaskInput } from '@/lib/validations';
import type { Task } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['PENDING', 'COMPLETED']),
});

type FormData = z.infer<typeof formSchema>;

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (data: CreateTaskInput) => void;
  isLoading?: boolean;
}

export function TaskForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  isLoading,
}: TaskFormProps) {
  const isEdit = !!task;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '',
      status: task?.status || 'PENDING',
    },
  });

  const status = watch('status');

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset({
        title: '',
        description: '',
        dueDate: '',
        status: 'PENDING',
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue('status', value as 'PENDING' | 'COMPLETED')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
