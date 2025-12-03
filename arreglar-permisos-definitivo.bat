@echo off
echo ========================================
echo Arreglando permisos DEFINITIVO
echo ========================================
echo.

REM Remover herencia
echo Paso 1: Removiendo herencia...
icacls "cyafibertechclave.pem" /inheritance:r
echo.

REM Remover TODOS los permisos primero
echo Paso 2: Removiendo todos los permisos existentes...
icacls "cyafibertechclave.pem" /remove "BUILTIN\Usuarios" 2>nul
icacls "cyafibertechclave.pem" /remove "BUILTIN\Usuarios autenticados" 2>nul
icacls "cyafibertechclave.pem" /remove "Todos" 2>nul
icacls "cyafibertechclave.pem" /remove "Authenticated Users" 2>nul
icacls "cyfibertechclave.pem" /remove "Users" 2>nul
icacls "cyafibertechclave.pem" /remove "S-1-5-32-545" 2>nul
echo.

REM Dar acceso SOLO al usuario actual
echo Paso 3: Dando acceso solo al usuario actual...
icacls "cyafibertechclave.pem" /grant "%USERNAME%:R"
icacls "cyafibertechclave.pem" /grant "SYSTEM:R" 2>nul
echo.

REM Verificar
echo Paso 4: Verificando permisos...
icacls "cyafibertechclave.pem"
echo.

echo ========================================
echo Si aun ves "BUILTIN\Usuarios", usa el metodo grafico
echo ========================================
pause

