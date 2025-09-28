import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  q: z.string().optional(),
  appSlug: z.string().optional(),
});

const createSchema = z.object({
  appId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  introducedAt: z.string().optional(),
});

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { page, limit, q, appSlug } = parsed.data;
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (appSlug) {
    where.app = { slug: appSlug };
  }
  const [items, total] = await Promise.all([
    prisma.feature.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: {
        app: true,
        availabilities: true,
        requirements: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.feature.count({ where }),
  ]);
  return NextResponse.json({ items, page, total, pages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { introducedAt, ...rest } = parsed.data;
  const feature = await prisma.feature.create({
    data: {
      ...rest,
      introducedAt: introducedAt ? new Date(introducedAt) : undefined,
    },
  });
  return NextResponse.json(feature, { status: 201 });
}
