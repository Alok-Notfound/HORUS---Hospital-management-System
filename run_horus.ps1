# HORUS Hospital Operations Platform - Unified Launcher
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  Starting HORUS Unified Platform on http://localhost:5000" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$baseDir\backend"

Start-Sleep -Seconds 1
Start-Process "http://localhost:5000"

python app.py
