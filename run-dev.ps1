Write-Host "Starting backend and frontend..." -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "car-rental-backend"
$frontendPath = Join-Path $root "car-rental-system\frontend"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "Backend:  http://localhost:8081" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
