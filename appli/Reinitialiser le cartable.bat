@echo off
rem Remet le cartable a zero. Rien n'est efface : le dossier data est renomme
rem avec la date, et le cartable recree une base vide au prochain lancement.
cd /d "%~dp0"

if not exist data (
  echo Le cartable est deja vide : il n'y a rien a reinitialiser.
  pause
  exit /b 0
)

rem Le cartable doit etre ferme (meme port que Demarrer le cartable.bat)
set "PORT=3000"
if exist .env for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
  if /i "%%a"=="PORT" set "PORT=%%b"
)
powershell -NoProfile -Command "try{(New-Object Net.Sockets.TcpClient).Connect('127.0.0.1',%PORT%);exit 1}catch{exit 0}"
if errorlevel 1 (
  echo Le cartable est ouvert. Ferme sa fenetre noire, puis relance ce fichier.
  pause
  exit /b 1
)

echo.
echo  REINITIALISATION DU CARTABLE
echo.
echo  Les lecons, devoirs, notes, etoiles, le prenom et le code parent
echo  seront retires du cartable, qui repartira de zero.
echo  Rien n'est efface : tout est range dans un dossier data-avant-reinitialisation.
echo.
set "REPONSE="
set /p "REPONSE=Tape OUI en majuscules pour confirmer : "
if not "%REPONSE%"=="OUI" (
  echo Rien n'a ete modifie.
  pause
  exit /b 0
)

for /f %%d in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH\hmm"') do set "QUAND=%%d"
ren data "data-avant-reinitialisation-%QUAND%"
if errorlevel 1 (
  echo Le dossier data n'a pas pu etre renomme. Ferme le cartable et reessaie.
  pause
  exit /b 1
)
echo.
echo C'est fait. L'ancien cartable est dans le dossier data-avant-reinitialisation-%QUAND%.
echo Pour le retrouver : supprimer le dossier data, puis renommer ce dossier en data.
echo Lance Demarrer le cartable.bat pour commencer avec un cartable vide.
pause
