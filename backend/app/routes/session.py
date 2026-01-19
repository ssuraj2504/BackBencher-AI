from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models, schemas
from app.utils.deps import get_current_user, get_db

router = APIRouter(prefix="/session", tags=["Sessions"])


@router.post("/start", response_model=schemas.SessionResponse)
def start_session(
    payload: schemas.SessionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # deactivate previous sessions
    db.query(models.LearningSession).filter(
        models.LearningSession.user_id == user.id,
        models.LearningSession.is_active == 1
    ).update({"is_active": 0})

    session = models.LearningSession(
        user_id=user.id,
        subject=payload.subject,
        is_active=1
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/current", response_model=schemas.SessionResponse | None)
def get_current_session(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(models.LearningSession).filter(
        models.LearningSession.user_id == user.id,
        models.LearningSession.is_active == 1
    ).first()
