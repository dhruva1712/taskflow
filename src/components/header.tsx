'use client';

import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-slate-900">TaskFlow</h1>

        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm text-slate-600 sm:inline">
                {session.user.email}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
