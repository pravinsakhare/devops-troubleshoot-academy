@echo off
REM DevOps Troubleshooting Lab Cleanup (Windows Batch)

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "cleanup-k8s-lab.ps1"
pause
