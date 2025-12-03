@echo off
echo ========================================
echo Verificando conexion a EC2
echo ========================================
echo.

echo Probando con usuario ubuntu...
ssh -i "cyafibertechclave.pem" -v ubuntu@3.14.73.208
echo.

echo Si falla, prueba con ec2-user (Amazon Linux):
echo ssh -i "cyafibertechclave.pem" ec2-user@3.14.73.208
echo.

pause

