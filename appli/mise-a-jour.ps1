# Met Excalibur a jour depuis GitHub (branche main) sans toucher aux donnees :
# appli\data, appli\.env et photos ne sont pas dans l'archive, ils restent tels quels.
# Lance par le bouton Mise a jour de l'espace parents (-Relancer : attend que le serveur se ferme, puis relance
# le cartable a la fin). Sans le cartable, clic droit sur ce fichier > "Executer avec PowerShell". Messages sans accents : PowerShell 5.1 lit ce fichier en ANSI.
param([switch]$SansPause, [switch]$Relancer, [string]$Racine)

$ErrorActionPreference = 'Stop'
$depot = 'Foxraa/excalibur'
$branche = 'main'
$appli = $PSScriptRoot
if (-not $Racine) { $Racine = Split-Path $appli -Parent }
$appli = Join-Path $Racine 'appli'

function Fin([int]$code) {
  if ($Relancer) {
    # Le lanceur n'ouvre pas de nouvel onglet : la page restee ouverte se recharge toute seule.
    $env:SANS_NAVIGATEUR = '1'
    Write-Host 'Le cartable redemarre...'
    $arguments = '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$(Join-Path $appli 'lanceur.ps1')`"", '-Serveur'
    # Ouvert par l'icone du bureau (EXCALIBUR_CACHE, herite du serveur) : il se relance cache, comme avant
    if ($env:EXCALIBUR_CACHE) { Start-Process powershell.exe -ArgumentList $arguments -WorkingDirectory $appli -WindowStyle Hidden }
    else { Start-Process powershell.exe -ArgumentList $arguments -WorkingDirectory $appli }
    if ($code -eq 0) { Start-Sleep -Seconds 2; exit 0 }
  }
  if (-not $SansPause) { Write-Host ''; Read-Host 'Appuie sur Entree pour fermer' | Out-Null }
  exit $code
}

$git = Test-Path (Join-Path $Racine '.git')

# Le cartable doit etre ferme (sinon les modules de node_modules sont verrouilles)
$port = 3000
$env_fichier = Join-Path $appli '.env'
if (Test-Path $env_fichier) {
  foreach ($ligne in Get-Content $env_fichier) { if ($ligne -match '^\s*PORT\s*=\s*(\d+)') { $port = [int]$Matches[1] } }
}
function Ouvert {
  try { $c = New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1', $port); $c.Close(); return $true } catch { return $false }
}
if ($Relancer) {
  Write-Host 'Fermeture du cartable...'
  for ($i = 0; $i -lt 60 -and (Ouvert); $i++) { Start-Sleep -Milliseconds 500 }
  Start-Sleep -Seconds 2 # la fenetre noire finit de se fermer, la base est liberee
}
if (Ouvert) {
  $Relancer = $false # il tourne encore : ne pas en lancer un second
  Write-Host 'Le cartable est ouvert : arrete-le (espace parents, Reglages, "Arreter le cartable") ou ferme sa fenetre noire, puis relance la mise a jour.'
  Fin 1
}

# Copie de travail git : on avance sur main de GitHub, seulement en fast-forward (rien de local n'est perdu)
if ($git) {
  $lock = Join-Path $appli 'package-lock.json'
  $modules = Join-Path $appli 'node_modules'
  $avant = if (Test-Path $lock) { (Get-FileHash $lock).Hash } else { '' }
  Write-Host 'Recuperation de la nouvelle version avec git...'
  git -C $Racine fetch -q origin $branche
  if ($LASTEXITCODE -ne 0) { Write-Host "git n'a pas pu joindre GitHub. Verifie la connexion internet et recommence."; Fin 1 }
  git -C $Racine merge --ff-only -q FETCH_HEAD
  if ($LASTEXITCODE -ne 0) {
    Write-Host "git n'a pas pu avancer : des modifications locales ou des commits absents de main l'en empechent."
    Write-Host 'Le cartable est intact. Fusionne a la main, puis recommence.'
    Fin 1
  }
  $apres = if (Test-Path $lock) { (Get-FileHash $lock).Hash } else { '' }
  if ((Test-Path $modules) -and $avant -ne $apres) { Remove-Item $modules -Recurse -Force }
  Write-Host ''
  Write-Host 'Mise a jour faite.'
  if (-not $Relancer) { Write-Host 'Ouvre le cartable avec l''icone Excalibur du bureau pour lancer la nouvelle version.' }
  Fin 0
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$entetes = @{ 'User-Agent' = 'excalibur-mise-a-jour' }
$fichier_version = Join-Path $appli '.version'

# Derniere version publiee (si GitHub ne repond pas, on telecharge quand meme la branche)
$sha = $null
try { $sha = (Invoke-RestMethod "https://api.github.com/repos/$depot/commits/$branche" -Headers $entetes).sha } catch {}
if ($sha -and (Test-Path $fichier_version) -and ((Get-Content $fichier_version -Raw).Trim() -eq $sha)) {
  Write-Host 'Excalibur est deja a jour.'
  Fin 0
}

$tmp = Join-Path $env:TEMP ("excalibur-maj-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
  $ref = if ($sha) { $sha } else { "refs/heads/$branche" }
  Write-Host 'Telechargement de la nouvelle version...'
  $zip = Join-Path $tmp 'excalibur.zip'
  Invoke-WebRequest "https://github.com/$depot/archive/$ref.zip" -OutFile $zip -UseBasicParsing -Headers $entetes
  Expand-Archive $zip -DestinationPath (Join-Path $tmp 'x')
  $nouveau = (Get-ChildItem (Join-Path $tmp 'x') -Directory | Select-Object -First 1).FullName
  if (-not $nouveau -or -not (Test-Path (Join-Path $nouveau 'appli\server.mjs'))) { throw "L'archive telechargee ne contient pas le cartable." }

  # Copie de securite de la base avant de changer le code
  $base = Join-Path $appli 'data\cartable.duckdb'
  if (Test-Path $base) { Copy-Item $base (Join-Path $appli 'data\cartable.avant-mise-a-jour.duckdb') -Force }

  # La progression annuelle peut avoir ete retouchee a la main : on garde l'ancienne si elle change
  $prog = Join-Path $Racine 'programme_cm1\10_Progression_annuelle.md'
  $prog_neuve = Join-Path $nouveau 'programme_cm1\10_Progression_annuelle.md'
  if ((Test-Path $prog) -and (Test-Path $prog_neuve) -and ((Get-FileHash $prog).Hash -ne (Get-FileHash $prog_neuve).Hash)) {
    Copy-Item $prog (Join-Path $Racine 'programme_cm1\10_Progression_annuelle.avant-mise-a-jour.md') -Force
    $prog_gardee = $true
  }

  # Modules a reinstaller si la liste a change (le lanceur refait npm install au demarrage)
  $lock = Join-Path $appli 'package-lock.json'
  $lock_neuf = Join-Path $nouveau 'appli\package-lock.json'
  $modules = Join-Path $appli 'node_modules'
  if ((Test-Path $modules) -and (-not (Test-Path $lock) -or (Get-FileHash $lock).Hash -ne (Get-FileHash $lock_neuf).Hash)) {
    Remove-Item $modules -Recurse -Force
  }

  Write-Host 'Installation de la nouvelle version...'
  robocopy $nouveau $Racine /E /IS /IT /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "La copie des fichiers a echoue (robocopy $LASTEXITCODE)." }
  # Anciens fichiers retires du depot (la copie n'efface rien) : l'icone Excalibur et "Installer Excalibur.bat" les remplacent
  foreach ($vieux in 'appli\Demarrer le cartable.bat', 'appli\Mettre a jour le cartable.bat') {
    Remove-Item (Join-Path $Racine $vieux) -Force -ErrorAction SilentlyContinue
  }
  if ($sha) { Set-Content $fichier_version $sha -Encoding ascii }
} catch {
  Write-Host ''
  Write-Host "La mise a jour n'a pas pu se faire : $($_.Exception.Message)"
  Write-Host 'Le cartable et ses donnees sont intacts. Verifie la connexion internet et recommence.'
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
  Fin 1
}
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ''
Write-Host 'Mise a jour faite. Les donnees, les reglages et les cles sont gardes.'
if ($prog_gardee) { Write-Host 'Ton ancienne progression annuelle est gardee dans programme_cm1\10_Progression_annuelle.avant-mise-a-jour.md.' }
Write-Host 'Ouvre le cartable avec l''icone Excalibur du bureau pour lancer la nouvelle version.'
Fin 0
