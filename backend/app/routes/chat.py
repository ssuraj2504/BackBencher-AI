from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.utils.deps import get_current_user, get_db
from app.db import models
from app.core.llm import run_llm
from app.services.prompt_builder import build_teaching_prompt
from app.services.rag import search_pdf
from app.services.adaptive import get_weak_concepts

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(
    message: str = Query(..., min_length=3),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    session = db.query(models.LearningSession).filter(
        models.LearningSession.user_id == user.id,
        models.LearningSession.is_active == 1
    ).first()

    if not session:
        return {"error": "No active learning session"}

    pdf_chunks = []

    if session.subject.lower() in ["dbms", "database", "database management system"]:
        pdf_chunks = search_pdf(message)


    weak_concepts = get_weak_concepts(
        db=db,
        user_id=user.id,
        subject=session.subject
    )

    prompt = build_teaching_prompt(
        subject=session.subject,
        user_question=message,
        pdf_context=pdf_chunks,
        weak_concepts=weak_concepts
    )


    try:
        answer = run_llm(prompt)
    except TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model response timed out. Please try again later."
        )
    except (RuntimeError, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

    return {
        "subject": session.subject,
        "question": message,
        "answer": answer
    }
