import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-helpers"

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "all"

    let data

    switch (type) {
      case "users":
        data = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
        break
      case "cvs":
        data = await prisma.cv.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            position: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
        break
      case "messages":
        data = await prisma.message.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
        break
      default:
        const [users, cvs, messages] = await Promise.all([
          prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
          prisma.cv.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              position: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
          prisma.message.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              content: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
        ])
        data = { users, cvs, messages }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener datos:", error)
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    )
  }
}

