import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get('ids')

    if (!ids) {
      return NextResponse.json({ error: 'College IDs are required' }, { status: 400 })
    }

    const collegeIds = ids.split(',').map(id => id.trim())

    if (collegeIds.length < 2 || collegeIds.length > 3) {
      return NextResponse.json({ error: 'Please select 2 or 3 colleges to compare' }, { status: 400 })
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: {
        courses: {
          orderBy: { annualFees: 'asc' }
        }
      }
    })

    if (colleges.length === 0) {
      return NextResponse.json({ error: 'No colleges found' }, { status: 404 })
    }

    return NextResponse.json({ data: colleges })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch comparison data' }, { status: 500 })
  }
}
