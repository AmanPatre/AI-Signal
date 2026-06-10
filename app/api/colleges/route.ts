import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CollegeFilters } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams

    const filters: CollegeFilters = {
      search: params.get('search') || undefined,
      state: params.get('state') || undefined,
      feesMin: params.get('feesMin') ? parseInt(params.get('feesMin')!) : undefined,
      feesMax: params.get('feesMax') ? parseInt(params.get('feesMax')!) : undefined,
      examType: params.get('examType') || undefined,
      rating: params.get('rating') ? parseFloat(params.get('rating')!) : undefined,
      courseType: params.get('courseType') || undefined,
      page: parseInt(params.get('page') || '1'),
      limit: parseInt(params.get('limit') || '12'),
    }

    const where: any = {}

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.state) where.state = filters.state

    if (filters.feesMin || filters.feesMax) {
      where.feesMin = {}
      if (filters.feesMin) where.feesMin.gte = filters.feesMin
      if (filters.feesMax) {
        where.feesMax = { lte: filters.feesMax }
      }
    }

    if (filters.examType) {
      where.examAccepted = { has: filters.examType }
    }

    if (filters.rating) {
      where.overallRating = { gte: filters.rating }
    }

    if (filters.courseType) {
      where.courses = { some: { field: filters.courseType } }
    }

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        skip: (filters.page! - 1) * filters.limit!,
        take: filters.limit,
        orderBy: { overallRating: 'desc' },
        include: {
          courses: { take: 1, orderBy: { annualFees: 'asc' } },
          _count: { select: { reviews: true } },
        },
      })
    ])

    return NextResponse.json({
      data: colleges,
      meta: { total, page: filters.page, limit: filters.limit },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}
