:: Запуск проекта:
:: 1. Убедитесь, что в проект api добавлен актуальный файл .env (он не отслеживаются git-ом, он лежит в папке проекта на диске)
:: 2. Выполнить run.bat в консоли (НЕ PowerShell). Это запустит api и web в отдельных консолях
:: 3. Для завершения нажмите любую клавишу в основной консоли (только НЕ Ctrl + C, это прервет скрипт)

@echo off
title Project Runner (API + Web)
color 0A
setlocal enabledelayedexpansion

:: Переключаем кодировку на UTF-8
chcp 65001 > nul

:: Устанавливаем шрифт, поддерживающий UTF-8 (если есть возможность)
reg add "HKCU\Console\%CD%" /v "FaceName" /t REG_SZ /d "Lucida Console" /f > nul 2>&1
reg add "HKCU\Console\%CD%" /v "CodePage" /t REG_DWORD /d 65001 /f > nul 2>&1

:: Проверяем наличие Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js не установлен или не добавлен в PATH
    pause
    exit /b
)

:: Устанавливаем зависимости и запускаем проекты
start "API" /D "api" cmd /c "npm install && npm run start"
start "Web" /D "web" cmd /c "npm install && npm run start"

echo Оба проекта запущены. Нажмите любую клавишу для остановки (только НЕ Ctrl + C, это прервет скрипт)...
pause >nul

:: Останавливаем все Node.js процессы
taskkill /IM node.exe /F >nul 2>&1
echo Проекты остановлены
timeout /t 3 >nul