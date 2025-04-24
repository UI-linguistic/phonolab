# src/services/quiz.py
from src.db import db
from src.models.quiz import QuizItem, QuizOption


def create_quiz(prompt_word, prompt_ipa, prompt_audio_url, options, vowel_id=None):
    """
    Creates a new quiz item with its answer options.
    """
    quiz = QuizItem(
        prompt_word=prompt_word,
        prompt_ipa=prompt_ipa,
        prompt_audio_url=prompt_audio_url,
        vowel_id=vowel_id
    )

    for option in options:
        quiz_option = QuizOption(
            word=option["word"],
            ipa=option["ipa"],
            audio_url=option["audio_url"],
            is_correct=option.get("is_correct", False)
        )
        quiz.options.append(quiz_option)

    db.session.add(quiz)
    db.session.commit()
    return quiz


def get_all_quizzes():
    """
    Retrieves all quiz items from the database.
    """
    return QuizItem.query.all()


def get_quiz_by_id(quiz_id):
    """
    Retrieves a quiz item by its ID.
    """
    return QuizItem.query.get(quiz_id)


def delete_quiz(quiz_id):
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

def format_quiz_for_frontend(quiz: QuizItem):
    """
    Formats a QuizItem object into the structure expected by the frontend.

    This includes:
    - The quiz ID and target IPA symbol.
    - A list of sample words (currently only the prompt word).
    - Grouped correct and incorrect options with language, word, IPA, and audio URL.
    - Feedback messages for correct and incorrect answers.

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


def get_formatted_quiz_by_id(quiz_id):
    """
    Retrieves a quiz type 1 by its ID.
    """
    quiz = get_quiz_by_id(quiz_id)
    return format_quiz_for_frontend(quiz)
