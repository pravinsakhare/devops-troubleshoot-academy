@echo off
REM DevOps Troubleshooting Scenario Reset (Windows Batch)

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "reset-scenario.ps1"
pause
