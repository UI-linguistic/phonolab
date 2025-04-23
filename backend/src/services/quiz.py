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
