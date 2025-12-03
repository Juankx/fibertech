# Script para arreglar permisos del archivo .pem en Windows
Write-Host "Arreglando permisos del archivo .pem..." -ForegroundColor Yellow

$pemFile = "cyafibertechclave.pem"

if (Test-Path $pemFile) {
    # Remover todos los permisos excepto el usuario actual
    $acl = Get-Acl $pemFile
    $permissions = $acl.Access | Where-Object { $_.IdentityReference -notlike "*$env:USERNAME*" }
    
    foreach ($permission in $permissions) {
        $acl.RemoveAccessRule($permission) | Out-Null
    }
    
    # Asegurar que solo el usuario actual tenga acceso
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $currentUser,
        "FullControl",
        "Allow"
    )
    $acl.SetAccessRule($accessRule)
    Set-Acl $pemFile $acl
    
    Write-Host "Permisos arreglados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ahora puedes conectarte con:" -ForegroundColor Cyan
    Write-Host "  .\conectar-ec2.bat" -ForegroundColor White
} else {
    Write-Host "Error: No se encontro el archivo $pemFile" -ForegroundColor Red
}

