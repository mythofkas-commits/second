import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFeatureBySlug } from '@/lib/data';
import { MarkdownRenderer } from '@/lib/mdx';
import { AvailabilityTable } from '@/components/features/availability-table';
import { FeatureChecker } from '@/components/features/feature-checker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { SourceLink } from '@/components/shared/source-link';
import { featureArticleJsonLd, breadcrumbJsonLd, softwareApplicationJsonLd } from '@/lib/seo';

async function getFeatureOrThrow(slug: string) {
  const feature = await getFeatureBySlug(slug);
  if (!feature) {
    notFound();
  }
  return feature;
}

export async function generateMetadata({ params }: { params: { featureSlug: string; appSlug: string } }): Promise<Metadata> {
  const feature = await getFeatureBySlug(params.featureSlug);
  if (!feature) {
    return { title: 'Feature not found' };
  }
  const title = `How to get ${feature.name} on ${feature.app.name}`;
  const description = feature.summary ?? 'Check availability, requirements, and instructions.';
  const canonical = `https://rollout-radar.example.com/${feature.app.slug}/${feature.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function FeaturePage({ params }: { params: { featureSlug: string; appSlug: string } }) {
  const feature = await getFeatureOrThrow(params.featureSlug);
  const canonical = `https://rollout-radar.example.com/${feature.app.slug}/${feature.slug}`;
  const jsonLd = [
    featureArticleJsonLd({ feature, app: feature.app, url: canonical, description: feature.summary ?? '' }),
    breadcrumbJsonLd([
      { name: 'Home', url: 'https://rollout-radar.example.com/' },
      { name: feature.app.name, url: `https://rollout-radar.example.com/apps/${feature.app.slug}` },
      { name: feature.name, url: canonical },
    ]),
    softwareApplicationJsonLd(feature.app, canonical),
  ];

  const countries = feature.availabilities.map((availability) => availability.country).sort();
  const osOptions = Array.from(new Set(feature.requirements.map((req) => req.osName)));

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">
          How to get <span className="text-primary">{feature.name}</span> on {feature.app.name}
        </h1>
        {feature.summary && <p className="text-lg text-muted-foreground">{feature.summary}</p>}
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>Last updated {formatDate(feature.updatedAt)}</span>
          <span>Introduced {formatDate(feature.introducedAt)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {feature.requirements.map((requirement) => (
            <Badge key={requirement.id} variant="secondary">
              {requirement.osName} {requirement.osMin ?? ''}
            </Badge>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Availability by country</CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityTable rows={feature.availabilities} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              {feature.instructions?.stepsMarkdown ? (
                <MarkdownRenderer source={feature.instructions.stepsMarkdown} />
              ) : (
                <p className="text-sm text-muted-foreground">Instructions coming soon.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feature.changes.map((change) => (
                <div key={change.id} className="rounded-md border p-3">
                  <p className="text-sm font-medium">{formatDate(change.entryDate)}</p>
                  <p className="text-sm text-muted-foreground">{change.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <FeatureChecker featureSlug={feature.slug} countries={countries} osOptions={osOptions} />
          <Card>
            <CardHeader>
              <CardTitle>Not seeing it?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Try restarting the app or checking for the latest software update. Rollouts may take time even within the same country.</p>
              <p>
                Still missing? <a href="/report" className="text-primary hover:underline">Submit a report</a> so others can verify.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feature.sources.map((source) => (
                <SourceLink key={source.id} url={source.url} title={source.title} type={source.sourceType} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
