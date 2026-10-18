@echo off
title "Setup Local Domain for K-NEXUS"
echo ====================================================================
echo   Configuring Local Domain Names:
echo   - http://flowsense.local/
echo   - http://trustgraph.local/
echo   - http://k-sentinel.local/ (legacy alias)
echo   - http://wealthpilot.local/ (legacy alias)
echo ====================================================================
echo.

:: Check for Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [REQUEST ELEVATION] Requesting Administrator privilege to update hosts file...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"%~f0\"' -Verb RunAs"
    exit /b
)

set HOSTS_FILE=%WINDIR%\System32\drivers\etc\hosts

:: Check if already mapped
findstr /i "flowsense.local" "%HOSTS_FILE%" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] flowsense.local is ALREADY configured in your hosts file!
) else (
    echo. >> "%HOSTS_FILE%"
    echo # FlowSense and TrustGraph Local Domains >> "%HOSTS_FILE%"
    echo 127.0.0.1  flowsense.local >> "%HOSTS_FILE%"
    echo 127.0.0.1  trustgraph.local >> "%HOSTS_FILE%"
    echo 127.0.0.1  k-sentinel.local >> "%HOSTS_FILE%"
    echo 127.0.0.1  wealthpilot.local >> "%HOSTS_FILE%"
    echo [OK] Successfully added flowsense.local, trustgraph.local and legacy aliases to hosts!
)

ipconfig /flushdns >nul

echo.
echo ====================================================================
echo [SUCCESS] Domain setup complete!
echo You can now access the website directly via:
echo   - http://flowsense.local/         (Home Page)
echo   - http://trustgraph.local/        (TrustGraph Anti-Scam)
echo   - http://flowsense.local/app      (Interactive Dashboard)
echo   - http://localhost/
echo ====================================================================
echo.
pause
