@echo off
echo ========================================
echo          TASKIFY SETUP SCRIPT
echo ========================================

echo.
echo [1/4] Setting up Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo.
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/4] Installing Python dependencies...
pip install -r requirements.txt

echo.
echo [4/4] Starting the Taskify application...
echo.
echo Backend API will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:8000/static/index.html
echo API Documentation: http://localhost:8000/docs
echo.

uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload