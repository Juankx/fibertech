@echo off
echo Arreglando permisos del archivo .pem...
echo.

REM Remover herencia de permisos
icacls "cyafibertechclave.pem" /inheritance:r

REM Remover todos los permisos
icacls "cyafibertechclave.pem" /remove "BUILTIN\Usuarios"
icacls "cyafibertechclave.pem" /remove "BUILTIN\Usuarios autenticados"
icacls "cyfibertechclave.pem" /remove "Todos"

REM Dar acceso solo al usuario actual
icacls "cyafibertechclave.pem" /grant "%USERNAME%:(R)"

echo.
echo Permisos arreglados!
echo.
echo Ahora intenta conectarte con:
echo   .\conectar-ec2.bat
echo.
pause

