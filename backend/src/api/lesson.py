# # src/api/lesson.py
from flask import Blueprint, jsonify, request

from src.services.lesson import (
    get_all_lessons,
    get_lesson_by_id,
    get_lesson_by_vowel_id,
    get_lesson_by_vowel_id_with_details,
)
from src.utils.format import error_response, format_lesson_http, format_lessons_http, success_response

lesson_bp = Blueprint("lesson", __name__, url_prefix="/lesson")


@lesson_bp.route("/", methods=["GET"])
def fetch_all_lessons():
    """Get all lessons."""
    try:
        lessons = get_all_lessons()

        # Check if we need to format for frontend
        format_for_frontend = request.args.get("format") == "frontend"
        if format_for_frontend:
            return jsonify(format_lessons_http(lessons))

        return success_response(
            "Lessons retrieved successfully",
            {"lessons": [lesson.to_dict() for lesson in lessons]}
        )
    except Exception as e:
        return error_response(f"Error retrieving lessons: {str(e)}")


@lesson_bp.route("/<int:lesson_id>", methods=["GET"])
def fetch_lesson_by_id(lesson_id):
    """Get a lesson by ID."""
    try:
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            return error_response(f"Lesson with ID {lesson_id} not found", 404)

        format_for_frontend = request.args.get("format") == "frontend"
        if format_for_frontend:
            formatted_lesson = format_lesson_http(lesson)
            if not formatted_lesson:
                return error_response("Could not format lesson for frontend", 500)
            return jsonify(formatted_lesson)

        return success_response(
            "Lesson retrieved successfully",
            {"lesson": lesson.to_dict()}
        )
    except Exception as e:
        return error_response(f"Error retrieving lesson: {str(e)}")


@lesson_bp.route("/vowel/<string:vowel_id>", methods=["GET"])
def fetch_lesson_by_vowel_id(vowel_id):
    """Get a lesson by vowel ID."""
    try:
        with_details = request.args.get("details") == "true"

        if with_details:
            lesson_data = get_lesson_by_vowel_id_with_details(vowel_id)
            if not lesson_data:
                return error_response(f"Lesson for vowel {vowel_id} not found", 404)

            format_for_frontend = request.args.get("format") == "frontend"
            if format_for_frontend:
                lesson = get_lesson_by_vowel_id(vowel_id)
                formatted_lesson = format_lesson_http(lesson)
                if not formatted_lesson:
                    return error_response("Could not format lesson for frontend", 500)
                return jsonify(formatted_lesson)

            return success_response(
                "Lesson retrieved successfully",
                {"lesson": lesson_data}
            )
        else:
            lesson = get_lesson_by_vowel_id(vowel_id)
            if not lesson:
                return error_response(f"Lesson for vowel {vowel_id} not found", 404)

            format_for_frontend = request.args.get("format") == "frontend"
            if format_for_frontend:
                formatted_lesson = format_lesson_http(lesson)
                if not formatted_lesson:
                    return error_response("Could not format lesson for frontend", 500)
                return jsonify(formatted_lesson)

            return success_response(
                "Lesson retrieved successfully",
                {"lesson": lesson.to_dict()}
            )
    except Exception as e:
        return error_response(f"Error retrieving lesson: {str(e)}")
