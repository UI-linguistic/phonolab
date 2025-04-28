import json
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.exc import SQLAlchemyError

from src.db import db
from src.models.lesson import Lesson
from src.models.phoneme import Vowel
from src.utils.error_handling import handle_db_operation


# --- Lesson CRUD Operations ---
def get_all_lessons() -> List[Lesson]:
    """
    Get all lessons from the database.

    Returns:
        List[Lesson]: List of all lessons
    """
    return Lesson.query.all()


def get_lesson_by_id(lesson_id: int) -> Optional[Lesson]:
    """
    Get a lesson by its ID.

    Args:
        lesson_id (int): The ID of the lesson to retrieve

    Returns:
        Optional[Lesson]: The lesson if found, None otherwise
    """
    return Lesson.query.get(lesson_id)


def get_lesson_by_vowel_id(vowel_id: str) -> Optional[Lesson]:
    """
    Get a lesson by its associated vowel ID.

    Args:
        vowel_id (str): The ID of the vowel associated with the lesson

    Returns:
        Optional[Lesson]: The lesson if found, None otherwise
    """
    return Lesson.query.filter_by(vowel_id=vowel_id).first()


def create_lesson(vowel_id: str) -> Tuple[Optional[Lesson], Optional[str]]:
    """
    Create a new lesson for a vowel.

    Args:
        vowel_id (str): ID of the vowel for this lesson

    Returns:
        Tuple[Optional[Lesson], Optional[str]]: (Created lesson, Error message)
    """
    try:
        vowel = Vowel.query.get(vowel_id)
        if not vowel:
            return None, f"Vowel with ID {vowel_id} not found"

        existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
        if existing_lesson:
            return existing_lesson, None  # Return existing lesson without error

        lesson = Lesson(vowel_id=vowel_id)
        db.session.add(lesson)
        db.session.commit()
        return lesson, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error creating lesson: {str(e)}"


def update_lesson(lesson_id: int, vowel_id: str) -> Tuple[Optional[Lesson], Optional[str]]:
    """
    Update an existing lesson.

    Args:
        lesson_id (int): ID of the lesson to update
        vowel_id (str): ID of the vowel for this lesson

    Returns:
        Tuple[Optional[Lesson], Optional[str]]: (Updated lesson, Error message)
    """
    try:
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return None, f"Lesson with ID {lesson_id} not found"

        vowel = Vowel.query.get(vowel_id)
        if not vowel:
            return None, f"Vowel with ID {vowel_id} not found"

        # Check if another lesson already uses this vowel
        existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
        if existing_lesson and existing_lesson.id != lesson_id:
            return None, f"Another lesson already exists for vowel {vowel_id}"

        lesson.vowel_id = vowel_id
        db.session.commit()
        return lesson, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error updating lesson: {str(e)}"


def delete_lesson(lesson_id: int) -> Tuple[bool, Optional[str]]:
    """
    Delete a lesson by its ID.

    Args:
        lesson_id (int): ID of the lesson to delete

    Returns:
        Tuple[bool, Optional[str]]: (Success status, Error message)
    """
    try:
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return False, f"Lesson with ID {lesson_id} not found"

        db.session.delete(lesson)
        db.session.commit()
        return True, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return False, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return False, f"Error deleting lesson: {str(e)}"

# --- Lesson Card CRUD Operations ---


def get_lesson_by_vowel_id_with_details(vowel_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a lesson by vowel ID with detailed vowel information and lesson card.

    Args:
        vowel_id (str): The ID of the vowel

    Returns:
        Optional[Dict[str, Any]]: Dictionary with lesson, vowel details, and lesson card, or None if not found
    """
    lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
    if not lesson:
        return None

    vowel = lesson.vowel

    # Get lesson card data from vowel
    lesson_card = {}
    if vowel:
        lesson_card = {
            "pronounced": vowel.pronounced,
            "common_spellings": vowel.common_spellings,
            "lips": vowel.lips,
            "tongue": vowel.tongue,
            "example_words": vowel.example_words
        }

    return {
        "lesson_id": lesson.id,
        "vowel": vowel.to_dict() if vowel else None,
        "lesson_card": lesson_card
    }


def get_lesson_with_vowel_details(lesson_id: int) -> Optional[Dict[str, Any]]:
    """
    Get a lesson with detailed vowel information and lesson card.

    Args:
        lesson_id (int): The ID of the lesson

    Returns:
        Optional[Dict[str, Any]]: Dictionary with lesson, vowel details, and lesson card, or None if not found
    """
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return None

    vowel = lesson.vowel

    # Get lesson card data from vowel
    lesson_card = {}
    if vowel:
        lesson_card = {
            "pronounced": vowel.pronounced,
            "common_spellings": vowel.common_spellings,
            "lips": vowel.lips,
            "tongue": vowel.tongue,
            "example_words": vowel.example_words
        }

    return {
        "lesson_id": lesson.id,
        "vowel": vowel.to_dict() if vowel else None,
        "lesson_card": lesson_card
    }


def create_lessons_for_all_vowels() -> Tuple[int, Optional[str]]:
    """
    Create lessons for all vowels that don't have lessons yet.

    Returns:
        Tuple[int, Optional[str]]: (Number of lessons created, Error message)
    """
    def _create_lessons():
        # Get all vowels
        vowels = Vowel.query.all()

        # Count created lessons
        created_count = 0

        for vowel in vowels:
            # Check if lesson exists
            existing_lesson = Lesson.query.filter_by(vowel_id=vowel.id).first()
            if not existing_lesson:
                # Create new lesson
                lesson = Lesson(vowel_id=vowel.id)
                db.session.add(lesson)
                created_count += 1

        db.session.commit()
        return created_count

    return handle_db_operation(_create_lessons, 0)


def seed_lessons_from_data(vowel_ids: List[str], clear_existing: bool = False) -> Tuple[int, Optional[str]]:
    """
    Seed lessons from a list of vowel IDs.

    Args:
        vowel_ids (List[str]): List of vowel IDs to create lessons for
        clear_existing (bool): Whether to clear existing lessons before seeding

    Returns:
        Tuple[int, Optional[str]]: (Number of lessons created, Error message)
    """
    try:
        # Clear existing lessons if requested
        if clear_existing:
            Lesson.query.delete()
            db.session.commit()

        # Create new lessons
        created_count = 0
        for vowel_id in vowel_ids:
            # Check if vowel exists
            vowel = Vowel.query.get(vowel_id)
            if not vowel:
                continue

            # Skip if lesson already exists for this vowel and we're not clearing
            if not clear_existing and Lesson.query.filter_by(vowel_id=vowel_id).first():
                continue

            # Create the lesson
            lesson = Lesson(vowel_id=vowel_id)
            db.session.add(lesson)
            created_count += 1

        db.session.commit()
        return created_count, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return 0, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return 0, f"Error seeding lessons: {str(e)}"


def seed_lessons_from_json_file(file_path: str, clear_existing: bool = False) -> Tuple[int, Optional[str]]:
    """
    Seed lessons from a JSON file.

    Args:
        file_path (str): Path to the JSON file
        clear_existing (bool): Whether to clear existing lessons before seeding

    Returns:
        Tuple[int, Optional[str]]: (Number of lessons created, Error message)
    """
    try:
        # Read the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            lessons_data = json.load(f)

        # Validate the data structure
        if not isinstance(lessons_data, list):
            return 0, "JSON file must contain a list of lesson data"

        # Seed the lessons
        return seed_lessons_from_data(lessons_data, clear_existing)

    except FileNotFoundError:
        return 0, f"File not found: {file_path}"
    except json.JSONDecodeError:
        return 0, f"Invalid JSON format in file: {file_path}"
    except Exception as e:
        return 0, f"Error reading JSON file: {str(e)}"


def get_lesson_stats():
    """
    Get statistics about lessons in the database.

    Returns:
        dict: A dictionary containing various statistics about lessons.
    """
    return
    # try:
    #     total_lessons = Lesson.query.count()
    #     total_instructions = LessonInstruction.query.count()

    #     # Get vowels with lessons
    #     vowels_with_lessons = db.session.query(Vowel).join(Lesson).all()
    #     vowels_with_lessons_count = len(vowels_with_lessons)

    #     # Get vowels without lessons - fix E711 comparison to None
    #     vowels_without_lessons = db.session.query(Vowel).outerjoin(Lesson).filter(Lesson.id is None).all()
    #     vowels_without_lessons_count = len(vowels_without_lessons)

    #     # Get average instructions per lesson
    #     avg_instructions = total_instructions / total_lessons if total_lessons > 0 else 0

    #     return {
    #         "total_lessons": total_lessons,
    #         "total_instructions": total_instructions,
    #         "vowels_with_lessons": vowels_with_lessons_count,
    #         "vowels_without_lessons": vowels_without_lessons_count,
    #         "vowels_without_lessons_ids": [v.id for v in vowels_without_lessons],
    #         "avg_instructions_per_lesson": avg_instructions
    #     }
    # except Exception as e:
    #     print(f"Error getting lesson stats: {str(e)}")
    #     return {
    #         "total_lessons": 0,
    #         "total_instructions": 0,
    #         "vowels_with_lessons": 0,
    #         "vowels_without_lessons": 0,
    #         "vowels_without_lessons_ids": [],
    #         "avg_instructions_per_lesson": 0
    #     }
