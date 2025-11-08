import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-helpers"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()

    const [userCount, cvCount, messageCount] = await Promise.all([
      prisma.user.count(),
      prisma.cv.count(),
      prisma.message.count(),
    ])

    return NextResponse.json({
      users: userCount,
      cvs: cvCount,
      messages: messageCount,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json(
      { error: "Error al obtener las estadísticas" },
      { status: 500 }
    )
  }
}

