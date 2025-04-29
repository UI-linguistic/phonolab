# # src/models/phoneme.py
from src.db import db


class Vowel(db.Model):
    """
    Database model representing a vowel phoneme in the PhonoLab system.
    
    Attributes:
        id (str): Unique identifier for the vowel.
        phoneme (str): The IPA symbol for the vowel.
        name (str): Human-readable name for the vowel.
        audio_url (str): URL to the audio file demonstrating the vowel sound.
    Relationships:
        word_examples: One-to-many relationship with WordExample model.
        lesson: One-to-one relationship with Lesson model (via backref).
    """
    __tablename__ = "vowels"

    id = db.Column(db.String, primary_key=True)
    phoneme = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    ipa_example = db.Column(db.String, nullable=False)
    color_code = db.Column(db.String, nullable=False)
    audio_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    # New fields from vowel.json
    pronounced = db.Column(db.String, nullable=True)
    common_spellings = db.Column(db.JSON, nullable=True)
    lips = db.Column(db.String, nullable=True)
    tongue = db.Column(db.String, nullable=True)
    example_words = db.Column(db.JSON, nullable=True)
    mouth_image_url = db.Column(db.String, nullable=True)

    word_examples = db.relationship(
        "WordExample",
        backref="vowel",
        cascade="all, delete-orphan",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "phoneme": self.phoneme,
            "name": self.name,
            "ipa_example": self.ipa_example,
            "color_code": self.color_code,
            "audio_url": self.audio_url,
            "description": self.description,
            "pronounced": self.pronounced,
            "common_spellings": self.common_spellings,
            "lips": self.lips,
            "tongue": self.tongue,
            "example_words": self.example_words,
            "mouth_image_url": self.mouth_image_url,
            "word_examples": [we.to_dict() for we in self.word_examples]
        }

    def get_lesson_card(self):
        """
        Return a dictionary with the lesson card information.
        """
        return {
            "pronounced": self.pronounced,
            "common_spellings": self.common_spellings,
            "lips": self.lips,
            "tongue": self.tongue,
            "example_words": self.example_words
        }

    def __repr__(self):
        return f"<Vowel id={self.id} phoneme='{self.phoneme}' name='{self.name}'>"


class WordExample(db.Model):
    """
    Database model representing example words that contain specific vowel sounds.
    
    Attributes:
        id (int): Unique identifier for the word example.
        word (str): The example word containing the target vowel.
        audio_url (str): URL to the audio file of the word.
        ipa (str): IPA transcription of the word.
        example_sentence (str): Example sentence using the word.
        vowel_id (str): Foreign key to the associated vowel.
    
    Relationships:
        vowel: Many-to-one relationship with the Vowel model.
    """
    __tablename__ = "word_examples"

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String, nullable=False)
    audio_url = db.Column(db.String, nullable=False)
    ipa = db.Column(db.String, nullable=True)
    example_sentence = db.Column(db.String, nullable=True)
    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)

    def to_dict(self):
        return {
            "word": self.word,
            "audio_url": self.audio_url,
            "ipa": self.ipa,
            "example_sentence": self.example_sentence
        }

    def __repr__(self):
        return f"<WordExample word='{self.word}' vowel_id='{self.vowel_id}'>"
