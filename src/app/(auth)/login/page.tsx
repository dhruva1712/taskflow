'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/validations';

type ErrorType = 'no-account' | 'invalid-password' | 'generic' | null;

export default function LoginPage() {
  const router = useRouter();
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorType(null);

    try {
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (!checkRes.ok) {
        setErrorType('generic');
        setIsLoading(false);
        return;
      }

      const { exists } = await checkRes.json();

      if (!exists) {
        setErrorType('no-account');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        setErrorType('invalid-password');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorType('generic');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Welcome to TaskFlow
          </CardTitle>
          <p className="text-sm text-slate-600">Sign in to manage your tasks</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorType === 'no-account' && (
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                No account found with this email.{' '}
                <Link
                  href="/register"
                  className="font-medium text-amber-900 underline"
                >
                  Would you like to register?
                </Link>
              </div>
            )}

            {errorType === 'invalid-password' && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                Incorrect password. Please try again.
              </div>
            )}

            {errorType === 'generic' && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                Something went wrong. Please try again.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
