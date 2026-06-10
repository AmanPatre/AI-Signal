import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: { orderBy: { annualFees: 'asc' } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    })

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }

    return NextResponse.json({ data: college })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 })
  }
}
