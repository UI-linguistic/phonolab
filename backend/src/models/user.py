# src/models/user.py
from datetime import datetime, UTC
from src.db import db


class SessionUser(db.Model):
    """
    Tracks anonymous users by UUID stored in their browser cookies.
    """
    __tablename__ = "session_users"

    id = db.Column(db.String, primary_key=True)
    first_seen = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    quiz_attempts = db.relationship("QuizAttempt", backref="user", lazy=True)

    def touch(self):
        """Update last_seen timestamp when user is active"""
        self.last_seen = datetime.utcnow()


class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String, db.ForeignKey("session_users.id"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)

    quiz = db.relationship("Quiz", backref="attempts")
