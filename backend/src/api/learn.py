# src/api/learn.py

from flask import Blueprint, jsonify
from services.learn import get_lesson_by_index, log_lesson_visit

learn_bp = Blueprint("learn", __name__, url_prefix="/learn")


@learn_bp.route("/<int:index>", methods=["GET"])
def get_lesson(index):
    """
    Serve lesson content for a given lesson index.
    
    Returns:
        JSON containing:
        - lesson id
        - vowel data
        - sample text
        - instructions
    """
    lesson = get_lesson_by_index(index)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404

    # Log the visit
    log_lesson_visit(lesson.id)

    return jsonify({
        "lesson": {
            "id": lesson.id,
            "vowel": lesson.vowel.__dict__,
            "sample_text": lesson.sample_text,
            "instructions": lesson.instructions
        }
    }), 200
