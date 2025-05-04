# # src/models/phoneme.py
from src.db import db


tricky_vowel_pairs = db.Table(
    'tricky_vowel_pairs',
    db.Column('vowel1_id', db.String, db.ForeignKey('vowels.id'), primary_key=True),
    db.Column('vowel2_id', db.String, db.ForeignKey('vowels.id'), primary_key=True),
    db.Column('category', db.String, nullable=False),  # e.g., "High Front Vowels"
    db.Column('difficulty', db.Integer, default=1),  # 1-5 scale of difficulty
    db.Column('description', db.String)  # e.g., "Confused by Spanish speakers"
)

class Vowel(db.Model):
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

    tricky_pairs = db.relationship(
        'Vowel',
        secondary=tricky_vowel_pairs,
        primaryjoin=(tricky_vowel_pairs.c.vowel1_id == id),
        secondaryjoin=(tricky_vowel_pairs.c.vowel2_id == id),
        backref=db.backref('paired_with', lazy='dynamic')
    )

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

    def get_word_examples(self, limit=None):
        """Get word examples for this vowel"""
        query = WordExample.query.filter_by(vowel_id=self.id)
        if limit:
            query = query.limit(limit)
        return query.all()

    def __repr__(self):
        return f"<Vowel id={self.id} phoneme='{self.phoneme}' name='{self.name}'>"


class WordExample(db.Model):
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


# # Phase 2
# # class ColorMapPosition(db.Model):
# #     __tablename__ = "color_map_positions"
# #
# #     id = db.Column(db.Integer, primary_key=True)
# #     x = db.Column(db.Float, nullable=False)
# #     y = db.Column(db.Float, nullable=False)
# #     region = db.Column(db.String, nullable=False)
# #     vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"))
# #
# #     def __repr__(self):
# #         return f"<ColorMapPosition x={self.x}, y={self.y}, region='{self.region}'>"


# # class ComparisonPair(db.Model):
# #     __tablename__ = "comparison_pairs"
# #
# #     id = db.Column(db.Integer, primary_key=True)
# #     contrast_with = db.Column(db.String, nullable=False)
# #     word_a = db.Column(db.String, nullable=False)
# #     word_b = db.Column(db.String, nullable=False)
# #     audio_url_a = db.Column(db.String, nullable=False)
# #     audio_url_b = db.Column(db.String, nullable=False)
# #     note = db.Column(db.String, nullable=True)
# #     vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"))
# #
# #     def __repr__(self):
# #         return (
# #             f"<ComparisonPair contrast_with='{self.contrast_with}', "
# #             f"word_a='{self.word_a}', word_b='{self.word_b}'>"
# #         )
