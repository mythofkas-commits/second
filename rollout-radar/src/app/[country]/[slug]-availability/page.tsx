import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFeatureBySlug } from '@/lib/data';
import { AvailabilityTable } from '@/components/features/availability-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { featureArticleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

function parseSlug(slug: string) {
  if (!slug.endsWith('-availability')) return null;
  const trimmed = slug.replace(/-availability$/, '');
  const [appSlug, ...rest] = trimmed.split('-');
  if (!appSlug || rest.length === 0) return null;
  const featureSlug = rest.join('-');
  return { appSlug, featureSlug };
}

export async function generateMetadata({ params }: { params: { country: string; slug: string } }): Promise<Metadata> {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: 'Feature not found' };
  const feature = await getFeatureBySlug(parsed.featureSlug);
  if (!feature) return { title: 'Feature not found' };
  const canonical = `https://rollout-radar.example.com/${feature.app.slug}/${feature.slug}`;
  return {
    title: `${feature.name} availability in ${params.country}`,
    description: feature.summary ?? 'Track rollout status by country.',
    alternates: { canonical },
  };
}

export default async function CountryAvailabilityPage({ params }: { params: { country: string; slug: string } }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) return notFound();
  const feature = await getFeatureBySlug(parsed.featureSlug);
  if (!feature) return notFound();

  const canonical = `https://rollout-radar.example.com/${feature.app.slug}/${feature.slug}`;
  const jsonLd = [
    featureArticleJsonLd({ feature, app: feature.app, url: canonical, description: feature.summary ?? '' }),
    breadcrumbJsonLd([
      { name: 'Home', url: 'https://rollout-radar.example.com/' },
      { name: feature.app.name, url: `https://rollout-radar.example.com/apps/${feature.app.slug}` },
      { name: feature.name, url: canonical },
    ]),
  ];

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {feature.name} availability in {params.country.toUpperCase()}
        </h1>
        <p className="text-muted-foreground">Last updated {formatDate(feature.updatedAt)}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Country availability</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityTable rows={feature.availabilities} />
        </CardContent>
      </Card>
    </div>
  );
}
