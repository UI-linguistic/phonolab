# src/services/quiz.py
from flask import json
from src.db import db
from src.models.quiz import QuizItem, QuizOption
from src.utils.format import format_quiz_http


def _load_quiz_json(path: str = None) -> dict:
    """Utility to load the quiz.json file."""
    if path is None:
        here = os.path.dirname(__file__)
        path = os.path.join(here, "../data/quiz.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def create_quiz_from_json_id(quiz_id: int, data: dict | None = None) -> QuizItem:
    """
    Create and return a QuizItem for the entry whose 'id' matches quiz_id.
    """
    if data is None:
        data = _load_quiz_json()
    # find the JSON object
    entry = next((q for q in data["quiz"] if q["id"] == quiz_id), None)
    if not entry:
        raise ValueError(f"Quiz id {quiz_id} not found in JSON")

    quiz = QuizItem(
        prompt_word=entry["samples"][0]["text"],
        prompt_ipa=entry["samples"][0]["IPA"],
        prompt_audio_url=entry["samples"][0]["audio"],
        feedback_correct=entry["feedback"]["correct"],
        feedback_incorrect=entry["feedback"]["incorrect"],
        vowel_id=None  # or entry.get("vowel_id")
    )

    # correct options
    for opt in entry["options_pool"]["correct_answers"]:
        quiz.options.append(QuizOption(
            word=opt["word"],
            ipa=opt["IPA"],
            audio_url=opt["audio"],
            is_correct=True,
            language=opt.get("language")
        ))
    # wrong options
    for opt in entry["options_pool"]["wrong_answers"]:
        quiz.options.append(QuizOption(
            word=opt["word"],
            ipa=opt["IPA"],
            audio_url=opt["audio"],
            is_correct=False,
            language=opt.get("language")
        ))

    db.session.add(quiz)
    db.session.commit()
    return quiz


def create_quiz_batch(data: dict):
    """
    Seeds the quiz database from quiz.json format.
    """
    if data is None:
        data = _load_quiz_json()

    QuizOption.query.delete()
    QuizItem.query.delete()
    db.session.commit()

    for entry in data["quiz"]:
        create_quiz_from_json_id(entry["id"], data)


def get_all_quizzes() -> QuizItem:
    """
    Retrieves all quiz items from the database.
    """
    return QuizItem.query.all()


def get_quiz_by_id(quiz_id) -> QuizItem:
    """
    Retrieves a quiz item by its ID.
    """
    return QuizItem.query.get(quiz_id)


def delete_quiz(quiz_id) -> bool:
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


def get_formatted_quiz_by_id(quiz_id) -> QuizItem | None:
    """
    Retrieves a quiz type 1 by its ID.
    """
    quiz = get_quiz_by_id(quiz_id)
    return format_quiz_http(quiz)
