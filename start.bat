@echo off
chcp 65001 > nul
echo ======================================================
echo    Запуск сайта АНО ЦДО «ОРИОН» имени Бигаева М.А.
echo ======================================================

:: Проверка наличия Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ОШИБКА: Node.js не найден!
    echo Пожалуйста, установите Node.js с сайта https://nodejs.org/
    echo После установки перезапустите это окно.
    pause
    exit /b
)

echo [1/4] Установка зависимостей (может занять время)...
call npm install --no-audit --no-fund

echo [2/4] Подготовка базы данных...
call npx prisma db push

echo [3/4] Создание администратора...
call npm run prisma:seed

echo [4/4] Запуск сервера разработки...
echo Сайт будет доступен по адресу: http://localhost:3000
call npm run dev

pause
