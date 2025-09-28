import { PrismaClient, AvailabilityStatus, FeatureStatus, Platform } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const app = await prisma.app.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
      platform: Platform.MULTI,
      website: 'https://www.apple.com',
      developer: 'Apple Inc.',
    },
  });

  const feature = await prisma.feature.upsert({
    where: { slug: 'apple-intelligence' },
    update: {},
    create: {
      appId: app.id,
      name: 'Apple Intelligence',
      slug: 'apple-intelligence',
      summary: 'Apple Intelligence brings AI features to iOS and macOS.',
      description:
        'Apple Intelligence is a suite of generative AI capabilities built into Apple devices, rolling out gradually across regions and languages.',
      status: FeatureStatus.ACTIVE,
      introducedAt: new Date('2024-06-10'),
    },
  });

  await prisma.requirement.deleteMany({ where: { featureId: feature.id } });
  await prisma.requirement.createMany({
    data: [
      {
        featureId: feature.id,
        osName: 'iOS',
        osMin: '18',
        appVersionMin: null,
        accountFlag: 'US English',
        notes: 'Requires Siri language set to US English',
      },
      {
        featureId: feature.id,
        osName: 'iPadOS',
        osMin: '18',
        appVersionMin: null,
        accountFlag: 'US English',
        notes: 'Available to Apple Developer Program members during preview.',
      },
    ],
  });

  await prisma.availability.deleteMany({ where: { featureId: feature.id } });
  const availability = await prisma.availability.createMany({
    data: [
      {
        featureId: feature.id,
        country: 'US',
        status: AvailabilityStatus.LIVE,
        lastSeen: new Date('2025-09-01'),
      },
      {
        featureId: feature.id,
        country: 'CA',
        status: AvailabilityStatus.STAGED,
        lastSeen: new Date('2025-09-05'),
      },
      {
        featureId: feature.id,
        country: 'BR',
        status: AvailabilityStatus.NOT_LIVE,
      },
    ],
  });

  const sources = await prisma.source.createMany({
    data: [
      {
        featureId: feature.id,
        url: 'https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence/',
        title: 'Introducing Apple Intelligence',
        sourceType: 'NEWSROOM',
        publishedAt: new Date('2024-06-10'),
      },
      {
        featureId: feature.id,
        url: 'https://support.apple.com/apple-intelligence',
        title: 'Apple Intelligence Support Overview',
        sourceType: 'SUPPORT',
        publishedAt: new Date('2024-09-01'),
      },
      {
        featureId: feature.id,
        url: 'https://www.macrumors.com/guide/apple-intelligence/',
        title: 'MacRumors Guide to Apple Intelligence',
        sourceType: 'TRACKER',
        publishedAt: new Date('2024-09-15'),
      },
    ],
  });

  await prisma.instruction.upsert({
    where: { featureId: feature.id },
    update: {
      stepsMarkdown: `### What is it?\nApple Intelligence brings on-device intelligence to iPhone, iPad, and Mac.\n\n### Requirements\n- OS: iOS 18+\n- Notes: English (US) only at launch\n\n### How to enable\n1. Update to iOS 18 via Settings → General → Software Update.\n2. Set Siri language to English (United States).\n3. Enable Apple Intelligence features in Settings → Siri & Search.\n`,
      settingsPath: 'Settings → Siri & Search',
    },
    create: {
      featureId: feature.id,
      stepsMarkdown: `### What is it?\nApple Intelligence brings on-device intelligence to iPhone, iPad, and Mac.\n\n### Requirements\n- OS: iOS 18+\n- Notes: English (US) only at launch\n\n### How to enable\n1. Update to iOS 18 via Settings → General → Software Update.\n2. Set Siri language to English (United States).\n3. Enable Apple Intelligence features in Settings → Siri & Search.\n`,
      settingsPath: 'Settings → Siri & Search',
    },
  });

  await prisma.changeLog.create({
    data: {
      featureId: feature.id,
      entryDate: new Date('2025-09-05'),
      text: 'Apple Intelligence expands preview to Canada with staged rollout.',
    },
  });

  console.log('Seeded sample data');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
