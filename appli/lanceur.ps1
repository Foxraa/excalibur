# Lance par l'icone "Excalibur" (bureau et menu Demarrer) : ouvre le cartable sans fenetre noire.
# - Il tourne deja : ouvre juste la page.
# - Sinon : affiche tout de suite demarrage.html ("Le cartable s'ouvre..."), qui bascule sur le cartable des
#   qu'il repond, et demarre "Demarrer le cartable.bat" en cache.
# - Premiere installation (Node.js, choix de l'IA, modules) : il faut repondre a des questions, donc le .bat
#   s'ouvre dans sa fenetre habituelle.
# -Raccourci (appele par le .bat a chaque lancement) : cree ou remet a jour les icones, au cas ou le dossier a bouge.
# Messages sans accents : PowerShell 5.1 lit ce fichier en ANSI.
param([switch]$Raccourci)
$appli = $PSScriptRoot
$bat = Join-Path $appli 'Demarrer le cartable.bat'

if ($Raccourci) {
  # Fenetre "reduite" + -WindowStyle Hidden : rien ne clignote a l'ecran au double-clic.
  foreach ($dossier in [Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs')) {
    if (-not $dossier) { continue }
    $s = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $dossier 'Excalibur.lnk'))
    $s.TargetPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $s.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$PSCommandPath`""
    $s.WorkingDirectory = $appli
    $s.IconLocation = Join-Path $appli 'public\images\excalibur.ico'
    $s.WindowStyle = 7
    $s.Description = 'Ouvrir le cartable Excalibur'
    $s.Save()
  }
  exit 0
}

$port = 3000
$env_fichier = Join-Path $appli '.env'
if (Test-Path $env_fichier) {
  foreach ($ligne in Get-Content $env_fichier) { if ($ligne -match '^\s*PORT\s*=\s*(\d+)') { $port = [int]$Matches[1] } }
}
# Connexion courte : sous Windows, un port ferme met sinon 2 s a etre refuse
function Ouvert {
  $c = New-Object Net.Sockets.TcpClient
  try { return $c.ConnectAsync('127.0.0.1', $port).Wait(300) -and $c.Connected } catch { return $false } finally { $c.Close() }
}
if (Ouvert) { Start-Process "http://localhost:$port"; exit 0 }

$node = (Get-Command node -ErrorAction SilentlyContinue) -or (Test-Path (Join-Path $env:ProgramFiles 'nodejs\node.exe'))
$installe = $node -and (Test-Path $env_fichier) -and (Test-Path (Join-Path $appli 'node_modules'))
if (-not $installe) {
  Start-Process $bat -WorkingDirectory $appli
  exit 0
}

# Page d'attente tout de suite, avec le bon port (copie dans TEMP : le dossier du cartable n'est pas modifie)
$attente = Join-Path $env:TEMP 'excalibur-demarrage.html'
try {
  (Get-Content (Join-Path $appli 'demarrage.html') -Raw -Encoding UTF8).Replace('__PORT__', [string]$port) |
    Set-Content $attente -Encoding UTF8
  Start-Process $attente
  $env:SANS_NAVIGATEUR = '1' # la page d'attente basculera d'elle-meme : pas de second onglet
} catch {}

# Le .bat, Node et la mise a jour heritent de EXCALIBUR_CACHE : ils restent caches et ne s'arretent pas sur "pause".
$env:EXCALIBUR_CACHE = '1'
Start-Process cmd.exe -ArgumentList '/c', "`"`"$bat`"`"" -WorkingDirectory $appli -WindowStyle Hidden
