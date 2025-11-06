@echo off
echo ================================================================================
echo DG97 BLOG GENERATOR LAUNCHER
echo ================================================================================
echo.

REM Check if OPENAI_API_KEY is set
if "%OPENAI_API_KEY%"=="" (
    echo WARNING: OPENAI_API_KEY is not set!
    echo.
    echo Please set your OpenAI API key first:
    echo   set OPENAI_API_KEY=your-key-here
    echo.
    echo Or enter it now:
    set /p OPENAI_API_KEY="Enter your OpenAI API key: "
)

echo.
echo Starting blog generator control panel...
echo.

python control_panel.py

pause

