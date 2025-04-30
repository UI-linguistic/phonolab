from src.db import db


class QuizItem(db.Model):
    __tablename__ = "quiz_items"

    id = db.Column(db.Integer, primary_key=True)
    prompt_word = db.Column(db.String, nullable=False)
    prompt_audio_url = db.Column(db.String, nullable=False)
    prompt_ipa = db.Column(db.String, nullable=False)

    # Optional: associate quiz with a vowel
    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=True)
    vowel = db.relationship("Vowel", backref="quizzes")

    # Relationships
    options = db.relationship("QuizOption", backref="quiz_item", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "prompt_word": self.prompt_word,
            "prompt_ipa": self.prompt_ipa,
            "prompt_audio_url": self.prompt_audio_url,
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

    quiz_item_id = db.Column(db.Integer, db.ForeignKey("quiz_items.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "word": self.word,
            "ipa": self.ipa,
            "audio_url": self.audio_url,
            "is_correct": self.is_correct
        }

    def __repr__(self):
        return f"<QuizOption word='{self.word}' ipa='{self.ipa}' correct={self.is_correct}>"
