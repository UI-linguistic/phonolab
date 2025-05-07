import factory
from src.models.phoneme import Vowel, WordExample
from src.models.lesson import LessonMode, Lesson, Vowels101Lesson, TrickyPairLesson, MapVowelSpaceLesson, GraphemeLesson
from src.db import db

class VowelFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Vowel
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    id = factory.Sequence(lambda n: f"v{n}")
    ipa = factory.Sequence(lambda n: f"ipa_{n}")
    length = factory.Sequence(lambda n: f"length_{n}")
    color_code = "#000000"
    description = factory.Sequence(lambda n: f"Description for vowel {n}")
    pronounced = factory.Sequence(lambda n: f"pronounced_{n}")
    common_spellings = factory.LazyFunction(lambda: ["spelling1", "spelling2"])
    lips = factory.Sequence(lambda n: f"lips_{n}")
    tongue = factory.Sequence(lambda n: f"tongue_{n}")
    audio_url = factory.LazyFunction(lambda: ["/audio/vowel_example.mp3"])
    mouth_image_url = factory.Sequence(lambda n: f"/images/mouth_{n}.svg")

class WordExampleFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = WordExample
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    id = factory.Sequence(lambda n: n)
    word = factory.Sequence(lambda n: f"word_{n}")
    audio_url = factory.LazyFunction(lambda: ["/audio/word_example.mp3"])
    ipa = factory.Sequence(lambda n: f"ipa_{n}")
    example_sentence = factory.Sequence(lambda n: f"This is example sentence {n}")
    vowel_id = factory.LazyAttribute(lambda o: o.vowel.id if hasattr(o, 'vowel') else None)

class LessonModeFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = LessonMode
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    id = factory.Sequence(lambda n: n)
    name = factory.Sequence(lambda n: f"Mode {n}")
    slug = factory.Sequence(lambda n: f"mode-{n}")
    description = factory.Sequence(lambda n: f"Description for mode {n}")

class LessonFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Lesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    id = factory.Sequence(lambda n: n)
    title = factory.Sequence(lambda n: f"Lesson {n}")
    description = factory.Sequence(lambda n: f"Description for lesson {n}")
    lesson_mode_id = factory.LazyAttribute(lambda o: o.lesson_mode.id if hasattr(o, 'lesson_mode') else None)
    type = "lesson"

class Vowels101LessonFactory(LessonFactory):
    class Meta:
        model = Vowels101Lesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    content = factory.LazyFunction(lambda: {
        "tongue_position": {
            "title": "Tongue Position",
            "caption": "Explore how vowels are produced with different tongue heights and placements."
        },
        "lip_shape": {
            "title": "Lip Shape",
            "caption": "Click a lip to highlight the matching vowels and hear their sounds."
        }
    })
    type = "vowels_101_lesson"

class TrickyPairLessonFactory(LessonFactory):
    class Meta:
        model = TrickyPairLesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    instructions = "Practice distinguishing between these tricky vowel pairs."
    content = factory.LazyFunction(lambda: {
        "pairs": [
            {
                "vowel1": "i",
                "vowel2": "ɪ",
                "examples": ["beat/bit", "seat/sit"]
            }
        ]
    })
    type = "tricky_pair_lesson"

class MapVowelSpaceLessonFactory(LessonFactory):
    class Meta:
        model = MapVowelSpaceLesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    grid_data = factory.LazyFunction(lambda: {
        "grid": [
            [
                {"ipa": "i", "id": "v1"},
                {"ipa": "u", "id": "v10"}
            ],
            [
                {"ipa": "e", "id": "v3"},
                {"ipa": "o", "id": "v9"}
            ]
        ]
    })
    type = "map_vowel_space_lesson"

class GraphemeLessonFactory(LessonFactory):
    class Meta:
        model = GraphemeLesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    grapheme_data = factory.LazyFunction(lambda: {
        "graphemes": [
            {
                "spelling": "ee",
                "examples": ["see", "tree", "meet"],
                "vowel_id": "v1"
            }
        ]
    })
    type = "grapheme_lesson"
