# from flask import Flask
# import pytest
# from datetime import datetime, timedelta
# from src.db import db
# from src.models.user import UserSession, CompletedLesson, QuizAttempt
# from src.services.user import (
#     create_new_session,
#     get_or_create_session,
#     get_session_status,
#     get_user_progress,
#     mark_lesson_complete,
#     log_quiz_attempt
# )
# # from src.db import db
# # from src.models.user import UserSession, CompletedLesson, QuizAttempt
# # from src.services.user import (
# #     create_new_session,
# #     get_or_create_session,
# #     mark_lesson_complete,
# #     log_quiz_attempt,
# #     get_session_status,
# #     get_user_progress
# # )
# # from src.services.lesson import get_all_lesson_ids


# @pytest.fixture
# def mock_lessons(monkeypatch):
#     """Mock the get_all_lesson_ids function to return test lesson IDs"""
#     def mock_get_all_lesson_ids():
#         return [1, 2, 3, 4, 5]

#     monkeypatch.setattr('src.services.lesson.get_all_lesson_ids', mock_get_all_lesson_ids)


# def test_create_and_get_session(app):
#     """Test creating a session and retrieving it"""

#     session = create_new_session()
#     session_id = session.session_id

#     retrieved = get_or_create_session(session_id)

#     # Verify it's the same session
#     assert retrieved.id == session.id
#     assert retrieved.session_id == session_id


# def test_mark_lesson_complete_flow(app):
#     """Test the complete flow of marking lessons as complete"""

#     session = create_new_session()
#     session_id = session.session_id

#     mark_lesson_complete(session_id, 1)

#     completed = CompletedLesson.query.filter_by(session_id=session_id, lesson_id=1).first()
#     assert completed is not None

#     mark_lesson_complete(session_id, 1)

#     # check for duplicate
#     count = CompletedLesson.query.filter_by(session_id=session_id, lesson_id=1).count()
#     assert count == 1

#     # mark another lesson
#     mark_lesson_complete(session_id, 2)

#     completed_lessons = CompletedLesson.query.filter_by(session_id=session_id).all()
#     assert len(completed_lessons) == 2
#     completed_ids = [lesson.lesson_id for lesson in completed_lessons]
#     assert 1 in completed_ids
#     assert 2 in completed_ids


# def test_log_quiz_attempt_flow(app):
#     """Test the flow of logging quiz attempts"""
#     session = create_new_session()
#     session_id = session.session_id

#     answers1 = [
#         {"question_id": 1, "selected_option": "A", "is_correct": True},
#         {"question_id": 2, "selected_option": "B", "is_correct": False}
#     ]
#     attempt1 = log_quiz_attempt(session_id, 1, answers1)

#     assert attempt1.score == 1
#     assert attempt1.total == 2

#     answers2 = [
#         {"question_id": 1, "selected_option": "A", "is_correct": True},
#         {"question_id": 2, "selected_option": "C", "is_correct": True}
#     ]
#     attempt2 = log_quiz_attempt(session_id, 1, answers2)

#     assert attempt2.score == 2
#     assert attempt2.total == 2
#     assert attempt2.session_id == session_id
#     assert attempt2.quiz_id == 1

#     attempts = QuizAttempt.query.filter_by(session_id=session_id, quiz_id=1).all()
#     assert len(attempts) == 2

#     scores = [a.score for a in attempts]
#     assert 1 in scores
#     assert 2 in scores

#     attempt_ids = [a.id for a in attempts]
#     assert attempt1.id in attempt_ids
#     assert attempt2.id in attempt_ids


# def test_get_session_status(app, mock_lessons):
#     """Test getting comprehensive session status"""
#     session = create_new_session()
#     session_id = session.session_id

#     mark_lesson_complete(session_id, 1)
#     mark_lesson_complete(session_id, 3)

#     answers1 = [{"is_correct": True}, {"is_correct": False}]
#     log_quiz_attempt(session_id, 1, answers1)

#     answers2 = [{"is_correct": True}, {"is_correct": True}]
#     log_quiz_attempt(session_id, 2, answers2)

#     status = get_session_status(session_id)

#     import json
#     print(f"\nActual status structure: {json.dumps(status, indent=2)}")

#     assert status["session_id"] == session_id
#     assert status["progress"]["completed"] == 2
#     assert status["progress"]["total"] == 5
#     assert status["progress"]["percentage"] == 40.0
#     assert sorted(status["progress"]["completed_lessons"]) == [1, 3]
#     assert sorted(status["progress"]["remaining_lessons"]) == [2, 4, 5]
#     assert len(status["quiz_attempts"]) == 2

#     assert "latest_quiz_results" in status

#     quiz1_result = status["latest_quiz_results"].get("1") or status["latest_quiz_results"].get(1)
#     quiz2_result = status["latest_quiz_results"].get("2") or status["latest_quiz_results"].get(2)

#     assert quiz1_result is not None, "Quiz 1 results not found in latest_quiz_results"
#     assert quiz2_result is not None, "Quiz 2 results not found in latest_quiz_results"

#     assert quiz1_result["percentage"] == 50.0
#     assert quiz2_result["percentage"] == 100.0


# def test_get_user_progress(app, mock_lessons):
#     """Test getting user progress summary"""
#     session = create_new_session()
#     session_id = session.session_id

#     mark_lesson_complete(session_id, 1)

#     answers = [{"is_correct": True}, {"is_correct": False}]
#     log_quiz_attempt(session_id, 1, answers)

#     progress = get_user_progress(session_id)

#     import json
#     print(f"\nActual progress structure: {json.dumps(progress, indent=2)}")

#     assert progress["session_id"] == session_id
#     assert progress["lesson_progress"]["completed"] == 1
#     assert progress["lesson_progress"]["total"] == 5
#     assert progress["lesson_progress"]["percentage"] == 20.0
#     assert progress["quiz_performance"]["attempts"] == 1
#     assert progress["quiz_performance"]["average_score"] == 50.0

#     assert progress["latest_activity"] is not None
#     assert progress["latest_activity"]["type"] in ["lesson", "quiz"]
