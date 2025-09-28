import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const app = await prisma.app.findUnique({
    where: { slug: params.slug },
    include: {
      features: {
        include: {
          availabilities: true,
        },
      },
    },
  });
  if (!app) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(app);
}
