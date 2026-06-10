import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TaskDashboardClient } from '@/features/tasks/components/task-dashboard-client';
import type { Task } from '@/types';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const serializedTasks: Task[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as 'PENDING' | 'COMPLETED',
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    userId: task.userId,
  }));

  return <TaskDashboardClient initialTasks={serializedTasks} />;
}
