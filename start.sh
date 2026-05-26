#!/bin/bash

# Установка кодировки
export LANG=en_US.UTF-8

echo "======================================================"
echo "   Запуск сайта АНО ЦДО «ОРИОН» имени Бигаева М.А.    "
echo "======================================================"
echo

# Проверка Node.js
if ! command -v node &> /dev/null
then
    echo "[!] ОШИБКА: Node.js не найден."
    echo "Пожалуйста, установите Node.js (https://nodejs.org/)"
    exit 1
fi

# Установка зависимостей
if [ ! -d "node_modules" ]; then
    echo "[1/4] Установка библиотек..."
    npm install --no-audit --no-fund
else
    echo "[1/4] Библиотеки уже установлены."
fi

# База данных
echo "[2/4] Настройка базы данных..."
npx prisma generate
npx prisma db push

# Сид
echo "[3/4] Проверка учетной записи администратора..."
npm run prisma:seed

echo
echo "======================================================"
echo "[4/4] Запуск сервера..."
echo "САЙТ ДОСТУПЕН ПО АДРЕСУ: http://localhost:3000"
echo "======================================================"
echo

npm run dev
