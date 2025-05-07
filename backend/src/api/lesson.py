# src/api/lesson.py
# import logging

from flask import Blueprint
from src.utils.format import (
    success_response, 
    error_response, 
    not_found_response
)
from src.services.lesson import (
    get_all_lesson_modes,
    get_lesson_by_id
)


lesson_bp = Blueprint('lesson', __name__, url_prefix='/api/lesson')


@lesson_bp.route('/', methods=['GET'])
def get_all_lessons_route():
    """Get all available lesson modes."""
    data, error = get_all_lesson_modes()
    
    if error:
        return error_response(message=error, status_code=500)
    
    return success_response(
        message="Lesson modes retrieved successfully",
        data=data
    )

@lesson_bp.route('/id/<int:lesson_id>', methods=['GET'])
def get_lesson_by_id_route(lesson_id):
    """Get a specific lesson by its ID."""
    data, error, error_type = get_lesson_by_id(lesson_id)
    
    if error_type == "not_found":
        return not_found_response(resource_type="Lesson", resource_id=str(lesson_id))
    elif error:
        return error_response(message=error, status_code=500, error_code=error_type)
    
    return success_response(
        message="Lesson retrieved successfully",
        data=data
    )
