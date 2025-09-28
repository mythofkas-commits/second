import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  platform: z.string().optional(),
  website: z.string().url().optional(),
  developer: z.string().optional(),
});

export async function GET(request: Request) {
  const parsed = paginationSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { page, limit } = parsed.data;
  const [items, total] = await Promise.all([
    prisma.app.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { name: 'asc' } }),
    prisma.app.count(),
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

  const app = await prisma.app.create({ data: parsed.data });
  return NextResponse.json(app, { status: 201 });
}
