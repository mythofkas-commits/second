'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar } from '@/components/shared/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UserMenu() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />;
  }

  if (!data?.user) {
    return (
      <Button onClick={() => signIn()} variant="outline">
        Sign in
      </Button>
    );
  }

  const initials = data.user.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) ||
    data.user.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar fallback={initials} image={data.user.image} />
          <span className="hidden text-sm font-medium md:inline">{data.user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Signed in as {data.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
