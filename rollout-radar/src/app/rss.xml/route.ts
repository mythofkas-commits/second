import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = 'https://rollout-radar.example.com';
  const changes = await prisma.changeLog.findMany({
    take: 20,
    orderBy: { entryDate: 'desc' },
    include: { feature: { include: { app: true } } },
  });

  const items = changes
    .map((change) => {
      const link = `${baseUrl}/${change.feature.app.slug}/${change.feature.slug}`;
      return `
        <item>
          <title><![CDATA[${change.feature.name} update]]></title>
          <link>${link}</link>
          <guid>${change.id}</guid>
          <pubDate>${new Date(change.entryDate).toUTCString()}</pubDate>
          <description><![CDATA[${change.text}]]></description>
        </item>
      `;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Rollout Radar updates</title>
        <link>${baseUrl}</link>
        <description>Latest change log entries for tracked features.</description>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
