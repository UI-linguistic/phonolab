# # src/models/phoneme.py
from typing import Optional
from src.db import db


class Vowel(db.Model):
    __tablename__ = "vowels"

    id = db.Column(db.String, primary_key=True)
    phoneme = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    ipa_example = db.Column(db.String, nullable=False)
    color_code = db.Column(db.String, nullable=False)
    audio_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

    # Optional details
    pronounced = db.Column(db.String)
    common_spellings = db.Column(db.JSON)
    lips = db.Column(db.String)
    tongue = db.Column(db.String)
    mouth_image_url = db.Column(db.String)

    # One-to-many
    word_examples = db.relationship("WordExample",
                                    backref="vowel",
                                    cascade="all, delete-orphan",
                                    lazy=True)

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
    audio_url = db.Column(db.String, nullable=False)
    ipa = db.Column(db.String)
    example_sentence = db.Column(db.String)

    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)

    def __repr__(self):
        return f"<WordExample word='{self.word}' vowel_id='{self.vowel_id}'>"


class TrickyPair(db.Model):
    __tablename__ = "tricky_pairs"

    id = db.Column(db.Integer, primary_key=True)

    vowel1_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)
    vowel2_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)

    category = db.Column(db.String)
    difficulty = db.Column(db.Integer, default=1)
    description = db.Column(db.String)

    vowel1 = db.relationship("Vowel", foreign_keys=[vowel1_id])
    vowel2 = db.relationship("Vowel", foreign_keys=[vowel2_id])

    __table_args__ = (
        db.UniqueConstraint('vowel1_id', 'vowel2_id', name='uq_tricky_pair_unique'),
    )

    def involves(self, vowel_id: str) -> bool:
        return self.vowel1_id == vowel_id or self.vowel2_id == vowel_id

    def get_other(self, vowel_id: str) -> Optional["Vowel"]:
        if self.vowel1_id == vowel_id:
            return self.vowel2
        elif self.vowel2_id == vowel_id:
            return self.vowel1
        return None
