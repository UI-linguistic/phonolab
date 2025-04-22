from dataclasses import asdict, dataclass, field
from typing import Dict, List, Optional

from .phoneme import ColorMapPosition, ComparisonPair, Vowel

# TODO: quiz has 3 correct answers instead of a single one

@dataclass
class QuizItem:
    question: str
    options: List[str]
    answer: str
    hint: Optional[str] = None


@dataclass
class VowelEntry(Vowel):
    quiz_items: List[QuizItem] = field(default_factory=list)
    map_location: Optional[ColorMapPosition] = None
    comparison_set: Optional[ComparisonPair] = None

    def to_dict(self) -> Dict:
        result = asdict(self)
        if self.map_location:
            result["map_location"] = asdict(self.map_location)
        if self.comparison_set:
            result["comparison_set"] = asdict(self.comparison_set)
        return result


class QuizEngine:
    def __init__(self, quiz_items: List[QuizItem]):
        self.quiz_data = quiz_items
        # TODO: move the fields below to user.py model
        
        # self.user_data: Dict = {
        #     "quiz_answers": [],
        #     "score": 0,
        #     "lesson_entries": []
        # }

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
