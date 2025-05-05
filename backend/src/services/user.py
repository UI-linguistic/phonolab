# # src/services/user.py
# import uuid
# from src.db import db
# from src.models.user import CompletedLesson, QuizAttempt, UserSession
# from src.services.lesson import get_lesson_progress
# from src.services.quiz import get_quiz_attempts, get_latest_quiz_results, get_quiz_performance
# from src.services.activity import get_latest_activity


# def generate_session_id():
#     """Generate a unique session ID"""
#     return str(uuid.uuid4())


# def create_new_session():
#     """Create a new user session with a generated ID"""
#     session_id = generate_session_id()
#     session = UserSession(session_id=session_id)
#     db.session.add(session)
#     db.session.commit()
#     return session


# def get_or_create_session(session_id):
#     """Get an existing session or create a new one"""
#     session = UserSession.query.filter_by(session_id=session_id).first()
#     if not session:
#         session = UserSession(session_id=session_id)
#         db.session.add(session)
#         db.session.commit()
#     return session


# def mark_lesson_complete(session_id, lesson_id):
#     """Mark a lesson as completed for a user"""
#     existing = CompletedLesson.query.filter_by(session_id=session_id, lesson_id=lesson_id).first()
#     if not existing:
#         db.session.add(CompletedLesson(session_id=session_id, lesson_id=lesson_id))
#         db.session.commit()
#     return True


# def log_quiz_attempt(session_id, quiz_id, answers):
#     """Log a quiz attempt"""
#     correct = sum(1 for ans in answers if ans.get("is_correct"))
#     total = len(answers)

#     attempt = QuizAttempt(
#         session_id=session_id,
#         quiz_id=quiz_id,
#         score=correct,
#         total=total
#     )

#     db.session.add(attempt)
#     db.session.commit()
#     return attempt


# def get_session_status(session_id):
#     """Get comprehensive information about a user session"""
#     session = get_or_create_session(session_id)

#     return {
#         "session_id": session_id,
#         "started_at": session.started_at.isoformat(),
#         "progress": get_lesson_progress(session_id),
#         "quiz_attempts": get_quiz_attempts(session_id),
#         "latest_quiz_results": get_latest_quiz_results(session_id)
#     }


# def get_user_progress(session_id):
#     """Get a summary of user progress"""
#     session = get_or_create_session(session_id)
#     lesson_progress = get_lesson_progress(session_id)

#     return {
#         "session_id": session_id,
#         "started_at": session.started_at.isoformat(),
#         "lesson_progress": {
#             "completed": lesson_progress["completed"],
#             "total": lesson_progress["total"],
#             "percentage": lesson_progress["percentage"]
#         },
#         "quiz_performance": get_quiz_performance(session_id),
#         "latest_activity": get_latest_activity(session_id)
#     }
