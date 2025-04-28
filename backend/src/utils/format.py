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

    vowel = lesson.vowel
    if not vowel:
        return None

    lesson_card = vowel.get_lesson_card()

    return {
        "id": lesson.id,
        "vowel_id": vowel.id,
        "phoneme": vowel.phoneme,
        "name": vowel.name,
        "description": vowel.description,
        "audio_url": vowel.audio_url,
        "mouth_image_url": vowel.mouth_image_url,
        "lesson_card": lesson_card
        # word_examples removed as they're not needed for lessons
    }


def format_lessons_http(lessons) -> list:
    """
    Formats a list of Lesson objects into the structure expected by the frontend.

    Args:
        lessons (List[Lesson]): The list of lesson instances to be formatted.

    Returns:
        list: A list of dictionaries matching the frontend lesson schema.
    """
    return [format_lesson_http(lesson) for lesson in lessons if lesson.vowel]
