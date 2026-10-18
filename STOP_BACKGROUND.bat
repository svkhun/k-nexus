@echo off
title "Stop K-NEXUS Backend"
echo Stopping backend server on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /T /PID %%a
echo [OK] Backend stopped.
timeout /t 2 >nul
