# # src/api/lesson.py

from flask import Blueprint, request
from utils.format import error_response, success_response
from services.lesson import (
    create_lesson,
    delete_lesson,
    get_all_lessons,
    get_lesson_by_id,
    get_lesson_by_vowel,
    update_lesson_instructions,
    format_lesson_for_frontend
)


lesson_bp = Blueprint("lesson", __name__, url_prefix="/lesson")
admin_lesson_bp = Blueprint("admin_lesson", __name__, url_prefix="/admin/lesson")


@lesson_bp.route("/<int:lesson_id>", methods=["GET"])
def get_lesson(lesson_id):
    """
    Public API: Returns a lesson formatted for frontend use.
    """
    lesson = get_lesson_by_id(lesson_id)
    if not lesson:
        return error_response("Lesson not found", 404)

    # format_lesson_for_frontend will be added in services.lesson

    return success_response("Lesson retrieved", {"lesson": format_lesson_for_frontend(lesson)})


# @lesson_bp.route("/vowel/<string:vowel_id>", methods=["GET"])
# def get_lesson_by_vowel(vowel_id):
#     """
#     Public API: Returns a lesson by vowel ID (formatted for frontend).
#     """
#     lesson = get_lesson_by_vowel(vowel_id)
#     if not lesson:
#         return error_response("Lesson not found", 404)
#     return success_response("Lesson retrieved", {"lesson": format_lesson_for_frontend(lesson)})


#
#   Database Handlers
#

@admin_lesson_bp.route("/", methods=["GET"])
def admin_list_lessons():
    """
    Retrieves all lessons.
    """
    try:
        lessons = get_all_lessons()
        return success_response("Lessons retrieved", {"lessons": [lesson.to_dict() for lesson in lessons]})
    except Exception as e:
        return error_response(f"Error retrieving lessons: {str(e)}")


@admin_lesson_bp.route("/<int:lesson_id>", methods=["GET"])
def admin_get_lesson(lesson_id):
    """
    Gets a lesson by its ID.
    """
    lesson = get_lesson_by_id(lesson_id)
    if not lesson:
        return error_response("Lesson not found", 404)
    return success_response("Lesson retrieved", {"lesson": lesson.to_dict()})


@admin_lesson_bp.route("/vowel/<string:vowel_id>", methods=["GET"])
def admin_get_lesson_by_vowel_id(vowel_id):
    """
    Gets the lesson by vowel ID.
    """
    lesson = get_lesson_by_vowel(vowel_id)
    if not lesson:
        return error_response("No lesson found for this vowel", 404)
    return success_response("Lesson retrieved", {"lesson": lesson.to_dict()})


@admin_lesson_bp.route("/", methods=["POST"])
def admin_create_lesson_route():
    """
    Creates a new lesson.
    **Body:**
    - vowel_id: str
    - instructions: list[str]
    """
    data = request.get_json()
    vowel_id = data.get("vowel_id")
    instructions = data.get("instructions")

    if not vowel_id or not instructions:
        return error_response("vowel_id and instructions are required", 400)

    try:
        lesson = create_lesson(vowel_id, instructions)
        return success_response("Lesson created", {"lesson": lesson.to_dict()}, 201)
    except ValueError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(f"Unexpected error: {str(e)}")


@admin_lesson_bp.route("/<int:lesson_id>", methods=["PUT"])
def admin_update_lesson(lesson_id):
    """
    Updates lesson instructions.
    **Body:**
    - instructions: list[str]
    """
    data = request.get_json()
    instructions = data.get("instructions")

    if not instructions:
        return error_response("instructions field is required", 400)

    updated = update_lesson_instructions(lesson_id, instructions)
    if not updated:
        return error_response("Lesson not found", 404)

    return success_response("Lesson updated", {"lesson": updated.to_dict()})


@admin_lesson_bp.route("/<int:lesson_id>", methods=["DELETE"])
def admin_delete_lesson_route(lesson_id):
    """
    Deletes a lesson and its instructions.
    """
    deleted = delete_lesson(lesson_id)
    if not deleted:
        return error_response("Lesson not found", 404)

    return success_response("Lesson deleted")
