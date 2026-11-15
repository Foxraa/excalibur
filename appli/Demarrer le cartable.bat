@echo off
cd /d "%~dp0"

rem Sur un PC neuf, installe Node.js avec winget, puis demarre Ollama si l'IA tourne sur ce PC
rem (s'il n'est pas installe, c'est la page du cartable qui propose de l'installer)
where node >nul 2>&1 && goto node_ok
if exist "%ProgramFiles%\nodejs\node.exe" goto node_path
echo Node.js n'est pas installe : installation, une seule fois. Accepte la demande de Windows.
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
if not exist "%ProgramFiles%\nodejs\node.exe" goto sans_node
:node_path
set "PATH=%ProgramFiles%\nodejs;%PATH%"
:node_ok

rem Premier lancement : ou tourne l'IA ? (se change ensuite dans l'espace parents)
if exist .env goto choix_fait
:choix
echo.
echo Quelle IA pour le cartable ?
echo   1 = Ollama sur ce PC : gratuit, rien ne sort de la maison, plusieurs Go a telecharger
echo   2 = Claude : payant, avec une cle API, les donnees partent chez Anthropic
echo   3 = Mistral : payant et moins cher, avec une cle API, les donnees partent chez Mistral AI
choice /c 123 /n /m "Ton choix (1, 2 ou 3) : "
if errorlevel 3 goto choix_mistral
if errorlevel 2 goto choix_claude
> .env echo IA=ollama
goto choix_fait
:choix_claude
> .env echo IA=claude
echo La cle API se colle dans le cartable, a l'etape "L'IA du cartable".
goto choix_fait
:choix_mistral
> .env echo IA=mistral
echo La cle API se colle dans le cartable, a l'etape "L'IA du cartable".
:choix_fait

rem Code 43 (bouton Redemarrer de l'espace parents) : on revient ici, .env a pu changer
:redemarrer
rem Lit les reglages dans .env (memes valeurs par defaut que server.mjs)
set "MODELE=gemma4:e4b"
set "PORT=3000"
set "CHOIX_IA="
set "CHOIX_QUICK="
set "ADRESSE="
set "CLE="
if exist .env for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
  if /i "%%a"=="OLLAMA_MODEL" set "MODELE=%%b"
  if /i "%%a"=="PORT" set "PORT=%%b"
  if /i "%%a"=="IA" set "CHOIX_IA=%%b"
  if /i "%%a"=="IA_QUICK" set "CHOIX_QUICK=%%b"
  if /i "%%a"=="OLLAMA_URL" set "ADRESSE=%%b"
  if /i "%%a"=="ANTHROPIC_API_KEY" set "CLE=%%b"
)
if not defined CHOIX_IA if defined CLE set "CHOIX_IA=claude"
if not defined CHOIX_IA set "CHOIX_IA=ollama"
if not defined CHOIX_QUICK set "CHOIX_QUICK=%CHOIX_IA%"

rem Rien a faire ici pour Ollama si l'IA tourne ailleurs (OLLAMA_URL vers un autre PC, mis a la main dans .env)
rem Claude et Mistral tournent en ligne : pas besoin d'Ollama
if /i not "%CHOIX_IA%"=="ollama" if /i not "%CHOIX_QUICK%"=="ollama" goto lancer
if not defined ADRESSE goto ollama_ici
echo %ADRESSE%| findstr /i "localhost 127.0.0.1" >nul || goto lancer
:ollama_ici

set "OLLAMA=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"
rem Pas d'Ollama : le cartable s'ouvre et demande dans la page s'il faut l'installer
if not exist "%OLLAMA%" goto lancer

rem Demarre Ollama s'il ne tourne pas deja
"%OLLAMA%" list >nul 2>&1
if not errorlevel 1 goto ollama_ok
echo Demarrage d'Ollama...
start "" "%LOCALAPPDATA%\Programs\Ollama\ollama app.exe"
for /l %%i in (1,1,30) do (
  timeout /t 1 /nobreak >nul
  "%OLLAMA%" list >nul 2>&1 && goto ollama_ok
)
rem Lance par l'icone (cache) : le cartable s'ouvre quand meme, sans IA, plutot que d'attendre une touche invisible
if defined EXCALIBUR_CACHE goto lancer
echo Ollama ne repond pas. Ouvre l'application Ollama puis relance ce fichier.
pause
exit /b 1
:ollama_ok

rem Telecharge le modele la premiere fois (plusieurs Go). Cache : dans une fenetre a part, pour voir l'avancement
"%OLLAMA%" list | findstr /b /c:"%MODELE% " >nul && goto lancer
if defined EXCALIBUR_CACHE (start "Telechargement du modele %MODELE%" "%OLLAMA%" pull %MODELE%) else "%OLLAMA%" pull %MODELE%

:lancer
if not exist node_modules (
  echo Installation des modules, une seule fois...
  call npm install
)
rem Icone "Excalibur" sur le bureau : ouvre le cartable sans fenetre noire (recree si le dossier a bouge)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0lanceur.ps1" -Raccourci >nul 2>&1

rem Ouvre le navigateur seulement quand le serveur repond (60 s max), sauf apres une mise a jour lancee
rem depuis l'espace parents : la page deja ouverte se recharge seule
if not defined SANS_NAVIGATEUR start "" /b powershell -NoProfile -Command "for($i=0;$i -lt 240;$i++){try{(New-Object Net.Sockets.TcpClient).Connect('127.0.0.1',%PORT%);Start-Process http://localhost:%PORT%;break}catch{Start-Sleep -Milliseconds 250}}"
node server.mjs
rem Code 42 : le serveur s'est ferme pour se mettre a jour, mise-a-jour.ps1 relance le cartable ensuite
if "%errorlevel%"=="42" exit
rem Code 43 : redemarrage demande depuis l'espace parents, la page ouverte se recharge seule
if "%errorlevel%"=="43" (
  set "SANS_NAVIGATEUR=1"
  goto redemarrer
)
rem Cache (icone) : arrete depuis l'espace parents, personne ne voit la fenetre
if defined EXCALIBUR_CACHE exit
pause
exit /b 0

:sans_node
echo Node.js n'a pas pu etre installe. Installe la version LTS depuis https://nodejs.org puis relance ce fichier.
pause
exit /b 1

