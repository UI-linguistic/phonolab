# src/database/lesson.py
import db
from models.lesson import LessonMode, VowelLesson
from scripts.seed_data import build_vowels_101_lesson_mode


def lesson_mode_exists(slug_or_name: str) -> bool:
    return db.session.query(
        LessonMode.query.filter(
            (LessonMode.slug == slug_or_name) | (LessonMode.name == slug_or_name)
        ).exists()
    ).scalar()


def commit_lesson_mode(map_variable: tuple[str, str, str]) -> LessonMode:
    name, slug, description = map_variable
    mode = LessonMode(name=name, slug=slug, description=description)
    db.session.add(mode)
    db.session.commit()
    print(f"Lesson Mode committed: {name} ({slug})")
    return mode


def seed_vowels_101_lesson(map_variable: tuple[str, str, str]) -> LessonMode:
    """
    Seeds the Vowels 101 lesson mode and its associated VowelLesson.
    Commits to the database only if not already present.
    """
    name, slug, _ = map_variable

    # Check or commit the mode
    if lesson_mode_exists(slug):
        mode = LessonMode.query.filter(
            (LessonMode.slug == slug) | (LessonMode.name == name)
        ).first()
        print(f"Lesson mode already exists: {slug}")
    else:
        mode = commit_lesson_mode(map_variable)

    # Prevent duplicate lesson creation
    existing_lesson = VowelLesson.query.filter_by(lesson_mode_id=mode.id).first()
    if existing_lesson:
        print(f"A VowelLesson already exists for mode '{slug}' — skipping.")
        return mode

    # Build and commit lesson
    content = build_vowels_101_lesson_mode(map_variable)
    lesson = VowelLesson(
        title="Vowels 101",
        description="Learn how vowels are categorized by tongue position, lip shape, and length.",
        lesson_mode_id=mode.id,
        content=content
    )
    db.session.add(lesson)
    db.session.commit()
    print(f"VowelLesson created for mode: {slug}")

    return mode
