# src/models/lesson.py
from src.db import db


class LessonMode(db.Model):
    __tablename__ = "lesson_modes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    slug = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.Text)

    lessons = db.relationship("Lesson", backref="mode", cascade="all, delete-orphan")


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)

    lesson_mode_id = db.Column(db.Integer, db.ForeignKey("lesson_modes.id"), nullable=False)

    type = db.Column(db.String, nullable=False)
    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'base_lesson',
    }


class VowelLesson(Lesson):
    __tablename__ = "vowel_lessons"

    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)
    vowel = db.relationship("Vowel")

    content = db.Column(db.JSON)

    __mapper_args__ = {
        'polymorphic_identity': 'vowel_lesson',
    }


class TrickyPairLesson(Lesson):
    __tablename__ = "tricky_pair_lessons"

    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    instructions = db.Column(db.Text)

    word_pairs = db.relationship("WordPair", backref="lesson", cascade="all, delete-orphan")

    __mapper_args__ = {
        'polymorphic_identity': 'tricky_pairs',
    }


class MapVowelSpaceLesson(Lesson):
    __tablename__ = "map_vowel_space_lessons"

    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    grid_data = db.Column(db.JSON, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'map_vowel_space',
    }


class GraphemeLesson(Lesson):
    __tablename__ = "grapheme_lessons"

    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    grapheme_data = db.Column(db.JSON, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'get_your_graphemes_right',
    }
