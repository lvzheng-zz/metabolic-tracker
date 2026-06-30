param(
  [string]$Username,
  [string]$Password,
  [string]$Domain = "health.384571259.xyz",
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

function Read-TextOrDefault {
  param([string]$Prompt, [string]$Default)
  $value = Read-Host "$Prompt [$Default]"
  if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
  return $value.Trim()
}

function New-RandomHex {
  param([int]$Bytes)
  $buffer = New-Object byte[] $Bytes
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buffer)
  return -join ($buffer | ForEach-Object { $_.ToString("x2") })
}

function Get-Sha256Hex {
  param([string]$Text)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
  $hash = $sha.ComputeHash($bytes)
  return -join ($hash | ForEach-Object { $_.ToString("x2") })
}

function New-ForwardSlashZip {
  param(
    [string]$SourceDir,
    [string]$DestinationPath,
    [string[]]$ExcludedNames
  )

  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  if (Test-Path $DestinationPath) { Remove-Item $DestinationPath -Force }

  $sourceRoot = (Resolve-Path $SourceDir).Path.TrimEnd("\", "/")
  $sourcePrefix = "$sourceRoot\"
  $zip = [System.IO.Compression.ZipFile]::Open($DestinationPath, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    Get-ChildItem -Path $sourceRoot -Recurse -File -Force | Where-Object {
      $relative = $_.FullName.Substring($sourcePrefix.Length)
      $parts = $relative -split '[\\/]'
      -not ($parts | Where-Object { $ExcludedNames -contains $_ })
    } | ForEach-Object {
      $relative = $_.FullName.Substring($sourcePrefix.Length).Replace('\', '/')
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $zip,
        $_.FullName,
        $relative,
        [System.IO.Compression.CompressionLevel]::Optimal
      ) | Out-Null
    }
  } finally {
    $zip.Dispose()
  }
}

Write-Host ""
Write-Host "Metabolic Tracker - one-click deploy prep" -ForegroundColor Cyan
Write-Host "This script only creates a zip and env file locally. It does not log in to Alibaba Cloud or change DNS."
Write-Host ""

if ([string]::IsNullOrWhiteSpace($Username)) {
  $Username = Read-TextOrDefault "Web login username" "owner"
}

if ([string]::IsNullOrWhiteSpace($Domain)) {
  $Domain = Read-TextOrDefault "Deploy subdomain" "health.384571259.xyz"
}

if ([string]::IsNullOrWhiteSpace($Password)) {
  $secure = Read-Host "Web login password (plain text will not be saved)" -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $Password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

if ([string]::IsNullOrWhiteSpace($Password)) {
  throw "Password cannot be empty."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$appRoot = Resolve-Path (Join-Path $scriptDir "..\..")
$outputsRoot = Resolve-Path (Join-Path $appRoot "..")
$outDir = Join-Path $outputsRoot "aliyun-oneclick"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$salt = New-RandomHex 16
$passwordHash = Get-Sha256Hex "$salt`:$Password"
$jwtSecret = New-RandomHex 32
$healthImportToken = New-RandomHex 32
$Password = $null

$zipPath = Join-Path $outDir "metabolic-tracker-fc-upload.zip"
New-ForwardSlashZip -SourceDir $appRoot -DestinationPath $zipPath -ExcludedNames @("node_modules", ".metabolic-tracker-data")

$envPath = Join-Path $outDir "env-to-copy.txt"
@"
ALLOWED_ORIGIN=https://$Domain
APP_USERNAME=$Username
APP_PASSWORD_SALT=$salt
APP_PASSWORD_SHA256=$passwordHash
APP_JWT_SECRET=$jwtSecret
APP_TOKEN_TTL_SECONDS=2592000
APP_HEALTH_IMPORT_TOKEN=$healthImportToken

# Optional: enable after you have an OpenAI-compatible vision API key.
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_API_STYLE=chat

# Optional: Alibaba Cloud Model Studio / DashScope alternative.
# DASHSCOPE_API_KEY=sk-...
# DASHSCOPE_WORKSPACE_ID=llm-...
# DASHSCOPE_REGION=cn-beijing
# DASHSCOPE_MODEL=qwen-vl-plus
# OPENAI_API_STYLE=chat

# Optional: fill later for durable multi-device sync.
# OSS_REGION=oss-cn-hongkong
# OSS_BUCKET=
# OSS_ACCESS_KEY_ID=
# OSS_ACCESS_KEY_SECRET=
# OSS_STATE_PREFIX=metabolic-tracker
"@ | Set-Content -Path $envPath -Encoding UTF8

$stepsPath = Join-Path $outDir "steps-for-console.txt"
@"
Alibaba Cloud Function Compute console values:

1. Region:
   China (Hong Kong)
2. Runtime:
   Node.js
3. Code package:
   $zipPath
4. Start command:
   npm start
5. Port, if asked:
   3000
6. Environment variables:
   Copy the first 6 basic lines from:
   $envPath
7. Custom domain:
   $Domain

Important:
- Do not modify the existing root DNS record: @ A 122.192.196.184
- First get the website online. OSS durable sync and photo AI can be enabled later.
"@ | Set-Content -Path $stepsPath -Encoding UTF8

Write-Host ""
Write-Host "Generated:" -ForegroundColor Green
Write-Host "ZIP:   $zipPath"
Write-Host "ENV:   $envPath"
Write-Host "STEPS: $stepsPath"
Write-Host ""
Write-Host "Next: upload the ZIP to Function Compute. Start command: npm start"

if (-not $NoOpen) {
  Start-Process explorer.exe $outDir
  Start-Process "https://fcnext.console.aliyun.com/overview"
}
