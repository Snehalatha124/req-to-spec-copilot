@echo off
echo ========================================
echo Starting Requirements Spec Copilot...
echo ========================================
echo.

REM Check if backend is already running
netstat -ano | findstr :8000 >nul
if %errorlevel% == 0 (
    echo Port 8000 is in use. Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo Starting Backend Server...
) else (
    echo Starting Backend Server...
)
start "Backend Server" cmd /k "cd /d %~dp0 && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"
timeout /t 3 /nobreak >nul

REM Check if frontend is already running
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo Port 3000 is in use. Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo Starting Frontend Server...
) else (
    echo Starting Frontend Server...
)
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo.
echo Done! Your project should open in the browser.
echo Press any key to exit...
pause >nul

