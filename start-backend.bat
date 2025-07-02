@echo off
echo 🚀 Starting Python Code Execution Backend...
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: backend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment. Make sure Python 3 is installed.
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate

REM Install or upgrade dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo ✅ Backend setup complete!
echo 🌐 Starting server on http://localhost:5000
echo.
echo To stop the server, press Ctrl+C
echo ----------------------------------------

REM Start the Flask server
python app.py 