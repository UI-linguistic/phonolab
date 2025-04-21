# backend/src/api/blueprints.py

from .learn import learn_bp
from .quiz import quiz_bp
from .user import track_bp

all_blueprints = [
    learn_bp,
    quiz_bp,
    track_bp
]
