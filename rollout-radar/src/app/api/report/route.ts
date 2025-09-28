import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ensureWithinLimit, reportLimiter } from '@/lib/rate-limit';
import { hashIp } from '@/lib/hash';

const schema = z.object({
  featureId: z.string().uuid(),
  country: z.string().min(2).max(2),
  device: z.string().min(1),
  os: z.string().min(1),
  appVersion: z.string().optional(),
  hasFeature: z.boolean(),
  ip: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const allowed = await ensureWithinLimit(reportLimiter, ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { featureId, country, device, os, appVersion, hasFeature } = parsed.data;
  const ipHash = hashIp(parsed.data.ip ?? ip);

  await prisma.userReport.create({
    data: {
      featureId,
      country: country.toUpperCase(),
      device,
      os,
      appVersion,
      hasFeature,
      ipHash,
    },
  });

  return NextResponse.json({ status: 'submitted' }, { status: 201 });
}
