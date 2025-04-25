# src/services/user.py
from src.db import db
from src.models.user import UserSession, CompletedLesson, QuizAttempt


def get_or_create_session(session_id):
    session = UserSession.query.filter_by(session_id=session_id).first()
    if not session:
        session = UserSession(session_id=session_id)
        db.session.add(session)
        db.session.commit()
    return session


def mark_lesson_complete(session_id, lesson_id):
    # session = get_or_create_session(session_id)
    existing = CompletedLesson.query.filter_by(session_id=session_id, lesson_id=lesson_id).first()
    if not existing:
        db.session.add(CompletedLesson(session_id=session_id, lesson_id=lesson_id))
        db.session.commit()
    return True


def log_quiz_attempt(session_id, quiz_id, answers):
    correct = sum(1 for ans in answers if ans.get("is_correct"))
    total = len(answers)

    attempt = QuizAttempt(
        session_id=session_id,
        quiz_id=quiz_id,
        score=correct,
        total=total
    )

    db.session.add(attempt)
    db.session.commit()
    return attempt
