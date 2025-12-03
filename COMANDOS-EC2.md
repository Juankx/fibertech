# 🚀 COMANDOS PARA EJECUTAR EN EC2

Ya estás conectado a EC2 usando Session Manager. Ejecuta estos comandos en orden:

---

## PASO 1: ACTUALIZAR SISTEMA

```bash
sudo yum update -y
```

---

## PASO 2: INSTALAR NODE.JS 18

```bash
# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalación
node --version
npm --version
```

---

## PASO 3: INSTALAR PM2

```bash
sudo npm install -g pm2
```

---

## PASO 4: INSTALAR NGINX

```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## PASO 5: INSTALAR GIT Y HERRAMIENTAS

```bash
sudo yum install -y git gcc-c++ make
```

---

## PASO 6: CONFIGURAR FIREWALL

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

---

## PASO 7: CLONAR O SUBIR PROYECTO

### Opción A: Si tienes el proyecto en Git

```bash
cd /home/ec2-user
git clone https://github.com/tu-usuario/fibertech.git
cd fibertech
```

### Opción B: Si necesitas subir los archivos

Desde tu computadora (en otra terminal), ejecuta:

```powershell
# Desde la raíz del proyecto
scp -i "cyafibertechclave.pem" -r . ec2-user@3.14.73.208:/home/ec2-user/fibertech
```

---

## PASO 8: CREAR ARCHIVO .ENV

En EC2:

```bash
cd /home/ec2-user/fibertech
nano .env
```

Pega este contenido (ajusta DATABASE_URL y NEXTAUTH_SECRET):

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@host:5432/fibertech?schema=public"

# NextAuth
NEXTAUTH_URL="http://3.14.73.208:3000"
NEXTAUTH_SECRET="GENERA_UNA_CLAVE_SECRETA_DE_AL_MENOS_32_CARACTERES"

# AWS S3
AWS_REGION="us-east-2"
AWS_ACCESS_KEY_ID="TU_AWS_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="TU_AWS_SECRET_ACCESS_KEY"
AWS_S3_BUCKET_NAME="cyafibertech"
AWS_S3_BUCKET_URL="https://cyafibertech.s3.us-east-2.amazonaws.com"

NODE_ENV="production"
```

Guarda con: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## PASO 9: INSTALAR DEPENDENCIAS Y BUILD

```bash
cd /home/ec2-user/fibertech
npm install --production
npx prisma generate
npx prisma migrate deploy
npm run build
```

---

## PASO 10: INICIAR CON PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Sigue las instrucciones que te muestra `pm2 startup` (probablemente necesites ejecutar un comando con sudo).

---

## PASO 11: CONFIGURAR NGINX

```bash
sudo nano /etc/nginx/conf.d/fibertech.conf
```

Pega esto:

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

Guarda y reinicia Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## PASO 12: PROBAR

Abre en tu navegador: `http://3.14.73.208`

---

## COMANDOS ÚTILES

```bash
# Ver logs de la aplicación
pm2 logs fibertech

# Reiniciar aplicación
pm2 restart fibertech

# Ver estado
pm2 status

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

---

**Empieza ejecutando el Paso 1 y avísame cuando termines cada paso.**

