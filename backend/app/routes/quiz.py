import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.utils.deps import get_db, get_current_user
from app.services.quiz_generator import generate_mcq

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.post("/generate")
def generate_quiz(
    subject: str,
    context: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    quiz_data = generate_mcq(subject, context)

    if not quiz_data:
        return {"error": "Quiz generation failed"}

    quiz = models.Quiz(
        user_id=user.id,
        subject=subject,
        question=quiz_data["question"],
        options=json.dumps(quiz_data["options"]),
        correct_answer=quiz_data["correct_answer"]
    )

    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return {
        "quiz_id": quiz.id,
        "question": quiz.question,
        "options": quiz_data["options"]
    }


@router.post("/submit")
def submit_quiz(
    quiz_id: int,
    selected_answer: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    quiz = db.query(models.Quiz).filter_by(id=quiz_id).first()

    if not quiz:
        return {"error": "Quiz not found"}

    is_correct = int(selected_answer == quiz.correct_answer)

    attempt = models.QuizAttempt(
        user_id=user.id,
        quiz_id=quiz.id,
        selected_answer=selected_answer,
        is_correct=is_correct
    )

    db.add(attempt)

    # ---- UPDATE CONCEPT MASTERY ----
    concept = quiz.question  # simple mapping for now

    mastery = db.query(models.ConceptMastery).filter_by(
        user_id=user.id,
        subject=quiz.subject,
        concept=concept
    ).first()

    if not mastery:
        mastery = models.ConceptMastery(
            user_id=user.id,
            subject=quiz.subject,
            concept=concept,
            correct_attempts=0,
            total_attempts=0
        )
        db.add(mastery)

    mastery.total_attempts += 1
    if is_correct:
        mastery.correct_attempts += 1

    db.commit()


    return {
        "correct": bool(is_correct),
        "correct_answer": quiz.correct_answer
    }

@router.get("/recommend")
def recommend_quiz(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    weak = db.query(models.ConceptMastery).filter(
        models.ConceptMastery.user_id == user.id,
        models.ConceptMastery.total_attempts > 0
    ).all()

    recommendations = []

    for w in weak:
        accuracy = (w.correct_attempts / w.total_attempts) * 100
        if accuracy < 60:
            recommendations.append({
                "subject": w.subject,
                "concept": w.concept,
                "accuracy": round(accuracy, 2)
            })

    return recommendations
