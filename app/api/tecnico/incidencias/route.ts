import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"
import { Role, TipoIncidencia } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireAuth()

    if (user.role !== Role.TECNICO) {
      return NextResponse.json(
        { error: "Acceso denegado: se requiere rol de técnico" },
        { status: 403 }
      )
    }

    const tecnicoId = parseInt(user.id)

    const incidencias = await prisma.incidencia.findMany({
      where: { tecnicoId },
      orderBy: {
        fecha: "desc"
      }
    })

    return NextResponse.json(incidencias)
  } catch (error) {
    console.error("Error al obtener incidencias:", error)
    return NextResponse.json(
      { error: "Error al obtener las incidencias" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== Role.TECNICO) {
      return NextResponse.json(
        { error: "Acceso denegado: se requiere rol de técnico" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { tipo, descripcion, fecha, fotoPath } = body

    if (!tipo || !descripcion || !fecha) {
      return NextResponse.json(
        { error: "Tipo, descripción y fecha son requeridos" },
        { status: 400 }
      )
    }

    if (!["PERSONAL", "VEHICULO"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo de incidencia inválido" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    const incidencia = await prisma.incidencia.create({
      data: {
        tipo: tipo as TipoIncidencia,
        descripcion,
        fecha: new Date(fecha),
        fotoPath: fotoPath || null,
        tecnicoId
      }
    })

    return NextResponse.json(
      { message: "Incidencia registrada exitosamente", incidencia },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear incidencia:", error)
    return NextResponse.json(
      { error: "Error al registrar la incidencia" },
      { status: 500 }
    )
  }
}

