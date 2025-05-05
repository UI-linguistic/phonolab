# src/services/quiz.py
import os

from flask import json

from src.db import db
from src.models.quiz import QuizItem, QuizOption
from src.utils.format import format_quiz_http
from src.models.user import QuizAttempt


def _load_quiz_json(path: str = None) -> dict:
    """Utility to load the quiz.json file."""
    if path is None:
        here = os.path.dirname(__file__)
        path = os.path.join(here, "../data/quiz.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def create_quiz_from_json_id(quiz_id: int, data: dict | None = None) -> QuizItem:
    """
    Create and return a QuizItem for the entry whose 'id' matches quiz_id.
    """
    if data is None:
        data = _load_quiz_json()
    # find the JSON object
    entry = next((q for q in data["quiz"] if q["id"] == quiz_id), None)
    if not entry:
        raise ValueError(f"Quiz id {quiz_id} not found in JSON")

    quiz = QuizItem(
        prompt_word=entry["samples"][0]["text"],
        prompt_ipa=entry["samples"][0]["IPA"],
        prompt_audio_url=entry["samples"][0]["audio"],
        feedback_correct=entry["feedback"]["correct"],
        feedback_incorrect=entry["feedback"]["incorrect"],
        vowel_id=None  # or entry.get("vowel_id")
    )

    # correct options
    for opt in entry["options_pool"]["correct_answers"]:
        quiz.options.append(QuizOption(
            word=opt["word"],
            ipa=opt["IPA"],
            audio_url=opt["audio"],
            is_correct=True,
            language=opt.get("language")
        ))
    # wrong options
    for opt in entry["options_pool"]["wrong_answers"]:
        quiz.options.append(QuizOption(
            word=opt["word"],
            ipa=opt["IPA"],
            audio_url=opt["audio"],
            is_correct=False,
            language=opt.get("language")
        ))

    db.session.add(quiz)
    db.session.commit()
    return quiz


def get_all_quizzes() -> QuizItem:
    """
    Retrieves all quiz items from the database.
    """
    return QuizItem.query.all()


def get_quiz_by_id(quiz_id) -> QuizItem:
    """
    Retrieves a quiz item by its ID.
    """
    return QuizItem.query.get(quiz_id)


def delete_quiz(quiz_id) -> bool:
    """
    Deletes a quiz item and its options.
    """
    quiz = QuizItem.query.get(quiz_id)
    if quiz:
        db.session.delete(quiz)
        db.session.commit()
        return True
    return False


def update_quiz_options(quiz_id, new_options):
    """
    Replaces all options for a quiz item with new ones.
    """
    quiz = QuizItem.query.get(quiz_id)
    if not quiz:
        return None

    # Clear existing options
    quiz.options.clear()

    # Add new options
    for option in new_options:
        quiz_option = QuizOption(
            word=option["word"],
            ipa=option["ipa"],
            audio_url=option["audio_url"],
            is_correct=option.get("is_correct", False)
        )
        quiz.options.append(quiz_option)

    db.session.commit()
    return quiz


def get_formatted_quiz_by_id(quiz_id) -> QuizItem | None:
    """
    Retrieves a quiz type 1 by its ID.
    """
    quiz = get_quiz_by_id(quiz_id)
    return format_quiz_http(quiz)


# user functions

def get_quiz_attempts(session_id):
    """Get all quiz attempts for a user"""
    attempts = QuizAttempt.query.filter_by(session_id=session_id).all()

    return [
        {
            "quiz_id": attempt.quiz_id,
            "score": attempt.score,
            "total": attempt.total,
            "percentage": (attempt.score / attempt.total * 100) if attempt.total > 0 else 0,
            "attempted_at": attempt.attempted_at.isoformat()
        }
        for attempt in attempts
    ]


def get_latest_quiz_results(session_id):
    """Get the latest result for each quiz attempted by a user"""
    attempts = QuizAttempt.query.filter_by(session_id=session_id).all()

    latest_attempts = {}
    for attempt in attempts:
        if attempt.quiz_id not in latest_attempts or \
           attempt.attempted_at > latest_attempts[attempt.quiz_id]["attempted_at"]:
            latest_attempts[attempt.quiz_id] = {
                "score": attempt.score,
                "total": attempt.total,
                "percentage": (attempt.score / attempt.total * 100) if attempt.total > 0 else 0,
                "attempted_at": attempt.attempted_at.isoformat()
            }

    return latest_attempts


def get_quiz_performance(session_id):
    """Get overall quiz performance statistics"""
    attempts = QuizAttempt.query.filter_by(session_id=session_id).all()

    if not attempts:
        return {
            "attempts": 0,
            "average_score": 0
        }

    total_score = sum(attempt.score for attempt in attempts)
    total_questions = sum(attempt.total for attempt in attempts)

    return {
        "attempts": len(attempts),
        "average_score": (total_score / total_questions * 100) if total_questions > 0 else 0
    }


def get_latest_quiz_attempt(session_id):
    """Get the most recent quiz attempt"""
    latest = QuizAttempt.query.filter_by(session_id=session_id)\
        .order_by(QuizAttempt.attempted_at.desc()).first()

    if not latest:
        return None

    return {
        "quiz_id": latest.quiz_id,
        "score": latest.score,
        "total": latest.total,
        "percentage": (latest.score / latest.total * 100) if latest.total > 0 else 0,
        "attempted_at": latest.attempted_at.isoformat()
    }
