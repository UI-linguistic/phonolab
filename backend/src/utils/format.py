from flask import jsonify
from typing import Any, Dict, List, Optional, Tuple, Union


def success_response(
    message: str = "Success",
    data: Optional[Union[Dict, List, Any]] = None,
    status_code: int = 200,
    meta: Optional[Dict] = None
) -> Tuple:
    """
    Return a standardized success response.

    Args:
        message: Human-readable success message
        data: The main payload to return
        status_code: HTTP status code
        meta: Optional metadata (pagination, etc.)

    Returns:
        Tuple of (JSON response, status code)
    """
    payload = {
        "status": "success",
        "message": message
    }

    if data is not None:
        payload["data"] = data

    if meta is not None:
        payload["meta"] = meta

    return jsonify(payload), status_code


def error_response(
    message: str = "An error occurred",
    status_code: int = 400,
    errors: Optional[Dict] = None,
    error_code: Optional[str] = None
) -> Tuple:
    """
    Return a standardized error response.

    Args:
        message: Human-readable error message
        status_code: HTTP status code
        errors: Detailed error information (field-specific errors, etc.)
        error_code: Optional application-specific error code

    Returns:
        Tuple of (JSON response, status code)
    """
    payload = {
        "status": "error",
        "message": message
    }

    if errors:
        payload["errors"] = errors

    if error_code:
        payload["error_code"] = error_code

    return jsonify(payload), status_code


def not_found_response(
    resource_type: str = "Resource",
    resource_id: Optional[str] = None
) -> Tuple:
    """
    Return a standardized 404 Not Found response.

    Args:
        resource_type: Type of resource that wasn't found (e.g., "Lesson", "Quiz")
        resource_id: Optional identifier that was searched for

    Returns:
        Tuple of (JSON response, 404 status code)
    """
    message = f"{resource_type} not found"
    if resource_id:
        message = f"{resource_type} with identifier '{resource_id}' not found"

    return error_response(message=message, status_code=404)


#
# Lesson formatting
#

def format_lesson_mode_response(lesson_mode) -> Dict:
    """Format a lesson mode for API response."""
    return {
        'id': lesson_mode.id,
        'name': lesson_mode.name,
        'slug': lesson_mode.slug,
        'description': lesson_mode.description
    }


def format_lesson_modes_response(lesson_modes) -> List[Dict]:
    """Format multiple lesson modes for API response."""
    return [format_lesson_mode_response(mode) for mode in lesson_modes]


def format_lesson_response(lesson) -> Dict:
    """Format a lesson for API response."""
    return {
        'id': lesson.id,
        'title': lesson.title,
        'description': lesson.description,
        'lesson_mode': {
            'id': lesson.lesson_mode.id,
            'name': lesson.lesson_mode.name,
            'slug': lesson.lesson_mode.slug
        } if lesson.lesson_mode else None,
        'content': lesson.content,
        'type': lesson.type
    }
