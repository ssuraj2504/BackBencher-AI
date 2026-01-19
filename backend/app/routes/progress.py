from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.utils.deps import get_db, get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/")
def get_progress(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    records = db.query(models.ConceptMastery).filter_by(
        user_id=user.id
    ).all()

    progress = []

    for r in records:
        accuracy = (
            (r.correct_attempts / r.total_attempts) * 100
            if r.total_attempts > 0 else 0
        )

        progress.append({
            "subject": r.subject,
            "concept": r.concept,
            "accuracy": round(accuracy, 2),
            "attempts": r.total_attempts
        })

    return progress
