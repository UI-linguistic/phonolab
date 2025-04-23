# TODO:
#   1. learn module
#       - id (endpoint)
#       - Vowel Object
#       - sample text pronounciation
#       - Instructions List (5 items)
#       - 

# 1. create learn page content
# 2. get page by id
# 3. generate database, then migrate

# lesson_1 = VowelEntry(
#     id="ae",
#     phoneme="æ",
#     name="Short A",
#     word_example="cat",
#     ipa_example="/kæt/",
#     audio_url="/audio/cat_ae.mp3",
#     description=["5 sentences - link is sending me it"]
# )

from typing import Optional, List
from models.learn import LearnLesson
from models.phoneme import Vowel


def get_lesson_by_index(index: int) -> Optional[LearnLesson]:
    """Fetch lesson data for the given index."""
    if 1 <= index <= len(_LESSON_DATA):
        return _LESSON_DATA[index - 1]
    return None


def log_lesson_visit(lesson_id: int):
    """Track when a user visits a lesson."""
    user_lesson_log["visited"].append(lesson_id)


def reset_lesson_log():
    """Clear user lesson visit history."""
    user_lesson_log["visited"].clear()
    