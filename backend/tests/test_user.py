# from unittest.mock import MagicMock, patch
# from src.services.user import (
#     generate_session_id,
#     create_new_session,
#     get_or_create_session,
#     log_quiz_attempt,
#     mark_lesson_complete
# )


# def test_generate_session_id():
#     """Test that session ID is generated as a string UUID"""
#     session_id = generate_session_id()
#     assert isinstance(session_id, str)
#     assert len(session_id) == 36  # standard for UUID


# @patch('src.services.user.db.session')
# def test_create_new_session(mock_db_session):
#     """Test creating a new user session"""
#     with patch('src.services.user.generate_session_id') as mock_gen_id:
#         mock_gen_id.return_value = "test-session-id"
#         session = create_new_session()

#         assert session.session_id == "test-session-id"

#         mock_db_session.add.assert_called_once()
#         mock_db_session.commit.assert_called_once()


# @patch('src.services.user.db.session')
# @patch('src.services.user.UserSession')
# def test_get_or_create_session_existing(mock_user_session, mock_db_session):
#     """Test retrieving an existing session"""

#     mock_session = MagicMock()
#     mock_session.session_id = "existing-id"
#     mock_user_session.query.filter_by.return_value.first.return_value = mock_session

#     result = get_or_create_session("existing-id")

#     assert result == mock_session
#     # database ops check
#     mock_db_session.add.assert_not_called()
#     mock_db_session.commit.assert_not_called()


# @patch('src.services.user.db.session')
# @patch('src.services.user.UserSession')
# def test_get_or_create_session_new(mock_user_session, mock_db_session):
#     """Test creating a session when none exists"""
#     mock_user_session.query.filter_by.return_value.first.return_value = None
#     mock_instance = MagicMock()
#     mock_user_session.return_value = mock_instance

#     result = get_or_create_session("new-id")

#     mock_user_session.assert_called_once_with(session_id="new-id")
#     mock_db_session.add.assert_called_once()
#     mock_db_session.commit.assert_called_once()

#     assert result == mock_instance


# @patch('src.services.user.db.session')
# @patch('src.services.user.CompletedLesson')
# def test_mark_lesson_complete_new(mock_completed_lesson, mock_db_session):
#     """Test marking a lesson as complete for the first time"""
#     mock_completed_lesson.query.filter_by.return_value.first.return_value = None
#     result = mark_lesson_complete("session-id", 1)

#     assert result is True
#     mock_db_session.add.assert_called_once()
#     mock_db_session.commit.assert_called_once()


# @patch('src.services.user.db.session')
# @patch('src.services.user.CompletedLesson')
# def test_mark_lesson_complete_existing(mock_completed_lesson, mock_db_session):
#     """Test marking a lesson as complete that's already completed"""
#     mock_completed_lesson.query.filter_by.return_value.first.return_value = MagicMock()

#     result = mark_lesson_complete("session-id", 1)

#     assert result is True
#     mock_db_session.add.assert_not_called()
#     mock_db_session.commit.assert_not_called()


# @patch('src.services.user.db.session')
# def test_log_quiz_attempt(mock_db_session):
#     """Test logging a quiz attempt"""
#     answers = [
#         {"question_id": 1, "selected_option": "A", "is_correct": True},
#         {"question_id": 2, "selected_option": "B", "is_correct": False},
#         {"question_id": 3, "selected_option": "C", "is_correct": True}
#     ]

#     result = log_quiz_attempt("session-id", 1, answers)

#     # check attempt
#     assert result.session_id == "session-id"
#     assert result.quiz_id == 1
#     assert result.score == 2  # 2 correct
#     assert result.total == 3  # 3 total questions

#     # was it saved to db?
#     mock_db_session.add.assert_called_once()
#     mock_db_session.commit.assert_called_once()
