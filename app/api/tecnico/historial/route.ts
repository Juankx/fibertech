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

    // Obtener días únicos con actividades
    const actividades = await prisma.actividad.findMany({
      where: {
        tecnicoId,
        ...(fecha && {
          fecha: {
            gte: new Date(fecha + "T00:00:00"),
            lte: new Date(fecha + "T23:59:59")
          }
        })
      },
      select: {
        fecha: true,
        id: true,
        numeroOrden: true,
        tipoActividad: true
      },
      orderBy: {
        fecha: "desc"
      }
    })

    // Agrupar por fecha
    const diasTrabajados = actividades.reduce((acc: any, actividad) => {
      const fechaKey = actividad.fecha.toISOString().split('T')[0]
      if (!acc[fechaKey]) {
        acc[fechaKey] = {
          fecha: fechaKey,
          actividades: []
        }
      }
      acc[fechaKey].actividades.push({
        id: actividad.id,
        numeroOrden: actividad.numeroOrden,
        tipoActividad: actividad.tipoActividad
      })
      return acc
    }, {})

    // Obtener fotos de uniforme y vehículo para cada día
    const fechas = Object.keys(diasTrabajados)
    for (const fechaKey of fechas) {
      const fotos = await prisma.foto.findMany({
        where: {
          tecnicoId,
          fecha: {
            gte: new Date(fechaKey + "T00:00:00"),
            lte: new Date(fechaKey + "T23:59:59")
          },
          tipo: {
            in: ["UNIFORME", "VEHICULO"]
          }
        },
        select: {
          id: true,
          tipo: true,
          ruta: true,
          fecha: true
        }
      })

      diasTrabajados[fechaKey].fotos = fotos
    }

    return NextResponse.json({
      diasTrabajados: Object.values(diasTrabajados)
    })
  } catch (error) {
    console.error("Error al obtener historial:", error)
    return NextResponse.json(
      { error: "Error al obtener el historial" },
      { status: 500 }
    )
  }
}

