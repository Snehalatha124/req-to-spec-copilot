@echo off
echo ========================================
echo Fixing GitHub Authentication...
echo ========================================
echo.
echo Clearing old credentials...
cmdkey /list | findstr git
echo.
echo To remove old credentials, run:
echo cmdkey /delete:git:https://github.com
echo.
echo Then try pushing again - Windows will prompt for new credentials.
echo.
pause

