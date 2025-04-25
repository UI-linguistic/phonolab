# src/models/quiz.py
from src.db import db

# src/models/quiz.py


class QuizItem(db.Model):
    __tablename__ = "quiz_items"

    id = db.Column(db.Integer, primary_key=True)
    prompt_word = db.Column(db.String, nullable=False)
    prompt_audio_url = db.Column(db.String, nullable=False)
    prompt_ipa = db.Column(db.String, nullable=False)

    # NEW FIELDS for feedback messages
    feedback_correct = db.Column(db.String, nullable=True)
    feedback_incorrect = db.Column(db.String, nullable=True)

    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=True)
    vowel = db.relationship("Vowel", backref="quizzes")

    options = db.relationship("QuizOption", backref="quiz_item", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "prompt_word": self.prompt_word,
            "prompt_ipa": self.prompt_ipa,
            "prompt_audio_url": self.prompt_audio_url,
            "feedback_correct": self.feedback_correct,
            "feedback_incorrect": self.feedback_incorrect,
            "options": [opt.to_dict() for opt in self.options],
        }

    def __repr__(self):
        return f"<QuizItem {self.prompt_word} ({self.prompt_ipa})>"


class QuizOption(db.Model):
    __tablename__ = "quiz_options"

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String, nullable=False)
    ipa = db.Column(db.String, nullable=False)
    audio_url = db.Column(db.String, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    language = db.Column(db.String, nullable=True)

    quiz_item_id = db.Column(db.Integer, db.ForeignKey("quiz_items.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "word": self.word,
            "ipa": self.ipa,
            "audio_url": self.audio_url,
            "is_correct": self.is_correct,
            "language": self.language
        }

    def __repr__(self):
        return f"<QuizOption word='{self.word}' ipa='{self.ipa}' lang='{self.language}' correct={self.is_correct}>"
