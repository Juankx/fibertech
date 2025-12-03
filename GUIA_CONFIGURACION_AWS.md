# 🚀 GUÍA COMPLETA: CONFIGURACIÓN AWS S3 + EC2 PARA FIBERTECH

## 📋 RESUMEN DE LO QUE NECESITAS

Para desplegar Fibertech en AWS necesitas:

1. **Cuenta AWS** (si no tienes, créala en aws.amazon.com)
2. **Bucket S3** para almacenar archivos (CVs, fotos)
3. **Usuario IAM** con permisos para S3
4. **Instancia EC2** para el servidor
5. **Security Groups** configurados
6. **Elastic IP** (opcional pero recomendado)
7. **Base de Datos** (RDS o PostgreSQL en EC2)

---

## PASO 1: CREAR CUENTA AWS

1. Ve a: https://aws.amazon.com/
2. Clic en "Crear una cuenta de AWS"
3. Completa el registro (requiere tarjeta de crédito)
4. **Nota:** AWS tiene tier gratuito por 12 meses para nuevos usuarios

---

## PASO 2: CONFIGURAR S3 (ALMACENAMIENTO DE ARCHIVOS)

### 2.1 Crear Bucket S3

1. Ve a la consola de AWS: https://console.aws.amazon.com/
2. Busca "S3" en el buscador
3. Clic en "Create bucket"

**Configuración del Bucket:**

- **Bucket name:** `fibertech-uploads-prod` (debe ser único globalmente)
- **AWS Region:** `us-east-1` (o la más cercana a Ecuador: `sa-east-1`)
- **Object Ownership:** ACLs disabled (recomendado)
- **Block Public Access:** 
  - ✅ Bloquear todo el acceso público (por seguridad)
  - Los archivos se accederán mediante URLs firmadas o políticas IAM
- **Bucket Versioning:** Opcional (útil para backups)
- **Default encryption:** 
  - ✅ Habilitar
  - Encryption type: `Amazon S3 managed keys (SSE-S3)`
- **Clic en "Create bucket"**

### 2.2 Configurar CORS (Cross-Origin Resource Sharing)

1. Selecciona tu bucket `fibertech-uploads-prod`
2. Ve a la pestaña "Permissions"
3. Scroll hasta "Cross-origin resource sharing (CORS)"
4. Clic en "Edit"
5. Pega esta configuración:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://cyafibertech.com",
      "https://www.cyafibertech.com"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

6. Clic en "Save changes"

### 2.3 Crear Estructura de Carpetas (Opcional)

No es necesario crear carpetas manualmente, el código las creará automáticamente. Pero la estructura será:

```
fibertech-uploads-prod/
├── cvs/
│   └── 2025/
│       └── 01/
│           └── archivo.pdf
├── fotos/
│   ├── uniforme/
│   │   └── 2025/
│   │       └── 01/
│   ├── vehiculo/
│   │   └── 2025/
│   │       └── 01/
│   └── herramienta/
│       └── 2025/
│           └── 01/
```

---

## PASO 3: CREAR USUARIO IAM (PARA ACCESO A S3)

### 3.1 Crear Usuario IAM

1. Ve a la consola de AWS
2. Busca "IAM" (Identity and Access Management)
3. En el menú lateral, clic en "Users"
4. Clic en "Create user"

**Configuración:**

- **User name:** `fibertech-s3-user`
- **Access type:** 
  - ✅ Programmatic access (para Access Key ID y Secret)
  - ❌ AWS Management Console access (no necesario)
5. Clic en "Next: Permissions"

### 3.2 Asignar Permisos

**Opción A: Política Personalizada (Recomendada - Más Segura)**

1. Clic en "Attach policies directly"
2. Clic en "Create policy"
3. Ve a la pestaña "JSON"
4. Pega esta política:

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
        "arn:aws:s3:::fibertech-uploads-prod",
        "arn:aws:s3:::fibertech-uploads-prod/*"
      ]
    }
  ]
}
```

5. Clic en "Next"
6. **Policy name:** `FibertechS3Access`
7. **Description:** `Acceso a bucket S3 de Fibertech para subir/obtener/eliminar archivos`
8. Clic en "Create policy"
9. Regresa a la creación del usuario
10. Busca y selecciona la política `FibertechS3Access`
11. Clic en "Next"

**Opción B: Política Predefinida (Más Simple pero Menos Segura)**

1. Busca: `AmazonS3FullAccess`
2. Selecciona (da acceso a TODOS los buckets S3)
3. Clic en "Next"

### 3.3 Guardar Credenciales

1. Clic en "Next: Tags" (opcional, puedes saltar)
2. Clic en "Create user"
3. **⚠️ IMPORTANTE: Descarga las credenciales**
   - **Access Key ID:** (copia este valor)
   - **Secret Access Key:** (copia este valor - solo se muestra una vez)
4. Guarda estas credenciales de forma segura (las necesitarás para `.env`)

---

## PASO 4: CONFIGURAR EC2 (SERVIDOR)

### 4.1 Crear Key Pair (Para SSH)

1. Ve a la consola de AWS
2. Busca "EC2"
3. En el menú lateral, ve a "Key Pairs" (bajo "Network & Security")
4. Clic en "Create key pair"

**Configuración:**

- **Name:** `fibertech-keypair`
- **Key pair type:** `RSA`
- **Private key file format:** `pem` (para Linux/Mac) o `ppk` (para Windows con PuTTY)
5. Clic en "Create key pair"
6. **Descarga el archivo** (lo necesitarás para conectarte por SSH)

### 4.2 Crear Security Group (Firewall)

1. En EC2, ve a "Security Groups" (bajo "Network & Security")
2. Clic en "Create security group"

**Configuración:**

- **Security group name:** `fibertech-sg`
- **Description:** `Security group para servidor Fibertech`
- **VPC:** Deja el default

**Inbound Rules (Reglas de Entrada):**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | Acceso SSH desde tu IP |
| HTTP | TCP | 80 | 0.0.0.0/0 | Acceso HTTP público |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Acceso HTTPS público |
| Custom TCP | TCP | 3000 | My IP | Next.js dev (solo desarrollo) |

**Outbound Rules (Reglas de Salida):**
- Deja todo permitido (default)

3. Clic en "Create security group"

### 4.3 Crear Instancia EC2

1. En EC2, ve a "Instances"
2. Clic en "Launch instance"

**Paso 1: Name and tags**
- **Name:** `fibertech-server`

**Paso 2: Application and OS Images**
- **AMI:** `Ubuntu Server 22.04 LTS` (Free tier eligible)
- O `Amazon Linux 2023` (también gratis)

**Paso 3: Instance type**
- **Para MVP:** `t3.small` (2 vCPU, 2GB RAM) - ~$15/mes
- **Para desarrollo/pruebas:** `t3.micro` (1 vCPU, 1GB RAM) - Gratis en tier gratuito
- **Para producción:** `t3.medium` (2 vCPU, 4GB RAM) - ~$30/mes

**Paso 4: Key pair**
- Selecciona: `fibertech-keypair` (el que creaste antes)

**Paso 5: Network settings**
- **VPC:** Default
- **Subnet:** Default
- **Auto-assign Public IP:** Enable
- **Security group:** Selecciona `fibertech-sg`

**Paso 6: Configure storage**
- **Size:** 20 GB (suficiente para MVP)
- **Volume type:** gp3 (SSD)

**Paso 7: Advanced details (Opcional)**
- Puedes agregar un script de inicialización aquí (user data)

3. Clic en "Launch instance"

### 4.4 Asociar Elastic IP (Recomendado)

1. En EC2, ve a "Elastic IPs" (bajo "Network & Security")
2. Clic en "Allocate Elastic IP address"
3. Clic en "Allocate"
4. Selecciona la IP y clic en "Actions" → "Associate Elastic IP address"
5. Selecciona tu instancia y clic en "Associate"

**¿Por qué Elastic IP?**
- Tu IP pública no cambiará aunque reinicies la instancia
- Útil para configurar DNS

---

## PASO 5: CONFIGURAR BASE DE DATOS

### Opción A: PostgreSQL en EC2 (Gratis pero más trabajo)

Instalarás PostgreSQL directamente en la instancia EC2.

### Opción B: Amazon RDS (Recomendado - Más fácil)

1. Ve a la consola de AWS
2. Busca "RDS"
3. Clic en "Create database"

**Configuración:**

- **Engine:** PostgreSQL
- **Version:** 15.x o 14.x
- **Template:** Free tier (si aplica) o Production
- **DB instance identifier:** `fibertech-db`
- **Master username:** `fibertech_admin`
- **Master password:** (crea una contraseña segura)
- **DB instance class:** `db.t3.micro` (gratis) o `db.t3.small` (~$15/mes)
- **Storage:** 20 GB
- **VPC:** Default
- **Public access:** Yes (para acceder desde fuera)
- **Security group:** Crea uno nuevo o usa existente
- **Database name:** `fibertech`

4. Clic en "Create database"
5. Espera 5-10 minutos a que se cree
6. Anota el **Endpoint** (será tu `DATABASE_URL`)

---

## PASO 6: CONFIGURAR VARIABLES DE ENTORNO

En tu proyecto, actualiza el archivo `.env` con:

```env
# Database
DATABASE_URL="postgresql://fibertech_admin:tu_password@fibertech-db.xxxxx.us-east-1.rds.amazonaws.com:5432/fibertech?schema=public"

# NextAuth
NEXTAUTH_URL="http://tu-ip-ec2:3000"
NEXTAUTH_SECRET="tu-secret-key-generada"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="tu-access-key-id-del-iam-user"
AWS_SECRET_ACCESS_KEY="tu-secret-access-key-del-iam-user"
AWS_S3_BUCKET_NAME="fibertech-uploads-prod"
AWS_S3_BUCKET_URL="https://fibertech-uploads-prod.s3.us-east-1.amazonaws.com"

# Environment
NODE_ENV="production"
```

---

## PASO 7: CONFIGURAR EC2 (SERVIDOR)

### 7.1 Conectarse por SSH

**Windows (PowerShell):**
```powershell
ssh -i "ruta/a/fibertech-keypair.pem" ubuntu@tu-elastic-ip
```

**Linux/Mac:**
```bash
chmod 400 fibertech-keypair.pem
ssh -i fibertech-keypair.pem ubuntu@tu-elastic-ip
```

### 7.2 Ejecutar Script de Configuración

Una vez conectado, ejecuta:

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar Git
sudo apt install -y git

# Instalar build tools
sudo apt install -y build-essential

# Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

O usa el script `ec2-setup.sh` que creamos antes.

---

## PASO 8: DESPLEGAR APLICACIÓN EN EC2

### 8.1 Clonar Repositorio

```bash
cd /home/ubuntu
git clone https://github.com/tu-usuario/fibertech.git
cd fibertech
```

### 8.2 Configurar Variables de Entorno

```bash
nano .env
# Pega las variables de entorno que configuraste antes
```

### 8.3 Instalar y Build

```bash
npm install --production
npx prisma generate
npx prisma migrate deploy
npm run build
```

### 8.4 Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## PASO 9: CONFIGURAR NGINX

1. Crea archivo de configuración:

```bash
sudo nano /etc/nginx/sites-available/fibertech
```

2. Pega la configuración de `nginx.conf.example`

3. Crear symlink:

```bash
sudo ln -s /etc/nginx/sites-available/fibertech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## PASO 10: CONFIGURAR SSL (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cyafibertech.com -d www.cyafibertech.com
```

---

## 📊 RESUMEN DE RECURSOS AWS NECESARIOS

| Recurso | Nombre | Costo Estimado |
|---------|--------|----------------|
| **S3 Bucket** | `fibertech-uploads-prod` | ~$0.30/mes |
| **IAM User** | `fibertech-s3-user` | Gratis |
| **EC2 Instance** | `fibertech-server` (t3.small) | ~$15/mes |
| **Elastic IP** | (asociada a EC2) | Gratis si está en uso |
| **RDS** (opcional) | `fibertech-db` (db.t3.micro) | Gratis (tier) o ~$15/mes |
| **Security Group** | `fibertech-sg` | Gratis |

**Total Estimado MVP:** ~$15-30/mes

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### S3
- [ ] Bucket creado
- [ ] CORS configurado
- [ ] Encriptación habilitada

### IAM
- [ ] Usuario IAM creado
- [ ] Política de permisos asignada
- [ ] Access Key ID guardado
- [ ] Secret Access Key guardado

### EC2
- [ ] Key Pair creado y descargado
- [ ] Security Group configurado
- [ ] Instancia EC2 creada
- [ ] Elastic IP asociada
- [ ] Servidor configurado (Node.js, PM2, Nginx)

### Base de Datos
- [ ] RDS creado O PostgreSQL instalado en EC2
- [ ] DATABASE_URL configurado

### Aplicación
- [ ] Repositorio clonado en EC2
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas
- [ ] Prisma migrado
- [ ] Aplicación build y corriendo

### DNS y SSL
- [ ] Dominio configurado (opcional)
- [ ] SSL configurado (opcional)

---

## 🔐 SEGURIDAD IMPORTANTE

1. **Nunca subas el archivo `.env` a Git**
2. **Guarda las credenciales de forma segura** (password manager)
3. **Rota las Access Keys periódicamente**
4. **Usa Security Groups restrictivos** (solo puertos necesarios)
5. **Habilita HTTPS** en producción
6. **Haz backups regulares** de la base de datos

---

## 🆘 TROUBLESHOOTING

### Error: "Access Denied" en S3
- Verifica que el IAM user tenga los permisos correctos
- Verifica que el bucket name sea correcto

### Error: No puedo conectarme por SSH
- Verifica que tu IP esté en el Security Group
- Verifica que el Key Pair sea correcto
- Verifica que la instancia esté "Running"

### Error: La aplicación no inicia
- Verifica logs: `pm2 logs fibertech`
- Verifica variables de entorno
- Verifica que la BD esté accesible

---

## 📚 RECURSOS ADICIONALES

- [Documentación AWS S3](https://docs.aws.amazon.com/s3/)
- [Documentación AWS EC2](https://docs.aws.amazon.com/ec2/)
- [Documentación AWS IAM](https://docs.aws.amazon.com/iam/)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

**Documento creado:** Enero 2025  
**Última actualización:** Enero 2025

