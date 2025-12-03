# 🚀 GUÍA PASO A PASO - DESPLIEGUE FIBERTECH

## ✅ LO QUE YA TIENES

- ✅ Bucket S3: `cyafibertech`
- ✅ Usuario IAM: `Juankx` con Access Key configurada
- ✅ Instancia EC2: `3.14.73.208`
- ✅ CloudFront configurado
- ✅ Key Pair: `cyafibertechclave.pem`

---

## PASO 1: PREPARAR ARCHIVO .ENV

**⚠️ IMPORTANTE:** Necesitas completar el Secret Access Key. El que me diste parece incompleto: `-FXsC64_`

1. Ve a AWS Console → IAM → Users → Juankx
2. Pestaña "Credenciales de seguridad"
3. Si no tienes el Secret Access Key completo, crea una nueva:
   - Clic en "Crear clave de acceso"
   - **Copia el Secret Access Key completo** (solo se muestra una vez)

4. Abre el archivo `.env.production` que creé
5. Reemplaza `-FXsC64_` con tu Secret Access Key completo
6. También necesitas configurar:
   - `DATABASE_URL` - Tu conexión a PostgreSQL
   - `NEXTAUTH_SECRET` - Genera una clave secreta (puedes usar: `openssl rand -base64 32`)

---

## PASO 2: CONECTARSE A EC2

### Opción A: Windows (PowerShell)

1. Abre PowerShell en la raíz del proyecto
2. Ejecuta:
```powershell
.\conectar-ec2.bat
```

O manualmente:
```powershell
ssh -i "cyafibertechclave.pem" ubuntu@3.14.73.208
```

### Opción B: Linux/Mac

1. Abre terminal en la raíz del proyecto
2. Ejecuta:
```bash
chmod 400 cyafibertechclave.pem
ssh -i cyafibertechclave.pem ubuntu@3.14.73.208
```

**Si te da error de permisos:**
- Windows: No debería dar error
- Linux/Mac: `chmod 400 cyafibertechclave.pem`

**Si te pregunta "Are you sure you want to continue connecting?"**
- Escribe: `yes` y presiona Enter

---

## PASO 3: SUBIR ARCHIVOS AL SERVIDOR

Una vez conectado a EC2, tienes 2 opciones:

### Opción A: Clonar desde Git (si tienes repo)

```bash
cd /home/ubuntu
git clone https://github.com/tu-usuario/fibertech.git
cd fibertech
```

### Opción B: Subir archivos con SCP (desde tu computadora)

**En una NUEVA ventana de terminal/PowerShell** (sin cerrar la conexión SSH):

```powershell
# Desde Windows PowerShell (en la raíz del proyecto)
scp -i cyafibertechclave.pem -r . ubuntu@3.14.73.208:/home/ubuntu/fibertech
```

O si prefieres subir solo archivos específicos, crea un script.

---

## PASO 4: CONFIGURAR VARIABLES DE ENTORNO EN EC2

Una vez en EC2 y en el directorio del proyecto:

```bash
cd /home/ubuntu/fibertech
nano .env
```

Pega el contenido de `.env.production` (que creé) y ajusta:
- Secret Access Key completo
- DATABASE_URL
- NEXTAUTH_SECRET

Guarda con: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## PASO 5: EJECUTAR SCRIPT DE DESPLIEGUE

En EC2, ejecuta:

```bash
cd /home/ubuntu/fibertech
chmod +x desplegar-completo.sh
./desplegar-completo.sh
```

Este script hará todo automáticamente:
- Instalar Node.js, PM2, Nginx
- Instalar dependencias
- Build de la aplicación
- Iniciar con PM2

---

## PASO 6: CONFIGURAR NGINX

En EC2:

```bash
sudo nano /etc/nginx/sites-available/fibertech
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

Guarda: `Ctrl+O`, `Enter`, `Ctrl+X`

Luego:

```bash
sudo ln -s /etc/nginx/sites-available/fibertech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## PASO 7: PROBAR LA APLICACIÓN

Abre en tu navegador:
```
http://3.14.73.208
```

Deberías ver tu aplicación funcionando.

---

## PASO 8: CONFIGURAR CLOUDFRONT (OPCIONAL)

1. Ve a AWS Console → CloudFront
2. Selecciona tu distribución `cyafibertech`
3. Pestaña "Origins" → "Create origin"
4. Configura:
   - **Origin domain:** `ec2-3-14-73-208.us-east-2.compute.amazonaws.com`
   - **Name:** `fibertech-ec2`
5. Pestaña "Behaviors" → Edita o crea behavior
6. **Origin:** Selecciona el que creaste
7. Guarda

---

## PASO 9: CONFIGURAR SSL (HTTPS)

En EC2:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cyafibertech.com -d www.cyafibertech.com
```

Sigue las instrucciones.

---

## 🆘 SI ALGO FALLA

### Ver logs de la aplicación:
```bash
pm2 logs fibertech
```

### Reiniciar aplicación:
```bash
pm2 restart fibertech
```

### Ver estado:
```bash
pm2 status
```

### Ver logs de Nginx:
```bash
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ CHECKLIST

- [ ] Secret Access Key completo guardado
- [ ] Conectado a EC2 por SSH
- [ ] Archivos subidos a EC2
- [ ] Archivo .env configurado en EC2
- [ ] Script de despliegue ejecutado
- [ ] Nginx configurado
- [ ] Aplicación accesible en http://3.14.73.208
- [ ] CloudFront configurado (opcional)
- [ ] SSL configurado (opcional)

---

**¿Listo para empezar?** Empieza por el Paso 1 y avísame cuando termines cada paso.

