@echo off
REM Ego Music Player — Local Android APK Build Script
echo [Ego Android] Starting Gradle APK Build...
cd /d "%~dp0"

if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo [Ego Android] Downloading Gradle wrapper...
    gradle wrapper --gradle-version 8.11.1
)

echo [Ego Android] Running assembleDebug...
call gradlew.bat :app:assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo [Ego Android] Build Successful!
    echo [Ego Android] APK Location: %~dp0app\build\outputs\apk\debug\app-debug.apk
) else (
    echo [Ego Android] Build Failed with code %ERRORLEVEL%.
)
pause
