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
    """
    Get all lessons.

    Returns:
        JSON: A list of all lessons with their details.
            Each lesson contains:
            - id: The lesson identifier
            - vowel_id: The associated vowel identifier
            - phoneme: The phoneme symbol
            - name: The name of the vowel/phoneme
            - description: Detailed description of the vowel/phoneme
            - audio_url: URL to the audio pronunciation
            - mouth_image_url: URL to the mouth position image
            - lesson_card: Structured lesson content

    Raises:
        500: If there's an error retrieving or formatting the lessons
    """
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
    """
    Get a lesson by ID.

    Args:
        lesson_id (int): The unique identifier of the lesson

    Returns:
        JSON: The lesson details including:
            - id: The lesson identifier
            - vowel_id: The associated vowel identifier
            - phoneme: The phoneme symbol
            - name: The name of the vowel/phoneme
            - description: Detailed description of the vowel/phoneme
            - audio_url: URL to the audio pronunciation
            - mouth_image_url: URL to the mouth position image
            - lesson_card: Structured lesson content

    Raises:
        404: If the lesson with the specified ID is not found
        500: If there's an error retrieving or formatting the lesson
    """
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
    """
    Get a lesson by vowel ID.

    Args:
        vowel_id (str): The unique identifier of the vowel

    Returns:
        JSON: The lesson details including:
            - id: The lesson identifier
            - vowel_id: The associated vowel identifier
            - phoneme: The phoneme symbol
            - name: The name of the vowel/phoneme
            - description: Detailed description of the vowel/phoneme
            - audio_url: URL to the audio pronunciation
            - mouth_image_url: URL to the mouth position image
            - lesson_card: Structured lesson content

    Raises:
        404: If no lesson exists for the specified vowel ID
        500: If there's an error retrieving or formatting the lesson
    """
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
    """
    Create a new lesson.

    Request Body:
        JSON object containing:
        - vowel_id (str): The unique identifier of the vowel to create a lesson for

    Returns:
        JSON: The newly created lesson details

    Raises:
        400: If vowel_id is missing or invalid
        500: If there's an error creating or formatting the lesson
    """
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
    """
    Update an existing lesson.

    Args:
        lesson_id (int): The unique identifier of the lesson to update

    Request Body:
        JSON object containing:
        - vowel_id (str): The unique identifier of the vowel to associate with the lesson

    Returns:
        JSON: The updated lesson details

    Raises:
        400: If vowel_id is missing or invalid, or if the lesson cannot be updated
        500: If there's an error updating or formatting the lesson
    """
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
    """
    Delete a lesson.

    Args:
        lesson_id (int): The unique identifier of the lesson to delete

    Returns:
        JSON: A success message confirming the deletion

    Raises:
        400: If the lesson cannot be deleted
        500: If there's an error during deletion
    """
    try:
        error = delete_lesson(lesson_id)

        if error:
            return error_response(error, 400)

        return success_response("Lesson deleted successfully")
    except Exception as e:
        return error_response(f"Error deleting lesson: {str(e)}")


@lesson_bp.route("/create-all", methods=["POST"])
def create_all_lessons():
    """
    Create lessons for all vowels that don't have lessons yet.

    Returns:
        JSON: A success message with the count of newly created lessons

    Raises:
        400: If there's an error creating the lessons
        500: If there's an unexpected error during creation
    """
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
