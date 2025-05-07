# # src/models/phoneme.py
from sqlalchemy import JSON
from src.db import db


class Vowel(db.Model):
    __tablename__ = "vowels"

    id = db.Column(db.String(32), primary_key=True)
    ipa = db.Column(db.String(8), unique=True, nullable=False)
    description = db.Column(db.String(128), nullable=True)

    pronounced = db.Column(db.String(64), nullable=True)
    common_spellings = db.Column(JSON)
    length = db.Column(db.String(16), nullable=True)
    lips = db.Column(db.String(64), nullable=True)
    tongue = db.Column(db.String(64), nullable=True)

    audio_url = db.Column(JSON)
    mouth_image_url = db.Column(db.String(256), nullable=True)

    # One-to-many: Vowel → WordExample
    examples = db.relationship(
        "WordExample", 
        back_populates="vowel", 
        cascade="all, delete-orphan"
    )

    # def get_word_examples(self, limit=None):
    #     """Get word examples for this vowel"""
    #     query = WordExample.query.filter_by(vowel_id=self.id)
    #     if limit:
    #         query = query.limit(limit)
    #     return query.all()

    def __repr__(self):
        return f"<Vowel id={self.id} ipa='{self.ipa}'>"


class WordExample(db.Model):
    __tablename__ = "word_examples"
    
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(64), unique=True, nullable=False)
    audio_url = db.Column(JSON)
    ipa = db.Column(db.String(16))
    example_sentence = db.Column(db.String(256))

    vowel_id = db.Column(db.String(32), db.ForeignKey("vowels.id"), nullable=True)
    vowel = db.relationship("Vowel", back_populates="examples")

    def __repr__(self):
        return f"<WordExample word='{self.word}' vowel_id='{self.vowel_id}'>"


class MinimalPair(db.Model):
    __tablename__ = "minimal_pairs"

    id = db.Column(db.Integer, primary_key=True)

    # The actual word pair (e.g. "pit" vs "pet")
    word_a = db.Column(db.String(64), nullable=False)
    word_b = db.Column(db.String(64), nullable=False)

    # The contrasting vowel sounds (e.g. "ɪ" vs "ɛ")
    vowel_a = db.Column(db.String(8), nullable=False)
    vowel_b = db.Column(db.String(8), nullable=False)

    audio_a = db.Column(db.String(256))
    audio_b = db.Column(db.String(256))

    # Optional 
    description = db.Column(db.String(256))  # e.g. "ɪ vs ɛ distinction"
    category = db.Column(db.String(64))      # e.g. "vowel height"

    __table_args__ = (
        db.UniqueConstraint("word_a", "word_b", name="uq_minimal_pair_wordpair"),
    )

    def __repr__(self):
        return f"<MinimalPair '{self.word_a}' vs '{self.word_b}'>"


class SeedingStats:
    def __init__(self):
        self.inserted_vowels = 0
        self.skipped_vowels = 0
        self.inserted_words = 0
        self.skipped_words = 0

    def log(self):
        print("\n📊 Seeding Summary:")
        print(f"🟢 Inserted vowels: {self.inserted_vowels}")
        print(f"🟡 Skipped vowels (already existed): {self.skipped_vowels}")
        print(f"🟢 Inserted word examples: {self.inserted_words}")
        print(f"🟡 Skipped words (already existed): {self.skipped_words}")


# def make_tricky_pair(word1, word2, **kwargs):
#     if word1 == word2:
#         raise ValueError("Tricky pairs must consist of two distinct words.")
#     word_a, word_b = sorted([word1, word2])
#     return TrickyPair(word_a=word_a, word_b=word_b, **kwargs)
