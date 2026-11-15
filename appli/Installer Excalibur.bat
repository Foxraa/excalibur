@echo off
rem Installe Excalibur (une seule fois) et cree l'icone Excalibur du bureau. Ensuite, on ouvre le cartable avec l'icone.
rem Sert aussi en cas de probleme : le cartable tourne alors dans cette fenetre, qui montre ce qui se passe.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0lanceur.ps1" -Installer
