$pythonPath = "C:\Users\SAULO\AppData\Local\Programs\Python\Python312"
$scriptsPath = "C:\Users\SAULO\AppData\Local\Programs\Python\Python312\Scripts"

$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($currentPath -notlike "*Python312*") {
    $newPath = $pythonPath + ";" + $scriptsPath + ";" + $currentPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "PATH atualizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Python312 ja esta no PATH do usuario" -ForegroundColor Yellow
}

# Atualiza PATH da sessao atual
$env:PATH = $pythonPath + ";" + $scriptsPath + ";" + $env:PATH

# Testa Python
Write-Host ""
Write-Host "Testando Python..." -ForegroundColor Cyan
& "$pythonPath\python.exe" --version

# Testa pip
Write-Host ""
Write-Host "Testando pip..." -ForegroundColor Cyan
& "$pythonPath\Scripts\pip.exe" --version

# Verifica open-interpreter
Write-Host ""
Write-Host "Verificando open-interpreter..." -ForegroundColor Cyan
$pipShow = & "$pythonPath\Scripts\pip.exe" show open-interpreter 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "open-interpreter nao instalado. Instalando..." -ForegroundColor Yellow
    & "$pythonPath\Scripts\pip.exe" install open-interpreter
} else {
    Write-Host "open-interpreter ja instalado!" -ForegroundColor Green
    Write-Host $pipShow
}
