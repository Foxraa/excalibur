@echo off
cd /d "%~dp0"

rem Sur un PC neuf, installe Node.js et Ollama avec winget (une seule fois)
where node >nul 2>&1 && goto node_ok
if exist "%ProgramFiles%\nodejs\node.exe" goto node_path
echo Node.js n'est pas installe : installation, une seule fois. Accepte la demande de Windows.
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
if not exist "%ProgramFiles%\nodejs\node.exe" goto sans_node
:node_path
set "PATH=%ProgramFiles%\nodejs;%PATH%"
:node_ok

set "OLLAMA=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"
if exist "%OLLAMA%" goto ollama_installe
echo Ollama n'est pas installe : installation, une seule fois.
winget install --id Ollama.Ollama -e --silent --accept-source-agreements --accept-package-agreements
if not exist "%OLLAMA%" goto sans_ollama
:ollama_installe

rem Demarre Ollama s'il ne tourne pas deja
"%OLLAMA%" list >nul 2>&1
if not errorlevel 1 goto ollama_ok
echo Demarrage d'Ollama...
start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe"
for /l %%i in (1,1,30) do (
  timeout /t 1 /nobreak >nul
  "%OLLAMA%" list >nul 2>&1 && goto ollama_ok
)
echo Ollama ne repond pas. Ouvre l'application Ollama puis relance ce fichier.
pause
exit /b 1
:ollama_ok

rem Lit le modele et le port dans .env (memes valeurs par defaut que server.mjs)
set "MODELE=gemma4:e4b"
set "PORT=3000"
if exist .env for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
  if /i "%%a"=="OLLAMA_MODEL" set "MODELE=%%b"
  if /i "%%a"=="PORT" set "PORT=%%b"
)

rem Telecharge le modele la premiere fois (plusieurs Go)
"%OLLAMA%" list | findstr /b /c:"%MODELE% " >nul || "%OLLAMA%" pull %MODELE%

if not exist node_modules (
  echo Installation des modules, une seule fois...
  call npm install
)
rem Ouvre le navigateur seulement quand le serveur repond (60 s max)
start "" /b powershell -NoProfile -Command "for($i=0;$i -lt 240;$i++){try{(New-Object Net.Sockets.TcpClient).Connect('127.0.0.1',%PORT%);Start-Process http://localhost:%PORT%;break}catch{Start-Sleep -Milliseconds 250}}"
node server.mjs
pause
exit /b 0

:sans_node
echo Node.js n'a pas pu etre installe. Installe la version LTS depuis https://nodejs.org puis relance ce fichier.
pause
exit /b 1

:sans_ollama
echo Ollama n'a pas pu etre installe. Installe-le depuis https://ollama.com/download puis relance ce fichier.
pause
exit /b 1
