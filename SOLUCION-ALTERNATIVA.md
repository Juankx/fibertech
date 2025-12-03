# 🔄 SOLUCIÓN ALTERNATIVA: Conectar a EC2

## ✅ BUENAS NOTICIAS

El error cambió de "Bad permissions" a solo "Permission denied". Esto significa que **los permisos del archivo están bien ahora**.

El problema ahora es diferente: puede ser el usuario o la clave.

---

## 🔍 POSIBLES CAUSAS

### 1. Usuario Incorrecto

Dependiendo del tipo de AMI en EC2, el usuario puede ser:
- **Ubuntu:** `ubuntu`
- **Amazon Linux:** `ec2-user`
- **Debian:** `admin`
- **CentOS:** `centos`

### 2. Key Pair Incorrecto

El archivo `.pem` podría no ser el correcto para esta instancia.

---

## ✅ SOLUCIONES A PROBAR

### Opción 1: Probar con ec2-user (Amazon Linux)

```powershell
ssh -i "cyafibertechclave.pem" ec2-user@3.14.73.208
```

### Opción 2: Verificar en AWS Console

1. Ve a EC2 → Instances
2. Selecciona tu instancia `cyafibertech-backend`
3. Clic en "Connect" (Conectar)
4. Ahí te dirá:
   - El usuario correcto
   - El comando exacto para conectarte

### Opción 3: Verificar el Key Pair

1. En EC2 → Instances
2. Selecciona tu instancia
3. Abajo en "Details" (Detalles)
4. Busca "Key pair name"
5. Verifica que sea `cyafibertechclave` o el nombre que usaste

---

## 🚀 MÉTODO MÁS FÁCIL: Usar AWS Systems Manager Session Manager

Si tienes problemas con SSH, puedes conectarte directamente desde la consola de AWS:

1. Ve a EC2 → Instances
2. Selecciona tu instancia
3. Clic en "Connect" (Conectar)
4. Pestaña "Session Manager"
5. Clic en "Connect"

Esto te dará una terminal directamente en el servidor sin necesidad de SSH.

---

## 📝 VERIFICAR EN AWS CONSOLE

**Pasos:**

1. Ve a: https://console.aws.amazon.com/ec2/
2. Instances → Selecciona `cyafibertech-backend`
3. Clic en "Connect" (botón naranja arriba)
4. Ahí verás:
   - El usuario correcto
   - El comando exacto
   - Si el Key Pair es correcto

---

**Prueba primero con `ec2-user` y luego verifica en la consola de AWS qué usuario es el correcto.**

