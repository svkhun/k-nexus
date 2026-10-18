@echo off
title "K-NEXUS Background Launcher"
cd /d "%~dp0"

echo ========================================================
echo   K-NEXUS - Background Service Runner
echo ========================================================
echo.

:: Check if port 8000 is already active
netstat -ano | findstr :8000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Backend is ALREADY RUNNING on port 8000 and 80.
    echo Opening browser...
    start http://localhost/
    exit /b 0
)

echo Starting backend server in the background...
powershell -WindowStyle Hidden -Command "Start-Process -WindowStyle Hidden -FilePath '%~dp0.venv\Scripts\python.exe' -ArgumentList 'run.py --no-browser'"

timeout /t 2 >nul

echo [OK] Backend started successfully!
echo Opening http://localhost/ ...
start http://localhost/
exit /b 0
