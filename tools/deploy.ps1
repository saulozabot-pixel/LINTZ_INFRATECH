# ============================================================
#  LUX Driver — Script de Deploy PowerShell (Windows)
#  Uso: Clique direito → "Executar com PowerShell"
#       Ou no terminal VS Code: .\tools\deploy.ps1
# ============================================================

# Configurar encoding para UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Ir para a raiz do projeto
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "..")
$projectRoot = Get-Location

# ─────────────────────────────────────────────
# FUNÇÕES UTILITÁRIAS
# ─────────────────────────────────────────────

function Write-Header {
    param([string]$title)
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "  ║  $title" -ForegroundColor Yellow
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
}

function Write-Step {
    param([string]$msg)
    Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  $msg" -ForegroundColor Cyan
    Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkGray
}

function Write-Success {
    param([string]$msg)
    Write-Host "  ✅ $msg" -ForegroundColor Green
}

function Write-Fail {
    param([string]$msg)
    Write-Host "  ❌ $msg" -ForegroundColor Red
}

function Write-Warn {
    param([string]$msg)
    Write-Host "  ⚠️  $msg" -ForegroundColor Yellow
}

function Confirm-Action {
    param([string]$question)
    $resp = Read-Host "  ⚡ $question (s/n)"
    return ($resp -eq "s" -or $resp -eq "S" -or $resp -eq "sim" -or $resp -eq "Sim")
}

function Invoke-Step {
    param(
        [string]$label,
        [scriptblock]$action
    )
    Write-Step $label
    try {
        & $action
        if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
            throw "Comando retornou código $LASTEXITCODE"
        }
        Write-Success "$label concluído!"
        return $true
    }
    catch {
        Write-Fail "Erro em: $label"
        Write-Host "  Detalhe: $_" -ForegroundColor DarkRed
        return $false
    }
}

# ─────────────────────────────────────────────
# STEPS INDIVIDUAIS
# ─────────────────────────────────────────────

function Step-Build {
    return Invoke-Step "🔨 Build Web (npm run build)" {
        npm run build
    }
}

function Step-Git {
    Write-Step "🔄 Git Status"
    git status --short
    Write-Host ""
    
    $msg = Read-Host "  Mensagem do commit (Enter = 'feat: atualização')"
    if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "feat: atualização" }
    
    git add -A
    $commitResult = git commit -m $msg 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Nada para commitar ou erro no commit: $commitResult"
    } else {
        Write-Success "Commit criado: $msg"
    }
    
    return Invoke-Step "📤 Git Push" {
        git push
    }
}

function Step-Vercel {
    return Invoke-Step "🚀 Deploy Vercel (--prod)" {
        npx vercel --prod
    }
}

function Step-CapSync {
    $ok = Invoke-Step "📱 Capacitor Sync Android" {
        npx cap sync android
    }
    
    if ($ok) {
        if (Confirm-Action "Abrir Android Studio?") {
            Write-Step "🔧 Abrindo Android Studio..."
            npx cap open android
        }
    }
    return $ok
}

function Step-BuildArquitetura {
    return Invoke-Step "📊 Build Arquitetura (sub-app React)" {
        Set-Location "docs/arquitetura-solucao"
        npm install
        npm run build
        Set-Location $projectRoot
    }
}

# ─────────────────────────────────────────────
# MENU PRINCIPAL
# ─────────────────────────────────────────────

Write-Header "🚀 LUX Driver — Deploy Automatizado     "
Write-Host "  📁 Projeto: $projectRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Escolha o tipo de deploy:" -ForegroundColor White
Write-Host ""
Write-Host "  [1] 🌐 Deploy Web (Build + Vercel)" -ForegroundColor Cyan
Write-Host "  [2] 📱 Sync Android (Build + cap sync)" -ForegroundColor Cyan
Write-Host "  [3] 🚀 Deploy Completo (Build + Git + Vercel)" -ForegroundColor Green
Write-Host "  [4] 🔨 Apenas Build" -ForegroundColor DarkCyan
Write-Host "  [5] 🔄 Apenas Git Push" -ForegroundColor DarkCyan
Write-Host "  [6] 📊 Build Arquitetura (sub-app)" -ForegroundColor DarkCyan
Write-Host "  [7] ❌ Cancelar" -ForegroundColor DarkGray
Write-Host ""

$opcao = Read-Host "  Digite a opção (1-7)"

$sucesso = $false

switch ($opcao) {
    "1" {
        Write-Header "🌐 Deploy Web: Build + Vercel            "
        if (Confirm-Action "Executar Build + Deploy Vercel?") {
            $ok1 = Step-Build
            if ($ok1) { $sucesso = Step-Vercel }
        }
    }
    "2" {
        Write-Header "📱 Sync Android: Build + cap sync        "
        if (Confirm-Action "Executar Build + Sync Android?") {
            $ok1 = Step-Build
            if ($ok1) { $sucesso = Step-CapSync }
        }
    }
    "3" {
        Write-Header "🚀 Deploy Completo: Build + Git + Vercel "
        if (Confirm-Action "Executar pipeline completo?") {
            $ok1 = Step-Build
            if ($ok1) {
                $ok2 = Step-Git
                if ($ok2) { $sucesso = Step-Vercel }
            }
        }
    }
    "4" {
        Write-Header "🔨 Apenas Build                          "
        if (Confirm-Action "Executar npm run build?") {
            $sucesso = Step-Build
        }
    }
    "5" {
        Write-Header "🔄 Apenas Git Push                       "
        if (Confirm-Action "Executar git commit + push?") {
            $sucesso = Step-Git
        }
    }
    "6" {
        Write-Header "📊 Build Arquitetura                     "
        if (Confirm-Action "Compilar sub-app docs/arquitetura-solucao?") {
            $sucesso = Step-BuildArquitetura
        }
    }
    "7" {
        Write-Host "  ⏹️  Cancelado." -ForegroundColor DarkGray
    }
    default {
        Write-Fail "Opção inválida: $opcao"
    }
}

# ─────────────────────────────────────────────
# RESULTADO FINAL
# ─────────────────────────────────────────────

Write-Host ""
if ($sucesso) {
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║   ✅ Processo concluído com sucesso!     ║" -ForegroundColor Green
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "  🔗 https://lux-driver-assistent-18y8.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor DarkGray
    Write-Host "  ║   ⏹️  Processo encerrado.                ║" -ForegroundColor DarkGray
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor DarkGray
}

Write-Host ""
Read-Host "  Pressione Enter para fechar"
