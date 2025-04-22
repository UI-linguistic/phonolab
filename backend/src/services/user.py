# src/services/user.py

import uuid
from sqlalchemy.orm import Session
from models.user import UserSession, QuizLog, VowelStat


def create_session(db: Session) -> str:
    """Create a new user session and return its session_id."""
    session_id = str(uuid.uuid4())
    new_session = UserSession(session_id=session_id)
    db.add(new_session)
    db.commit()
    return session_id


def log_quiz_answer(db: Session, session_id: str, question_index: int,
                    question: str, selected: str, correct: str):
    """Store a quiz submission for the session."""
    is_correct = selected == correct
    log = QuizLog(
        session_id=session_id,
        question_index=question_index,
        question_text=question,
        selected_option=selected,
        correct_option=correct,
        is_correct=is_correct
    )
    db.add(log)

    # Update vowel performance
    update_vowel_stats(db, session_id, correct, is_correct)

    db.commit()
    return is_correct


def update_vowel_stats(db: Session, session_id: str, vowel: str, is_correct: bool):
    """Update (or create) vowel stats for this session."""
    stat = db.query(VowelStat).filter_by(session_id=session_id, vowel=vowel).first()
    if not stat:
        stat = VowelStat(session_id=session_id, vowel=vowel)
        db.add(stat)

    if is_correct:
        stat.correct += 1
    else:
        stat.incorrect += 1


def get_quiz_summary(db: Session, session_id: str):
    """Fetch quiz summary for a session."""
    logs = db.query(QuizLog).filter_by(session_id=session_id).all()
    score = sum(log.is_correct for log in logs)
    total = len(logs)

    return {
        "session_id": session_id,
        "score": score,
        "total": total,
        "answers": [
            {
                "index": log.question_index,
                "question": log.question_text,
                "selected": log.selected_option,
                "correct": log.correct_option,
                "is_correct": log.is_correct
            } for log in logs
        ]
    }


def get_vowel_performance(db: Session, session_id: str):
    """Get per-vowel stats."""
    stats = db.query(VowelStat).filter_by(session_id=session_id).all()
    return {
        stat.vowel: {
            "correct": stat.correct,
            "incorrect": stat.incorrect
        } for stat in stats
    }
