# backend/src/api/blueprints.py

from src.api.audio import audio_bp
from src.api.lesson import lesson_bp

# from src.api.phoneme import phoneme_bp
from src.api.quiz import quiz_bp
# from src.api.user import user_bp

# from .user import track_bp

all_blueprints = [
    lesson_bp,
    # phoneme_bp,
    quiz_bp,
    audio_bp,
    # user_bp,
]
