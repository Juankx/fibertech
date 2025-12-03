import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Configurar cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "fibertech-uploads"

/**
 * Sube un archivo a S3
 * @param fileBuffer - Buffer del archivo
 * @param fileName - Nombre del archivo
 * @param folder - Carpeta en S3 (ej: "cvs", "fotos/uniforme")
 * @param contentType - Tipo MIME del archivo
 * @returns URL pública del archivo subido
 */
export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  folder: string,
  contentType: string
): Promise<string> {
  try {
    // Generar ruta completa en S3
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const key = `${folder}/${year}/${month}/${fileName}`

    // Comando para subir archivo
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      // Hacer el archivo público (opcional, depende de tus necesidades)
      // ACL: "public-read",
    })

    // Subir archivo
    await s3Client.send(command)

    // Retornar URL pública
    const baseUrl = process.env.AWS_S3_BUCKET_URL || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`
    return `${baseUrl}/${key}`
  } catch (error) {
    console.error("Error al subir archivo a S3:", error)
    throw new Error("Error al subir archivo a S3")
  }
}

/**
 * Obtiene la URL pública de un archivo en S3
 * @param key - Clave del archivo en S3
 * @returns URL pública
 */
export function getS3FileUrl(key: string): string {
  const baseUrl = process.env.AWS_S3_BUCKET_URL || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`
  
  // Si ya es una URL completa, retornarla
  if (key.startsWith("http")) {
    return key
  }
  
  // Si es una ruta relativa, construir URL
  return `${baseUrl}/${key}`
}

/**
 * Genera una URL firmada temporal para acceso privado
 * @param key - Clave del archivo en S3
 * @param expiresIn - Tiempo de expiración en segundos (default: 1 hora)
 * @returns URL firmada
 */
export async function getSignedS3Url(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error("Error al generar URL firmada:", error)
    throw new Error("Error al generar URL firmada")
  }
}

/**
 * Elimina un archivo de S3
 * @param key - Clave del archivo en S3
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  try {
    // Extraer key de URL si es necesario
    const s3Key = key.includes("amazonaws.com/") 
      ? key.split("amazonaws.com/")[1] 
      : key

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error("Error al eliminar archivo de S3:", error)
    throw new Error("Error al eliminar archivo de S3")
  }
}

/**
 * Valida si las credenciales de AWS están configuradas
 */
export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  )
}

