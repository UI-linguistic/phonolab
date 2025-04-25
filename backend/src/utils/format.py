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
    Formats a Lesson object into the structure expected by the frontend.
    
    Args:
        lesson (Lesson): The lesson instance to be formatted.
        
    Returns:
        dict | None: A dictionary matching the frontend VowelLesson schema,
                     or None if the lesson does not exist.
    """
    if not lesson or not lesson.vowel:
        return None
    
    vowel = lesson.vowel
    instruction_texts = [instr.text for instr in lesson.instructions] if lesson.instructions else []
    pronounced = ""
    common_spellings = []
    lips = ""
    tongue = ""
    example_words = []
    
    for text in instruction_texts:
        if text.startswith("Pronounced:"):
            pronounced = text.replace("Pronounced:", "").strip()
        elif text.startswith("Common Spellings:"):
            spellings_text = text.replace("Common Spellings:", "").strip()
            common_spellings = [s.strip() for s in spellings_text.split(',')]
        elif text.startswith("Lips:"):
            lips = text.replace("Lips:", "").strip()
        elif text.startswith("Tongue:"):
            tongue = text.replace("Tongue:", "").strip()
        elif text.startswith("Example Words:"):
            words_text = text.replace("Example Words:", "").strip()
            example_words = [w.strip() for w in words_text.split(',')]
    
    # Get example words from word examples if not found in instructions
    if not example_words and hasattr(vowel, 'word_examples'):
        example_words = [ex.word for ex in vowel.word_examples][:5]  # Limit to 5 examples
    
    # Generate mouth image URL based on vowel ID - TODO: configure the real path
    mouth_image_url = f"/images/mouth-positions/{vowel.id}.svg"
    
    return {
        "id": lesson.id,
        "target": vowel.phoneme,
        "audio_url": vowel.audio_url,
        "mouth_image_url": mouth_image_url,
        "pronounced": pronounced or f"as in '{vowel.ipa_example}'",
        "common_spellings": common_spellings or ["a", "e", "i", "o", "u"],
        "lips": lips or "Neutral position",
        "tongue": tongue or "Mid-position in mouth",
        "example_words": example_words or [vowel.ipa_example.split()[0] if vowel.ipa_example else ""]
    }

def format_lessons_http(lessons) -> dict:
    """
    Formats a list of Lesson objects into the structure expected by the frontend.
    
    Args:
        lessons (List[Lesson]): The list of lesson instances to be formatted.
        
    Returns:
        dict: A dictionary containing the formatted lessons in the 'learn' key.
    """
    formatted_lessons = [format_lesson_http(lesson) for lesson in lessons if lesson and lesson.vowel]
    # Filter out None values (lessons that couldn't be formatted)
    formatted_lessons = [lesson for lesson in formatted_lessons if lesson]
    
    return {
        "learn": formatted_lessons
    }
