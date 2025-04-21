from dataclasses import asdict, dataclass, field
from typing import Dict, List, Optional

from .phoneme import ColorMapPosition, ComparisonPair, Vowel


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
