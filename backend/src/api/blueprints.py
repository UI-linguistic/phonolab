# backend/src/api/blueprints.py

"""
Central list of all Flask blueprints to be registered in app.py.
Import blueprints here to simplify registration and avoid circular imports.
"""

from src.api.lesson import lesson_bp
from src.api.quiz import quiz_bp
from src.api.user import user_bp

# Optional / inactive
# from src.api.phoneme import phoneme_bp
# from .user import track_bp

all_blueprints = [
    lesson_bp,
    quiz_bp,
    user_bp,
    # phoneme_bp,
    # track_bp
]
