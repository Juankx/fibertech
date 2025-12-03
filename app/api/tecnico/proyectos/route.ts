import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"
import { Role } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== Role.TECNICO) {
      return NextResponse.json(
        { error: "Acceso denegado: se requiere rol de técnico" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const fecha = searchParams.get("fecha")
    const tecnicoId = parseInt(user.id)

    const where: any = { tecnicoId }

    if (fecha) {
      const fechaInicio = new Date(fecha)
      fechaInicio.setHours(0, 0, 0, 0)
      const fechaFin = new Date(fecha)
      fechaFin.setHours(23, 59, 59, 999)
      where.fecha = {
        gte: fechaInicio,
        lte: fechaFin
      }
    }

    const proyectos = await prisma.proyecto.findMany({
      where,
      include: {
        actividades: {
          select: {
            id: true,
            numeroOrden: true,
            tipoActividad: true
          }
        }
      },
      orderBy: {
        fecha: "desc"
      }
    })

    return NextResponse.json(proyectos)
  } catch (error) {
    console.error("Error al obtener proyectos:", error)
    return NextResponse.json(
      { error: "Error al obtener los proyectos" },
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
    const { fecha, numeroOrden, tipoActividad, datosCliente, novedades } = body

    if (!fecha || !numeroOrden || !tipoActividad || !datosCliente) {
      return NextResponse.json(
        { error: "Fecha, número de orden, tipo de actividad y datos del cliente son requeridos" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    const proyecto = await prisma.proyecto.create({
      data: {
        fecha: new Date(fecha),
        numeroOrden,
        tipoActividad,
        datosCliente,
        novedades: novedades || null,
        tecnicoId
      }
    })

    return NextResponse.json(
      { message: "Proyecto registrado exitosamente", proyecto },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear proyecto:", error)
    return NextResponse.json(
      { error: "Error al registrar el proyecto" },
      { status: 500 }
    )
  }
}

