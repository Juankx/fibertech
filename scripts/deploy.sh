#!/bin/bash

# Script de despliegue para EC2
# Ejecutar desde: /home/ec2-user/fibertech

set -e

echo "🚀 Iniciando despliegue de Fibertech..."

# Cambiar al directorio del proyecto
cd /home/ec2-user/fibertech

# Pull latest code
echo "📥 Obteniendo últimos cambios..."
git pull origin main

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --production

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
npx prisma migrate deploy

# Build de la aplicación
echo "🏗️  Construyendo aplicación..."
npm run build

# Reiniciar aplicación con PM2
echo "🔄 Reiniciando aplicación..."
pm2 restart ecosystem.config.js

# Verificar estado
echo "✅ Verificando estado..."
pm2 status

echo ""
echo "✅ Despliegue completado exitosamente!"
echo "📊 Ver logs con: pm2 logs fibertech"

