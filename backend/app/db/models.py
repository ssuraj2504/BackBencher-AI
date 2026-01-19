from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.database import Base
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String, index=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON string
    correct_answer = Column(String, nullable=False)


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    selected_answer = Column(String)
    is_correct = Column(Integer)  # 1 or 0

class ConceptMastery(Base):
    __tablename__ = "concept_mastery"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String, nullable=False)
    concept = Column(String, nullable=False)
    correct_attempts = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
