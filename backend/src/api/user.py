# src/api/track_api.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import scoped_session
from services import user as user_service
from src import db 

track_bp = Blueprint("track", __name__, url_prefix="/user")


@track_bp.route("/session", methods=["POST"])
def create_session():
    """
    Creates a new user session and returns a unique session ID.
    """
    session_id = user_service.create_session(db.session)
    return jsonify({"session_id": session_id}), 201


@track_bp.route("/quiz/submit", methods=["POST"])
def submit_quiz_answer():
    """
    Logs a quiz answer to a session.

    Request JSON:
    - session_id (str)
    - question_index (int)
    - question (str)
    - selected (str)
    - correct (str)
    """
    data = request.get_json()
    required = ["session_id", "question_index", "question", "selected", "correct"]

    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    is_correct = user_service.log_quiz_answer(
        db.session,
        session_id=data["session_id"],
        question_index=data["question_index"],
        question=data["question"],
        selected=data["selected"],
        correct=data["correct"]
    )

    return jsonify({"correct": is_correct}), 200


@track_bp.route("/quiz/summary/<session_id>", methods=["GET"])
def quiz_summary(session_id):
    """
    Returns a summary of the quiz session.
    """
    summary = user_service.get_quiz_summary(db.session, session_id)
    return jsonify(summary), 200


@track_bp.route("/vowel/performance/<session_id>", methods=["GET"])
def vowel_performance(session_id):
    """
    Returns correct/incorrect counts for each vowel in a session.
    """
    stats = user_service.get_vowel_performance(db.session, session_id)
    return jsonify({"performance": stats}), 200

# reset session route
