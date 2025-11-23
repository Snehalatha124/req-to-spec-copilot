@echo off
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.
echo You will be prompted for your GitHub username and Personal Access Token.
echo.
echo Steps:
echo 1. Username: Enter your GitHub username (Snehalatha124)
echo 2. Password: Enter your Personal Access Token (NOT your GitHub password)
echo.
pause
git push -u origin main
echo.
echo Done!
pause

