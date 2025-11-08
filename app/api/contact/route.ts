import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, content } = body

    if (!name || !email || !content) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son requeridos" },
        { status: 400 }
      )
    }

    // Obtener usuario actual si está autenticado
    const user = await getCurrentUser()

    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        content,
        userId: user?.id ? parseInt(user.id) : null,
      },
    })

    return NextResponse.json(
      { message: "Mensaje enviado exitosamente", id: message.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al guardar mensaje:", error)
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    )
  }
}

