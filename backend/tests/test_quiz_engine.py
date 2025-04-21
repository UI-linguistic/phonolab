import pytest

from models.quiz import QuizItem, QuizEngine


@pytest.fixture
def demo_quiz():
    return [
        QuizItem(
            question="Which word has the same vowel as 'cat'?",
            options=["bat", "bet", "cut"],
            answer="bat"
        ),
        QuizItem(
            question="Which word has the same vowel as 'bed'?",
            options=["bad", "bet", "bat"],
            answer="bet"
        )
    ]


@pytest.fixture
def engine(demo_quiz):
    return QuizEngine(demo_quiz)

def test_get_quiz_item_valid(engine):
    item = engine.get_quiz_item(1)
    assert item is not None
    assert item.question == "Which word has the same vowel as 'cat'?"


def test_get_quiz_item_invalid(engine):
    assert engine.get_quiz_item(0) is None
    assert engine.get_quiz_item(100) is None


def test_submit_answer_correct(engine):
    result = engine.submit_answer(1, "bat")
    assert result is True
    summary = engine.get_result_summary()
    assert summary["score"] == 1
    assert summary["answers"][0]["is_correct"] is True


def test_submit_answer_incorrect(engine):
    result = engine.submit_answer(1, "cut")
    assert result is False
    summary = engine.get_result_summary()
    assert summary["score"] == 0
    assert summary["answers"][0]["is_correct"] is False


def test_quiz_reset(engine):
    engine.submit_answer(1, "bat")
    engine.reset_quiz()
    summary = engine.get_result_summary()
    assert summary["score"] == 0
    assert len(summary["answers"]) == 0
