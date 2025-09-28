import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ensureWithinLimit, checkLimiter } from '@/lib/rate-limit';
import { evaluateCheck } from '@/lib/checker';

const schema = z.object({
  featureSlug: z.string().min(1),
  country: z.string().min(2).max(2),
  osName: z.string().min(1),
  osVersion: z.string().optional(),
  appVersion: z.string().optional(),
});

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const allowed = await ensureWithinLimit(checkLimiter, ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const parsed = schema.safeParse(Object.fromEntries(new URL(request.url).searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { featureSlug, country, osName, osVersion, appVersion } = parsed.data;

  const feature = await prisma.feature.findUnique({
    where: { slug: featureSlug },
    include: {
      requirements: true,
      availabilities: {
        where: { country: country.toUpperCase() },
      },
    },
  });
  if (!feature) {
    return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
  }

  const availability = feature.availabilities[0]?.status ?? null;
  const evaluation = evaluateCheck({
    osName,
    osVersion,
    appVersion,
    availability,
    requirements: feature.requirements,
  });

  return NextResponse.json({
    status: evaluation.status,
    reasons: evaluation.reasons,
    requirements: evaluation.matchingRequirements,
    availability: feature.availabilities[0] ?? null,
  });
}
