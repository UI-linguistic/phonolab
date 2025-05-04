import json
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.exc import SQLAlchemyError

from src.db import db
from src.models.phoneme import Vowel
from src.utils.error_handling import handle_db_operation
from src.models.user import CompletedLesson
from src.models.lesson import Lesson, LessonInteraction, LessonType



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


# user functions

def get_all_lesson_ids():
    """Get a list of all lesson IDs"""
    lessons = Lesson.query.all()
    return [lesson.id for lesson in lessons]


def get_completed_lessons(session_id):
    """Get all lessons completed by a user"""
    completed = CompletedLesson.query.filter_by(session_id=session_id).all()
    return [lesson.lesson_id for lesson in completed]


def get_remaining_lessons(session_id):
    """Get all lessons not yet completed by a user"""
    all_lessons = get_all_lesson_ids()
    completed = get_completed_lessons(session_id)
    return [lid for lid in all_lessons if lid not in completed]


def get_lesson_progress(session_id):
    """Get lesson progress statistics"""
    completed = get_completed_lessons(session_id)
    all_lessons = get_all_lesson_ids()

    return {
        "completed": len(completed),
        "total": len(all_lessons),
        "percentage": (len(completed) / len(all_lessons) * 100) if all_lessons else 0,
        "completed_lessons": completed,
        "remaining_lessons": get_remaining_lessons(session_id)
    }


def get_latest_completed_lesson(session_id):
    """Get the most recently completed lesson"""
    latest = CompletedLesson.query.filter_by(session_id=session_id)\
        .order_by(CompletedLesson.completed_at.desc()).first()

    if not latest:
        return None

    return {
        "lesson_id": latest.lesson_id,
        "completed_at": latest.completed_at.isoformat()
    }


def build_vowel_tongue_position_matrix() -> List[Vowel]:
    """
    Build a 3x3 matrix of vowels for the tongue position interaction.
    
    The matrix follows this structure:
    [ i I, null, ʊ u]
    [ e ɛ, ʌ ə, o ɔ]
    [æ, null, ɑ]
    
    Each vowel in the matrix contains only essential fields:
    id, phoneme, name, audio_url, lips, tongue, mouth_image_url
    
    Returns:
        list: A 3x3 matrix with vowel objects or null values
    """
    matrix_structure = [
        [["i", "ɪ"], None, ["ʊ", "u"]],
        [["e", "ɛ"], ["ʌ", "ə"], ["o", "ɔ"]],
        [["æ"], None, ["ɑ"]]
    ]

    all_vowels = Vowel.query.all()
    vowel_dict = {vowel.phoneme: vowel for vowel in all_vowels}

    result_matrix = []
    
    for row in matrix_structure:
        result_row = []
        
        for cell in row:
            if cell is None:
                result_row.append(None)
            else:
                # Cell can be a list of vowel IDs or a single vowel ID
                if isinstance(cell, list):
                    cell_vowels = []
                    for vowel_id in cell:
                        vowel = vowel_dict.get(vowel_id)
                        if vowel:
                            cell_vowels.append({
                                "id": vowel.id,
                                "phoneme": vowel.phoneme,
                                "name": vowel.name,
                                "audio_url": vowel.audio_url,
                                "lips": vowel.lips,
                                "tongue": vowel.tongue,
                                "mouth_image_url": vowel.mouth_image_url
                            })
                    result_row.append(cell_vowels if cell_vowels else None)
                else:
                    vowel = vowel_dict.get(cell)
                    if vowel:
                        result_row.append({
                            "id": vowel.id,
                            "phoneme": vowel.phoneme,
                            "name": vowel.name,
                            "audio_url": vowel.audio_url,
                            "lips": vowel.lips,
                            "tongue": vowel.tongue,
                            "mouth_image_url": vowel.mouth_image_url
                        })
                    else:
                        result_row.append(None)
        
        result_matrix.append(result_row)
    
    return result_matrix

def build_vowel_lip_shape_config() -> dict:
    """
    Build the lip shape configuration for the Vowels 101 lesson.
    
    This includes:
    1. Two lip shape images (rounded and unrounded)
    2. A 4x3 table of individual vowels
    
    Returns:
        dict: Configuration for the lip shape interaction
    """
    all_vowels = Vowel.query.all()
    vowel_dict = {vowel.phoneme: vowel for vowel in all_vowels}
    
    # 4x3 table structure with vowel IDs
    table_structure = [
        ["i", "ɪ", "e", "ɛ"],
        ["æ", "ɑ", "ʌ", "ɔ"],
        ["u", "ʊ", "oʊ", "ə"]
    ]

    vowel_table = []
    
    for row in table_structure:
        table_row = []
        for vowel_id in row:
            vowel = vowel_dict.get(vowel_id)
            if vowel:
                table_row.append({
                    "id": vowel.id,
                    "phoneme": vowel.phoneme,
                    "name": vowel.name,
                    "audio_url": vowel.audio_url,
                    "lips": vowel.lips,
                    "tongue": vowel.tongue,
                    "mouth_image_url": vowel.mouth_image_url
                })
            else:
                table_row.append(None)
        vowel_table.append(table_row)
    
    # lip shape option
    lip_shape_config = {
        "lip_shapes": [
            {
                "id": "unrounded",
                "name": "Unrounded Lips",
                "description": "Lips are spread or in a neutral position.",
                "image_url": "/images/lips/unrounded.png"
            },
            {
                "id": "rounded",
                "name": "Rounded Lips",
                "description": "Lips are rounded and pushed forward.",
                "image_url": "/images/lips/rounded.png"
            }
        ],
        "vowel_table": vowel_table
    }
    
    return lip_shape_config

def create_vowels_101_lesson(title=None, description=None) -> Lesson:
    """
    Create a Vowels 101 lesson with the appropriate tongue position matrix and lip shapes.
    
    Returns:
        Lesson: A new Vowels 101 lesson
    """
    # Create the base lesson
    lesson = Lesson(
        title=title or "Vowels 101",
        description=description or "Learn the basics of vowel sounds and how they're produced.",
        lesson_type=LessonType.VOWELS_101.value,
        content={
            "introduction": "Vowels are sounds produced with an open vocal tract. They are classified based on tongue position and lip shape."
        }
    )

    tongue_position_config = {
        "matrix": build_vowel_tongue_position_matrix(),
        "labels": {
            "rows": ["High", "Mid", "Low"],
            "columns": ["Front", "Central", "Back"]
        }
    }
    
    tongue_position = LessonInteraction(
        interaction_type="tongue_position",
        config=tongue_position_config
    )

    lip_shape = LessonInteraction(
        interaction_type="lip_shape",
        config=build_vowel_lip_shape_config()
    )

    lesson.interactions.append(tongue_position)
    lesson.interactions.append(lip_shape)

    return lesson
