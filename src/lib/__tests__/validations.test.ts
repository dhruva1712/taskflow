import { describe, it, expect } from 'vitest';
import { createTaskSchema, registerSchema, loginSchema } from '../validations';

describe('createTaskSchema', () => {
  it('passes with valid input', () => {
    const result = createTaskSchema.safeParse({
      title: 'Test task',
      description: 'A description',
      dueDate: '2024-12-31',
      status: 'PENDING',
    });
    expect(result.success).toBe(true);
  });

  it('passes without optional description', () => {
    const result = createTaskSchema.safeParse({
      title: 'Test task',
      dueDate: '2024-12-31',
    });
    expect(result.success).toBe(true);
  });

  it('fails when title is missing', () => {
    const result = createTaskSchema.safeParse({
      dueDate: '2024-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('fails when title is empty', () => {
    const result = createTaskSchema.safeParse({
      title: '',
      dueDate: '2024-12-31',
    });
    expect(result.success).toBe(false);
  });

  it('fails when dueDate is missing', () => {
    const result = createTaskSchema.safeParse({
      title: 'Test task',
    });
    expect(result.success).toBe(false);
  });

  it('fails when dueDate is empty', () => {
    const result = createTaskSchema.safeParse({
      title: 'Test task',
      dueDate: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('passes with valid input', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails with password too short', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('fails with missing name', () => {
    const result = registerSchema.safeParse({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('passes with valid input', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('fails with missing password', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('fails with empty password', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});
