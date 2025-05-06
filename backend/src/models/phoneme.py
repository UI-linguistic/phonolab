# # src/models/phoneme.py
from sqlalchemy import JSON
from src.db import db

class Vowel(db.Model):
    __tablename__ = "vowels"

    id = db.Column(db.String, primary_key=True)
    ipa = db.Column(db.String, nullable=False)

    # Fields now nullable or removed
    length = db.Column(db.String, nullable=True)
    color_code = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=True)

    # Optional details
    pronounced = db.Column(db.String)
    common_spellings = db.Column(JSON)
    lips = db.Column(db.String)
    tongue = db.Column(db.String)
    audio_url = db.Column(JSON)
    mouth_image_url = db.Column(db.String)

    # One-to-many: Vowel → WordExample
    word_examples = db.relationship(
        "WordExample",
        backref="vowel",
        cascade="all, delete-orphan",
        lazy=True
    )


    def get_tricky_pairs(self):
        """Return all TrickyPairs involving this vowel"""
        return TrickyPair.query.filter(
            db.or_(
                TrickyPair.vowel1_id == self.id,
                TrickyPair.vowel2_id == self.id
            )
        ).all()

    def get_tricky_neighbors(self):
        """Return all Vowels confused with this one"""
        return [
            pair.get_other(self.id)
            for pair in self.get_tricky_pairs()
            if pair.get_other(self.id) is not None
        ]

    def get_lesson_card(self):
        """
        Return a dictionary with the lesson card information.
        """
        return {
            "pronounced": self.pronounced,
            "common_spellings": self.common_spellings,
            "lips": self.lips,
            "tongue": self.tongue,
            "example_words": [w.word for w in self.word_examples]
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
    audio_url = db.Column(JSON)
    ipa = db.Column(db.String)
    example_sentence = db.Column(db.String)

    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)

    def __repr__(self):
        return f"<WordExample word='{self.word}' vowel_id='{self.vowel_id}'>"


class TrickyPair(db.Model):
    __tablename__ = "tricky_pairs"

    id = db.Column(db.Integer, primary_key=True)

    word_a = db.Column(db.String, nullable=False)  # e.g. "pit"
    word_b = db.Column(db.String, nullable=False)  # e.g. "pet"

    vowel_a = db.Column(db.String, nullable=False)  # e.g. "ɪ"
    vowel_b = db.Column(db.String, nullable=False)  # e.g. "ɛ"

    audio_a = db.Column(db.String)
    audio_b = db.Column(db.String)

    description = db.Column(db.String)  # Optional tip (e.g. "ɪ vs ɛ distinction")
    category = db.Column(db.String)     # Optional category ("vowel height", etc.)

    __table_args__ = (
        db.UniqueConstraint("word_a", "word_b", name="uq_tricky_pair_wordpair"),
    )
