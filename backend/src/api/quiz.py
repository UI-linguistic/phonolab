# # src/api/quiz.py
from flask import Blueprint

from src.services.quiz import get_formatted_quiz_by_id
from src.utils.format import error_response, success_response

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")


@quiz_bp.route("/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    """
    Retrieves a quiz by its ID.
    """
    formatted = get_formatted_quiz_by_id(quiz_id)
    if not formatted:
        return error_response("Quiz not found", 404)
    return success_response("Quiz retrieved", {"quiz": formatted})
