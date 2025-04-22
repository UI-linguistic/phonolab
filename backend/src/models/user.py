# src/models/user.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, unique=True, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    quiz_logs = relationship("QuizLog", back_populates="session", cascade="all, delete-orphan")
    vowel_stats = relationship("VowelStat", back_populates="session", cascade="all, delete-orphan")


class QuizLog(Base):
    __tablename__ = "quiz_logs"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, ForeignKey("user_sessions.session_id"))
    question_index = Column(Integer, nullable=False)
    question_text = Column(String)
    selected_option = Column(String)
    correct_option = Column(String)
    is_correct = Column(Boolean)

    # Relationships
    session = relationship("UserSession", back_populates="quiz_logs")


class VowelStat(Base):
    __tablename__ = "vowel_stats"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, ForeignKey("user_sessions.session_id"))
    vowel = Column(String, nullable=False)
    correct = Column(Integer, default=0)
    incorrect = Column(Integer, default=0)

    # Relationships
    session = relationship("UserSession", back_populates="vowel_stats")
