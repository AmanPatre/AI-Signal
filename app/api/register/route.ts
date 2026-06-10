import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
        }

        const exists = await prisma.user.findUnique({ where: { email } })
        if (exists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, email: true, name: true }
        })

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }
}
