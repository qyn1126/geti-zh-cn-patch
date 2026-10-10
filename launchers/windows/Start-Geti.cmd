@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Geti.ps1"
if errorlevel 1 pause
