import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAppBySlug } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const app = await getAppBySlug(params.slug);
  if (!app) {
    return {
      title: 'App not found',
    };
  }
  return {
    title: app.name,
    description: `Track feature rollout for ${app.name}.`,
  };
}

export default async function AppDetailPage({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) return notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>
        <div className="text-muted-foreground">
          <p>Platform: {app.platform ?? 'Not specified'}</p>
          {app.website && (
            <a href={app.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              {app.website}
            </a>
          )}
        </div>
      </div>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {app.features.map((feature) => (
            <Card key={feature.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  <Link href={`/${app.slug}/${feature.slug}`} className="hover:underline">
                    {feature.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 text-sm text-muted-foreground">
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
