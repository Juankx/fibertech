import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"
import { Role } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireAuth()

    // Verificar que el usuario sea técnico
    if (user.role !== Role.TECNICO) {
      return NextResponse.json(
        { error: "Acceso denegado: se requiere rol de técnico" },
        { status: 403 }
      )
    }

    const tecnicoId = parseInt(user.id)

    // Buscar cuadrilla donde el técnico es titular o auxiliar
    const cuadrilla = await prisma.cuadrilla.findFirst({
      where: {
        OR: [
          { tecnicoTitularId: tecnicoId },
          { tecnicoAuxiliarId: tecnicoId }
        ]
      },
      include: {
        tecnicoTitular: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tecnicoAuxiliar: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!cuadrilla) {
      return NextResponse.json(
        { error: "No se encontró cuadrilla asignada" },
        { status: 404 }
      )
    }

    // Determinar si es titular o auxiliar
    const esTitular = cuadrilla.tecnicoTitularId === tecnicoId

    return NextResponse.json({
      cuadrilla: {
        id: cuadrilla.id,
        nombre: cuadrilla.nombre,
        tecnicoTitular: cuadrilla.tecnicoTitular,
        tecnicoAuxiliar: cuadrilla.tecnicoAuxiliar,
        esTitular
      }
    })
  } catch (error) {
    console.error("Error al obtener cuadrilla:", error)
    return NextResponse.json(
      { error: "Error al obtener la cuadrilla" },
      { status: 500 }
    )
  }
}

