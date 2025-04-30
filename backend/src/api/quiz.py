# # src/api/quiz.py
from flask import Blueprint, request

from src.services.quiz import create_quiz, delete_quiz, get_all_quizzes, get_quiz_by_id, update_quiz_options
from src.utils.format import error_response, success_response

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")


@quiz_bp.route("/", methods=["GET"])
def list_quizzes():
    """
    Retrieves all quizzes.
    """
    quizzes = get_all_quizzes()
    return success_response("Quizzes retrieved", {"quizzes": [q.to_dict() for q in quizzes]})


@quiz_bp.route("/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    """
    Retrieves a quiz by its ID.
    """
    quiz = get_quiz_by_id(quiz_id)
    if not quiz:
        return error_response("Quiz not found", 404)
    return success_response("Quiz retrieved", {"quiz": quiz.to_dict()})


@quiz_bp.route("/", methods=["POST"])
def create_quiz_route():
    """
    Creates a new quiz.
    Expects:
    - prompt_word: str
    - prompt_ipa: str
    - prompt_audio_url: str
    - question_audio_url: str
    - correct_options: list of audio URLs
    - wrong_option: str
    - vowel_id: str (optional)
    """
    try:
        data = request.get_json()
        prompt_word = data["prompt_word"]
        prompt_ipa = data["prompt_ipa"]
        prompt_audio_url = data["prompt_audio_url"]
        correct_options = data["correct_options"]
        wrong_option = data["wrong_option"]
        vowel_id = data.get("vowel_id")

        # Create answer options list
        options = [{"word": prompt_word, "ipa": prompt_ipa, "audio_url": url, "is_correct": True}
                   for url in correct_options]

        options.append({
            "word": prompt_word,
            "ipa": prompt_ipa,
            "audio_url": wrong_option,
            "is_correct": False
        })

        quiz = create_quiz(
            prompt_word=prompt_word,
            prompt_ipa=prompt_ipa,
            prompt_audio_url=prompt_audio_url,
            options=options,
            vowel_id=vowel_id
        )

        return success_response("Quiz created", {"quiz": quiz.to_dict()}, 201)

    except KeyError as e:
        return error_response(f"Missing field: {str(e)}", 400)
    except Exception as e:  # fallback for unexpected issues
        return error_response(f"Error creating quiz: {str(e)}", 500)


@quiz_bp.route("/<int:quiz_id>", methods=["PUT"])
def update_quiz(quiz_id):
    """
    Updates quiz options.

    **Expected JSON Body:**
    - options: list of new answer options
    """
    data = request.get_json()
    new_options = data.get("options")
    if not new_options:
        return error_response("Missing options", 400)

    updated_quiz = update_quiz_options(quiz_id, new_options)
    if not updated_quiz:
        return error_response("Quiz not found", 404)

    return success_response("Quiz updated", {"quiz": updated_quiz.to_dict()})


@quiz_bp.route("/<int:quiz_id>", methods=["DELETE"])
def delete_quiz_route(quiz_id):
    """
    Deletes a quiz and its options.
    """
    success = delete_quiz(quiz_id)
    if not success:
        return error_response("Quiz not found", 404)

    return success_response("Quiz deleted")
