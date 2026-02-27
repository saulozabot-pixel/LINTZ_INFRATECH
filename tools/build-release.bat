@echo off
echo ========================================
echo   LUX DRIVER - BUILD RELEASE AAB
echo ========================================
echo.

:: Configurar JAVA_HOME (JDK do Android Studio)
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%
echo [INFO] JAVA_HOME=%JAVA_HOME%
echo.

echo [1/3] Buildando frontend (Vite)...
cd /d c:\Users\SAULO\AndroidStudioProjects\Lux
call npm run build
if %errorlevel% neq 0 (
    echo ERRO no build do frontend!
    pause
    exit /b 1
)
echo [OK] Frontend buildado com sucesso!
echo.

echo [2/3] Sincronizando com Android (Capacitor)...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERRO no cap sync!
    pause
    exit /b 1
)
echo [OK] Sincronizado com sucesso!
echo.

echo [3/3] Gerando AAB Release via Gradle...
cd android
call gradlew.bat bundleRelease
if %errorlevel% neq 0 (
    echo ERRO no build do AAB!
    pause
    exit /b 1
)
echo.
echo ========================================
echo   BUILD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Arquivo gerado em:
echo   android\app\build\outputs\bundle\release\app-release.aab
echo.
pause
