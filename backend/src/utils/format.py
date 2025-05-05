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


def format_lesson_http(lesson) -> dict | None:
    """
    Formats a Lesson object into the structure expected by the HTTP client.

    Args:
        lesson (Lesson): The lesson instance to be formatted.

    Returns:
        dict | None: A dictionary matching the HTTP client lesson schema,
                     or None if the lesson does not exist.
    """
    if not lesson:
        return None

    # base lesson data
    formatted = {
        "id": lesson.id,
        "title": lesson.title,
        "description": lesson.description,
        "lesson_type": lesson.lesson_type,
        "content": lesson.content
    }

    # vowel data if present
    if lesson.vowel:
        formatted["vowel"] = {
            "id": lesson.vowel.id,
            "phoneme": lesson.vowel.phoneme,
            "name": lesson.vowel.name,
            "audio_url": lesson.vowel.audio_url,
            "mouth_image_url": lesson.vowel.mouth_image_url
        }

    # interactions
    formatted["interactions"] = [
        {
            "type": interaction.interaction_type,
            "config": interaction.config
        }
        for interaction in lesson.interactions
    ]

    return formatted


def format_lessons_http(lessons) -> list:
    """
    Formats a list of Lesson objects into the structure expected by the frontend.

    Args:
        lessons (List[Lesson]): The list of lesson instances to be formatted.

    Returns:
        list: A list of dictionaries matching the frontend lesson schema.
    """
    return [format_lesson_http(lesson) for lesson in lessons if lesson.vowel]


def format_quiz_attempt_http(attempt) -> dict:
    """
    Formats a QuizAttempt object into the structure expected by the HTTP client.

    Args:
        attempt (QuizAttempt): The quiz attempt to format

    Returns:
        dict: A dictionary with the formatted quiz attempt data
    """
    percentage = (attempt.score / attempt.total * 100) if attempt.total > 0 else 0

    return {
        "status": "success",
        "attempt_id": attempt.id,
        "score": attempt.score,
        "total": attempt.total,
        "percentage": percentage
    }


def format_session_http(session) -> dict:
    """
    Formats a UserSession object into the structure expected by the HTTP client.

    Args:
        session (UserSession): The session to format

    Returns:
        dict: A dictionary with the formatted session data
    """
    return {
        "session_id": session.session_id,
        "started_at": session.started_at.isoformat()
    }
