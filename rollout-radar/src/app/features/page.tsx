import Link from 'next/link';
import { Metadata } from 'next';
import { getFeatures, getApps } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover features currently being tracked across apps.',
};

export default async function FeaturesPage({ searchParams }: { searchParams: { q?: string; app?: string } }) {
  const [features, apps] = await Promise.all([
    getFeatures({ search: searchParams.q, appSlug: searchParams.app }),
    getApps({ take: 100 }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feature rollouts</h1>
          <p className="text-muted-foreground">Filter by app or search to find a feature of interest.</p>
        </div>
        <form className="flex flex-col gap-3 md:flex-row">
          <Select name="app" defaultValue={searchParams.app}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by app" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All apps</SelectItem>
              {apps.map((app) => (
                <SelectItem key={app.id} value={app.slug}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search features"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
          <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            Apply
          </button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <CardTitle className="text-xl">
                <Link href={`/${feature.app.slug}/${feature.slug}`} className="hover:underline">
                  {feature.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{feature.summary}</p>
              <div className="flex flex-wrap gap-2">
                {feature.availabilities.slice(0, 3).map((availability) => (
                  <StatusBadge key={availability.id} status={availability.status} label={availability.country} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
