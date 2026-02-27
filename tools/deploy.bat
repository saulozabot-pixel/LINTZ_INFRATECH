@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: ============================================================
::  LUX Driver — Script de Deploy Automatizado (Windows)
::  Uso: Clique duplo ou execute no terminal do VS Code
:: ============================================================

title LUX Driver — Deploy

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   🚀 LUX Driver — Deploy Automatizado   ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Ir para a raiz do projeto (pasta pai de tools/)
cd /d "%~dp0.."

echo  📁 Diretório: %CD%
echo.

:: ─────────────────────────────────────────────
:: MENU PRINCIPAL
:: ─────────────────────────────────────────────
echo  Escolha o tipo de deploy:
echo.
echo  [1] 🌐 Deploy Web (Build + Vercel)
echo  [2] 📱 Sync Android (Build + cap sync)
echo  [3] 🚀 Deploy Completo (Build + Git + Vercel)
echo  [4] 🔨 Apenas Build (sem deploy)
echo  [5] 🔄 Apenas Git Push
echo  [6] ❌ Cancelar
echo.
set /p OPCAO="  Digite a opção (1-6): "

if "%OPCAO%"=="1" goto DEPLOY_WEB
if "%OPCAO%"=="2" goto SYNC_ANDROID
if "%OPCAO%"=="3" goto DEPLOY_COMPLETO
if "%OPCAO%"=="4" goto APENAS_BUILD
if "%OPCAO%"=="5" goto APENAS_GIT
if "%OPCAO%"=="6" goto CANCELAR

echo  ❌ Opção inválida.
goto FIM

:: ─────────────────────────────────────────────
:: OPÇÃO 1: DEPLOY WEB
:: ─────────────────────────────────────────────
:DEPLOY_WEB
echo.
echo  ┌─────────────────────────────────────────┐
echo  │  🌐 Deploy Web: Build + Vercel          │
echo  └─────────────────────────────────────────┘
echo.
call :CONFIRMAR "Executar npm run build + npx vercel --prod?"
if errorlevel 1 goto CANCELAR

call :STEP_BUILD
if errorlevel 1 goto ERRO

call :STEP_VERCEL
if errorlevel 1 goto ERRO

goto SUCESSO

:: ─────────────────────────────────────────────
:: OPÇÃO 2: SYNC ANDROID
:: ─────────────────────────────────────────────
:SYNC_ANDROID
echo.
echo  ┌─────────────────────────────────────────┐
echo  │  📱 Sync Android: Build + cap sync      │
echo  └─────────────────────────────────────────┘
echo.
call :CONFIRMAR "Executar npm run build + npx cap sync android?"
if errorlevel 1 goto CANCELAR

call :STEP_BUILD
if errorlevel 1 goto ERRO

echo.
echo  📱 Sincronizando com Android...
npx cap sync android
if errorlevel 1 (
    echo  ❌ Erro no cap sync android!
    goto ERRO
)
echo  ✅ Android sincronizado!

echo.
set /p ABRIR_AS="  Deseja abrir o Android Studio? (s/n): "
if /i "%ABRIR_AS%"=="s" (
    echo  🔧 Abrindo Android Studio...
    npx cap open android
)

goto SUCESSO

:: ─────────────────────────────────────────────
:: OPÇÃO 3: DEPLOY COMPLETO
:: ─────────────────────────────────────────────
:DEPLOY_COMPLETO
echo.
echo  ┌─────────────────────────────────────────┐
echo  │  🚀 Deploy Completo: Build+Git+Vercel   │
echo  └─────────────────────────────────────────┘
echo.
call :CONFIRMAR "Executar build + git commit/push + vercel deploy?"
if errorlevel 1 goto CANCELAR

call :STEP_BUILD
if errorlevel 1 goto ERRO

call :STEP_GIT
if errorlevel 1 goto ERRO

call :STEP_VERCEL
if errorlevel 1 goto ERRO

goto SUCESSO

:: ─────────────────────────────────────────────
:: OPÇÃO 4: APENAS BUILD
:: ─────────────────────────────────────────────
:APENAS_BUILD
echo.
call :CONFIRMAR "Executar apenas npm run build?"
if errorlevel 1 goto CANCELAR

call :STEP_BUILD
if errorlevel 1 goto ERRO

goto SUCESSO

:: ─────────────────────────────────────────────
:: OPÇÃO 5: APENAS GIT
:: ─────────────────────────────────────────────
:APENAS_GIT
echo.
call :CONFIRMAR "Executar git add + commit + push?"
if errorlevel 1 goto CANCELAR

call :STEP_GIT
if errorlevel 1 goto ERRO

goto SUCESSO

:: ─────────────────────────────────────────────
:: SUBROTINAS
:: ─────────────────────────────────────────────

:STEP_BUILD
echo.
echo  🔨 Executando build (npm run build)...
echo  ─────────────────────────────────────────
npm run build
if errorlevel 1 (
    echo.
    echo  ❌ ERRO no build! Verifique os erros acima.
    exit /b 1
)
echo  ✅ Build concluído com sucesso!
exit /b 0

:STEP_GIT
echo.
echo  🔄 Preparando commit Git...
echo  ─────────────────────────────────────────
git status --short
echo.
set /p MSG_COMMIT="  Mensagem do commit (Enter para 'feat: atualização'): "
if "!MSG_COMMIT!"=="" set MSG_COMMIT=feat: atualização

git add -A
git commit -m "!MSG_COMMIT!"
if errorlevel 1 (
    echo  ⚠️  Nada para commitar ou erro no commit.
)
git push
if errorlevel 1 (
    echo  ❌ Erro no git push!
    exit /b 1
)
echo  ✅ Git push concluído!
exit /b 0

:STEP_VERCEL
echo.
echo  🚀 Fazendo deploy no Vercel (produção)...
echo  ─────────────────────────────────────────
npx vercel --prod
if errorlevel 1 (
    echo  ❌ Erro no deploy Vercel!
    exit /b 1
)
echo  ✅ Deploy Vercel concluído!
exit /b 0

:CONFIRMAR
echo  ⚡ %~1
set /p CONF="  Confirmar? (s/n): "
if /i "%CONF%"=="s" exit /b 0
if /i "%CONF%"=="sim" exit /b 0
echo  ⏭️  Operação cancelada pelo usuário.
exit /b 1

:: ─────────────────────────────────────────────
:: RESULTADOS
:: ─────────────────────────────────────────────
:SUCESSO
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   ✅ Deploy concluído com sucesso!       ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  🔗 https://lux-driver-assistent-18y8.vercel.app
echo.
goto FIM

:ERRO
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   ❌ Erro durante o processo!            ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  Verifique os erros acima e tente novamente.
echo.
goto FIM

:CANCELAR
echo.
echo  ⏹️  Operação cancelada.
echo.

:FIM
pause
endlocal
