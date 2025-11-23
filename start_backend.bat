@echo off
echo ========================================
echo Starting Requirements Spec Copilot Backend
echo ========================================
cd /d %~dp0
echo.
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
