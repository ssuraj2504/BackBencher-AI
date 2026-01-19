from sqlalchemy.orm import Session
from app.db import models


def get_weak_concepts(db: Session, user_id: int, subject: str):
    records = db.query(models.ConceptMastery).filter_by(
        user_id=user_id,
        subject=subject
    ).all()

    weak = []

    for r in records:
        if r.total_attempts > 0:
            accuracy = (r.correct_attempts / r.total_attempts) * 100
            if accuracy < 60:
                weak.append({
                    "concept": r.concept,
                    "accuracy": round(accuracy, 2)
                })

    return weak
