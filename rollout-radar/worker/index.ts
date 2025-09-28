import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import Parser from 'rss-parser';
import { prisma } from '../src/lib/prisma';

const sourcesPath = path.join(process.cwd(), 'worker', 'sources.yml');

type SourceConfig = {
  feature: string;
  url: string;
  type: string;
  pattern?: string;
};

type SourcesFile = {
  sources: SourceConfig[];
};

async function loadSources(): Promise<SourcesFile> {
  if (!fs.existsSync(sourcesPath)) {
    return { sources: [] };
  }
  const data = fs.readFileSync(sourcesPath, 'utf8');
  return yaml.parse(data) ?? { sources: [] };
}

async function processSource(source: SourceConfig) {
  const parser = new Parser();
  const feed = await parser.parseURL(source.url);
  for (const item of feed.items ?? []) {
    const link = item.link ?? '';
    if (!link) continue;
    const existing = await prisma.source.findFirst({ where: { url: link } });
    if (existing) continue;
    await prisma.source.create({
      data: {
        feature: { connect: { slug: source.feature } },
        url: link,
        title: item.title ?? null,
        sourceType: source.type,
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
      },
    });
  }
}

export async function runOnce() {
  const config = await loadSources();
  for (const source of config.sources) {
    await processSource(source).catch((error) => {
      console.error('Failed to process source', source.url, error);
    });
  }
}

if (process.argv.includes('--once')) {
  runOnce().then(() => {
    console.log('Worker run completed');
    process.exit(0);
  });
}
