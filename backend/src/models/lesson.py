# src/models/lesson.py
from src.db import db
from enum import Enum


class LessonType(Enum):
    VOWEL_LESSON = "vowel_lesson"
    VOWELS_101 = "vowels_101"
    MAP_VOWEL_SPACE = "map_vowel_space"
    TRAIN_YOUR_EAR = "train_your_ear"
    TRICKY_PAIRS = "tricky_pairs"


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=True)
    description = db.Column(db.Text, nullable=True)
    lesson_type = db.Column(db.String, nullable=False, default="vowel_lesson")

    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=True)
    vowel = db.relationship("Vowel", backref=db.backref("lesson", uselist=False, cascade="all, delete-orphan"))

    # content varies per lesson
    content = db.Column(db.JSON, nullable=True)

    # lesson types
    interactions = db.relationship("LessonInteraction", backref="lesson", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Lesson id={self.id} type={self.lesson_type} vowel_id={self.vowel_id}>"


class LessonInteraction(db.Model):
    """Stores specific interaction components for lessons"""
    __tablename__ = "lesson_interactions"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)
    interaction_type = db.Column(db.String, nullable=False)  # e.g., "tongue_position", "lip_shape"

    # Interaction-specific data
    config = db.Column(db.JSON, nullable=False)

    def __repr__(self):
        return f"<LessonInteraction {self.id}: {self.interaction_type} for Lesson {self.lesson_id}>"

# For Tricky Pairs specifically


class WordPair(db.Model):
    """Stores word pairs for the Tricky Pairs lesson type"""
    __tablename__ = "word_pairs"

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)

    word1 = db.Column(db.String, nullable=False)
    word2 = db.Column(db.String, nullable=False)

    ipa1 = db.Column(db.String, nullable=False)
    ipa2 = db.Column(db.String, nullable=False)

    audio_url1 = db.Column(db.String, nullable=True)
    audio_url2 = db.Column(db.String, nullable=True)

    # The vowels/phonemes that distinguish these words
    target_phoneme1_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=True)
    target_phoneme2_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=True)

    def __repr__(self):
        return f"<WordPair {self.id}: {self.word1}/{self.word2}>"
