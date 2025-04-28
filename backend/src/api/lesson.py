# src/api/lesson.py
import logging

from flask import Blueprint, jsonify, request

from src.services.lesson import (
    create_lesson,
    create_lessons_for_all_vowels,
    delete_lesson,
    get_all_lessons,
    get_lesson_by_id,
    get_lesson_by_vowel_id,
    update_lesson,
)
from src.utils.format import error_response, format_lesson_http, format_lessons_http, success_response

lesson_bp = Blueprint("lesson", __name__, url_prefix="/lesson")


@lesson_bp.route("/", methods=["GET"])
def fetch_all_lessons():
    """Get all lessons."""
    try:
        lessons = get_all_lessons()
        formatted_lessons = format_lessons_http(lessons)
        return jsonify(formatted_lessons)
    except (ValueError, TypeError) as e:
        return error_response(f"Error formatting lessons: {str(e)}")
    except Exception as e:
        logging.exception("Unexpected error in fetch_all_lessons")
        return error_response(f"Unexpected error: {str(e)}")


@lesson_bp.route("/<int:lesson_id>", methods=["GET"])
def fetch_lesson_by_id(lesson_id):
    """Get a lesson by ID."""
    try:
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            return error_response(f"Lesson with ID {lesson_id} not found", 404)

        formatted_lesson = format_lesson_http(lesson)
        if not formatted_lesson:
            return error_response("Could not format lesson response", 500)

        return jsonify(formatted_lesson)
    except (ValueError, TypeError) as e:
        return error_response(f"Error formatting lesson: {str(e)}")
    except Exception as e:
        return error_response(f"Error retrieving lesson: {str(e)}")


@lesson_bp.route("/vowel/<string:vowel_id>", methods=["GET"])
def fetch_lesson_by_vowel_id(vowel_id):
    """Get a lesson by vowel ID."""
    try:
        lesson = get_lesson_by_vowel_id(vowel_id)
        if not lesson:
            return error_response(f"Lesson for vowel {vowel_id} not found", 404)

        formatted_lesson = format_lesson_http(lesson)
        if not formatted_lesson:
            return error_response("Could not format lesson response", 500)

        return jsonify(formatted_lesson)
    except (ValueError, TypeError) as e:
        return error_response(f"Error formatting lesson: {str(e)}")
    except Exception as e:
        return error_response(f"Error retrieving lesson: {str(e)}")


@lesson_bp.route("/", methods=["POST"])
def create_new_lesson():
    """Create a new lesson."""
    try:
        data = request.get_json()
        if not data or 'vowel_id' not in data:
            return error_response("Vowel ID is required", 400)

        vowel_id = data['vowel_id']
        lesson, error = create_lesson(vowel_id)

        if error:
            return error_response(error, 400)

        formatted_lesson = format_lesson_http(lesson)
        return jsonify(formatted_lesson), 201
    except (ValueError, TypeError) as e:
        return error_response(f"Error formatting lesson: {str(e)}")
    except Exception as e:
        return error_response(f"Error creating lesson: {str(e)}")


@lesson_bp.route("/<int:lesson_id>", methods=["PUT"])
def update_existing_lesson(lesson_id):
    """Update an existing lesson."""
    try:
        data = request.get_json()
        if not data or 'vowel_id' not in data:
            return error_response("Vowel ID is required", 400)

        vowel_id = data['vowel_id']
        lesson, error = update_lesson(lesson_id, vowel_id)

        if error:
            return error_response(error, 400)

        formatted_lesson = format_lesson_http(lesson)
        return jsonify(formatted_lesson)
    except (ValueError, TypeError) as e:
        return error_response(f"Error formatting lesson: {str(e)}")
    except Exception as e:
        return error_response(f"Error updating lesson: {str(e)}")


@lesson_bp.route("/<int:lesson_id>", methods=["DELETE"])
def delete_existing_lesson(lesson_id):
    """Delete a lesson."""
    try:
        error = delete_lesson(lesson_id)

        if error:
            return error_response(error, 400)

        return success_response("Lesson deleted successfully")
    except Exception as e:
        return error_response(f"Error deleting lesson: {str(e)}")


@lesson_bp.route("/create-all", methods=["POST"])
def create_all_lessons():
    """Create lessons for all vowels that don't have lessons yet."""
    try:
        count, error = create_lessons_for_all_vowels()

        if error:
            return error_response(error, 400)

        return success_response(
            f"Created {count} new lessons",
            {"count": count}
        )
    except Exception as e:
        return error_response(f"Error creating lessons: {str(e)}")
