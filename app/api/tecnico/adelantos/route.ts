import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"
import { Role, TipoAdelanto, EstadoAdelanto, TipoNotificacion } from "@prisma/client"

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

    const adelantos = await prisma.adelanto.findMany({
      where: { tecnicoId },
      include: {
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
    const { tipo, monto, motivo } = body

    if (!tipo || !monto || !motivo) {
      return NextResponse.json(
        { error: "Tipo, monto y motivo son requeridos" },
        { status: 400 }
      )
    }

    if (!["COMBUSTIBLE", "SUELDO"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo de adelanto inválido" },
        { status: 400 }
      )
    }

    if (monto <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser mayor a 0" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    // Crear adelanto
    const adelanto = await prisma.adelanto.create({
      data: {
        tipo: tipo as TipoAdelanto,
        monto: parseFloat(monto),
        motivo,
        estado: EstadoAdelanto.PENDIENTE,
        tecnicoId
      }
    })

    // Obtener todos los administradores para notificar
    const administradores = await prisma.user.findMany({
      where: {
        role: Role.ADMIN
      }
    })

    // Crear notificaciones para cada administrador
    const notificaciones = await Promise.all(
      administradores.map(admin =>
        prisma.notificacion.create({
          data: {
            tipo: TipoNotificacion.ADELANTO_SOLICITADO,
            mensaje: `${user.name} ha solicitado un adelanto de ${tipo.toLowerCase()} por $${monto}`,
            usuarioId: admin.id,
            adelantoId: adelanto.id
          }
        })
      )
    )

    return NextResponse.json(
      {
        message: "Adelanto solicitado exitosamente. Se notificó a los administradores.",
        adelanto
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear adelanto:", error)
    return NextResponse.json(
      { error: "Error al solicitar el adelanto" },
      { status: 500 }
    )
  }
}

