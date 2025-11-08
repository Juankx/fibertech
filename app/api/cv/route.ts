import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const position = formData.get("position") as string
    const file = formData.get("file") as File

    if (!name || !email || !phone || !position || !file) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Validar que sea PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Solo se permiten archivos PDF" },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo no debe exceder 10MB" },
        { status: 400 }
      )
    }

    // Obtener usuario actual si está autenticado
    const user = await getCurrentUser()

    // En Netlify usar /tmp, en desarrollo usar uploads
    const isNetlify = process.env.NETLIFY === "true" || process.env.NETLIFY_DEV === "true"
    const uploadsDir = isNetlify 
      ? join("/tmp", "uploads") 
      : join(process.cwd(), "uploads")

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_")
    const fileName = `${sanitizedName}_${timestamp}.pdf`
    const filePath = join(uploadsDir, fileName)

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Guardar en base de datos
    // Nota: En Netlify, el filePath será temporal, pero guardamos la referencia
    const cv = await prisma.cv.create({
      data: {
        name,
        email,
        phone,
        position,
        filePath: isNetlify ? `/tmp/uploads/${fileName}` : `/uploads/${fileName}`,
        userId: user?.id ? parseInt(user.id) : null,
      },
    })

    return NextResponse.json(
      { message: "CV enviado exitosamente", id: cv.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al guardar CV:", error)
    return NextResponse.json(
      { error: "Error al procesar el CV" },
      { status: 500 }
    )
  }
}

