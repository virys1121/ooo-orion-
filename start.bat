@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ======================================================
echo    Запуск сайта АНО ЦДО «ОРИОН» имени Бигаева М.А.
echo ======================================================
echo.

:: Проверка наличия Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ОШИБКА: Node.js не найден в системе.
    echo Пожалуйста, скачайте и установите Node.js с официального сайта:
    echo https://nodejs.org/ (рекомендуется версия LTS^)
    echo.
    echo После установки закройте это окно и запустите start.bat снова.
    pause
    exit /b
)

:: Проверка наличия папки node_modules
if not exist "node_modules\" (
    echo [1/4] Установка необходимых библиотек...
    echo Это может занять несколько минут, пожалуйста, подождите...
    call npm install --no-audit --no-fund
) else (
    echo [1/4] Библиотеки уже установлены.
)

:: Подготовка базы данных
echo [2/4] Настройка базы данных (Prisma)...
call npx prisma generate
call npx prisma db push

:: Сидирование (создание админа)
echo [3/4] Проверка учетной записи администратора...
call npm run prisma:seed

:: Запуск сервера
echo.
echo ======================================================
echo [4/4] Запуск сервера...
echo.
echo САЙТ БУДЕТ ДОСТУПЕН ПО АДРЕСУ: http://localhost:3000
echo.
echo Для остановки сервера нажмите Ctrl+C
echo ======================================================
echo.

call npm run dev

pause
