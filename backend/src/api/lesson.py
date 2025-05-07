# src/api/lesson.py
from flask import Blueprint
from src.services.lesson import (
    get_all_lesson_types,
    get_lesson_type_by_id,
    format_all_lessons_response,
    format_lesson_by_id_response
)
from utils.response import not_found_response


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
