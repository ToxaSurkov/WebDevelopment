@echo off
where node >nul 2>nul || (echo ERROR: Please install Node.js first. & pause & exit /b 1)
call npm install || (echo npm install failed & pause & exit /b 1)
call npm run dev
pause
