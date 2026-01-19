@echo off
echo Starting BackBencher AI Development Environment...

:: Start Backend
start "BackBencher Backend" cmd /k "cd backend && echo Starting Backend... && uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload"

:: Start Frontend
start "BackBencher Frontend" cmd /k "cd frontend && echo Starting Frontend... && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://127.0.0.1:8080
echo Frontend: http://localhost:5173
echo.
pause
