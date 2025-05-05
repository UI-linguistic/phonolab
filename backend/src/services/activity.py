# # src/services/activity.py
# from datetime import datetime
# from src.services.lesson import get_latest_completed_lesson
# from src.services.quiz import get_latest_quiz_attempt


# def get_latest_activity(session_id):
#     """
#     Determine the most recent activity (lesson or quiz) for a user session.

#     This function compares the timestamps of the latest completed lesson and
#     the latest quiz attempt to determine which activity was most recent.

#     Args:
#         session_id (str): The unique identifier of the user session

#     Returns:
#         dict or None: A dictionary containing the latest activity information with:
#             - type (str): Either "lesson" or "quiz" indicating the activity type
#             - For lessons: lesson_id, completed_at, and other lesson details
#             - For quizzes: quiz_id, attempted_at, score, total, and other quiz details
#             Returns None if the user has no activity

#     Examples:
#         >>> activity = get_latest_activity("session123")
#         >>> if activity:
#         >>>     print(f"Latest activity was a {activity['type']}")
#     """
#     latest_lesson = get_latest_completed_lesson(session_id)
#     latest_quiz = get_latest_quiz_attempt(session_id)

#     # one or both activities don't exist
#     if not latest_lesson and not latest_quiz:
#         return None

#     if latest_lesson and not latest_quiz:
#         return {
#             "type": "lesson",
#             **latest_lesson
#         }

#     if latest_quiz and not latest_lesson:
#         return {
#             "type": "quiz",
#             **latest_quiz
#         }

#     lesson_time = datetime.fromisoformat(latest_lesson["completed_at"])
#     quiz_time = datetime.fromisoformat(latest_quiz["attempted_at"])

#     if lesson_time > quiz_time:
#         return {
#             "type": "lesson",
#             **latest_lesson
#         }

#     return {
#         "type": "quiz",
#         **latest_quiz
#     }
