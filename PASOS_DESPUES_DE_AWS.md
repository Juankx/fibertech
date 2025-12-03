# 🚀 PASOS SIGUIENTES: DESPUÉS DE CONFIGURAR AWS

## ✅ LO QUE YA TIENES CONFIGURADO

Basado en tus capturas de pantalla:

1. **Bucket S3:** `cyafibertech` (us-east-2)
2. **Usuario IAM:** `Juankx` con Access Key: `AKIAQTMAPXZYJ6BRJ6J3`
3. **Instancia EC2:** `cyafibertech-backend` (t3.micro)
   - IP Pública: `3.14.73.208`
   - DNS: `ec2-3-14-73-208.us-east-2.compute.amazonaws.com`
   - Estado: En ejecución
4. **CloudFront:** Distribución `cyafibertech`
   - Dominio: `d14c7y9eu17gbm.cloudfront.net`
   - Dominio personalizado: `cyafibertech.com`

---

## PASO 1: CONFIGURAR VARIABLES DE ENTORNO

### 1.1 Obtener Secret Access Key del Usuario IAM

Si no tienes el Secret Access Key guardado:

1. Ve a IAM → Users → Juankx
2. Pestaña "Credenciales de seguridad"
3. Si no tienes el Secret Access Key, necesitarás crear una nueva Access Key:
   - Clic en "Crear clave de acceso"
   - Descarga o copia el Secret Access Key (solo se muestra una vez)

### 1.2 Actualizar archivo `.env` en tu proyecto local

```env
# Database (ajusta según tu configuración)
DATABASE_URL="postgresql://usuario:contraseña@host:5432/fibertech?schema=public"

# NextAuth
NEXTAUTH_URL="http://3.14.73.208:3000"
# O cuando tengas dominio:
# NEXTAUTH_URL="https://cyafibertech.com"
NEXTAUTH_SECRET="genera-una-clave-secreta-de-al-menos-32-caracteres"

# AWS S3 - IMPORTANTE: Usa us-east-2 porque tu bucket está ahí
AWS_REGION="us-east-2"
AWS_ACCESS_KEY_ID="AKIAQTMAPXZYJ6BRJ6J3"
AWS_SECRET_ACCESS_KEY="tu-secret-access-key-aqui"
AWS_S3_BUCKET_NAME="cyafibertech"
AWS_S3_BUCKET_URL="https://cyafibertech.s3.us-east-2.amazonaws.com"

# Environment
NODE_ENV="production"
```

**⚠️ IMPORTANTE:** 
- Tu bucket está en `us-east-2` (Ohio), no `us-east-1`
- Asegúrate de usar `us-east-2` en `AWS_REGION`
- El nombre del bucket es `cyafibertech` (sin el prefijo que sugerimos)

---

## PASO 2: ACTUALIZAR CÓDIGO PARA USAR TU BUCKET

Necesitamos verificar que el código use el nombre correcto del bucket. Revisa `lib/s3.ts`:

```typescript
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "fibertech-uploads"
```

Esto debería funcionar con tu `.env`, pero verifica que esté correcto.

---

## PASO 3: CONECTARSE A EC2

### 3.1 Obtener Key Pair

¿Tienes el archivo `.pem` o `.ppk` para conectarte? Si no:

1. Ve a EC2 → Key Pairs
2. Si no tienes uno, créalo
3. Descarga el archivo

### 3.2 Conectarse por SSH

**Windows (PowerShell):**
```powershell
ssh -i "ruta/a/tu-keypair.pem" ubuntu@3.14.73.208
```

**Linux/Mac:**
```bash
chmod 400 tu-keypair.pem
ssh -i tu-keypair.pem ubuntu@3.14.73.208
```

**Nota:** Si usas Amazon Linux en lugar de Ubuntu, el usuario es `ec2-user`:
```bash
ssh -i tu-keypair.pem ec2-user@3.14.73.208
```

---

## PASO 4: CONFIGURAR EL SERVIDOR EC2

Una vez conectado, ejecuta estos comandos:

### 4.1 Actualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 4.2 Instalar Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verificar que sea v18+
```

### 4.3 Instalar PM2

```bash
sudo npm install -g pm2
```

### 4.4 Instalar Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.5 Instalar Git

```bash
sudo apt install -y git
```

### 4.6 Instalar Build Tools

```bash
sudo apt install -y build-essential
```

---

## PASO 5: CLONAR Y CONFIGURAR EL PROYECTO

### 5.1 Clonar Repositorio

```bash
cd /home/ubuntu
git clone https://github.com/tu-usuario/fibertech.git
# O si tienes el repo en otro lugar, ajusta la URL
cd fibertech
```

### 5.2 Crear archivo `.env`

```bash
nano .env
```

Pega las variables de entorno (las del Paso 1.2), pero ajusta:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@host:5432/fibertech?schema=public"

# NextAuth
NEXTAUTH_URL="http://3.14.73.208:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"

# AWS S3
AWS_REGION="us-east-2"
AWS_ACCESS_KEY_ID="AKIAQTMAPXZYJ6BRJ6J3"
AWS_SECRET_ACCESS_KEY="tu-secret-access-key"
AWS_S3_BUCKET_NAME="cyafibertech"
AWS_S3_BUCKET_URL="https://cyafibertech.s3.us-east-2.amazonaws.com"

NODE_ENV="production"
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`

### 5.3 Instalar Dependencias

```bash
npm install --production
```

### 5.4 Generar Prisma Client

```bash
npx prisma generate
```

### 5.5 Ejecutar Migraciones

```bash
npx prisma migrate deploy
```

### 5.6 Build de la Aplicación

```bash
npm run build
```

---

## PASO 6: CONFIGURAR PM2

### 6.1 Crear archivo de configuración

```bash
nano ecosystem.config.js
```

Pega esto:

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

### 6.2 Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Sigue las instrucciones que te da `pm2 startup` (probablemente necesites ejecutar un comando con `sudo`).

### 6.3 Verificar que esté corriendo

```bash
pm2 status
pm2 logs fibertech
```

Deberías ver que la aplicación está corriendo en el puerto 3000.

---

## PASO 7: CONFIGURAR NGINX

### 7.1 Crear configuración de Nginx

```bash
sudo nano /etc/nginx/sites-available/fibertech
```

Pega esta configuración:

```nginx
server {
    listen 80;
    server_name 3.14.73.208 cyafibertech.com www.cyafibertech.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.2 Habilitar el sitio

```bash
sudo ln -s /etc/nginx/sites-available/fibertech /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

### 7.3 Verificar

Abre en tu navegador: `http://3.14.73.208`

Deberías ver tu aplicación funcionando.

---

## PASO 8: CONFIGURAR CLOUDFRONT

### 8.1 Configurar Origin en CloudFront

1. Ve a CloudFront → Distributions → cyafibertech
2. Pestaña "Origins"
3. Clic en "Create origin"
4. Configuración:
   - **Origin domain:** `ec2-3-14-73-208.us-east-2.compute.amazonaws.com`
   - **Name:** `fibertech-ec2`
   - **Protocol:** HTTP (o HTTPS si configuraste SSL)
   - **HTTP port:** 80
   - **Origin path:** (deja vacío)
5. Clic en "Create origin"

### 8.2 Crear/Actualizar Behavior

1. Pestaña "Behaviors"
2. Si ya hay uno, edítalo. Si no, crea uno nuevo
3. Configuración:
   - **Path pattern:** `*` (todas las rutas)
   - **Origin and origin groups:** Selecciona el origin que creaste
   - **Viewer protocol policy:** Redirect HTTP to HTTPS (recomendado)
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - **Cache policy:** CachingDisabled (para desarrollo) o Managed-CachingOptimized (para producción)
4. Guarda

### 8.3 Invalidar Cache (si es necesario)

1. Pestaña "Invalidations"
2. Clic en "Create invalidation"
3. Paths: `/*`
4. Clic en "Create invalidation"

---

## PASO 9: CONFIGURAR SSL (HTTPS)

### 9.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### 9.2 Obtener Certificado SSL

```bash
sudo certbot --nginx -d cyafibertech.com -d www.cyafibertech.com
```

Sigue las instrucciones. Certbot configurará Nginx automáticamente.

### 9.3 Actualizar NEXTAUTH_URL

Actualiza el `.env` en EC2:

```env
NEXTAUTH_URL="https://cyafibertech.com"
```

Reinicia la aplicación:

```bash
pm2 restart fibertech
```

---

## PASO 10: CONFIGURAR SECURITY GROUP

Verifica que tu Security Group tenga estos puertos abiertos:

1. Ve a EC2 → Security Groups
2. Selecciona el Security Group de tu instancia
3. Pestaña "Inbound rules"
4. Debe tener:
   - **SSH (22)** - Solo tu IP
   - **HTTP (80)** - 0.0.0.0/0 (público)
   - **HTTPS (443)** - 0.0.0.0/0 (público)

Si falta alguno, agrégalo.

---

## PASO 11: PROBAR LA APLICACIÓN

### 11.1 Probar S3

1. Ve a tu aplicación: `http://3.14.73.208` o `https://cyafibertech.com`
2. Intenta subir un CV o una foto
3. Verifica en S3 que el archivo se haya subido:
   - Ve a S3 → Bucket `cyafibertech`
   - Deberías ver las carpetas `cvs/` o `fotos/`

### 11.2 Verificar Logs

```bash
pm2 logs fibertech
```

Si hay errores, revísalos aquí.

---

## PASO 12: CONFIGURAR BACKUPS Y MONITOREO

### 12.1 Configurar Backups de Base de Datos

Si usas RDS, los backups son automáticos. Si usas PostgreSQL en EC2:

```bash
# Crear script de backup
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /home/ubuntu/backups/db_backup_$DATE.sql
# Mantener solo los últimos 7 días
find /home/ubuntu/backups -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /home/ubuntu/backup-db.sh
mkdir -p /home/ubuntu/backups
```

Agregar a crontab (backup diario a las 2 AM):

```bash
crontab -e
```

Agrega:
```
0 2 * * * /home/ubuntu/backup-db.sh
```

---

## ✅ CHECKLIST FINAL

- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor EC2 configurado (Node.js, PM2, Nginx)
- [ ] Aplicación clonada y build ejecutado
- [ ] PM2 corriendo la aplicación
- [ ] Nginx configurado y funcionando
- [ ] CloudFront configurado con origin de EC2
- [ ] SSL configurado (HTTPS)
- [ ] Security Group con puertos correctos
- [ ] Prueba de subida de archivos a S3 exitosa
- [ ] Aplicación accesible desde internet

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot connect to EC2"
- Verifica Security Group (puerto 22 abierto para tu IP)
- Verifica que la instancia esté "Running"
- Verifica que tengas el Key Pair correcto

### Error: "Application not starting"
```bash
pm2 logs fibertech
# Revisa los logs para ver el error específico
```

### Error: "S3 Access Denied"
- Verifica que `AWS_REGION` sea `us-east-2`
- Verifica que `AWS_S3_BUCKET_NAME` sea `cyafibertech`
- Verifica que el IAM user tenga permisos en el bucket

### Error: "502 Bad Gateway" en Nginx
- Verifica que la app esté corriendo: `pm2 status`
- Verifica que el puerto 3000 esté escuchando: `netstat -tulpn | grep 3000`
- Verifica logs de Nginx: `sudo tail -f /var/log/nginx/error.log`

---

## 📞 PRÓXIMOS PASOS

1. ✅ Configurar dominio DNS (si aún no lo hiciste)
2. ✅ Configurar monitoreo (CloudWatch)
3. ✅ Configurar alertas
4. ✅ Documentar proceso de despliegue

---

**Documento creado:** Enero 2025

