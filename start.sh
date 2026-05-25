#!/bin/bash
echo "======================================================"
echo "   Запуск сайта АНО ЦДО «ОРИОН» имени Бигаева М.А."
echo "======================================================"

if ! command -v node &> /dev/null
then
    echo "ОШИБКА: Node.js не найден!"
    echo "Пожалуйста, установите Node.js (https://nodejs.org/)"
    exit
fi

echo "[1/4] Установка зависимостей..."
npm install --no-audit --no-fund

echo "[2/4] Подготовка базы данных..."
npx prisma db push

echo "[3/4] Создание администратора..."
npm run prisma:seed

echo "[4/4] Запуск сервера..."
echo "Сайт будет доступен по адресу: http://localhost:3000"
npm run dev
