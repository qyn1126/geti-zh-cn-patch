[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$getiRoot = Join-Path $PSScriptRoot 'geti'
$getiPython = Join-Path $getiRoot 'application\backend\.venv\Scripts\python.exe'
$getiStateFile = Join-Path $getiRoot '.build\runtime\server.json'
if (-not (Test-Path -LiteralPath $getiStateFile)) {
    Write-Output 'No background Geti process is registered.'
    return
}
$getiState = Get-Content -Raw -LiteralPath $getiStateFile | ConvertFrom-Json
$getiProcessId = [int]$getiState.pid
$getiProcess = Get-Process -Id $getiProcessId -ErrorAction SilentlyContinue
if (-not $getiProcess) {
    Remove-Item -LiteralPath $getiStateFile
    Write-Output 'Geti is already stopped.'
    return
}
$getiProcessDetails = Get-CimInstance Win32_Process -Filter "ProcessId = $getiProcessId"
if ($getiProcess.Path -ine $getiPython -or
    $getiProcess.StartTime.ToUniversalTime().Ticks -ne [long]$getiState.start_time_utc_ticks -or
    $getiProcessDetails.CommandLine -notmatch '(?:^|\s)-m\s+app\.main(?:\s|$)') {
    throw 'The recorded PID no longer identifies this Geti server. No process was stopped.'
}
& taskkill.exe /PID $getiProcessId /T /F
if ($LASTEXITCODE -ne 0) { throw 'Could not stop the Geti process tree.' }
Remove-Item -LiteralPath $getiStateFile
Write-Output 'Geti stopped. Application data is preserved.'
