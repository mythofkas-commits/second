import type { Feature, App, ChangeLog, Instruction } from '@prisma/client';

export function featureArticleJsonLd({
  feature,
  app,
  url,
  description,
}: {
  feature: Feature;
  app: App;
  url: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: feature.name,
    description,
    author: {
      '@type': 'Organization',
      name: 'Rollout Radar',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rollout Radar',
    },
    mainEntityOfPage: url,
    datePublished: feature.createdAt,
    dateModified: feature.updatedAt,
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function softwareApplicationJsonLd(app: App, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    url,
    operatingSystem: app.platform ?? 'Multiple',
  };
}
