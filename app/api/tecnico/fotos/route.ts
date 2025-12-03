import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-helpers"
import { Role, TipoFoto } from "@prisma/client"
import { uploadFileToS3, isS3Configured } from "@/lib/s3"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== Role.TECNICO) {
      return NextResponse.json(
        { error: "Acceso denegado: se requiere rol de técnico" },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const tipo = formData.get("tipo") as string
    const file = formData.get("file") as File
    const actividadId = formData.get("actividadId") as string | null

    if (!tipo || !file) {
      return NextResponse.json(
        { error: "Tipo y archivo son requeridos" },
        { status: 400 }
      )
    }

    // Validar tipo
    if (!["UNIFORME", "VEHICULO", "HERRAMIENTA"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo de foto inválido" },
        { status: 400 }
      )
    }

    // Validar que sea imagen
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten archivos de imagen" },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo no debe exceder 5MB" },
        { status: 400 }
      )
    }

    const tecnicoId = parseInt(user.id)

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${tecnicoId}_${timestamp}.${extension}`

    let ruta: string

    // Usar S3 si está configurado, sino usar almacenamiento local
    if (isS3Configured()) {
      // Subir a S3
      const folder = `fotos/${tipo.toLowerCase()}`
      ruta = await uploadFileToS3(
        buffer,
        fileName,
        folder,
        file.type
      )
    } else {
      // Fallback a almacenamiento local
      const isNetlify = process.env.NETLIFY === "true" || process.env.NETLIFY_DEV === "true"
      const fotosDir = isNetlify
        ? join("/tmp", "fotos-tecnicos", tipo.toLowerCase())
        : join(process.cwd(), "uploads", "fotos-tecnicos", tipo.toLowerCase())

      if (!existsSync(fotosDir)) {
        await mkdir(fotosDir, { recursive: true })
      }

      const localFilePath = join(fotosDir, fileName)
      await writeFile(localFilePath, buffer)
      ruta = isNetlify 
        ? `/tmp/fotos-tecnicos/${tipo.toLowerCase()}/${fileName}` 
        : `/uploads/fotos-tecnicos/${tipo.toLowerCase()}/${fileName}`
    }

    // Guardar en base de datos
    const foto = await prisma.foto.create({
      data: {
        tipo: tipo as TipoFoto,
        ruta,
        fecha: new Date(),
        tecnicoId,
        actividadId: actividadId ? parseInt(actividadId) : null
      }
    })

    return NextResponse.json(
      { message: "Foto subida exitosamente", foto },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al subir foto:", error)
    return NextResponse.json(
      { error: "Error al procesar la foto" },
      { status: 500 }
    )
  }
}

