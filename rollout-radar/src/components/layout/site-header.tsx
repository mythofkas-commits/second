import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/user-menu';
import { getSessionUser } from '@/lib/auth';

const navItems = [
  { href: '/apps', label: 'Apps' },
  { href: '/features', label: 'Features' },
  { href: '/report', label: 'Submit report' },
];

export async function SiteHeader() {
  const sessionUser = await getSessionUser();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">RR</span>
            <span className="hidden sm:inline">Rollout Radar</span>
          </Link>
          <nav className="hidden items-center gap-3 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted-foreground transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {sessionUser ? (
            <UserMenu />
          ) : (
            <Button asChild variant="outline">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
