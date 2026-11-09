@echo off
cd /d "%~dp0"
if not exist .venv\Scripts\python.exe (
    where py >nul 2>nul
    if not errorlevel 1 (
        py -3 -m venv .venv
    ) else (
        python -m venv .venv
    )
)
if not exist .venv\Scripts\python.exe (
    echo Python не найден. Установите Python 3.10+ и перезапустите скрипт.
    pause
    exit /b 1
)
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo Ошибка установки. Проверьте подключение к интернету.
    pause
    exit /b 1
)
".venv\Scripts\python.exe" app.py
pause
