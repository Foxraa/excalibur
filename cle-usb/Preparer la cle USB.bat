@echo off
rem Copie Excalibur et Ollama sur une cle USB (exFAT ou NTFS, 16 Go ou plus).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0preparer-cle.ps1" %*
pause
