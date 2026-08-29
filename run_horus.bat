@echo off
title HORUS Hospital Operations Platform
echo =========================================================
echo   Starting HORUS Unified Platform on http://localhost:5000
echo =========================================================
echo.

cd /d "%~dp0backend"
start http://localhost:5000
python app.py

pause
