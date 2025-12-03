import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-helpers"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = await requireAdmin()

    const notificaciones = await prisma.notificacion.findMany({
      where: {
        usuarioId: parseInt(admin.id)
      },
      include: {
        adelanto: {
          include: {
            tecnico: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: "desc"
      }
    })

    return NextResponse.json(notificaciones)
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    return NextResponse.json(
      { error: "Error al obtener las notificaciones" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin()

    const body = await req.json()
    const { id, leida } = body

    if (!id || leida === undefined) {
      return NextResponse.json(
        { error: "ID y estado leida son requeridos" },
        { status: 400 }
      )
    }

    const notificacion = await prisma.notificacion.update({
      where: { id: parseInt(id) },
      data: {
        leida: leida
      }
    })

    return NextResponse.json({
      message: "Notificación actualizada",
      notificacion
    })
  } catch (error) {
    console.error("Error al actualizar notificación:", error)
    return NextResponse.json(
      { error: "Error al actualizar la notificación" },
      { status: 500 }
    )
  }
}

