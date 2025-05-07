# src/models/quiz.py
from src.db import db


class QuizMode(db.Model):
    __tablename__ = "quiz_modes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    slug = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.Text)

    quizzes = db.relationship("Quiz", backref="mode", cascade="all, delete-orphan")


class Quiz(db.Model):
    __tablename__ = "quizzes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    instructions = db.Column(db.Text)

    quiz_mode_id = db.Column(db.Integer, db.ForeignKey("quiz_modes.id"), nullable=False)

    type = db.Column(db.String, nullable=False)
    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'base_quiz',
    }


class VowelShuffleQuiz(Quiz):
    __tablename__ = "vowel_shuffle_quizzes"

    id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), primary_key=True)
    items = db.Column(db.JSON, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'vowel_shuffle',
    }


class SpellAndTellQuiz(Quiz):
    __tablename__ = "spell_and_tell_quizzes"

    id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), primary_key=True)
    items = db.Column(db.JSON, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'spell_and_tell',
    }


class PairPlayQuiz(Quiz):
    __tablename__ = "pair_play_quizzes"

    id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), primary_key=True)
    pairs = db.Column(db.JSON, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'pair_play',
    }


class PhonicTrioQuiz(Quiz):
    __tablename__ = "phonic_trio_quizzes"

    id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), primary_key=True)

    prompt_samples = db.Column(db.JSON, nullable=False)
    source_id = db.Column(db.Integer, nullable=True, unique=True)
    feedback_correct = db.Column(db.Text, nullable=True)
    feedback_incorrect = db.Column(db.Text, nullable=True)

    options = db.relationship(
        "PhonicTrioOption",
        backref="quiz",
        cascade="all, delete-orphan",
        lazy=True
    )

    __mapper_args__ = {
        'polymorphic_identity': 'phonic_trio',
    }


class PhonicTrioOption(db.Model):
    __tablename__ = "phonic_trio_options"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("phonic_trio_quizzes.id"), nullable=False)

    word = db.Column(db.String, nullable=False)
    ipa = db.Column(db.String)
    audio_url = db.Column(db.String)
    is_correct = db.Column(db.Boolean, default=False)
    language = db.Column(db.String)
