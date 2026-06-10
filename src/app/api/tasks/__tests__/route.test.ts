import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const mockAuth = vi.mocked(auth);
const mockPrisma = vi.mocked(prisma);

describe('GET /api/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns tasks for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Test' },
      expires: '2024-12-31',
    });

    const mockTasks = [
      {
        id: 'task-1',
        title: 'Test Task',
        description: null,
        status: 'PENDING',
        dueDate: new Date('2024-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-1',
      },
    ];

    mockPrisma.task.findMany.mockResolvedValue(mockTasks);

    const request = new NextRequest('http://localhost:3000/api/tasks');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].id).toBe('task-1');
    expect(data[0].title).toBe('Test Task');
    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/tasks');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('filters by status when provided', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Test' },
      expires: '2024-12-31',
    });

    mockPrisma.task.findMany.mockResolvedValue([]);

    const request = new NextRequest(
      'http://localhost:3000/api/tasks?status=COMPLETED'
    );
    await GET(request);

    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('POST /api/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates task with valid data', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Test' },
      expires: '2024-12-31',
    });

    const mockTask = {
      id: 'task-1',
      title: 'New Task',
      description: 'Description',
      status: 'PENDING',
      dueDate: new Date('2024-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user-1',
    };

    mockPrisma.task.create.mockResolvedValue(mockTask);

    const request = new NextRequest('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Task',
        description: 'Description',
        dueDate: '2024-12-31',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe('New Task');
  });

  it('returns 400 with invalid data (missing title)', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com', name: 'Test' },
      expires: '2024-12-31',
    });

    const request = new NextRequest('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Description',
        dueDate: '2024-12-31',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Task',
        dueDate: '2024-12-31',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});
