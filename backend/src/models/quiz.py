# src/models/quiz.py
from src.db import db

# src/models/quiz.py


class QuizItem(db.Model):
    """
    Database model representing a quiz question in the PhonoLab system.
    
    Attributes:
        id (int): Unique identifier for the quiz item.
        prompt_word (str): The word presented as the quiz question.
        prompt_audio_url (str): URL to the audio file of the prompt word.
        prompt_ipa (str): IPA transcription of the prompt word.
        feedback_correct (str): Feedback for correct answers.
        feedback_incorrect (str): Feedback for incorrect answers.
        vowel_id (str): Foreign key to the associated vowel.
    
    Relationships:
        vowel: Many-to-one relationship with the Vowel model.
        options: One-to-many relationship with QuizOption model.
    """
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
    """
    Database model representing an answer option for a quiz question.
    
    Attributes:
        id (int): Unique identifier for the quiz option.
        word (str): The word presented as an answer option.
        ipa (str): IPA transcription of the option word.
        audio_url (str): URL to the audio file of the option word.
        is_correct (bool): Whether this option is the correct answer.
        language (str): Language identifier for the word.
        quiz_item_id (int): Foreign key to the associated quiz item.
    
    Relationships:
        quiz_item: Many-to-one relationship with the QuizItem model.
    """
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
