import pytest
from src.db import db
from src.services.lesson import (
    build_vowel_lip_shape_config,
    build_vowel_tongue_position_matrix,
    create_vowels_101_lesson,
    get_all_lesson_ids,
    get_vowel_by_tongue_position
)
from src.models.lesson import LessonType
from tests.factories import CompletedLessonFactory, UserSessionFactory
from tests.fixtures import sample_vowels, sample_lessons


def test_build_vowel_tongue_position_matrix(app, sample_vowels):
    """Test building the vowel tongue position matrix."""
    with app.app_context():
        matrix = build_vowel_tongue_position_matrix()

        # Basic structure tests
        assert matrix is not None
        assert len(matrix) == 3  # 3 rows
        assert all(len(row) == 3 for row in matrix)

        has_vowels = False
        for row in matrix:
            for cell in row:
                if cell and len(cell) > 0:
                    has_vowels = True
                    break
        assert has_vowels, "Matrix should contain at least some vowels"

        # Test that vowels have all required fields
        for row in matrix:
            for cell in row:
                if cell:
                    for vowel in cell:
                        assert "phoneme" in vowel
                        assert "name" in vowel
                        assert "audio_url" in vowel
                        assert "lips" in vowel
                        assert "tongue" in vowel
                        assert "mouth_image_url" in vowel


def test_build_vowel_lip_shape_config(app, sample_vowels):
    """Test building the vowel lip shape configuration."""
    with app.app_context():
        config = build_vowel_lip_shape_config()

        # Basic structure tests
        assert config is not None
        assert "lip_shapes" in config
        assert "vowel_table" in config

        assert len(config["lip_shapes"]) == 2  # rounded and unrounded
        lip_shape_ids = [shape["id"] for shape in config["lip_shapes"]]
        assert "rounded" in lip_shape_ids
        assert "unrounded" in lip_shape_ids

        assert len(config["vowel_table"]) > 0

        has_vowels = False
        for row in config["vowel_table"]:
            for vowel in row:
                if vowel:
                    has_vowels = True
                    break
        assert has_vowels, "Vowel table should contain at least some vowels"


def test_create_vowels_101_lesson(app, sample_vowels):
    """Test creating a Vowels 101 lesson."""
    with app.app_context():
        lesson = create_vowels_101_lesson()

        assert lesson is not None
        assert lesson.title == "Vowels 101"
        assert lesson.lesson_type == LessonType.VOWELS_101.value

        assert lesson.interactions is not None
        assert len(lesson.interactions) == 2

        interaction_types = [i.interaction_type for i in lesson.interactions]
        assert "tongue_position" in interaction_types
        assert "lip_shape" in interaction_types

        for interaction in lesson.interactions:
            assert interaction.config is not None

            if interaction.interaction_type == "tongue_position":
                assert "matrix" in interaction.config
                assert "labels" in interaction.config

            if interaction.interaction_type == "lip_shape":
                assert "lip_shapes" in interaction.config
                assert "vowel_table" in interaction.config


def test_get_lesson_by_id(app, sample_vowels):
    """Test retrieving a lesson by ID."""
    with app.app_context():
        from src.models.lesson import Lesson

        vowel = sample_vowels[0]
        lesson = Lesson(vowel_id=vowel.id)
        db.session.add(lesson)
        db.session.commit()

        from src.services.lesson import get_lesson_by_id
        retrieved_lesson = get_lesson_by_id(lesson.id)

        assert retrieved_lesson is not None
        assert retrieved_lesson.id == lesson.id
        assert retrieved_lesson.vowel_id == vowel.id

        db.session.delete(lesson)
        db.session.commit()


# def test_get_lesson_by_vowel_id(app, sample_lessons, sample_vowels):
#     """Test retrieving a lesson by vowel ID."""
#     sample_vowel = sample_vowels[0]
#     lesson = get_lesson_by_vowel_id(sample_vowel.id)

#     assert lesson is not None
#     assert lesson.vowel_id == sample_vowel.id

def test_get_lesson_progress_empty(app, monkeypatch):
    """Test getting lesson progress for a session with no completed lessons."""
    from tests.factories import UserSessionFactory
    from src.services.lesson import get_lesson_progress

    session = UserSessionFactory()

    monkeypatch.setattr('src.services.lesson.get_all_lesson_ids', lambda: [1, 2, 3, 4, 5])

    progress = get_lesson_progress(session.session_id)

    assert progress["completed"] == 0
    assert progress["total"] == 5
    assert progress["percentage"] == 0.0
    assert progress["completed_lessons"] == []
    assert sorted(progress["remaining_lessons"]) == [1, 2, 3, 4, 5]


def test_get_lesson_progress_partial(app, monkeypatch):
    """Test getting lesson progress for a session with some completed lessons."""
    from tests.factories import UserSessionFactory, CompletedLessonFactory
    from src.services.lesson import get_lesson_progress

    session = UserSessionFactory()

    # Complete some lessons
    CompletedLessonFactory(session=session, lesson_id=1)
    CompletedLessonFactory(session=session, lesson_id=3)

    # Mock
    monkeypatch.setattr('src.services.lesson.get_all_lesson_ids', lambda: [1, 2, 3, 4, 5])

    progress = get_lesson_progress(session.session_id)

    assert progress["completed"] == 2
    assert progress["total"] == 5
    assert progress["percentage"] == 40.0
    assert sorted(progress["completed_lessons"]) == [1, 3]
    assert sorted(progress["remaining_lessons"]) == [2, 4, 5]


def test_get_all_lesson_ids(app, sample_lessons):
    """Test retrieving all lesson IDs."""
    lesson_ids = get_all_lesson_ids()

    assert len(lesson_ids) == len(sample_lessons)
    for sample_lesson in sample_lessons:
        assert sample_lesson.id in lesson_ids


def test_get_vowel_by_tongue_position(sample_vowels):
    """Test that vowels are correctly organized by tongue position"""
    vowel_groups = get_vowel_by_tongue_position()

    assert set(vowel_groups.keys()) == {"front", "central", "back"}
    assert len(vowel_groups["front"]) == 2

    front_vowel_ids = {vowel["id"] for vowel in vowel_groups["front"]}
    assert front_vowel_ids == {"i", "e"}

    front_vowel = next(v for v in vowel_groups["front"] if v["id"] == "i")
    assert front_vowel["phoneme"] == "i"
    assert front_vowel["audio_url"] == "/audio/vowels/i.mp3"
    assert len(front_vowel["examples"]) == 2

    example = front_vowel["examples"][0]
    assert "word" in example
    assert "audio_url" in example
    assert "ipa" in example
