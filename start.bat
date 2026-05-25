@echo off
echo Запуск сайта АНО ЦДО ОРИОН...
call npm install
call npx prisma db push
npm run dev
pause
