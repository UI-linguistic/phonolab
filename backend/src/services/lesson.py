from src.db import db
from src.models.lesson import Lesson, LessonInstruction
from src.models.phoneme import Vowel


def create_lesson(vowel_id, instruction_texts):
    """
    Creates a lesson linked to a vowel, with up to 5 instruction items.
    """
    vowel = db.session.get(Vowel, vowel_id)
    if not vowel:
        raise ValueError("Vowel not found")

    lesson = Lesson(vowel_id=vowel_id)

    for text in instruction_texts[:5]:
        lesson.instructions.append(LessonInstruction(text=text))

    db.session.add(lesson)
    db.session.commit()
    return lesson


def get_lesson_by_id(lesson_id):
    """
    Retrieves a lesson by its ID.
    """
    return db.session.get(Lesson, lesson_id)


def get_lesson_by_vowel(vowel_id):
    """
    Retrieves a lesson based on the vowel_id.
    """
    return Lesson.query.filter_by(vowel_id=vowel_id).first()


def update_lesson_instructions(lesson_id, new_instructions):
    """
    Replaces instructions for a given lesson with new ones.
    """
    lesson = db.session.get(Lesson, lesson_id)
    if not lesson:
        return None

    LessonInstruction.query.filter_by(lesson_id=lesson.id).delete()

    for text in new_instructions[:5]:
        lesson.instructions.append(LessonInstruction(text=text))

    db.session.commit()
    return lesson


def delete_lesson(lesson_id):
    """
    Deletes a lesson and its associated instructions.
    """
    lesson = db.session.get(Lesson, lesson_id)
    if not lesson:
        return False

    db.session.delete(lesson)
    db.session.commit()
    return True


def get_all_lessons():
    """
    Returns all lessons (for internal/dev use).
    """
    return Lesson.query.all()
