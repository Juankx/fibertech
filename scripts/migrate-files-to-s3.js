/**
 * Script para migrar archivos existentes a S3
 * 
 * Este script:
 * 1. Lee todos los registros de CVs y Fotos de la BD
 * 2. Verifica si los archivos existen localmente
 * 3. Sube los archivos a S3
 * 4. Actualiza las URLs en la base de datos
 * 
 * Uso: node scripts/migrate-files-to-s3.js
 */

const { PrismaClient } = require('@prisma/client')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs').promises
const path = require('path')
require('dotenv').config()

const prisma = new PrismaClient()

// Configurar cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME

async function uploadFileToS3(filePath, s3Key, contentType) {
  try {
    const fileBuffer = await fs.readFile(filePath)
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
    })

    await s3Client.send(command)
    
    const baseUrl = process.env.AWS_S3_BUCKET_URL || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`
    return `${baseUrl}/${s3Key}`
  } catch (error) {
    console.error(`Error al subir ${filePath}:`, error.message)
    return null
  }
}

async function migrateCVs() {
  console.log('📄 Migrando CVs...')
  
  const cvs = await prisma.cv.findMany({
    where: {
      filePath: {
        not: {
          contains: 'amazonaws.com'
        }
      }
    }
  })

  console.log(`Encontrados ${cvs.length} CVs para migrar`)

  for (const cv of cvs) {
    try {
      // Extraer ruta local del filePath
      let localPath = cv.filePath
      if (localPath.startsWith('/')) {
        localPath = path.join(process.cwd(), localPath)
      } else {
        localPath = path.join(process.cwd(), 'uploads', path.basename(localPath))
      }

      // Verificar si el archivo existe
      try {
        await fs.access(localPath)
      } catch {
        console.log(`⚠️  Archivo no encontrado: ${localPath}`)
        continue
      }

      // Generar key para S3
      const date = new Date(cv.createdAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const fileName = path.basename(localPath)
      const s3Key = `cvs/${year}/${month}/${fileName}`

      // Subir a S3
      console.log(`Subiendo ${fileName}...`)
      const s3Url = await uploadFileToS3(localPath, s3Key, 'application/pdf')

      if (s3Url) {
        // Actualizar en BD
        await prisma.cv.update({
          where: { id: cv.id },
          data: { filePath: s3Url }
        })
        console.log(`✅ Migrado: ${fileName}`)
      }
    } catch (error) {
      console.error(`Error al migrar CV ${cv.id}:`, error.message)
    }
  }
}

async function migrateFotos() {
  console.log('📸 Migrando fotos...')
  
  const fotos = await prisma.foto.findMany({
    where: {
      ruta: {
        not: {
          contains: 'amazonaws.com'
        }
      }
    }
  })

  console.log(`Encontradas ${fotos.length} fotos para migrar`)

  for (const foto of fotos) {
    try {
      // Extraer ruta local
      let localPath = foto.ruta
      if (localPath.startsWith('/tmp')) {
        // En Netlify, los archivos en /tmp ya no existen
        console.log(`⚠️  Archivo temporal no disponible: ${localPath}`)
        continue
      }
      
      if (localPath.startsWith('/')) {
        localPath = path.join(process.cwd(), localPath)
      } else {
        localPath = path.join(process.cwd(), 'uploads', 'fotos-tecnicos', foto.tipo.toLowerCase(), path.basename(localPath))
      }

      // Verificar si el archivo existe
      try {
        await fs.access(localPath)
      } catch {
        console.log(`⚠️  Archivo no encontrado: ${localPath}`)
        continue
      }

      // Generar key para S3
      const date = new Date(foto.fecha)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const fileName = path.basename(localPath)
      const s3Key = `fotos/${foto.tipo.toLowerCase()}/${year}/${month}/${fileName}`

      // Determinar content type
      const extension = path.extname(fileName).toLowerCase()
      const contentType = extension === '.jpg' || extension === '.jpeg' 
        ? 'image/jpeg' 
        : extension === '.png' 
        ? 'image/png' 
        : 'image/*'

      // Subir a S3
      console.log(`Subiendo ${fileName}...`)
      const s3Url = await uploadFileToS3(localPath, s3Key, contentType)

      if (s3Url) {
        // Actualizar en BD
        await prisma.foto.update({
          where: { id: foto.id },
          data: { ruta: s3Url }
        })
        console.log(`✅ Migrado: ${fileName}`)
      }
    } catch (error) {
      console.error(`Error al migrar foto ${foto.id}:`, error.message)
    }
  }
}

async function main() {
  console.log('🚀 Iniciando migración de archivos a S3...\n')

  // Verificar configuración
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
    console.error('❌ Error: Variables de entorno de AWS no configuradas')
    console.error('Configura AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_S3_BUCKET_NAME')
    process.exit(1)
  }

  try {
    await migrateCVs()
    console.log('\n')
    await migrateFotos()
    
    console.log('\n✅ Migración completada')
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

