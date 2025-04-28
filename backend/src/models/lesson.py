# src/models/lesson.py
from src.db import db


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False, unique=True)

    vowel = db.relationship("Vowel", backref=db.backref("lesson", uselist=False, cascade="all, delete-orphan"))

    def to_dict(self):
        # lesson card
        lesson_card = {}
        if self.vowel:
            lesson_card = {
                "pronounced": self.vowel.pronounced,
                "common_spellings": self.vowel.common_spellings,
                "lips": self.vowel.lips,
                "tongue": self.vowel.tongue,
                "example_words": self.vowel.example_words
            }
        
        # filtered vowel
        vowel_dict = None
        if self.vowel:
            vowel_dict = {
                "id": self.vowel.id,
                "phoneme": self.vowel.phoneme,
                "name": self.vowel.name,
                "ipa_example": self.vowel.ipa_example,
                "color_code": self.vowel.color_code,
                "audio_url": self.vowel.audio_url,
                "description": self.vowel.description,
                "mouth_image_url": self.vowel.mouth_image_url,
                # "word_examples": [we.to_dict() for we in self.vowel.word_examples]
            }
        
        return {
            "id": self.id,
            "vowel": vowel_dict,
            "lesson_card": lesson_card
        }


    def __repr__(self):
        return f"<Lesson id={self.id} vowel_id={self.vowel_id}>"
