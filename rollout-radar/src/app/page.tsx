import Link from 'next/link';
import { Search } from 'lucide-react';
import { getRecentChangelog, getApps, getFeatures } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';

export default async function HomePage() {
  const [changelog, apps, features] = await Promise.all([
    getRecentChangelog(5),
    getApps({ take: 8 }),
    getFeatures({ take: 6 }),
  ]);

  return (
    <div className="space-y-16">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <Badge variant="secondary">Beta</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Track new features as they roll out.</h1>
          <p className="text-lg text-muted-foreground">
            Rollout Radar helps you know where features are live, how to enable them, and what to expect next.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/apps" className={buttonVariants({ size: 'lg' })}>
              Explore apps
            </Link>
            <Link href="/report" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              Submit a report
            </Link>
          </div>
        </div>
        <form action="/features" className="w-full max-w-md">
          <label htmlFor="search" className="sr-only">
            Search features
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="search" name="q" placeholder="Search for a feature" className="pl-10" />
          </div>
        </form>
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Newly rolling out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {changelog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No updates yet.</p>
            ) : (
              <ul className="space-y-4">
                {changelog.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        href={`/${item.feature.app.slug}/${item.feature.slug}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {item.feature.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.entryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Popular apps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {apps.map((app) => (
                <li key={app.id}>
                  <Link href={`/apps/${app.slug}`} className="flex items-center justify-between rounded-md border px-3 py-2 hover:bg-accent">
                    <span>{app.name}</span>
                    <span className="text-xs text-muted-foreground">{app.platform ?? 'Multi'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured rollouts</h2>
          <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.id}>
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-xl">
                  <Link href={`/${feature.app.slug}/${feature.slug}`} className="hover:underline">
                    {feature.name}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{feature.summary}</p>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2">
                {feature.availabilities.slice(0, 3).map((availability) => (
                  <StatusBadge key={availability.id} status={availability.status} label={availability.country} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
