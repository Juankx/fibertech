import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireAuth()

    const userId = parseInt(user.id)

    const [cvs, messages] = await Promise.all([
      prisma.cv.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
      cvs,
      messages,
    })
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error)
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    )
  }
}

