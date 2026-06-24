@echo off
REM TokBiz Setup Script for Windows

echo ===================================
echo  TokBiz Development Environment
echo ===================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

echo Python and Node.js found!
echo.

REM Setup Backend
echo Setting up backend...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call .\venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit backend\.env with your configuration
)

cd ..
echo Backend setup complete!
echo.

REM Setup Frontend
echo Setting up frontend...
cd frontend

echo Installing dependencies...
call npm install

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

cd ..
echo Frontend setup complete!
echo.

echo ===================================
echo Setup Complete!
echo ===================================
echo.
echo To start development:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   .\venv\Scripts\activate.bat
echo   python run.py
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
