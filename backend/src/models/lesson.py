# src/models/lesson.py
from src.db import db
from src.models.phoneme import Vowel


class LessonMode(db.Model):
    __tablename__ = "lesson_modes"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    slug = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.Text)
    
    lessons = db.relationship("src.models.lesson.Lesson", backref="mode", cascade="all, delete-orphan")

class Lesson(db.Model):
    __tablename__ = "lessons"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    lesson_mode_id = db.Column(db.Integer, db.ForeignKey("lesson_modes.id"), nullable=False)
    type = db.Column(db.String, nullable=False)
    
    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'lesson',
    }

class Vowels101Lesson(Lesson):
    __tablename__ = "vowels_101_lessons"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    content = db.Column(db.JSON)
    
    __mapper_args__ = {
        'polymorphic_identity': 'vowels_101_lesson',
    }


class TrickyPairLesson(Lesson):
    __tablename__ = "tricky_pair_lessons"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    instructions = db.Column(db.Text)
    content = db.Column(db.JSON)
    
    __mapper_args__ = {
        'polymorphic_identity': 'tricky_pair_lesson',
    }

class MapVowelSpaceLesson(Lesson):
    __tablename__ = "map_vowel_space_lessons"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    grid_data = db.Column(db.JSON, nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': 'map_vowel_space_lesson',
    }

class GraphemeLesson(Lesson):
    __tablename__ = "grapheme_lessons"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, db.ForeignKey("lessons.id"), primary_key=True)
    grapheme_data = db.Column(db.JSON, nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': 'grapheme_lesson',
    }

