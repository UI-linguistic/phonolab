# # src/api/lesson.py

from flask import Blueprint, request

from ..services.lesson import (
    create_lesson,
    delete_lesson,
    get_all_lessons,
    get_lesson_by_id,
    get_lesson_by_vowel,
    update_lesson_instructions,
)
from ..utils.format import error_response, success_response

lesson_bp = Blueprint("lesson", __name__, url_prefix="/lessons")


@lesson_bp.route("/", methods=["GET"])
def list_lessons():
    """
    Retrieves all lessons.
    """
    try:
        lessons = get_all_lessons()
        return success_response("Lessons retrieved", {"lessons": [lesson.to_dict() for lesson in lessons]})
    except Exception as e:
        return error_response(f"Error retrieving lessons: {str(e)}")


@lesson_bp.route("/<int:lesson_id>", methods=["GET"])
def get_lesson(lesson_id):
    """
    Gets a lesson by its ID.
    """
    lesson = get_lesson_by_id(lesson_id)
    if not lesson:
        return error_response("Lesson not found", 404)
    return success_response("Lesson retrieved", {"lesson": lesson.to_dict()})


@lesson_bp.route("/vowel/<string:vowel_id>", methods=["GET"])
def get_lesson_by_vowel_id(vowel_id):
    """
    Gets the lesson by vowel ID.
    """
    lesson = get_lesson_by_vowel(vowel_id)
    if not lesson:
        return error_response("No lesson found for this vowel", 404)
    return success_response("Lesson retrieved", {"lesson": lesson.to_dict()})


@lesson_bp.route("/", methods=["POST"])
def create_lesson_route():
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


@lesson_bp.route("/<int:lesson_id>", methods=["PUT"])
def update_lesson(lesson_id):
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


@lesson_bp.route("/<int:lesson_id>", methods=["DELETE"])
def delete_lesson_route(lesson_id):
    """
    Deletes a lesson and its instructions.
    """
    deleted = delete_lesson(lesson_id)
    if not deleted:
        return error_response("Lesson not found", 404)

    return success_response("Lesson deleted")
