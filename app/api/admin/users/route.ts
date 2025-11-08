import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-helpers"
import { hashPassword } from "@/lib/auth"
import { Role } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            cvs: true,
            messages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json(
      { error: "Error al obtener los usuarios" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: (role as Role) || Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    )
  }
}

