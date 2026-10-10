[CmdletBinding()]
param([switch]$Foreground)

$ErrorActionPreference = 'Stop'
$getiRoot = Join-Path $PSScriptRoot 'geti'
$getiBackend = Join-Path $getiRoot 'application\backend'
$getiPython = Join-Path $getiBackend '.venv\Scripts\python.exe'
$getiUi = Join-Path $getiRoot 'application\ui\dist'
$getiRuntime = Join-Path $getiRoot '.build\runtime'
$getiStateFile = Join-Path $getiRuntime 'server.json'
$getiUrl = 'https://localhost:7860'

if (-not (Test-Path -LiteralPath $getiPython)) { throw 'Geti Python environment is missing.' }
if (-not (Test-Path -LiteralPath (Join-Path $getiUi 'index.html'))) { throw 'Geti UI build is missing.' }
New-Item -ItemType Directory -Path $getiRuntime -Force | Out-Null

if (Test-Path -LiteralPath $getiStateFile) {
    $getiState = Get-Content -Raw -LiteralPath $getiStateFile | ConvertFrom-Json
    $getiExisting = Get-Process -Id ([int]$getiState.pid) -ErrorAction SilentlyContinue
    if ($getiExisting -and $getiExisting.Path -ieq $getiPython -and
        $getiExisting.StartTime.ToUniversalTime().Ticks -eq [long]$getiState.start_time_utc_ticks) {
        Write-Output "Geti is already running: $getiUrl (PID $($getiExisting.Id))"
        return
    }
}

if (Get-NetTCPConnection -LocalPort 7860 -State Listen -ErrorAction SilentlyContinue) {
    throw 'Port 7860 is already in use. No existing process was stopped.'
}

$getiEnvironment = @{
    HOST = '127.0.0.1'
    PORT = '7860'
    STATIC_FILES_DIR = $getiUi
    ASSET_PREFIX = '/html'
    DATA_DIR = (Join-Path $getiBackend 'data')
    LOG_DIR = (Join-Path $getiBackend 'logs')
    ENVIRONMENT = 'prod'
    PYTHONPATH = $getiBackend
    PYTHONUNBUFFERED = '1'
    PYTHONUTF8 = '1'
    PYTHONIOENCODING = 'utf-8'
    NO_PROXY = 'localhost,127.0.0.1,::1'
}
$getiPreviousEnvironment = @{}
foreach ($getiKey in $getiEnvironment.Keys) {
    $getiPreviousEnvironment[$getiKey] = [Environment]::GetEnvironmentVariable($getiKey, 'Process')
    [Environment]::SetEnvironmentVariable($getiKey, $getiEnvironment[$getiKey], 'Process')
}

try {
    if ($Foreground) {
        Push-Location $getiBackend
        try { & $getiPython -u -m app.main }
        finally { Pop-Location }
        if ($LASTEXITCODE -ne 0) { throw "Geti exited with code $LASTEXITCODE" }
    } else {
        $getiTimestamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
        $getiStdout = Join-Path $getiRuntime "server-$getiTimestamp.stdout.log"
        $getiStderr = Join-Path $getiRuntime "server-$getiTimestamp.stderr.log"
        $getiProcess = Start-Process -FilePath $getiPython -ArgumentList @('-u', '-m', 'app.main') `
            -WorkingDirectory $getiBackend -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput $getiStdout -RedirectStandardError $getiStderr
        @{
            pid = $getiProcess.Id
            start_time_utc_ticks = $getiProcess.StartTime.ToUniversalTime().Ticks
            executable = $getiPython
            url = $getiUrl
            stdout_log = $getiStdout
            stderr_log = $getiStderr
        } | ConvertTo-Json | Set-Content -LiteralPath $getiStateFile -Encoding UTF8
        Write-Output "Geti started in the background (PID $($getiProcess.Id))."
        Write-Output "Open after startup: $getiUrl"
        Write-Output "Startup log: $getiStderr"
    }
} finally {
    foreach ($getiKey in $getiEnvironment.Keys) {
        [Environment]::SetEnvironmentVariable($getiKey, $getiPreviousEnvironment[$getiKey], 'Process')
    }
}
