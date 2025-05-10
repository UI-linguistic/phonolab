# src/api/lesson.py
from flask import Blueprint
from src.services.lesson import (
    get_lesson_by_slug
)


lesson_bp = Blueprint("lesson", __name__, url_prefix="/api/lessons")


# @lesson_bp.route("/", methods=["GET"])
# def get_lessons():
#     lessons = get_all_lesson_types()
#     return format_all_lessons_response(lessons)


# @lesson_bp.route("/<int:lesson_id>", methods=["GET"])
# def get_lesson_by_id(lesson_id):
#     lesson = get_lesson_type_by_id(lesson_id)
#     if not lesson:
#         return not_found_response("Lesson", lesson_id)
#     return format_lesson_by_id_response(lesson)


# @lesson_bp.route("/vowels-101", methods=["GET"])
# def get_all_sections():
#     """
#     Endpoint to get all 3 sections of the 'vowels-101' lesson.
#     """
#     return get_all_sections_for_lesson_service("vowels-101")


@lesson_bp.route("/vowels-101", methods=["GET"])
def get_vowels101():
    return get_lesson_by_slug("vowels-101")
