from fastapi import FastAPI
from app.db.database import engine
from app.db import models
from app.routes import auth, session, chat, pdf, quiz, progress


app = FastAPI(title="BackBencher AI Tutor")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(auth.router)
app.include_router(session.router)
app.include_router(chat.router)
app.include_router(pdf.router)
app.include_router(quiz.router)
app.include_router(progress.router)

@app.get("/")
def health_check():
    return {"status": "Backend running"}
