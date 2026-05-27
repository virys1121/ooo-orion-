@echo off
:: Set UTF-8 encoding for the console
chcp 65001 > nul

echo ======================================================
echo    ORION Kindergarten Website Starter
echo ======================================================
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Node.js is not found.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: Check for NPM
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: NPM is not found.
    echo Please ensure Node.js is correctly installed and added to PATH.
    pause
    exit /b
)

echo [1/4] Installing dependencies...
call npm install --no-audit --no-fund

echo [2/4] Setting up database...
call npx prisma generate
call npx prisma db push

echo [3/4] Seeding administrator account...
call npm run prisma:seed

echo.
echo ======================================================
echo [4/4] Starting server...
echo.
echo Website will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo ======================================================
echo.

call npm run dev

pause
