# 🔧 SOLUCIÓN DEFINITIVA: Permisos del archivo .pem

## ⚠️ PROBLEMA
SSH en Windows requiere que el archivo `.pem` tenga permisos muy restrictivos. El grupo "BUILTIN\Usuarios" NO debe tener acceso.

## ✅ SOLUCIÓN RECOMENDADA: Método Gráfico

Este es el método más confiable:

### Pasos:

1. **Clic derecho** en `cyafibertechclave.pem` → **Propiedades**

2. Pestaña **"Seguridad"** → Clic en **"Opciones avanzadas"**

3. **Desactiva** "Heredar del objeto principal" (si está activado)
   - Clic en "Cambiar" si te pide confirmación

4. **Elimina TODOS los usuarios/grupos** excepto:
   - Tu usuario (`SUNNY\Elfit` o `Elfit`) - debe tener solo "Lectura"
   - `SYSTEM` - puede quedarse con "Lectura"

5. **IMPORTANTE:** Asegúrate de eliminar:
   - ❌ `BUILTIN\Usuarios`
   - ❌ `Usuarios autenticados`
   - ❌ `Todos`
   - ❌ Cualquier otro grupo

6. **Aplica** los cambios

7. **Verifica** que solo queden:
   - Tu usuario con "Lectura"
   - SYSTEM (opcional)

---

## 🔄 Alternativa: Comando Manual

Si prefieres usar comandos, ejecuta esto en PowerShell **como Administrador**:

```powershell
# 1. Remover herencia
icacls "cyafibertechclave.pem" /inheritance:r

# 2. Remover el grupo problemático por su SID
icacls "cyafibertechclave.pem" /remove "S-1-5-32-545"

# 3. Dar acceso solo a tu usuario
icacls "cyafibertechclave.pem" /grant "SUNNY\Elfit:R"

# 4. Verificar
icacls "cyafibertechclave.pem"
```

**Nota:** Ejecuta PowerShell como Administrador (clic derecho → "Ejecutar como administrador")

---

## 🧪 Probar Conexión

Después de arreglar permisos:

```powershell
.\conectar-ec2.bat
```

O directamente:

```powershell
ssh -i "cyafibertechclave.pem" ubuntu@3.14.73.208
```

---

## ❓ Si Aún No Funciona

1. **Verifica que el archivo no esté en OneDrive** (puede causar problemas)
   - Mueve el archivo a `C:\Users\Elfit\` temporalmente

2. **Ejecuta PowerShell como Administrador**

3. **Verifica los permisos finales:**
   ```powershell
   icacls "cyafibertechclave.pem"
   ```
   
   Debe mostrar solo tu usuario, NO debe aparecer "BUILTIN\Usuarios"

---

**Recomendación:** Usa el método gráfico, es el más confiable.

