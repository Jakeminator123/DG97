@echo off
echo ================================================================================
echo DG97 BLOG GENERATOR - GUI
echo ================================================================================
echo.
echo Starting graphical interface...
echo.

python gui_generator.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ================================================================================
    echo ERROR: Could not start GUI
    echo ================================================================================
    echo.
    echo Possible solutions:
    echo 1. Install dependencies: pip install -r requirements.txt
    echo 2. Check that .env file exists with OPENAI_API_KEY
    echo 3. Check Python installation
    echo.
    pause
)

