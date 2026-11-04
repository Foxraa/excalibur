# Copie Excalibur (appli, programme, Node, Ollama et le modele) dans <Destination>\Excalibur.
# Lance par "Preparer la cle USB.bat". Fichier en ASCII pur (PowerShell 5.1 lit les .ps1 en ANSI).
# -SansDonnees : cartable vide (sans les devoirs, notes et etoiles de l'enfant).
param([string]$Destination, [switch]$SansDonnees)
$ErrorActionPreference = 'Stop'

$depot = Split-Path $PSScriptRoot -Parent
$ollamaDir = Join-Path $env:LOCALAPPDATA 'Programs\Ollama'
$modelesDir = if ($env:OLLAMA_MODELS) { $env:OLLAMA_MODELS } else { Join-Path $env:USERPROFILE '.ollama\models' }

# Modele choisi dans appli\.env (meme valeur par defaut que server.mjs)
$modele = 'gemma4:e4b'
$envFile = Join-Path $depot 'appli\.env'
if (Test-Path $envFile) {
  foreach ($l in Get-Content $envFile) { if ($l -match '^\s*OLLAMA_MODEL\s*=\s*(\S+)') { $modele = $Matches[1] } }
}
$nom, $tag = $modele.Split(':'); if (-not $tag) { $tag = 'latest' }
$manifeste = Join-Path $modelesDir "manifests\registry.ollama.ai\library\$nom\$tag"
if (-not (Test-Path $manifeste)) { throw "Le modele $modele n'est pas telecharge sur ce PC." }
$m = Get-Content $manifeste -Raw | ConvertFrom-Json
$blobs = @($m.layers) + $m.config |
  ForEach-Object { $_.digest -replace ':', '-' } | Where-Object { Test-Path (Join-Path $modelesDir "blobs\$_") }

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw "Node n'est pas installe sur ce PC." }
if (-not (Test-Path "$ollamaDir\ollama.exe")) { throw "Ollama n'est pas installe sur ce PC." }

# Choix de la cle
if (-not $Destination) {
  $cles = @(Get-Volume | Where-Object { $_.DriveType -eq 'Removable' -and $_.DriveLetter })
  if ($cles.Count -eq 1) { $Destination = "$($cles[0].DriveLetter):\" }
  else {
    if ($cles.Count -eq 0) { Write-Host "Aucune cle USB detectee." }
    else { $cles | Format-Table DriveLetter, FileSystemLabel, @{n='Libre (Go)'; e={[math]::Round($_.SizeRemaining/1GB,1)}} | Out-Host }
    $Destination = Read-Host "Lettre de la cle (ex. E) ou dossier de destination"
    if ($Destination -match '^[A-Za-z]:?$') { $Destination = $Destination.Substring(0,1) + ':\' }
  }
}
if (-not (Test-Path $Destination)) { throw "Destination introuvable : $Destination" }

# Le modele fait plus de 4 Go : FAT32 ne peut pas le stocker.
$lettre = (Resolve-Path $Destination).Path.Substring(0,1)
$vol = Get-Volume -DriveLetter $lettre
if ($vol.FileSystem -eq 'FAT32') {
  throw "La cle est en FAT32, qui refuse les fichiers de plus de 4 Go (le modele en fait 5,5). Formate-la en exFAT (clic droit > Formater > exFAT) puis relance."
}
$taille = (Get-ChildItem $ollamaDir -Recurse -File | Measure-Object Length -Sum).Sum +
  ($blobs | ForEach-Object { (Get-Item (Join-Path $modelesDir "blobs\$_")).Length } | Measure-Object -Sum).Sum + 300MB
$cible = Join-Path $Destination 'Excalibur'
$deja = if (Test-Path $cible) { (Get-ChildItem $cible -Recurse -File | Measure-Object Length -Sum).Sum } else { 0 }
if ($vol.SizeRemaining + $deja -lt $taille) {
  throw ("Pas assez de place : il faut {0:N1} Go, il reste {1:N1} Go." -f ($taille/1GB), (($vol.SizeRemaining + $deja)/1GB))
}

# Le cartable ouvert verrouille cartable.duckdb : impossible de le copier.
$ouvert = $false
if (-not $SansDonnees) { try { (New-Object Net.Sockets.TcpClient).Connect('127.0.0.1', 3000); $ouvert = $true } catch {} }
if ($ouvert) { throw "Le cartable est ouvert. Ferme sa fenetre noire, puis relance ce fichier." }

Write-Host ("Copie vers {0} (environ {1:N1} Go)..." -f $cible, ($taille/1GB))
function Copier($de, $vers, [string[]]$options) {
  robocopy $de $vers @options /NJH /NJS /NDL /NP /R:1 /W:1 | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "Echec de la copie de $de (robocopy $LASTEXITCODE)" }
}
Write-Host '- le cartable et les lecons'
$exclus = @('.claude'); if ($SansDonnees) { $exclus += 'data' }
Copier (Join-Path $depot 'appli') "$cible\appli" (@('/MIR', '/XD') + $exclus)
# La cle se perd facilement : pas de cle API dessus, et l'IA y reste l'Ollama de la cle.
$envCle = "$cible\appli\.env"
if (Test-Path $envCle) {
  (Get-Content $envCle) -notmatch '^\s*(ANTHROPIC_API_KEY|IA|IA_QUICK|OLLAMA_URL)\s*=' | Set-Content $envCle -Encoding ascii
}
Copier (Join-Path $depot 'programme_cm1') "$cible\programme_cm1" @('/MIR')
Write-Host '- Node'
Copier (Split-Path $node) "$cible\outils\node" @('node.exe')
Write-Host '- Ollama'
Copier $ollamaDir "$cible\outils\ollama" @('/MIR', '/XF', 'unins*', 'ollama app.exe')
Write-Host "- le modele $modele (le plus long)"
Copier (Split-Path $manifeste) "$cible\outils\modeles\manifests\registry.ollama.ai\library\$nom" @($tag)
Copier (Join-Path $modelesDir 'blobs') "$cible\outils\modeles\blobs" $blobs
Copy-Item (Join-Path $PSScriptRoot 'Demarrer Excalibur.bat') $cible -Force
Copy-Item (Join-Path $PSScriptRoot 'LISEZMOI.txt') $cible -Force

Write-Host "Termine. Sur l'autre PC : ouvre la cle, dossier Excalibur, double-clic sur 'Demarrer Excalibur.bat'." -ForegroundColor Green
