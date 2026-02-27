# ============================================================
#  LUX Driver — Desktop Agent (PowerShell)
#  Controla apps Windows, navegadores e automações do sistema
#  Uso: .\tools\desktop-agent.ps1
# ============================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.VisualBasic

$projectRoot = "c:\Users\SAULO\AndroidStudioProjects\Lux"

# ─────────────────────────────────────────────
# FUNÇÕES UTILITÁRIAS
# ─────────────────────────────────────────────

function Write-Header {
    param([string]$title)
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║  $title" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-OK   { param([string]$m) Write-Host "  ✅ $m" -ForegroundColor Green }
function Write-Fail { param([string]$m) Write-Host "  ❌ $m" -ForegroundColor Red }
function Write-Info { param([string]$m) Write-Host "  ℹ️  $m" -ForegroundColor Cyan }
function Write-Warn { param([string]$m) Write-Host "  ⚠️  $m" -ForegroundColor Yellow }

function Wait-Key {
    Write-Host ""
    Read-Host "  Pressione Enter para continuar"
}

# ─────────────────────────────────────────────
# ABRIR APLICATIVOS
# ─────────────────────────────────────────────

function Open-App {
    param([string]$appName, [string]$args = "")
    try {
        if ($args) { Start-Process $appName $args }
        else { Start-Process $appName }
        Write-OK "Abrindo: $appName"
    } catch {
        Write-Fail "Não foi possível abrir: $appName — $_"
    }
}

function Open-Chrome-URL {
    param([string]$url)
    $chromePaths = @(
        "C:\Program Files\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    $chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($chrome) {
        Start-Process $chrome $url
        Write-OK "Chrome aberto: $url"
    } else {
        # Fallback: usar o browser padrão
        Start-Process $url
        Write-OK "Browser padrão aberto: $url"
    }
}

# ─────────────────────────────────────────────
# MENU PRINCIPAL
# ─────────────────────────────────────────────

function Show-Menu {
    Write-Header "🖥️  LUX Desktop Agent — Controle do Sistema  "
    Write-Host "  Escolha uma categoria:" -ForegroundColor White
    Write-Host ""
    Write-Host "  ── 🌐 BROWSER ──────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  [1] Abrir site LUX no Chrome" -ForegroundColor Cyan
    Write-Host "  [2] Abrir URL personalizada" -ForegroundColor Cyan
    Write-Host "  [3] Abrir Vercel Dashboard" -ForegroundColor Cyan
    Write-Host "  [4] Abrir GitHub do projeto" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  ── 💻 DESENVOLVIMENTO ──────────────────────" -ForegroundColor DarkGray
    Write-Host "  [5] Abrir VS Code (projeto LUX)" -ForegroundColor Cyan
    Write-Host "  [6] Abrir Android Studio" -ForegroundColor Cyan
    Write-Host "  [7] Abrir terminal no projeto" -ForegroundColor Cyan
    Write-Host "  [8] Abrir pasta do projeto no Explorer" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  ── 🤖 AUTOMAÇÃO ────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  [9]  Executar Browser Agent (Puppeteer)" -ForegroundColor Green
    Write-Host "  [10] Screenshot do site LUX" -ForegroundColor Green
    Write-Host "  [11] Testar deploy Vercel" -ForegroundColor Green
    Write-Host "  [12] Deploy completo (build+git+vercel)" -ForegroundColor Green
    Write-Host ""
    Write-Host "  ── 📁 ARQUIVOS ─────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  [13] Abrir pasta tools/" -ForegroundColor Cyan
    Write-Host "  [14] Abrir GUIA.html no browser" -ForegroundColor Cyan
    Write-Host "  [15] Abrir Admin Dashboard" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  ── 🔧 SISTEMA ──────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  [16] Informações do sistema" -ForegroundColor DarkCyan
    Write-Host "  [17] Processos Node.js ativos" -ForegroundColor DarkCyan
    Write-Host "  [18] Matar processos Node.js" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  [0] ❌ Sair" -ForegroundColor DarkGray
    Write-Host ""
}

# ─────────────────────────────────────────────
# AÇÕES
# ─────────────────────────────────────────────

function Action-BrowserLux {
    Open-Chrome-URL "https://lux-driver-assistent-18y8.vercel.app"
}

function Action-BrowserCustom {
    $url = Read-Host "  URL para abrir"
    if ($url) { Open-Chrome-URL $url }
}

function Action-Vercel {
    Open-Chrome-URL "https://vercel.com/dashboard"
}

function Action-GitHub {
    Open-Chrome-URL "https://github.com/saulozabot-pixel/LuxDriverAssistent"
}

function Action-VSCode {
    try {
        Start-Process "code" $projectRoot
        Write-OK "VS Code aberto no projeto LUX"
    } catch {
        Write-Fail "VS Code não encontrado no PATH. Abra manualmente."
    }
}

function Action-AndroidStudio {
    $asPaths = @(
        "$env:LOCALAPPDATA\Programs\Android Studio\bin\studio64.exe",
        "C:\Program Files\Android\Android Studio\bin\studio64.exe",
        "$env:USERPROFILE\AppData\Local\Programs\Android Studio\bin\studio64.exe"
    )
    $as = $asPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($as) {
        Start-Process $as "$projectRoot\android"
        Write-OK "Android Studio aberto"
    } else {
        Write-Fail "Android Studio não encontrado. Verifique a instalação."
    }
}

function Action-Terminal {
    Start-Process "wt" "-d `"$projectRoot`"" -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -ne 0) {
        Start-Process "cmd" "/k cd /d `"$projectRoot`""
    }
    Write-OK "Terminal aberto no projeto"
}

function Action-Explorer {
    Start-Process "explorer" $projectRoot
    Write-OK "Explorer aberto"
}

function Action-BrowserAgent {
    Write-Info "Iniciando Browser Agent (Puppeteer)..."
    Set-Location $projectRoot
    node tools/agents/browser-agent.js
}

function Action-Screenshot {
    Write-Info "Tirando screenshot do site LUX..."
    Set-Location $projectRoot
    node tools/agents/quick-screenshot.js
}

function Action-TestDeploy {
    Write-Info "Testando deploy Vercel..."
    Set-Location $projectRoot
    node tools/agents/browser-agent.js
}

function Action-DeployCompleto {
    Write-Info "Iniciando deploy completo..."
    Set-Location $projectRoot
    & "$projectRoot\tools\deploy.ps1"
}

function Action-OpenTools {
    Start-Process "explorer" "$projectRoot\tools"
    Write-OK "Pasta tools/ aberta"
}

function Action-OpenGuia {
    Start-Process "$projectRoot\tools\GUIA.html"
    Write-OK "GUIA.html aberto no browser"
}

function Action-OpenDashboard {
    Start-Process "$projectRoot\tools\admin-dashboard.html"
    Write-OK "Admin Dashboard aberto"
}

function Action-SysInfo {
    Write-Header "🔧 Informações do Sistema                    "
    $os = Get-CimInstance Win32_OperatingSystem
    $cpu = Get-CimInstance Win32_Processor
    $ram = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
    $ramFree = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
    $disk = Get-PSDrive C | Select-Object Used, Free
    $diskUsed = [math]::Round($disk.Used / 1GB, 1)
    $diskFree = [math]::Round($disk.Free / 1GB, 1)

    Write-Host "  OS:       $($os.Caption)" -ForegroundColor White
    Write-Host "  CPU:      $($cpu.Name)" -ForegroundColor White
    Write-Host "  RAM:      ${ram}GB total | ${ramFree}GB livre" -ForegroundColor White
    Write-Host "  Disco C:  ${diskUsed}GB usado | ${diskFree}GB livre" -ForegroundColor White
    Write-Host ""

    # Versões de ferramentas
    $nodeVer = (node --version 2>&1)
    $npmVer = (npm --version 2>&1)
    $gitVer = (git --version 2>&1)

    Write-Host "  Node.js:  $nodeVer" -ForegroundColor Cyan
    Write-Host "  npm:      $npmVer" -ForegroundColor Cyan
    Write-Host "  Git:      $gitVer" -ForegroundColor Cyan

    $pythonVer = (python --version 2>&1)
    if ($pythonVer -match "Python") {
        Write-Host "  Python:   $pythonVer" -ForegroundColor Cyan
    } else {
        Write-Host "  Python:   ❌ Não instalado" -ForegroundColor Yellow
    }
    Write-Host ""
}

function Action-NodeProcesses {
    Write-Header "⚙️  Processos Node.js Ativos                 "
    $procs = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($procs) {
        $procs | Format-Table Id, CPU, WorkingSet, StartTime -AutoSize
    } else {
        Write-Info "Nenhum processo Node.js ativo."
    }
}

function Action-KillNode {
    $procs = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($procs) {
        $count = $procs.Count
        $procs | Stop-Process -Force
        Write-OK "$count processo(s) Node.js encerrado(s)"
    } else {
        Write-Info "Nenhum processo Node.js para encerrar."
    }
}

# ─────────────────────────────────────────────
# LOOP PRINCIPAL
# ─────────────────────────────────────────────

while ($true) {
    Show-Menu
    $opcao = Read-Host "  Digite a opção"

    switch ($opcao.Trim()) {
        "1"  { Action-BrowserLux }
        "2"  { Action-BrowserCustom }
        "3"  { Action-Vercel }
        "4"  { Action-GitHub }
        "5"  { Action-VSCode }
        "6"  { Action-AndroidStudio }
        "7"  { Action-Terminal }
        "8"  { Action-Explorer }
        "9"  { Action-BrowserAgent }
        "10" { Action-Screenshot }
        "11" { Action-TestDeploy }
        "12" { Action-DeployCompleto }
        "13" { Action-OpenTools }
        "14" { Action-OpenGuia }
        "15" { Action-OpenDashboard }
        "16" { Action-SysInfo; Wait-Key }
        "17" { Action-NodeProcesses; Wait-Key }
        "18" { Action-KillNode }
        "0"  {
            Write-Host ""
            Write-Host "  👋 Desktop Agent encerrado." -ForegroundColor DarkGray
            Write-Host ""
            exit
        }
        default { Write-Warn "Opção inválida: $opcao" }
    }

    Write-Host ""
    Start-Sleep -Milliseconds 500
}
