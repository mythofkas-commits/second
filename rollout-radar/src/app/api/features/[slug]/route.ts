import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const feature = await prisma.feature.findUnique({
    where: { slug: params.slug },
    include: {
      app: true,
      requirements: true,
      availabilities: {
        include: { sources: { include: { source: true } } },
      },
      instructions: true,
      sources: true,
      changes: true,
    },
  });
  if (!feature) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(feature);
}
