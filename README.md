Terminal 1 (Backend):

cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
Terminal 2 (Frontend):

cd frontend
npm run dev
