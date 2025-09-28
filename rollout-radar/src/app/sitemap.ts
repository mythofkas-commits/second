import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rollout-radar.example.com';
  const [apps, features] = await Promise.all([
    prisma.app.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.feature.findMany({
      select: { slug: true, updatedAt: true, app: { select: { slug: true } } },
    }),
  ]);

  const appEntries = apps.map((app) => ({
    url: `${baseUrl}/apps/${app.slug}`,
    lastModified: app.updatedAt,
  }));

  const featureEntries = features.flatMap((feature) => {
    const featureUrl = `${baseUrl}/${feature.app.slug}/${feature.slug}`;
    return [
      {
        url: featureUrl,
        lastModified: feature.updatedAt,
      },
      {
        url: `${baseUrl}/us/${feature.app.slug}-${feature.slug}-availability`,
        lastModified: feature.updatedAt,
      },
    ];
  });

  return [
    { url: baseUrl },
    ...appEntries,
    ...featureEntries,
  ];
}
