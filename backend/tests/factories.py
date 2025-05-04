import factory
import uuid
from datetime import datetime, UTC
from factory.faker import Faker
from src.models.phoneme import Vowel, WordExample
from src.models.lesson import Lesson
from src.models.user import UserSession, CompletedLesson, QuizAttempt
from src.db import db


class VowelFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Vowel
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"
    
    id = factory.Sequence(lambda n: f"vowel_{n}")
    phoneme = factory.Sequence(lambda n: f"p_{n}")
    name = factory.Sequence(lambda n: f"Vowel {n}")
    ipa_example = factory.Sequence(lambda n: f"example_{n}")
    color_code = "#000000"
    audio_url = factory.Sequence(lambda n: f"/audio/vowel_{n}.mp3")
    description = factory.Sequence(lambda n: f"Description for vowel {n}")
    pronounced = None
    common_spellings = None
    lips = None
    tongue = None
    example_words = None
    mouth_image_url = None

class LessonFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Lesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"
    
    id = factory.Sequence(lambda n: n)
    vowel_id = factory.LazyAttribute(lambda o: o.vowel.id if hasattr(o, 'vowel') else None)

class WordExampleFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = WordExample
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"
    
    id = factory.Sequence(lambda n: n)
    word = factory.Sequence(lambda n: f"word_{n}")
    ipa = factory.Sequence(lambda n: f"ipa_{n}")
    audio_url = factory.Sequence(lambda n: f"/audio/word_{n}.mp3")
    vowel_id = factory.LazyAttribute(lambda o: o.vowel.id if hasattr(o, 'vowel') else None)

class UserSessionFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = UserSession
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"
    
    id = factory.Sequence(lambda n: n)
    session_id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    started_at = factory.LazyFunction(lambda: datetime.now(UTC))

class CompletedLessonFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = CompletedLesson
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"
    
    id = factory.Sequence(lambda n: n)
    session_id = factory.LazyAttribute(lambda o: o.session.session_id if hasattr(o, 'session') else None)
    lesson_id = factory.Sequence(lambda n: n)
    completed_at = factory.LazyFunction(lambda: datetime.now(UTC))

class QuizAttemptFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = QuizAttempt
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"
    
    id = factory.Sequence(lambda n: n)
    session_id = factory.LazyAttribute(lambda o: o.session.session_id if hasattr(o, 'session') else None)
    quiz_id = factory.Sequence(lambda n: n)
    score = factory.Faker('random_int', min=0, max=10)
    total = factory.Faker('random_int', min=10, max=10)
    attempted_at = factory.LazyFunction(lambda: datetime.now(UTC))
