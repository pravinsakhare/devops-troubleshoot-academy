@echo off
REM DevOps Troubleshooting Lab Setup (Windows Batch)
REM This script runs the PowerShell setup script

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "setup-k8s-lab.ps1"
pause
