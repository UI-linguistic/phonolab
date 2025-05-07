# src/api/lesson.py
from flask import Blueprint
from src.services.lesson import (
    format_lesson_by_slug_response,
    get_all_lesson_types,
    get_lesson_type_by_id,
    format_all_lessons_response,
    format_lesson_by_id_response,
    get_lesson_type_by_slug
)
from utils.response import not_found_response, success_response


lesson_bp = Blueprint("lesson", __name__, url_prefix="/api/lessons")


@lesson_bp.route("/", methods=["GET"])
def get_lessons():
    lessons = get_all_lesson_types()
    return format_all_lessons_response(lessons)


@lesson_bp.route("/<int:lesson_id>", methods=["GET"])
def get_lesson_by_id(lesson_id):
    lesson = get_lesson_type_by_id(lesson_id)
    if not lesson:
        return not_found_response("Lesson", lesson_id)
    return format_lesson_by_id_response(lesson)


@lesson_bp.route("/<string:slug>", methods=["GET"])
def get_lesson_by_slug(slug: str):
    """API endpoint to retrieve a lesson by its slug."""
    lesson = get_lesson_type_by_slug(slug)
    return format_lesson_by_slug_response(lesson)


@lesson_bp.route('/vowels-101/<int:index>', methods=['GET'])
def get_vowel_section(index):
    # Fetch the lesson by its slug
    lesson = get_lesson_by_slug("vowels-101")
    
    # Get the section based on the index
    section = next((section for section in lesson['sections'] if section['id'] == index), None)
    
    if section is None:
        return not_found_response(resource_type="Section", resource_id=str(index))
    
    return success_response(message=f"Section {index} retrieved successfully", data=section)

