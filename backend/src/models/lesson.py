# src/models/learn.py

from src.db import db


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False, unique=True)

    vowel = db.relationship("Vowel", backref=db.backref("lesson", uselist=False, cascade="all, delete-orphan"))
    instructions = db.relationship("LessonInstruction", backref="lesson", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "vowel": self.vowel.to_dict() if self.vowel else None,
            "instructions": [instruction.to_dict() for instruction in self.instructions]
        }

    def __repr__(self):
        return f"<Lesson id={self.id} vowel_id={self.vowel_id}>"


class LessonInstruction(db.Model):
    __tablename__ = "lesson_instructions"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text
        }

    def __repr__(self):
        return f"<LessonInstruction id={self.id} lesson_id={self.lesson_id}>"
