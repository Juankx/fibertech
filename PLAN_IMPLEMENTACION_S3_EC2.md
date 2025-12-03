# 🚀 PLAN DE IMPLEMENTACIÓN: MIGRACIÓN A AWS S3 + EC2

## OBJETIVO
Migrar la aplicación Fibertech de Netlify a AWS EC2 con almacenamiento en S3 para un MVP estable y escalable.

---

## FASE 1: CONFIGURACIÓN DE AWS S3

### Paso 1.1: Crear Bucket S3

1. Acceder a AWS Console → S3
2. Crear bucket con nombre: `fibertech-uploads-[ambiente]` (ej: `fibertech-uploads-prod`)
3. Región: `us-east-1` (o la más cercana)
4. Configuraciones:
   - ✅ Bloquear acceso público (excepto objetos específicos)
   - ✅ Habilitar versionado (opcional)
   - ✅ Habilitar encriptación (AES-256)

### Paso 1.2: Configurar CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://cyafibertech.com",
      "https://www.cyafibertech.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Paso 1.3: Crear Usuario IAM

1. Crear usuario IAM: `fibertech-s3-user`
2. Política personalizada:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::fibertech-uploads-*/*",
        "arn:aws:s3:::fibertech-uploads-*"
      ]
    }
  ]
}
```
3. Generar Access Key y Secret Key
4. Guardar credenciales de forma segura

### Paso 1.4: Estructura de Carpetas en S3

```
fibertech-uploads-prod/
├── cvs/
│   └── [año]/
│       └── [mes]/
│           └── [archivo].pdf
├── fotos/
│   ├── uniforme/
│   │   └── [año]/
│   │       └── [mes]/
│   ├── vehiculo/
│   │   └── [año]/
│   │       └── [mes]/
│   └── herramienta/
│       └── [año]/
│           └── [mes]/
```

---

## FASE 2: IMPLEMENTACIÓN DE CÓDIGO S3

### Paso 2.1: Instalar Dependencias

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Paso 2.2: Crear Utilidad S3

Archivo: `lib/s3.ts`

Funcionalidades:
- `uploadFile()` - Subir archivo a S3
- `getFileUrl()` - Obtener URL pública del archivo
- `deleteFile()` - Eliminar archivo de S3
- `generatePresignedUrl()` - Generar URL firmada (opcional)

### Paso 2.3: Actualizar Variables de Entorno

Agregar a `.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET_NAME=fibertech-uploads-prod
AWS_S3_BUCKET_URL=https://fibertech-uploads-prod.s3.amazonaws.com
```

### Paso 2.4: Modificar APIs

1. **app/api/cv/route.ts**
   - Reemplazar escritura local por `uploadFile()`
   - Guardar URL de S3 en `filePath`

2. **app/api/tecnico/fotos/route.ts**
   - Reemplazar escritura local por `uploadFile()`
   - Guardar URL de S3 en `ruta`

---

## FASE 3: CONFIGURACIÓN DE EC2

### Paso 3.1: Crear Instancia EC2

1. **Tipo de Instancia:** t3.small (2 vCPU, 2GB RAM)
2. **AMI:** Ubuntu 22.04 LTS
3. **Storage:** 20GB SSD
4. **Security Group:**
   - SSH (22) - Solo tu IP
   - HTTP (80) - Público
   - HTTPS (443) - Público
   - Custom TCP (3000) - Solo tu IP (para desarrollo)

### Paso 3.2: Configurar Servidor

Script: `ec2-setup.sh`

```bash
#!/bin/bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar PostgreSQL (o usar RDS)
sudo apt install -y postgresql postgresql-contrib

# Instalar Git
sudo apt install -y git

# Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Paso 3.3: Configurar Nginx

Archivo: `/etc/nginx/sites-available/fibertech`

```nginx
server {
    listen 80;
    server_name cyafibertech.com www.cyafibertech.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Paso 3.4: Configurar SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cyafibertech.com -d www.cyafibertech.com
```

### Paso 3.5: Configurar PM2

Archivo: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'fibertech',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/fibertech',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

---

## FASE 4: DESPLIEGUE

### Paso 4.1: Preparar Repositorio

1. Crear branch `production`
2. Agregar `.env.production` (sin commitear)
3. Configurar GitHub Secrets para CI/CD

### Paso 4.2: Script de Despliegue

Archivo: `scripts/deploy.sh`

```bash
#!/bin/bash
set -e

echo "🚀 Iniciando despliegue..."

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Restart PM2
pm2 restart ecosystem.config.js

echo "✅ Despliegue completado"
```

### Paso 4.3: Configurar CI/CD (GitHub Actions)

Archivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/fibertech
            ./scripts/deploy.sh
```

---

## FASE 5: MIGRACIÓN DE DATOS

### Paso 5.1: Backup de Base de Datos

```bash
# En servidor actual (Netlify o local)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Paso 5.2: Restaurar en Nueva Base de Datos

```bash
# En EC2 o RDS
psql $DATABASE_URL < backup_YYYYMMDD.sql
```

### Paso 5.3: Migrar Archivos a S3

Script: `scripts/migrate-files-to-s3.js`

```javascript
// Leer archivos de BD
// Para cada archivo:
// 1. Verificar si existe localmente
// 2. Subir a S3
// 3. Actualizar URL en BD
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### Pre-Implementación
- [ ] Crear cuenta AWS
- [ ] Configurar bucket S3
- [ ] Crear usuario IAM
- [ ] Obtener credenciales
- [ ] Configurar CORS

### Implementación S3
- [ ] Instalar dependencias AWS
- [ ] Crear `lib/s3.ts`
- [ ] Actualizar `app/api/cv/route.ts`
- [ ] Actualizar `app/api/tecnico/fotos/route.ts`
- [ ] Probar subida de archivos
- [ ] Probar acceso a archivos

### Configuración EC2
- [ ] Crear instancia EC2
- [ ] Configurar Security Groups
- [ ] Ejecutar `ec2-setup.sh`
- [ ] Configurar Nginx
- [ ] Configurar SSL
- [ ] Configurar PM2
- [ ] Configurar dominio DNS

### Despliegue
- [ ] Clonar repositorio en EC2
- [ ] Configurar variables de entorno
- [ ] Ejecutar migraciones de BD
- [ ] Build de aplicación
- [ ] Iniciar con PM2
- [ ] Verificar funcionamiento

### Post-Despliegue
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo
- [ ] Configurar CI/CD
- [ ] Documentar proceso
- [ ] Capacitar equipo

---

## COMANDOS ÚTILES

### EC2
```bash
# Conectar a EC2
ssh -i key.pem ubuntu@ec2-ip

# Ver logs de PM2
pm2 logs fibertech

# Reiniciar aplicación
pm2 restart fibertech

# Ver estado
pm2 status
```

### S3
```bash
# Listar archivos
aws s3 ls s3://fibertech-uploads-prod/

# Subir archivo
aws s3 cp file.pdf s3://fibertech-uploads-prod/cvs/

# Descargar archivo
aws s3 cp s3://fibertech-uploads-prod/cvs/file.pdf ./
```

### Base de Datos
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restaurar
psql $DATABASE_URL < backup.sql

# Migraciones
npx prisma migrate deploy
```

---

## TROUBLESHOOTING

### Problema: No se pueden subir archivos a S3
- Verificar credenciales IAM
- Verificar permisos del bucket
- Verificar CORS configurado

### Problema: Error 502 en Nginx
- Verificar que la app está corriendo: `pm2 status`
- Verificar logs: `pm2 logs fibertech`
- Verificar puerto 3000: `netstat -tulpn | grep 3000`

### Problema: SSL no funciona
- Verificar certificado: `sudo certbot certificates`
- Renovar certificado: `sudo certbot renew`

---

## COSTOS ESTIMADOS

### S3 (Mensual)
- Almacenamiento: 10GB × $0.023 = $0.23
- Requests: 10,000 × $0.005/1000 = $0.05
- **Total S3: ~$0.30/mes**

### EC2 t3.small (Mensual)
- Instancia: ~$15/mes
- Storage 20GB: ~$2/mes
- **Total EC2: ~$17/mes**

### RDS (Opcional)
- db.t3.micro: ~$15/mes

### **Total MVP: ~$17-32/mes**

---

## PRÓXIMOS PASOS

1. ✅ Revisar este plan
2. ✅ Crear recursos AWS
3. ✅ Implementar código S3
4. ✅ Configurar EC2
5. ✅ Realizar pruebas
6. ✅ Migrar a producción

---

**Documento creado:** Enero 2025

