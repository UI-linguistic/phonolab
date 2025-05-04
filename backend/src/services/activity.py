# src/services/activity.py
from datetime import datetime
from src.services.lesson import get_latest_completed_lesson
from src.services.quiz import get_latest_quiz_attempt


def get_latest_activity(session_id):
    """Determine the most recent activity (lesson or quiz)"""
    latest_lesson = get_latest_completed_lesson(session_id)
    latest_quiz = get_latest_quiz_attempt(session_id)

    if not latest_lesson and not latest_quiz:
        return None

    if latest_lesson and not latest_quiz:
        return {
            "type": "lesson",
            **latest_lesson
        }

    if latest_quiz and not latest_lesson:
        return {
            "type": "quiz",
            **latest_quiz
        }

    # both exist, compare timestamps
    lesson_time = datetime.fromisoformat(latest_lesson["completed_at"])
    quiz_time = datetime.fromisoformat(latest_quiz["attempted_at"])

    if lesson_time > quiz_time:
        return {
            "type": "lesson",
            **latest_lesson
        }
    return {
        "type": "quiz",
        **latest_quiz
    }
