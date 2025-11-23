Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Requirements Spec Copilot..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
$backendRunning = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "Port 8000 is in use. Killing existing process..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "Starting Backend Server..." -ForegroundColor Green
} else {
    Write-Host "Starting Backend Server..." -ForegroundColor Green
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"
Start-Sleep -Seconds 3

# Check if frontend is running
$frontendRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendRunning) {
    Write-Host "Port 3000 is in use. Killing existing process..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "Starting Frontend Server..." -ForegroundColor Green
} else {
    Write-Host "Starting Frontend Server..." -ForegroundColor Green
}
Set-Location frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
Set-Location ..
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servers are starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
Write-Host ""
Write-Host "Done! Your project should open in the browser." -ForegroundColor Green
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

