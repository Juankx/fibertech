import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-helpers"
import { EstadoAdelanto } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const estado = searchParams.get("estado")

    const where: any = {}
    if (estado) {
      where.estado = estado
    }

    const adelantos = await prisma.adelanto.findMany({
      where,
      include: {
        tecnico: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        aprobadoPor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        fechaSolicitud: "desc"
      }
    })

    return NextResponse.json(adelantos)
  } catch (error) {
    console.error("Error al obtener adelantos:", error)
    return NextResponse.json(
      { error: "Error al obtener los adelantos" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin()

    const body = await req.json()
    const { id, estado } = body

    if (!id || !estado) {
      return NextResponse.json(
        { error: "ID y estado son requeridos" },
        { status: 400 }
      )
    }

    if (!["APROBADO", "RECHAZADO"].includes(estado)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      )
    }

    const adelanto = await prisma.adelanto.update({
      where: { id: parseInt(id) },
      data: {
        estado: estado as EstadoAdelanto,
        aprobadoPorId: parseInt(admin.id),
        fechaAprobacion: new Date()
      },
      include: {
        tecnico: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: `Adelanto ${estado.toLowerCase()} exitosamente`,
      adelanto
    })
  } catch (error) {
    console.error("Error al actualizar adelanto:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

