#!/bin/bash
# Script completo de despliegue en EC2
# Ejecutar DESPUÉS de conectarte a EC2

set -e

echo "🚀 INICIANDO DESPLIEGUE COMPLETO DE FIBERTECH"
echo "=============================================="

# Paso 1: Actualizar sistema
echo ""
echo "📦 Paso 1: Actualizando sistema..."
sudo yum update -y

# Paso 2: Instalar Node.js 18
echo ""
echo "📦 Paso 2: Instalando Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
else
    echo "✅ Node.js ya está instalado: $(node --version)"
fi

# Paso 3: Instalar PM2
echo ""
echo "📦 Paso 3: Instalando PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo "✅ PM2 ya está instalado"
fi

# Paso 4: Instalar Nginx
echo ""
echo "📦 Paso 4: Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo yum install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo "✅ Nginx ya está instalado"
fi

# Paso 5: Instalar Git y herramientas
echo ""
echo "📦 Paso 5: Instalando Git y herramientas..."
if ! command -v git &> /dev/null; then
    sudo yum install -y git gcc-c++ make
else
    echo "✅ Git ya está instalado"
fi

# Paso 6: Configurar firewall
echo ""
echo "🔥 Paso 6: Configurando firewall..."
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# Paso 7: Clonar o actualizar repositorio
echo ""
echo "📥 Paso 7: Preparando repositorio..."
if [ -d "/home/ec2-user/fibertech" ]; then
    echo "✅ Directorio existe, actualizando..."
    cd /home/ec2-user/fibertech
    git pull origin main || echo "⚠️  No se pudo hacer pull (puede ser normal si no hay repo remoto)"
else
    echo "⚠️  Directorio no existe. Necesitas clonar el repositorio manualmente:"
    echo "   cd /home/ec2-user"
    echo "   git clone <tu-repositorio> fibertech"
    echo ""
    echo "   O sube los archivos manualmente con scp"
    exit 1
fi

# Paso 9: Instalar dependencias
echo ""
echo "📦 Paso 9: Instalando dependencias..."
npm install --production

# Paso 10: Generar Prisma Client
echo ""
echo "🔧 Paso 10: Generando Prisma Client..."
npx prisma generate

# Paso 11: Ejecutar migraciones
echo ""
echo "🗄️  Paso 11: Ejecutando migraciones..."
npx prisma migrate deploy || echo "⚠️  Error en migraciones (puede ser normal si no hay migraciones)"

# Paso 12: Build
echo ""
echo "🏗️  Paso 12: Construyendo aplicación..."
npm run build

# Paso 8: Crear directorio de logs
echo ""
echo "📁 Paso 8: Creando directorio de logs..."
mkdir -p /home/ec2-user/fibertech/logs

# Paso 14: Iniciar con PM2
echo ""
echo "🚀 Paso 14: Iniciando aplicación con PM2..."
pm2 start ecosystem.config.js || pm2 restart ecosystem.config.js
pm2 save

# Paso 15: Configurar PM2 para iniciar al arrancar
echo ""
echo "⚙️  Paso 15: Configurando PM2 para auto-inicio..."
pm2 startup || echo "⚠️  Ejecuta el comando que te muestra arriba con sudo"

# Paso 16: Verificar estado
echo ""
echo "✅ Verificando estado..."
pm2 status
pm2 logs fibertech --lines 20

echo ""
echo "=============================================="
echo "✅ DESPLIEGUE COMPLETADO!"
echo ""
echo "📊 Comandos útiles:"
echo "   pm2 status          - Ver estado"
echo "   pm2 logs fibertech  - Ver logs"
echo "   pm2 restart fibertech - Reiniciar"
echo ""
echo "🌐 Próximos pasos:"
echo "   1. Configurar Nginx (ver nginx.conf.example)"
echo "   2. Configurar SSL con Certbot"
echo "   3. Probar la aplicación en: http://3.14.73.208"

