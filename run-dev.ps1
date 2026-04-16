param(
    [switch]$Restart
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "car-rental-backend"
$frontendPath = Join-Path $root "frontend"

$backendApp = Join-Path $backendPath "pom.xml"
$frontendApp = Join-Path $frontendPath "package.json"

if (-not (Test-Path $backendApp)) {
    Write-Host "Backend project was not found at $backendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendApp)) {
    Write-Host "Frontend project was not found at $frontendPath" -ForegroundColor Red
    exit 1
}

function Get-PortListener {
    param([int]$Port)

    $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if ($null -eq $listener) {
        return $null
    }

    $process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue

    return [PSCustomObject]@{
        Port = $Port
        ProcessId = $listener.OwningProcess
        ProcessName = if ($process) { $process.ProcessName } else { "unknown" }
    }
}

function Stop-PortListener {
    param([int]$Port)

    $listener = Get-PortListener -Port $Port
    if ($null -eq $listener) {
        return
    }

    Write-Host "Stopping process $($listener.ProcessName) (PID $($listener.ProcessId)) on port $Port..." -ForegroundColor Yellow
    Stop-Process -Id $listener.ProcessId -Force
    Start-Sleep -Seconds 2
}

Write-Host "Starting Car Rental full-stack web app..." -ForegroundColor Cyan
Write-Host "Repository: $root" -ForegroundColor DarkGray

if ($Restart) {
    Stop-PortListener -Port 8081
    Stop-PortListener -Port 5173
}

$backendCommand = "cd '$backendPath'; mvn spring-boot:run"
$frontendCommand = "cd '$frontendPath'; if (-not (Test-Path 'node_modules')) { npm install }; npm run dev -- --host 0.0.0.0"

$backendListener = Get-PortListener -Port 8081
if ($backendListener) {
    Write-Host "Backend port 8081 is already in use by $($backendListener.ProcessName) (PID $($backendListener.ProcessId)). Reusing the running service." -ForegroundColor Yellow
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand -WorkingDirectory $backendPath
}

$frontendListener = Get-PortListener -Port 5173
if ($frontendListener) {
    Write-Host "Frontend port 5173 is already in use by $($frontendListener.ProcessName) (PID $($frontendListener.ProcessId)). Reusing the running service." -ForegroundColor Yellow
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand -WorkingDirectory $frontendPath
}

Write-Host "Backend:  http://localhost:8081" -ForegroundColor Green
Write-Host "API:      http://localhost:8081/api" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Keep both opened PowerShell windows running while using the app." -ForegroundColor Yellow
Write-Host "If you want to stop old services first, run: .\run-dev.ps1 -Restart" -ForegroundColor DarkGray
