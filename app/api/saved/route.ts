import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        savedColleges: {
          include: {
            college: {
              include: {
                courses: { take: 1 }
              }
            }
          },
          orderBy: { savedAt: "desc" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user.savedColleges.map((sc: any) => sc.college) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch saved colleges" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { collegeId } = await req.json();

    if (!collegeId) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }
      });
    }

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: { userId: user.id, collegeId }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "College already saved" }, { status: 400 });
    }

    const saved = await prisma.savedCollege.create({
      data: { userId: user.id, collegeId },
      include: { college: true }
    });

    return NextResponse.json({ data: saved });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save college" }, { status: 500 });
  }
}
