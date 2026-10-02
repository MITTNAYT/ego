#!/usr/bin/env bash
# Ego Music Player — Android APK Build Script for macOS & Linux
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "[Ego Android] Starting Gradle APK Build..."

if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "[Ego Android] Initializing Gradle wrapper..."
    gradle wrapper --gradle-version 8.11.1
fi

chmod +x gradlew
./gradlew :app:assembleDebug --stacktrace

echo "[Ego Android] Build Successful!"
echo "[Ego Android] APK Location: $DIR/app/build/outputs/apk/debug/app-debug.apk"
