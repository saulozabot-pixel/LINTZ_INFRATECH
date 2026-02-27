$ollamaPath = "C:\Users\SAULO\AppData\Local\Programs\Ollama"

$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($currentPath -notlike "*Ollama*") {
    $newPath = $ollamaPath + ";" + $currentPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "Ollama adicionado ao PATH permanentemente!" -ForegroundColor Green
} else {
    Write-Host "Ollama ja esta no PATH do usuario" -ForegroundColor Yellow
}

# Atualiza PATH da sessao atual
$env:PATH = $ollamaPath + ";" + $env:PATH

# Testa
Write-Host ""
Write-Host "Testando Ollama..." -ForegroundColor Cyan
& "$ollamaPath\ollama.exe" --version

# Baixar modelo llama3.2 (menor e mais rapido que llama3)
Write-Host ""
Write-Host "Baixando modelo llama3.2 (~2GB)..." -ForegroundColor Cyan
Write-Host "Isso pode demorar alguns minutos..." -ForegroundColor Yellow
& "$ollamaPath\ollama.exe" pull llama3.2
