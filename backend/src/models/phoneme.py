# # src/models/phoneme.py
from sqlalchemy import JSON
from src.db import db


class Vowel(db.Model):
    __tablename__ = "vowels"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.String, primary_key=True)
    ipa = db.Column(db.String, nullable=False)

    # nullable or removed
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

    # One-to-many: Vowel → WordExample - Use fully qualified path
    word_examples = db.relationship("src.models.phoneme.WordExample", back_populates="vowel")

    def get_word_examples(self, limit=None):
        """Get word examples for this vowel"""
        query = WordExample.query.filter_by(vowel_id=self.id)
        if limit:
            query = query.limit(limit)
        return query.all()

    def __repr__(self):
        return f"<Vowel id={self.id} ipa='{self.ipa}'>"


class WordExample(db.Model):
    __tablename__ = "word_examples"
    __table_args__ = {"extend_existing": True}
    
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String, nullable=False)
    audio_url = db.Column(JSON)
    ipa = db.Column(db.String)
    example_sentence = db.Column(db.String)
    vowel_id = db.Column(db.String, db.ForeignKey("vowels.id"), nullable=False)
    
    vowel = db.relationship("src.models.phoneme.Vowel", back_populates="word_examples")

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
        {"extend_existing": True}
    )
