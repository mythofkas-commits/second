import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { AvailabilityStatus } from '@prisma/client';

const schema = z.object({
  featureId: z.string().uuid(),
  country: z.string().min(2).max(2),
  status: z.nativeEnum(AvailabilityStatus),
  lastSeen: z.string().optional(),
  sourceIds: z.array(z.string().uuid()).optional(),
});

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { featureId, country, status, lastSeen, sourceIds } = parsed.data;

  const availability = await prisma.availability.upsert({
    where: {
      featureId_country: {
        featureId,
        country: country.toUpperCase(),
      },
    },
    update: {
      status,
      lastSeen: lastSeen ? new Date(lastSeen) : undefined,
    },
    create: {
      featureId,
      country: country.toUpperCase(),
      status,
      lastSeen: lastSeen ? new Date(lastSeen) : undefined,
    },
  });

  if (sourceIds?.length) {
    for (const sourceId of sourceIds) {
      await prisma.availabilitySource.upsert({
        where: {
          availabilityId_sourceId: {
            availabilityId: availability.id,
            sourceId,
          },
        },
        update: {},
        create: {
          availabilityId: availability.id,
          sourceId,
        },
      });
    }
  }

  return NextResponse.json(availability);
}
