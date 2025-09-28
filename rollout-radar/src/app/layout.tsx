import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Analytics } from '@/components/shared/analytics';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthSessionProvider } from '@/components/providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rollout-radar.example.com'),
  title: {
    default: 'Rollout Radar',
    template: '%s · Rollout Radar',
  },
  description: 'Track new features rolling out across apps with availability by country and device.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider session={session}>
          <ThemeProvider>
            <QueryProvider>
              <div className="flex min-h-screen flex-col">
                {/* @ts-expect-error Async Server Component */}
                <SiteHeader />
                <main className="flex-1 bg-muted/10">
                  <div className="container py-10">{children}</div>
                </main>
                <SiteFooter />
              </div>
              <Analytics />
            </QueryProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
