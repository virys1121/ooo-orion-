#!/bin/bash
echo "Запуск сайта АНО ЦДО ОРИОН..."
npm install
npx prisma db push
npm run dev
