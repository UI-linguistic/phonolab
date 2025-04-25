# src/api/user.py

from flask import Blueprint, request
from src.services.user import log_quiz_attempt
from src.models.user import QuizAttempt
from src.utils.format import success_response, error_response

user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.route("/quiz-score", methods=["POST"])
def submit_quiz_score():
    """
    Logs a quiz attempt.
    **Expected JSON:**
    - session_id (str)
    - quiz_id (int)
    - score (int)
    - total (int)
    """
    data = request.get_json()
    session_id = data.get("session_id")
    quiz_id = data.get("quiz_id")
    answers = data.get("answers")

    if not all([session_id, quiz_id]) or not isinstance(answers, list):
        return error_response("Missing one or more required fields", 400)

    attempt = log_quiz_attempt(session_id, quiz_id, answers)

    percentage = round((attempt.score / attempt.total) * 100)

    return success_response("Quiz attempt logged", {
        "attempt": {
            "session_id": attempt.session_id,
            "quiz_id": attempt.quiz_id,
            "score": attempt.score,
            "total": attempt.total,
            "percentage": percentage
        }
    })


@user_bp.route("/quiz-score", methods=["GET"])
def get_quiz_score():
    """
    Gets the most recent quiz score for a session.
    Query params:
    - session_id (str)
    - quiz_id (int)
    """
    session_id = request.args.get("session_id")
    quiz_id = request.args.get("quiz_id")

    if not session_id or not quiz_id:
        return error_response("Missing session_id or quiz_id", 400)

    attempt = QuizAttempt.query.filter_by(session_id=session_id,
                                          quiz_id=quiz_id).order_by(QuizAttempt.attempted_at.desc()).first()

    if not attempt:
        return error_response("No attempt found", 404)

    percentage = round((attempt.score / attempt.total) * 100)

    return success_response("Quiz score retrieved", {
        "score": attempt.score,
        "total": attempt.total,
        "percentage": percentage,
        "timestamp": attempt.attempted_at.isoformat()
    })
