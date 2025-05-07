# src/api/quiz.py
from flask import Blueprint
# from src.services.quiz import get_formatted_quiz_by_id
# from src.utils.format import error_response, success_response

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")


# @quiz_bp.route("/<int:quiz_id>", methods=["GET"])
# def get_quiz(quiz_id):
#     """
#     Retrieves a quiz by its ID.

#     Args:
#         quiz_id (int): The unique identifier of the quiz to retrieve

#     Returns:
#         JSON: A success response containing the quiz data:
#             - status: "success"
#             - message: Success message
#             - data: Object containing:
#                 - quiz: The formatted quiz object with:
#                     - id: Quiz identifier
#                     - target: Target IPA sound
#                     - samples: List of sample words with text, IPA, and audio
#                     - options_pool: Object containing correct_answers and wrong_answers
#                     - feedback: Object with correct and incorrect feedback messages

#     Raises:
#         404: If the quiz with the specified ID is not found
#     """
#     formatted = get_formatted_quiz_by_id(quiz_id)

#     if not formatted:
#         return error_response("Quiz not found", 404)

#     return success_response("Quiz retrieved", {"quiz": formatted})
