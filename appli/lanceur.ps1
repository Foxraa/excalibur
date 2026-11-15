# Le seul lanceur d'Excalibur. Messages sans accents : PowerShell 5.1 lit ce fichier en ANSI.
#
# Sans option (icone "Excalibur" du bureau et du menu Demarrer) :
#   - le cartable tourne deja : ouvre juste sa fenetre ;
#   - l'installation n'est pas finie (Node.js, choix de l'IA, modules) : ouvre une fenetre pour poser les questions ;
#   - sinon : affiche tout de suite "Le cartable s'ouvre..." dans la fenetre du cartable, qui bascule des que
#     le serveur repond, et demarre le serveur en arriere-plan, sans fenetre noire.
# -Installer ("Installer Excalibur.bat") : installe ce qui manque, cree les icones, puis fait tourner le cartable
#   dans cette fenetre, qui montre ce qui se passe (utile en cas de probleme). La fermer arrete le cartable.
# -Serveur : fait tourner le serveur (en arriere-plan quand il vient de l'icone).
# -Ouvrir <adresse> : ouvre l'adresse dans la fenetre du cartable.
param([switch]$Installer, [switch]$Serveur, [string]$Ouvrir)
$appli = $PSScriptRoot
Set-Location $appli
$envFichier = Join-Path $appli '.env'
$nodeDossier = Join-Path $env:ProgramFiles 'nodejs'
$ollama = Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'
# Codes de sortie du serveur (server.mjs) : 42 = ferme pour se mettre a jour (mise-a-jour.ps1 le relance), 43 = redemarrer
$CODE_MAJ = 42
$CODE_REDEMARRER = 43

# Le cartable s'ouvre dans sa propre fenetre, sans barre d'adresse ni onglets, comme une appli :
# mode --app du navigateur par defaut s'il s'agit de Chrome ou d'Edge, sinon d'Edge (toujours present sous
# Windows 10 et 11), sinon de Chrome, sinon le navigateur par defaut dans un onglet.
function OuvrirFenetre([string]$adresse) {
  $prog = (Get-ItemProperty 'HKCU:\SOFTWARE\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice' -ErrorAction SilentlyContinue).ProgId
  $ordre = if ($prog -like 'ChromeHTML*') { 'chrome.exe', 'msedge.exe' } else { 'msedge.exe', 'chrome.exe' }
  foreach ($exe in $ordre) {
    foreach ($racine in 'HKCU:', 'HKLM:') {
      $chemin = (Get-ItemProperty "$racine\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\$exe" -ErrorAction SilentlyContinue).'(default)'
      if ($chemin -and (Test-Path $chemin)) { Start-Process $chemin -ArgumentList "--app=$adresse"; return }
    }
  }
  Start-Process $adresse
}
if ($Ouvrir) { OuvrirFenetre $Ouvrir; exit 0 }

# Reglages de .env, avec les memes valeurs par defaut que server.mjs
function Reglages {
  $r = @{ PORT = '3000'; OLLAMA_MODEL = 'gemma4:e4b' }
  if (Test-Path $envFichier) {
    foreach ($ligne in Get-Content $envFichier) { if ($ligne -match '^\s*([A-Z_]+)\s*=\s*(.*?)\s*$') { $r[$Matches[1]] = $Matches[2] } }
  }
  if (-not $r.IA) { $r.IA = if ($r.ANTHROPIC_API_KEY) { 'claude' } else { 'ollama' } }
  if (-not $r.IA_QUICK) { $r.IA_QUICK = $r.IA }
  $r
}
# Connexion courte : sous Windows, un port ferme met sinon 2 s a etre refuse
function Ouvert([int]$port) {
  $c = New-Object Net.Sockets.TcpClient
  try { return $c.ConnectAsync('127.0.0.1', $port).Wait(300) -and $c.Connected } catch { return $false } finally { $c.Close() }
}
function NodeOk {
  if (Get-Command node -ErrorAction SilentlyContinue) { return $true }
  if (Test-Path (Join-Path $nodeDossier 'node.exe')) { $env:Path = "$nodeDossier;$env:Path"; return $true }
  return $false
}
# Icones du bureau et du menu Demarrer, refaites a chaque lancement au cas ou le dossier a bouge.
# Fenetre "reduite" + -WindowStyle Hidden : rien ne clignote a l'ecran au double-clic.
function Icones {
  foreach ($dossier in [Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs')) {
    if (-not $dossier) { continue }
    try {
      $s = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $dossier 'Excalibur.lnk'))
      $s.TargetPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
      $s.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$PSCommandPath`""
      $s.WorkingDirectory = $appli
      $s.IconLocation = Join-Path $appli 'public\images\excalibur.ico'
      $s.WindowStyle = 7
      $s.Description = 'Ouvrir le cartable Excalibur'
      $s.Save()
    } catch {}
  }
}
function LancerCache([string]$mode) {
  Start-Process powershell.exe -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', "`"$PSCommandPath`"", $mode -WindowStyle Hidden
}
function Attendre { if (-not $env:EXCALIBUR_CACHE) { Write-Host ''; Read-Host 'Appuie sur Entree pour fermer' | Out-Null } }

# ---------- Serveur : Ollama si besoin, puis node server.mjs, relance sur le code 43 ----------
if ($Serveur) {
  $ouvrirFenetre = -not $env:SANS_NAVIGATEUR
  while ($true) {
    $r = Reglages
    $port = [int]$r.PORT
    if (-not (NodeOk)) { Write-Host "Node.js manque : double-clique sur 'Installer Excalibur.bat'."; Attendre; exit 1 }

    # Ollama sur ce PC (pas pour Claude ou Mistral, ni pour un Ollama ailleurs mis a la main dans .env).
    # S'il n'est pas installe, c'est la page du cartable qui propose de l'installer.
    $veutOllama = $r.IA -eq 'ollama' -or $r.IA_QUICK -eq 'ollama'
    $local = -not $r.OLLAMA_URL -or $r.OLLAMA_URL -match 'localhost|127\.0\.0\.1'
    if ($veutOllama -and $local -and (Test-Path $ollama)) {
      & $ollama list *> $null
      if ($LASTEXITCODE -ne 0) {
        Write-Host "Demarrage d'Ollama..."
        Start-Process (Join-Path (Split-Path $ollama) 'ollama app.exe')
        for ($i = 0; $i -lt 30; $i++) { Start-Sleep 1; & $ollama list *> $null; if ($LASTEXITCODE -eq 0) { break } }
        if ($LASTEXITCODE -ne 0) { Write-Host "Ollama ne repond pas : le cartable s'ouvre sans IA. Ouvre l'application Ollama, puis redemarre le cartable." }
      }
      if ($LASTEXITCODE -eq 0 -and -not ((& $ollama list) -match "^$([regex]::Escape($r.OLLAMA_MODEL))\s")) {
        # Plusieurs Go : dans une fenetre a part, pour voir l'avancement
        Start-Process $ollama -ArgumentList 'pull', $r.OLLAMA_MODEL
      }
    }

    if (-not (Test-Path (Join-Path $appli 'node_modules'))) { Write-Host 'Installation des modules...'; & npm install }
    Icones

    if ($ouvrirFenetre) {
      # Ouvre la fenetre du cartable des que le serveur repond (60 s max)
      Start-Job -ScriptBlock {
        param($lanceur, $port)
        for ($i = 0; $i -lt 200; $i++) {
          $c = New-Object Net.Sockets.TcpClient
          try { if ($c.ConnectAsync('127.0.0.1', $port).Wait(300) -and $c.Connected) { & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $lanceur -Ouvrir "http://localhost:$port"; return } } catch {} finally { $c.Close() }
          Start-Sleep -Milliseconds 300
        }
      } -ArgumentList $PSCommandPath, $port | Out-Null
    }
    & node server.mjs
    $code = $LASTEXITCODE
    if ($code -ne $CODE_REDEMARRER) { break }
    # Redemarrage depuis l'espace parents : .env a pu changer, la page ouverte se recharge seule
    $ouvrirFenetre = $false
  }
  if ($code -ne $CODE_MAJ -and $code -ne 0) { Attendre }
  exit $code
}

# ---------- Installation ("Installer Excalibur.bat") : une seule fois, puis le cartable tourne ici ----------
if ($Installer) {
  $Host.UI.RawUI.WindowTitle = 'Excalibur'
  if (-not (NodeOk)) {
    Write-Host "Node.js n'est pas installe : installation, une seule fois. Accepte la demande de Windows."
    & winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
    if (-not (NodeOk)) {
      Write-Host "Node.js n'a pas pu etre installe. Installe la version LTS depuis https://nodejs.org puis relance ce fichier."
      Attendre; exit 1
    }
  }
  # Premier lancement : ou tourne l'IA ? (se change ensuite dans l'espace parents)
  if (-not (Test-Path $envFichier)) {
    Write-Host ''
    Write-Host 'Quelle IA pour le cartable ?'
    Write-Host '  1 = Ollama sur ce PC : gratuit, rien ne sort de la maison, plusieurs Go a telecharger'
    Write-Host '  2 = Claude : payant, avec une cle API, les donnees partent chez Anthropic'
    Write-Host '  3 = Mistral : payant et moins cher, avec une cle API, les donnees partent chez Mistral AI'
    do { $choix = Read-Host 'Ton choix (1, 2 ou 3)' } until ($choix -in '1', '2', '3')
    $ia = @{ '1' = 'ollama'; '2' = 'claude'; '3' = 'mistral' }[$choix]
    Set-Content $envFichier "IA=$ia" -Encoding ascii
    if ($ia -ne 'ollama') { Write-Host 'La cle API se colle dans le cartable, a l''etape "L''IA du cartable".' }
  }
  Icones
  Write-Host ''
  Write-Host "C'est installe. La prochaine fois, ouvre le cartable avec l'icone Excalibur du bureau." -ForegroundColor Green
  Write-Host 'Cette fenetre fait tourner le cartable : la fermer l''arrete.'
  Write-Host ''
  if (Ouvert ([int](Reglages).PORT)) { OuvrirFenetre "http://localhost:$((Reglages).PORT)"; exit 0 }
  & $PSCommandPath -Serveur
  exit $LASTEXITCODE
}

# ---------- Icone ----------
$port = [int](Reglages).PORT
if (Ouvert $port) { OuvrirFenetre "http://localhost:$port"; exit 0 }

$installe = (NodeOk) -and (Test-Path $envFichier) -and (Test-Path (Join-Path $appli 'node_modules'))
if (-not $installe) {
  Start-Process powershell.exe -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$PSCommandPath`"", '-Installer'
  exit 0
}

# Fenetre du cartable tout de suite sur la page d'attente, avec le bon port (copie dans TEMP : le dossier du
# cartable n'est pas modifie). Elle bascule d'elle-meme sur le cartable : le serveur n'ouvre pas de seconde fenetre.
$attente = Join-Path $env:TEMP 'excalibur-demarrage.html'
try {
  (Get-Content (Join-Path $appli 'demarrage.html') -Raw -Encoding UTF8).Replace('__PORT__', [string]$port) |
    Set-Content $attente -Encoding UTF8
  OuvrirFenetre ([Uri]$attente).AbsoluteUri
  $env:SANS_NAVIGATEUR = '1'
} catch {}

# Le serveur et la mise a jour heritent de EXCALIBUR_CACHE : ils restent caches et n'attendent pas de touche.
$env:EXCALIBUR_CACHE = '1'
LancerCache '-Serveur'
