import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"
import { Role } from "@prisma/client"

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

    const herramientas = await prisma.herramienta.findMany({
      where: { tecnicoId },
      orderBy: {
        fechaRegistro: "desc"
      }
    })

    return NextResponse.json(herramientas)
  } catch (error) {
    console.error("Error al obtener herramientas:", error)
    return NextResponse.json(
      { error: "Error al obtener las herramientas" },
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
    const { nombre, descripcion, fotoPath } = body

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre de la herramienta es requerido" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    const herramienta = await prisma.herramienta.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        fotoPath: fotoPath || null,
        tecnicoId
      }
    })

    return NextResponse.json(
      { message: "Herramienta registrada exitosamente", herramienta },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear herramienta:", error)
    return NextResponse.json(
      { error: "Error al registrar la herramienta" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== Role.TECNICO) {
      return NextResponse.json(
        { error: "Acceso denegado: se requiere rol de técnico" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { id, fotoPath } = body

    if (!id || !fotoPath) {
      return NextResponse.json(
        { error: "ID y fotoPath son requeridos" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    // Verificar que la herramienta pertenece al técnico
    const herramientaExistente = await prisma.herramienta.findFirst({
      where: {
        id: parseInt(id),
        tecnicoId
      }
    })

    if (!herramientaExistente) {
      return NextResponse.json(
        { error: "Herramienta no encontrada" },
        { status: 404 }
      )
    }

    const herramienta = await prisma.herramienta.update({
      where: { id: parseInt(id) },
      data: {
        fotoPath,
        fechaRegistro: new Date()
      }
    })

    return NextResponse.json({
      message: "Herramienta actualizada exitosamente",
      herramienta
    })
  } catch (error) {
    console.error("Error al actualizar herramienta:", error)
    return NextResponse.json(
      { error: "Error al actualizar la herramienta" },
      { status: 500 }
    )
  }
}

