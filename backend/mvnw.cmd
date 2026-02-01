@echo off
setlocal

rem Minimal Maven wrapper shim (no download). Requires Maven installed.
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven is not installed or not on PATH. Please install Maven or add it to PATH.
  exit /b 1
)

mvn %*
