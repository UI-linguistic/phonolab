from flask import jsonify


def success_response(message: str = "Success", data: dict = None, status_code: int = 200):
    """
    Return a standardized success response.
    """
    payload = {"status": "success", "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code


def error_response(message: str = "An error occurred", status_code: int = 400, errors: dict = None):
    """
    Return a standardized error response.
    """
    payload = {"status": "error", "message": message}
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status_code


def format_quiz_http(quiz) -> dict | None:
    """
    Formats a QuizItem object into the structure expected by the frontend.

    Args:
        quiz (QuizItem): The quiz instance to be formatted.

    Returns:
        dict | None: A dictionary matching the frontend quiz schema,
                     or None if the quiz does not exist.
    """
    if not quiz:
        return None

    correct_options = [opt for opt in quiz.options if opt.is_correct]
    wrong_options = [opt for opt in quiz.options if not opt.is_correct]

    return {
        "id": quiz.id,
        "target": quiz.prompt_ipa,
        "samples": [
            {
                "text": quiz.prompt_word,
                "IPA": quiz.prompt_ipa,
                "audio": quiz.prompt_audio_url
            }
        ],
        "options_pool": {
            "correct_answers": [
                {
                    "language": opt.language or "Unknown",
                    "word": opt.word,
                    "IPA": opt.ipa,
                    "audio": opt.audio_url
                }
                for opt in correct_options
            ],
            "wrong_answers": [
                {
                    "language": opt.language or "Unknown",
                    "word": opt.word,
                    "IPA": opt.ipa,
                    "audio": opt.audio_url
                }
                for opt in wrong_options
            ]
        },
        "feedback": {
            "correct": quiz.feedback_correct or "Well done!",
            "incorrect": quiz.feedback_incorrect or "Try again."
        }
    }
