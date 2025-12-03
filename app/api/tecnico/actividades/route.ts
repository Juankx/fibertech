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

    const actividades = await prisma.actividad.findMany({
      where,
      include: {
        cuadrilla: {
          select: {
            id: true,
            nombre: true
          }
        },
        proyecto: {
          select: {
            id: true,
            numeroOrden: true
          }
        }
      },
      orderBy: {
        fecha: "desc"
      }
    })

    return NextResponse.json(actividades)
  } catch (error) {
    console.error("Error al obtener actividades:", error)
    return NextResponse.json(
      { error: "Error al obtener las actividades" },
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
    const { fecha, numeroOrden, tipoActividad, datosCliente, novedades, cuadrillaId, proyectoId } = body

    if (!fecha || !numeroOrden || !tipoActividad || !datosCliente) {
      return NextResponse.json(
        { error: "Fecha, número de orden, tipo de actividad y datos del cliente son requeridos" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    const actividad = await prisma.actividad.create({
      data: {
        fecha: new Date(fecha),
        numeroOrden,
        tipoActividad,
        datosCliente,
        novedades: novedades || null,
        tecnicoId,
        cuadrillaId: cuadrillaId ? parseInt(cuadrillaId) : null,
        proyectoId: proyectoId ? parseInt(proyectoId) : null
      },
      include: {
        cuadrilla: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: "Actividad registrada exitosamente", actividad },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear actividad:", error)
    return NextResponse.json(
      { error: "Error al registrar la actividad" },
      { status: 500 }
    )
  }
}

