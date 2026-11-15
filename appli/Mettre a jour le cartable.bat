@echo off
rem Met le cartable a jour depuis GitHub. Les donnees, les reglages et les cles sont gardes.
rem Tout tient sur une ligne : ce fichier peut etre remplace pendant la mise a jour.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mise-a-jour.ps1" & exit /b
