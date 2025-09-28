import { prisma } from './prisma';
import { AvailabilityStatus, type Prisma } from '@prisma/client';

export async function getApps(options?: { take?: number; skip?: number; search?: string }) {
  const { take = 12, skip = 0, search } = options ?? {};
  return prisma.app.findMany({
    skip,
    take,
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { developer: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { name: 'asc' },
  });
}

export async function getAppBySlug(slug: string) {
  return prisma.app.findUnique({
    where: { slug },
    include: {
      features: {
        orderBy: { name: 'asc' },
        include: {
          availabilities: true,
        },
      },
    },
  });
}

export async function getFeatures(options?: {
  take?: number;
  skip?: number;
  search?: string;
  appSlug?: string;
}) {
  const { take = 20, skip = 0, search, appSlug } = options ?? {};
  const where: Prisma.FeatureWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { summary: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (appSlug) {
    where.app = { slug: appSlug };
  }
  return prisma.feature.findMany({
    skip,
    take,
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      app: true,
      availabilities: true,
      requirements: true,
    },
  });
}

export async function getFeatureBySlug(slug: string) {
  return prisma.feature.findUnique({
    where: { slug },
    include: {
      app: true,
      requirements: true,
      availabilities: {
        orderBy: { country: 'asc' },
        include: { sources: { include: { source: true } } },
      },
      instructions: true,
      sources: true,
      changes: {
        orderBy: { entryDate: 'desc' },
      },
      followers: true,
    },
  });
}

export async function getRecentChangelog(limit = 6) {
  return prisma.changeLog.findMany({
    take: limit,
    orderBy: { entryDate: 'desc' },
    include: {
      feature: {
        include: { app: true },
      },
    },
  });
}

export function statusToBadgeVariant(status: AvailabilityStatus) {
  switch (status) {
    case AvailabilityStatus.LIVE:
      return 'success';
    case AvailabilityStatus.STAGED:
      return 'warning';
    case AvailabilityStatus.NOT_LIVE:
      return 'destructive';
    default:
      return 'secondary';
  }
}
