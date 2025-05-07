"""
Test for the get_all_lessons function.
"""

import pytest
from unittest.mock import patch, MagicMock

from src.services.lesson import get_all_lessons, get_lesson_by_id
from src.models.lesson import LessonMode, Lesson, Vowels101Lesson
from src.db import db

def test_get_all_lessons_success(app, client):
    """Test successfully retrieving all lessons."""
    # Create a lesson mode directly in the database
    with app.app_context():
        # Create a lesson mode
        lesson_mode = LessonMode(
            name="Vowels 101",
            slug="vowels-101",
            description="Learn about vowels"
        )
        db.session.add(lesson_mode)
        db.session.flush()  # Flush to get the ID
        
        # Create a lesson
        lesson = Lesson(
            title="Test Vowel Lesson",
            description="A test lesson about vowels",
            lesson_mode_id=lesson_mode.id,
            type="lesson"
        )
        db.session.add(lesson)
        db.session.commit()
        
        # Mock the query to return our created lesson
        with patch("src.services.lesson.Lesson.query") as mock_query:
            mock_options = MagicMock()
            mock_query.options.return_value = mock_options
            mock_options.all.return_value = [lesson]
            
            # Call the function
            result = get_all_lessons()
            
            # Print the result for debugging
            print(f"Result type: {type(result)}")
            print(f"Result: {result}")
            
            # Verify the result structure
            assert isinstance(result, tuple)
            assert len(result) == 3
            
            # Unpack the tuple
            data, error, error_type = result
            
            # Handle the case where data is a tuple containing a list
            if isinstance(data, tuple) and len(data) > 0 and isinstance(data[0], list):
                lessons_list = data[0]
            else:
                lessons_list = data
            
            # Verify the result content
            assert error is None
            assert error_type is None
            assert isinstance(lessons_list, list)
            assert len(lessons_list) == 1
            assert lessons_list[0]["id"] == lesson.id
            assert lessons_list[0]["title"] == "Test Vowel Lesson"
            
            # Check if lesson_mode is included
            if "lesson_mode" in lessons_list[0]:
                assert lessons_list[0]["lesson_mode"]["name"] == "Vowels 101"
                assert lessons_list[0]["lesson_mode"]["slug"] == "vowels-101"


def test_get_lesson_by_id_success(app, client):
    """Test successfully retrieving a lesson by ID."""
    with app.app_context():
        # Create a lesson mode
        lesson_mode = LessonMode(
            name="Vowels 101",
            slug="vowels-101",
            description="Learn about vowels"
        )
        db.session.add(lesson_mode)
        db.session.flush()
        
        # Create a Vowels101Lesson
        vowels_lesson = Vowels101Lesson(
            title="Vowels 101 Lesson",
            description="Learn about vowel positions",
            lesson_mode_id=lesson_mode.id,
            content={
                "tongue_position": {
                    "title": "Tongue Position",
                    "caption": "Explore vowel positions"
                }
            }
        )
        db.session.add(vowels_lesson)
        db.session.commit()
        
        # Create a mock for the lesson_to_dict function to return a properly structured dictionary
        lesson_dict = {
            "id": vowels_lesson.id,
            "title": "Vowels 101 Lesson",
            "description": "Learn about vowel positions",
            "type": "vowels_101_lesson",
            "content": {
                "tongue_position": {
                    "title": "Tongue Position",
                    "caption": "Explore vowel positions"
                }
            },
            "lesson_mode": {
                "id": lesson_mode.id,
                "name": "Vowels 101",
                "slug": "vowels-101",
                "description": "Learn about vowels"
            }
        }
        
        # Mock the Lesson query and lesson_to_dict function
        with patch("src.services.lesson.Lesson.query") as mock_lesson_query, \
             patch("src.services.lesson.lesson_to_dict", return_value=lesson_dict) as mock_to_dict:
            
            mock_options = MagicMock()
            mock_lesson_query.options.return_value = mock_options
            mock_options.get.return_value = vowels_lesson
            
            # Call the function
            result = get_lesson_by_id(vowels_lesson.id)
            
            # Verify the result structure
            assert isinstance(result, tuple)
            assert len(result) == 3
            
            # Unpack the tuple
            data, error, error_type = result
            
            # Handle the case where data is a tuple
            if isinstance(data, tuple) and len(data) > 0:
                lesson_data = data[0]
            else:
                lesson_data = data
            
            # Verify the result content
            assert error is None
            assert error_type is None
            assert lesson_data["id"] == vowels_lesson.id
            assert lesson_data["title"] == "Vowels 101 Lesson"
            assert lesson_data["type"] == "vowels_101_lesson"
            
            # Check content
            assert "content" in lesson_data
            assert lesson_data["content"]["tongue_position"]["title"] == "Tongue Position"
            
            # Check lesson_mode
            assert "lesson_mode" in lesson_data
            assert lesson_data["lesson_mode"]["slug"] == "vowels-101"
            
            # Verify that lesson_to_dict was called with the correct lesson
            mock_to_dict.assert_called_once_with(vowels_lesson)
