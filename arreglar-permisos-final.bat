@echo off
echo ========================================
echo Arreglando permisos del archivo .pem
echo ========================================
echo.

REM Remover herencia de permisos
echo Paso 1: Removiendo herencia...
icacls "cyafibertechclave.pem" /inheritance:r
echo.

REM Remover permisos de grupos problemáticos
echo Paso 2: Removiendo permisos de grupos...
icacls "cyafibertechclave.pem" /remove "BUILTIN\Usuarios" 2>nul
icacls "cyafibertechclave.pem" /remove "BUILTIN\Usuarios autenticados" 2>nul
icacls "cyafibertechclave.pem" /remove "Todos" 2>nul
icacls "cyafibertechclave.pem" /remove "Authenticated Users" 2>nul
echo.

REM Dar acceso solo al usuario actual (sin paréntesis)
echo Paso 3: Configurando permisos del usuario actual...
icacls "cyafibertechclave.pem" /grant "%USERNAME%:R"
echo.

REM Verificar permisos
echo Paso 4: Verificando permisos finales...
icacls "cyafibertechclave.pem"
echo.

echo ========================================
echo Permisos configurados!
echo ========================================
echo.
echo Ahora intenta conectarte con:
echo   .\conectar-ec2.bat
echo.
pause

