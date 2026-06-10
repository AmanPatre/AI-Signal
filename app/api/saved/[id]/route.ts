import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// DELETE /api/saved/[id] - unsave a college
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete saved college
    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.id,
        collegeId: id,
      },
    })

    const response: ApiResponse<any> = {
      data: { success: true },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error unsaving college:', error)
    return NextResponse.json(
      { error: 'Failed to unsave college' },
      { status: 500 }
    )
  }
}
