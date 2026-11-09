@echo off
setlocal
cd /d "%~dp0" || exit /b 1

set "CATALOG_PYTHON="
if defined CONDA_PREFIX if exist "%CONDA_PREFIX%\python.exe" call :find_python "%CONDA_PREFIX%\python.exe"

for %%D in (miniconda3 anaconda3 miniforge3) do (
    if not defined CATALOG_PYTHON if exist "%USERPROFILE%\%%D\envs\webdevelopment-lesson1\python.exe" (
        call :find_python "%USERPROFILE%\%%D\envs\webdevelopment-lesson1\python.exe"
    )
)

if not defined CATALOG_PYTHON call :find_python python.exe
if not defined CATALOG_PYTHON call :find_python py.exe -3
if not defined CATALOG_PYTHON (
    echo Python 3.7 or newer was not found. Activate the course Conda environment and try again.
    pause
    exit /b 1
)

"%CATALOG_PYTHON%" %CATALOG_PYTHON_FLAG% server.py %*
set "CATALOG_STATUS=%errorlevel%"
pause
exit /b %CATALOG_STATUS%

:find_python
"%~1" %~2 -c "import sys; sys.exit(sys.version_info < (3, 7))" >nul 2>&1
if errorlevel 1 exit /b 1
set "CATALOG_PYTHON=%~1"
set "CATALOG_PYTHON_FLAG=%~2"
exit /b 0
