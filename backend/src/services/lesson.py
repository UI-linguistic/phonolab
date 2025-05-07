"""
Service functions for lesson-related operations.
"""
from src.db import db
from src.models.lesson import Lesson, Vowels101Lesson
from src.models.phoneme import Vowel
from utils.format import error_response, not_found_response, success_response

def get_all_lessons():
    """
    Retrieve all lessons from the database.
    
    Returns:
        List of lesson dictionaries
    """
    try:
        lessons = Lesson.query.all()
        return [lesson_to_dict(lesson) for lesson in lessons]
    except Exception as e:
        return {"error": f"Error retrieving lessons: {str(e)}"}, 500

def get_lesson_by_id(lesson_id):
    """
    Retrieve a lesson by its ID.
    
    Args:
        lesson_id: The ID of the lesson to retrieve
        
    Returns:
        Lesson dictionary or error response
    """
    try:
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return not_found_response("Lesson", lesson_id)
        
        return success_response(
            message=f"Lesson {lesson_id} retrieved successfully",
            data=lesson_to_dict(lesson)
        )
    except Exception as e:
        return error_response(f"Error retrieving lesson: {str(e)}", 500)

def get_lesson_by_vowel_id(vowel_id):
    """
    Retrieve a lesson for a specific vowel.
    
    Args:
        vowel_id: The ID of the vowel to get the lesson for
        
    Returns:
        Lesson dictionary or error response
    """
    try:
        # Find the vowel
        vowel = Vowel.query.get(vowel_id)
        if not vowel:
            return {"error": f"Vowel with ID {vowel_id} not found"}, 404
        
        # Find a lesson that references this vowel
        vowel_lesson = Vowels101Lesson.query.filter_by(vowel_id=vowel_id).first()
        if not vowel_lesson:
            return {"error": f"No lesson found for vowel {vowel_id}"}, 404
        
        lesson_dict = lesson_to_dict(vowel_lesson)
        lesson_dict["vowel"] = {
            "id": vowel.id,
            "ipa": vowel.ipa,
            "pronounced": vowel.pronounced
        }
        
        return lesson_dict
    except Exception as e:
        return {"error": f"Error retrieving lesson for vowel: {str(e)}"}, 500

def lesson_to_dict(lesson):
    """
    Convert a Lesson object to a dictionary.
    
    Args:
        lesson: The Lesson object to convert
        
    Returns:
        Dictionary representation of the lesson
    """
    result = {
        "id": lesson.id,
        "title": lesson.title,
        "description": lesson.description,
        "type": lesson.type
    }
    
    # Add lesson mode if available
    if hasattr(lesson, "lesson_mode") and lesson.lesson_mode:
        result["lesson_mode"] = {
            "id": lesson.lesson_mode.id,
            "name": lesson.lesson_mode.name,
            "slug": lesson.lesson_mode.slug,
            "description": lesson.lesson_mode.description
        }
    
    # Add content for Vowels101Lesson
    if isinstance(lesson, Vowels101Lesson) and lesson.content:
        result["content"] = lesson.content
    
    return result
