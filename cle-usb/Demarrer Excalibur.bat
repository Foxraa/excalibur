@echo off
rem Excalibur portable : tout est dans ce dossier (Node, Ollama, modele, cartable).
rem Rien n'est installe sur le PC. Fichier en ASCII pur, sans accents.
cd /d "%~dp0"
set "RACINE=%~dp0"
set "NODE=%RACINE%outils\node\node.exe"
set "OLLAMA=%RACINE%outils\ollama\ollama.exe"

rem Ollama portable : ses propres modeles et son propre port (11435),
rem pour ne jamais gener un Ollama deja installe sur ce PC.
set "OLLAMA_MODELS=%RACINE%outils\modeles"
set "OLLAMA_HOST=127.0.0.1:11435"
set "OLLAMA_LOCAL_URL=http://127.0.0.1:11435"

if not exist "%NODE%" goto incomplet
if not exist "%OLLAMA%" goto incomplet

set "OLLAMA_PID="
"%OLLAMA%" list >nul 2>&1
if not errorlevel 1 goto ollama_ok
echo Demarrage d'Ollama (la premiere fois peut prendre un moment depuis une cle USB)...
for /f %%p in ('powershell -NoProfile -Command "(Start-Process -FilePath $env:OLLAMA -ArgumentList 'serve' -WindowStyle Hidden -PassThru).Id"') do set "OLLAMA_PID=%%p"
for /l %%i in (1,1,60) do (
  timeout /t 1 /nobreak >nul
  "%OLLAMA%" list >nul 2>&1 && goto ollama_ok
)
echo Ollama ne repond pas.
goto fin
:ollama_ok

rem Lit le port dans .env (meme valeur par defaut que server.mjs)
set "PORT=3000"
if exist appli\.env for /f "usebackq tokens=1,* delims==" %%a in ("appli\.env") do (
  if /i "%%a"=="PORT" set "PORT=%%b"
)

echo Excalibur demarre sur http://localhost:%PORT%  (ferme cette fenetre pour tout arreter)
start "" /b powershell -NoProfile -Command "for($i=0;$i -lt 240;$i++){try{(New-Object Net.Sockets.TcpClient).Connect('127.0.0.1',%PORT%);Start-Process http://localhost:%PORT%;break}catch{Start-Sleep -Milliseconds 250}}"
cd appli
"%NODE%" server.mjs
cd ..
goto fin

:incomplet
echo Il manque des fichiers dans "%RACINE%outils". Recopie la cle depuis le PC d'origine.

:fin
if defined OLLAMA_PID taskkill /pid %OLLAMA_PID% /t /f >nul 2>&1
pause
