# src/models/user.py

from datetime import datetime

from src.db import db


class UserSession(db.Model):
    __tablename__ = "user_sessions"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String, unique=True, nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)

    completed_lessons = db.relationship("CompletedLesson", backref="session", cascade="all, delete-orphan")
    quiz_attempts = db.relationship("QuizAttempt", backref="session", cascade="all, delete-orphan")


class CompletedLesson(db.Model):
    __tablename__ = "completed_lessons"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String, db.ForeignKey("user_sessions.session_id"))
    lesson_id = db.Column(db.Integer, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)


class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String, db.ForeignKey("user_sessions.session_id"))
    quiz_id = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)


# class QuizLog(Base):
#     __tablename__ = "quiz_logs"

#     id = Column(Integer, primary_key=True)
#     session_id = Column(String, ForeignKey("user_sessions.session_id"))
#     question_index = Column(Integer, nullable=False)
#     question_text = Column(String)
#     selected_option = Column(String)
#     correct_option = Column(String)
#     is_correct = Column(Boolean)

#     # Relationships
#     session = relationship("UserSession", back_populates="quiz_logs")


# class VowelStat(Base):
#     __tablename__ = "vowel_stats"

#     id = Column(Integer, primary_key=True)
#     session_id = Column(String, ForeignKey("user_sessions.session_id"))
#     vowel = Column(String, nullable=False)
#     correct = Column(Integer, default=0)
#     incorrect = Column(Integer, default=0)

#     # Relationships
#     session = relationship("UserSession", back_populates="vowel_stats")
