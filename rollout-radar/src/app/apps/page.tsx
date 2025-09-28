import Link from 'next/link';
import { Metadata } from 'next';
import { getApps } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Apps',
  description: 'Browse supported apps and explore their feature rollouts.',
};

export default async function AppsPage({ searchParams }: { searchParams: { q?: string } }) {
  const apps = await getApps({ search: searchParams.q });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
        <p className="text-muted-foreground">Select an app to view feature availability and instructions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <CardTitle className="text-xl">
                <Link href={`/apps/${app.slug}`} className="hover:underline">
                  {app.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Platform: {app.platform ?? 'Not specified'}</p>
              {app.website && (
                <a href={app.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Official site
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
