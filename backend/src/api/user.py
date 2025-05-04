# src/api/user.py
from flask import Blueprint, request, jsonify
from src.services.user import (
    create_new_session,
    mark_lesson_complete,
    log_quiz_attempt,
    get_session_status,
    get_user_progress
)
from src.utils.format import (
    format_session_http,
    format_quiz_attempt_http,
    success_response,
    error_response
)

user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.route('/session', methods=['POST'])
def create_session():
    """Create a new session and return the session ID"""
    session = create_new_session()
    return jsonify(format_session_http(session))


@user_bp.route('/session/<string:session_id>', methods=['GET'])
def get_session_status_route(session_id):
    """Get comprehensive information about a user session"""
    status = get_session_status(session_id)
    return jsonify(status)


@user_bp.route('/lesson-complete', methods=['POST'])
def complete_lesson():
    """Mark a lesson as completed for a user"""
    data = request.get_json()
    
    if not data or 'session_id' not in data or 'lesson_id' not in data:
        return error_response("Missing required fields", 400)
    
    session_id = data['session_id']
    lesson_id = data['lesson_id']
    
    success = mark_lesson_complete(session_id, lesson_id)
    
    if success:
        return success_response("Lesson marked as complete")
    
    return error_response("Failed to mark lesson as complete", 500)


@user_bp.route('/quiz-score', methods=['POST'])
def submit_quiz_score():
    """Log a quiz attempt"""
    data = request.get_json()
    
    if not data or 'session_id' not in data or 'quiz_id' not in data or \
       'answers' not in data:
        return error_response("Missing required fields", 400)
    
    session_id = data['session_id']
    quiz_id = data['quiz_id']
    answers = data['answers']
    
    attempt = log_quiz_attempt(session_id, quiz_id, answers)
    return jsonify(format_quiz_attempt_http(attempt))


@user_bp.route('/progress/<string:session_id>', methods=['GET'])
def get_user_progress_route(session_id):
    """Get a summary of user progress"""
    progress = get_user_progress(session_id)
    return jsonify(progress)
