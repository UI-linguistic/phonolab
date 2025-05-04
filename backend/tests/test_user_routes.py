import json
import pytest


@pytest.fixture
def client(app):
    """Create a test client using the app fixture from conftest.py"""
    return app.test_client()


@pytest.fixture
def mock_lessons(monkeypatch):
    """Mock the get_all_lesson_ids function to return test lesson IDs"""
    def mock_get_all_lesson_ids():
        return [1, 2, 3, 4, 5]

    monkeypatch.setattr('src.services.lesson.get_all_lesson_ids', mock_get_all_lesson_ids)


def test_create_session(client):
    """Test creating a new session via the API"""
    response = client.post('/user/session')

    assert response.status_code == 200
    data = json.loads(response.data)

    assert "session_id" in data
    assert "started_at" in data
    assert len(data["session_id"]) > 0


def test_get_session_status(client, mock_lessons):
    """Test getting session status via the API"""
    create_response = client.post('/user/session')
    create_data = json.loads(create_response.data)
    session_id = create_data["session_id"]

    client.post('/user/lesson-complete',
                json={"session_id": session_id, "lesson_id": 1})

    client.post('/user/quiz-score',
                json={
                    "session_id": session_id,
                    "quiz_id": 1,
                    "answers": [{"is_correct": True}, {"is_correct": False}]
                })

    response = client.get(f'/user/session/{session_id}')

    assert response.status_code == 200
    data = json.loads(response.data)

    assert data["session_id"] == session_id
    assert "started_at" in data
    assert "progress" in data
    assert data["progress"]["completed"] == 1
    assert data["progress"]["total"] == 5
    assert data["progress"]["percentage"] == 20.0
    assert 1 in data["progress"]["completed_lessons"]
    assert "quiz_attempts" in data
    assert len(data["quiz_attempts"]) == 1
    assert "latest_quiz_results" in data
    assert "1" in data["latest_quiz_results"]
    assert data["latest_quiz_results"]["1"]["percentage"] == 50.0


def test_complete_lesson(client):
    """Test marking a lesson as complete via the API"""
    create_response = client.post('/user/session')
    create_data = json.loads(create_response.data)
    session_id = create_data["session_id"]

    response = client.post('/user/lesson-complete',
                           json={"session_id": session_id, "lesson_id": 1})

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "success"
    assert "message" in data

    response = client.post('/user/lesson-complete',
                           json={"session_id": session_id})

    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["status"] == "error"
    assert "message" in data


def test_submit_quiz_score(client):
    """Test submitting a quiz score via the API"""
    create_response = client.post('/user/session')
    create_data = json.loads(create_response.data)
    session_id = create_data["session_id"]

    response = client.post('/user/quiz-score',
                           json={
                               "session_id": session_id,
                               "quiz_id": 1,
                               "answers": [
                                   {"question_id": 1, "selected_option": "A", "is_correct": True},
                                   {"question_id": 2, "selected_option": "B", "is_correct": False}
                               ]
                           })

    assert response.status_code == 200
    data = json.loads(response.data)

    assert "status" in data
    assert "attempt_id" in data
    assert data["score"] == 1
    assert data["total"] == 2
    assert data["percentage"] == 50.0

    response = client.post('/user/quiz-score',
                           json={"session_id": session_id, "quiz_id": 1})

    assert response.status_code == 400
    data = json.loads(response.data)
    assert data["status"] == "error"
    assert "message" in data


def test_get_user_progress(client, mock_lessons):
    """Test getting user progress via the API"""
    create_response = client.post('/user/session')
    create_data = json.loads(create_response.data)
    session_id = create_data["session_id"]

    client.post('/user/lesson-complete',
                json={"session_id": session_id, "lesson_id": 1})
    client.post('/user/quiz-score',
                json={
                    "session_id": session_id,
                    "quiz_id": 1,
                    "answers": [{"is_correct": True}, {"is_correct": False}]
                })

    response = client.get(f'/user/progress/{session_id}')

    assert response.status_code == 200
    data = json.loads(response.data)

    assert data["session_id"] == session_id
    assert "lesson_progress" in data
    assert data["lesson_progress"]["completed"] == 1
    assert data["lesson_progress"]["total"] == 5
    assert data["lesson_progress"]["percentage"] == 20.0
    assert "quiz_performance" in data
    assert data["quiz_performance"]["attempts"] == 1
    assert data["quiz_performance"]["average_score"] == 50.0
    assert "latest_activity" in data
    assert data["latest_activity"]["type"] in ["lesson", "quiz"]


# def test_nonexistent_session(client):
#     """Test API behavior with a non-existent session ID"""
#     session_id = "00000000-0000-0000-0000-000000000000"
#     status_response = client.get(f'/user/session/{session_id}')

#     progress_response = client.get(f'/user/progress/{session_id}')

#     complete_response = client.post('/user/lesson-complete',
#                                     json={"session_id": session_id, "lesson_id": 1})

#     assert complete_response.status_code == 200
