# ============================================================
#  LUX Driver — Open Interpreter Launcher
#  Agente IA que controla o computador via linguagem natural
#  Uso: .\tools\agents\run-interpreter.ps1
# ============================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Garantir que Python está no PATH desta sessão
$env:Path = "C:\Users\SAULO\AppData\Local\Programs\Python\Python312;C:\Users\SAULO\AppData\Local\Programs\Python\Python312\Scripts;" + $env:Path

$interpreterExe = "C:\Users\SAULO\AppData\Local\Programs\Python\Python312\Scripts\interpreter.exe"
$pythonExe     = "C:\Users\SAULO\AppData\Local\Programs\Python\Python312\python.exe"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "  ║   🤖 Open Interpreter — Agente IA       ║" -ForegroundColor Magenta
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "  O Open Interpreter permite controlar seu computador" -ForegroundColor White
Write-Host "  usando linguagem natural (português funciona!)." -ForegroundColor White
Write-Host ""
Write-Host "  Exemplos de comandos que você pode dar:" -ForegroundColor DarkGray
Write-Host "  • 'Tire um screenshot do site LUX'" -ForegroundColor DarkGray
Write-Host "  • 'Execute npm run build e me diga se teve erros'" -ForegroundColor DarkGray
Write-Host "  • 'Abra o Chrome no Vercel Dashboard'" -ForegroundColor DarkGray
Write-Host "  • 'Crie um PDF da página de pitch deck'" -ForegroundColor DarkGray
Write-Host ""

# Verificar se há chave de API configurada
$hasOpenAI     = $env:OPENAI_API_KEY -ne $null -and $env:OPENAI_API_KEY -ne ""
$hasAnthropic  = $env:ANTHROPIC_API_KEY -ne $null -and $env:ANTHROPIC_API_KEY -ne ""

Write-Host "  ── Configuração de API ──────────────────────" -ForegroundColor DarkGray
if ($hasOpenAI) {
    Write-Host "  ✅ OPENAI_API_KEY configurada" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  OPENAI_API_KEY não configurada" -ForegroundColor Yellow
}
if ($hasAnthropic) {
    Write-Host "  ✅ ANTHROPIC_API_KEY configurada" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  ANTHROPIC_API_KEY não configurada" -ForegroundColor Yellow
}
Write-Host ""

# Menu de modelos
Write-Host "  Escolha o modelo:" -ForegroundColor White
Write-Host "  [1] 🌐 GPT-4o (OpenAI) — requer OPENAI_API_KEY" -ForegroundColor Cyan
Write-Host "  [2] 🧠 Claude 3.5 (Anthropic) — requer ANTHROPIC_API_KEY" -ForegroundColor Cyan
Write-Host "  [3] 🦙 Llama3 local (Ollama) — GRATUITO, sem internet" -ForegroundColor Green
Write-Host "  [4] 🔧 Modo seguro (pede confirmação antes de executar)" -ForegroundColor Yellow
Write-Host "  [5] 📖 Ver guia de configuração" -ForegroundColor DarkCyan
Write-Host "  [0] ❌ Cancelar" -ForegroundColor DarkGray
Write-Host ""

$opcao = Read-Host "  Escolha (1-5)"

switch ($opcao.Trim()) {
    "1" {
        if (-not $hasOpenAI) {
            Write-Host ""
            Write-Host "  ⚠️  Configure sua chave OpenAI primeiro:" -ForegroundColor Yellow
            Write-Host "  setx OPENAI_API_KEY 'sua-chave-aqui'" -ForegroundColor White
            Write-Host "  Obtenha em: https://platform.openai.com/api-keys" -ForegroundColor Cyan
            Write-Host ""
            $key = Read-Host "  Ou cole sua chave agora (Enter para pular)"
            if ($key) {
                $env:OPENAI_API_KEY = $key
                [System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $key, "User")
                Write-Host "  ✅ Chave salva!" -ForegroundColor Green
            }
        }
        Write-Host ""
        Write-Host "  🚀 Iniciando com GPT-4o..." -ForegroundColor Cyan
        Write-Host "  (Digite 'exit' para sair)" -ForegroundColor DarkGray
        Write-Host ""
        & $interpreterExe --model gpt-4o
    }
    "2" {
        if (-not $hasAnthropic) {
            Write-Host ""
            Write-Host "  ⚠️  Configure sua chave Anthropic primeiro:" -ForegroundColor Yellow
            Write-Host "  Obtenha em: https://console.anthropic.com/" -ForegroundColor Cyan
            Write-Host ""
            $key = Read-Host "  Ou cole sua chave agora (Enter para pular)"
            if ($key) {
                $env:ANTHROPIC_API_KEY = $key
                [System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $key, "User")
                Write-Host "  ✅ Chave salva!" -ForegroundColor Green
            }
        }
        Write-Host ""
        Write-Host "  🚀 Iniciando com Claude 3.5 Sonnet..." -ForegroundColor Cyan
        Write-Host "  (Digite 'exit' para sair)" -ForegroundColor DarkGray
        Write-Host ""
        & $interpreterExe --model claude-3-5-sonnet-20241022
    }
    "3" {
        $ollamaCheck = Get-Command ollama -ErrorAction SilentlyContinue
        if (-not $ollamaCheck) {
            Write-Host ""
            Write-Host "  ⚠️  Ollama não está instalado." -ForegroundColor Yellow
            Write-Host "  Instalando Ollama..." -ForegroundColor Cyan
            winget install Ollama.Ollama --accept-package-agreements --accept-source-agreements
            Write-Host "  Após instalar, execute: ollama pull llama3.2" -ForegroundColor White
            Write-Host "  Depois rode este script novamente." -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "  🚀 Iniciando com Llama3 (local)..." -ForegroundColor Green
            Write-Host "  (Digite 'exit' para sair)" -ForegroundColor DarkGray
            Write-Host ""
            & $interpreterExe --model ollama/llama3.2
        }
    }
    "4" {
        Write-Host ""
        Write-Host "  🔒 Modo seguro — pede confirmação antes de executar" -ForegroundColor Yellow
        $model = Read-Host "  Modelo (Enter = gpt-4o)"
        if (-not $model) { $model = "gpt-4o" }
        Write-Host ""
        & $interpreterExe --model $model --safe_mode ask
    }
    "5" {
        Write-Host ""
        Write-Host "  📖 Abrindo guia de configuração..." -ForegroundColor Cyan
        $guiaPath = "C:\Users\SAULO\AndroidStudioProjects\Lux\tools\agents\open-interpreter-setup.md"
        if (Get-Command code -ErrorAction SilentlyContinue) {
            code $guiaPath
        } else {
            notepad $guiaPath
        }
    }
    "0" {
        Write-Host "  ⏹️  Cancelado." -ForegroundColor DarkGray
    }
    default {
        Write-Host "  ❌ Opção inválida." -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "  Pressione Enter para fechar"
