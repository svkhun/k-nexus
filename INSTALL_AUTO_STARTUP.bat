@echo off
title Install Auto-Startup (K-NEXUS)
echo =================================================================
echo   Configuring Automatic Windows Startup for Backend Engine
echo =================================================================
echo.

powershell -Command "$startup = [Environment]::GetFolderPath('Startup'); if (Test-Path ($startup + '\KSentinel_WealthPilot.lnk')) { Remove-Item ($startup + '\KSentinel_WealthPilot.lnk') -Force }; $s=(New-Object -COM WScript.Shell).CreateShortcut($startup + '\FlowSense_TrustGraph.lnk'); $s.TargetPath='%~dp0RUN_SILENT_SERVICE.vbs'; $s.WorkingDirectory='%~dp0'; $s.Save()"

echo.
echo [SUCCESS] Successfully added to Windows Startup!
echo The backend server will now start automatically whenever your computer boots up.
echo You never need to enter any commands manually again.
echo.
pause
