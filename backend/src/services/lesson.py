from typing import Any, Dict, List, Optional, Tuple, Union

from sqlalchemy.exc import SQLAlchemyError

from models.lesson import Lesson, LessonInstruction
from src.db import db
from src.models.phoneme import Vowel

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


def create_lesson(data: Dict[str, Any]) -> Tuple[Optional[Lesson], Optional[str]]:
    """
    Create a new lesson.

    Args:
        data (Dict[str, Any]): Dictionary containing lesson data
            Required keys:
                - vowel_id (str): ID of the vowel for this lesson
            Optional keys:
                - instructions (List[Dict]): List of instruction data
                  Each instruction should have:
                  - text (str): The instruction text

    Returns:
        Tuple[Optional[Lesson], Optional[str]]: (Created lesson, Error message)
    """
    try:
        vowel_id = data.get('vowel_id')
        if not vowel_id:
            return None, "Vowel ID is required"

        vowel = Vowel.query.get(vowel_id)
        if not vowel:
            return None, f"Vowel with ID {vowel_id} not found"

        existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
        if existing_lesson:
            return None, f"Lesson for vowel {vowel_id} already exists"

        lesson = Lesson(vowel_id=vowel_id)
        db.session.add(lesson)

        instructions_data = data.get('instructions', [])
        for instruction_data in instructions_data:
            if 'text' in instruction_data:
                instruction = LessonInstruction(
                    text=instruction_data['text'],
                    lesson=lesson
                )
                db.session.add(instruction)

        db.session.commit()
        return lesson, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error creating lesson: {str(e)}"


def update_lesson(lesson_id: int, data: Dict[str, Any]) -> Tuple[Optional[Lesson], Optional[str]]:
    """
    Update an existing lesson.

    Args:
        lesson_id (int): ID of the lesson to update
        data (Dict[str, Any]): Dictionary containing lesson data to update
            Optional keys:
                - vowel_id (str): ID of the vowel for this lesson
                - instructions (List[Dict]): List of instruction data
                  Each instruction should have:
                  - id (int, optional): ID of existing instruction to update
                  - text (str): The instruction text

    Returns:
        Tuple[Optional[Lesson], Optional[str]]: (Updated lesson, Error message)
    """
    try:
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return None, f"Lesson with ID {lesson_id} not found"

        # Update vowel_id if provided
        if 'vowel_id' in data:
            vowel_id = data['vowel_id']
            vowel = Vowel.query.get(vowel_id)
            if not vowel:
                return None, f"Vowel with ID {vowel_id} not found"

            # Check if another lesson already uses this vowel
            existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
            if existing_lesson and existing_lesson.id != lesson_id:
                return None, f"Another lesson already exists for vowel {vowel_id}"

            lesson.vowel_id = vowel_id

        # Update instructions if provided
        if 'instructions' in data:
            instructions_data = data['instructions']

            for instruction_data in instructions_data:
                if 'id' in instruction_data:
                    instruction_id = instruction_data['id']
                    instruction = LessonInstruction.query.get(instruction_id)

                    if not instruction or instruction.lesson_id != lesson.id:
                        return None, f"Instruction with ID {instruction_id} not found in this lesson"

                    if 'text' in instruction_data:
                        instruction.text = instruction_data['text']
                else:
                    if 'text' in instruction_data:
                        instruction = LessonInstruction(
                            text=instruction_data['text'],
                            lesson=lesson
                        )
                        db.session.add(instruction)

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

# --- Lesson Instruction CRUD Operations ---


def get_instruction_by_id(instruction_id: int) -> Optional[LessonInstruction]:
    """
    Get a lesson instruction by its ID.

    Args:
        instruction_id (int): The ID of the instruction to retrieve

    Returns:
        Optional[LessonInstruction]: The instruction if found, None otherwise
    """
    return LessonInstruction.query.get(instruction_id)


def get_instructions_by_lesson_id(lesson_id: int) -> List[LessonInstruction]:
    """
    Get all instructions for a specific lesson.

    Args:
        lesson_id (int): The ID of the lesson

    Returns:
        List[LessonInstruction]: List of instructions for the lesson
    """
    return LessonInstruction.query.filter_by(lesson_id=lesson_id).all()


def create_instruction(data: Dict[str, Any]) -> Tuple[Optional[LessonInstruction], Optional[str]]:
    """
    Create a new lesson instruction.

    Args:
        data (Dict[str, Any]): Dictionary containing instruction data
            Required keys:
                - lesson_id (int): ID of the lesson this instruction belongs to
                - text (str): The instruction text

    Returns:
        Tuple[Optional[LessonInstruction], Optional[str]]: (Created instruction, Error message)
    """
    try:
        lesson_id = data.get('lesson_id')
        text = data.get('text')

        if not lesson_id:
            return None, "Lesson ID is required"
        if not text:
            return None, "Instruction text is required"

        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return None, f"Lesson with ID {lesson_id} not found"

        instruction = LessonInstruction(
            text=text,
            lesson_id=lesson_id
        )

        db.session.add(instruction)
        db.session.commit()
        return instruction, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error creating instruction: {str(e)}"


def update_instruction(instruction_id: int, data: Dict[str, Any]) -> Tuple[Optional[LessonInstruction], Optional[str]]:
    """
    Update an existing lesson instruction.

    Args:
        instruction_id (int): ID of the instruction to update
        data (Dict[str, Any]): Dictionary containing instruction data to update
            Optional keys:
                - text (str): The instruction text
                - lesson_id (int): ID of the lesson this instruction belongs to

    Returns:
        Tuple[Optional[LessonInstruction], Optional[str]]: (Updated instruction, Error message)
    """
    try:
        instruction = LessonInstruction.query.get(instruction_id)
        if not instruction:
            return None, f"Instruction with ID {instruction_id} not found"

        if 'text' in data:
            instruction.text = data['text']

        if 'lesson_id' in data:
            lesson_id = data['lesson_id']
            lesson = Lesson.query.get(lesson_id)
            if not lesson:
                return None, f"Lesson with ID {lesson_id} not found"

            instruction.lesson_id = lesson_id

        db.session.commit()
        return instruction, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error updating instruction: {str(e)}"


def delete_instruction(instruction_id: int) -> Tuple[bool, Optional[str]]:
    """
    Delete a lesson instruction by its ID.

    Args:
        instruction_id (int): ID of the instruction to delete

    Returns:
        Tuple[bool, Optional[str]]: (Success status, Error message)
    """
    try:
        instruction = LessonInstruction.query.get(instruction_id)
        if not instruction:
            return False, f"Instruction with ID {instruction_id} not found"

        db.session.delete(instruction)
        db.session.commit()
        return True, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return False, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return False, f"Error deleting instruction: {str(e)}"


def create_lesson_with_instructions(vowel_id: str, instructions: List[str]) -> Tuple[Optional[Lesson], Optional[str]]:
    """
    Create a lesson with multiple instructions in one operation.

    Args:
        vowel_id (str): ID of the vowel for this lesson
        instructions (List[str]): List of instruction texts

    Returns:
        Tuple[Optional[Lesson], Optional[str]]: (Created lesson, Error message)
    """
    try:
        vowel = Vowel.query.get(vowel_id)
        if not vowel:
            return None, f"Vowel with ID {vowel_id} not found"

        existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
        if existing_lesson:
            return None, f"Lesson for vowel {vowel_id} already exists"

        lesson = Lesson(vowel_id=vowel_id)
        db.session.add(lesson)

        for text in instructions:
            instruction = LessonInstruction(
                text=text,
                lesson=lesson
            )
            db.session.add(instruction)

        db.session.commit()
        return lesson, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error creating lesson with instructions: {str(e)}"


def replace_lesson_instructions(lesson_id: int, instructions: List[str]) -> Tuple[Optional[Lesson], Optional[str]]:
    """
    Replace all instructions for a lesson.

    Args:
        lesson_id (int): ID of the lesson
        instructions (List[str]): New list of instruction texts

    Returns:
        Tuple[Optional[Lesson], Optional[str]]: (Updated lesson, Error message)
    """
    try:
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return None, f"Lesson with ID {lesson_id} not found"

        # Delete existing instructions
        LessonInstruction.query.filter_by(lesson_id=lesson_id).delete()

        # Add new instructions
        for text in instructions:
            instruction = LessonInstruction(
                text=text,
                lesson=lesson
            )
            db.session.add(instruction)

        db.session.commit()
        return lesson, None

    except SQLAlchemyError as e:
        db.session.rollback()
        return None, f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        return None, f"Error replacing lesson instructions: {str(e)}"


def seed_lessons_from_data(lessons_data: List[Dict[str, Any]], clear_existing: bool = False) -> Tuple[int, Optional[str]]:
    """
    Seed lessons from a list of lesson data.

    Args:
        lessons_data (List[Dict[str, Any]]): List of lesson data dictionaries
            Each dictionary should have:
            - vowel_id (str): ID of the vowel for this lesson
            - instructions (List[str]): List of instruction texts
        clear_existing (bool): Whether to clear existing lessons before seeding

    Returns:
        Tuple[int, Optional[str]]: (Number of lessons created, Error message)
    """
    try:
        # Clear existing lessons if requested
        if clear_existing:
            # Delete all lesson instructions first (to avoid foreign key constraints)
            LessonInstruction.query.delete()
            # Then delete all lessons
            Lesson.query.delete()

        # Create new lessons
        created_count = 0
        for lesson_data in lessons_data:
            vowel_id = lesson_data.get('vowel_id')
            instructions = lesson_data.get('instructions', [])

            if not vowel_id:
                continue

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

            # Add instructions
            for text in instructions:
                instruction = LessonInstruction(
                    text=text,
                    lesson=lesson
                )
                db.session.add(instruction)

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
        import json

        # Read the JSON file
        with open(file_path, 'r') as f:
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
    try:
        total_lessons = Lesson.query.count()
        total_instructions = LessonInstruction.query.count()

        # Get vowels with lessons
        vowels_with_lessons = db.session.query(Vowel).join(Lesson).all()
        vowels_with_lessons_count = len(vowels_with_lessons)

        # Get vowels without lessons - fix E711 comparison to None
        vowels_without_lessons = db.session.query(Vowel).outerjoin(Lesson).filter(Lesson.id is None).all()
        vowels_without_lessons_count = len(vowels_without_lessons)

        # Get average instructions per lesson
        avg_instructions = total_instructions / total_lessons if total_lessons > 0 else 0

        return {
            "total_lessons": total_lessons,
            "total_instructions": total_instructions,
            "vowels_with_lessons": vowels_with_lessons_count,
            "vowels_without_lessons": vowels_without_lessons_count,
            "vowels_without_lessons_ids": [v.id for v in vowels_without_lessons],
            "avg_instructions_per_lesson": avg_instructions
        }
    except Exception as e:
        print(f"Error getting lesson stats: {str(e)}")
        return {
            "total_lessons": 0,
            "total_instructions": 0,
            "vowels_with_lessons": 0,
            "vowels_without_lessons": 0,
            "vowels_without_lessons_ids": [],
            "avg_instructions_per_lesson": 0
        }


def get_lesson_with_vowel_details(lesson_id: int) -> Optional[Dict[str, Any]]:
    """
    Get a lesson with detailed vowel information.

    Args:
        lesson_id (int): The ID of the lesson

    Returns:
        Optional[Dict[str, Any]]: Dictionary with lesson and vowel details, or None if not found
    """
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return None

    vowel = lesson.vowel
    instructions = lesson.instructions

    return {
        "lesson_id": lesson.id,
        "vowel": vowel.to_dict() if vowel else None,
        "instructions": [instruction.to_dict() for instruction in instructions]
    }


def get_lesson_by_vowel_id_with_details(vowel_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a lesson by vowel ID with detailed vowel information.

    Args:
        vowel_id (str): The ID of the vowel

    Returns:
        Optional[Dict[str, Any]]: Dictionary with lesson and vowel details, or None if not found
    """
    lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
    if not lesson:
        return None

    vowel = lesson.vowel
    instructions = lesson.instructions

    return {
        "lesson_id": lesson.id,
        "vowel": vowel.to_dict() if vowel else None,
        "instructions": [instruction.to_dict() for instruction in instructions]
    }
