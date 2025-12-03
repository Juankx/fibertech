#!/bin/bash

# Script de configuración inicial para EC2
# Ejecutar como: sudo bash ec2-setup.sh

set -e

echo "🚀 Configurando servidor EC2 para Fibertech..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
npm install -g pm2

# Configurar PM2 para iniciar al arrancar
pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Instalar Nginx
echo "📦 Instalando Nginx..."
apt install -y nginx

# Instalar PostgreSQL (opcional, si no usas RDS)
echo "📦 Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Instalar Git
echo "📦 Instalando Git..."
apt install -y git

# Instalar herramientas adicionales
apt install -y build-essential curl wget

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Crear directorio para logs
echo "📁 Creando directorios..."
mkdir -p /home/ec2-user/fibertech/logs
chown -R ec2-user:ec2-user /home/ec2-user/fibertech

# Instalar Certbot para SSL
echo "📦 Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

echo "✅ Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "1. Clonar repositorio: git clone <repo> /home/ec2-user/fibertech"
echo "2. Configurar variables de entorno en .env"
echo "3. Instalar dependencias: npm install"
echo "4. Generar Prisma Client: npx prisma generate"
echo "5. Ejecutar migraciones: npx prisma migrate deploy"
echo "6. Build: npm run build"
echo "7. Iniciar con PM2: pm2 start ecosystem.config.js"
echo "8. Configurar Nginx (ver nginx.conf)"
echo "9. Configurar SSL: sudo certbot --nginx -d tu-dominio.com"

