from models.quiz import QuizItem
from typing import List, Dict, Optional


class QuizEngine:
    def __init__(self, quiz_items: List[QuizItem]):
        self.quiz_data = quiz_items
        self.user_data: Dict = {
            "quiz_answers": [],
            "score": 0,
            "lesson_entries": []
        }

    def get_quiz_item(self, index: int) -> Optional[QuizItem]:
        if 1 <= index <= len(self.quiz_data):
            return self.quiz_data[index - 1]
        return None

    def submit_answer(self, index: int, selected: str) -> Optional[bool]:
        question = self.get_quiz_item(index)
        if not question or not selected:
            return None

        is_correct = selected == question.answer

        self.user_data["quiz_answers"].append({
            "index": index,
            "question": question.question,
            "selected": selected,
            "correct_answer": question.answer,
            "is_correct": is_correct
        })

        if is_correct:
            self.user_data["score"] += 1

        return is_correct

    def get_result_summary(self) -> Dict:
        return {
            "score": self.user_data["score"],
            "total": len(self.quiz_data),
            "answers": self.user_data["quiz_answers"]
        }

    def reset_quiz(self):
        self.user_data["quiz_answers"].clear()
        self.user_data["score"] = 0

    def get_user_state(self) -> Dict:
        return self.user_data
