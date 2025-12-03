@echo off
echo Creando archivo .env local para desarrollo...
echo.
echo IMPORTANTE: Este archivo contiene credenciales sensibles
echo No lo subas a Git!
echo.
(
echo # Database - AJUSTA ESTO
echo DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/fibertech?schema=public"
echo.
echo # NextAuth
echo NEXTAUTH_URL="http://localhost:3000"
echo NEXTAUTH_SECRET="GENERA_UNA_CLAVE_SECRETA_DE_AL_MENOS_32_CARACTERES"
echo.
echo # AWS S3 - ⚠️ REEMPLAZA CON TUS CREDENCIALES REALES
echo AWS_REGION="us-east-2"
echo AWS_ACCESS_KEY_ID="TU_AWS_ACCESS_KEY_ID"
echo AWS_SECRET_ACCESS_KEY="TU_AWS_SECRET_ACCESS_KEY"
echo AWS_S3_BUCKET_NAME="cyafibertech"
echo AWS_S3_BUCKET_URL="https://cyafibertech.s3.us-east-2.amazonaws.com"
echo.
echo NODE_ENV="development"
) > .env
echo.
echo ✅ Archivo .env creado!
echo.
echo ⚠️  RECUERDA:
echo    1. Ajustar DATABASE_URL con tu configuración
echo    2. Generar NEXTAUTH_SECRET (puedes usar: openssl rand -base64 32)
echo    3. NO subir este archivo a Git
pause

