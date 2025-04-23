# backend/src/api/blueprints.py

from .audio import audio_bp
from .lesson import lesson_bp
from .phoneme import phoneme_bp
from .quiz import quiz_bp
from .user import user_bp

# from .user import track_bp

all_blueprints = [
    lesson_bp,
    phoneme_bp,
    quiz_bp,
    audio_bp,
    user_bp
]
