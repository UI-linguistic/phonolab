# backend/config.py
import os
from dotenv import load_dotenv


load_dotenv()


BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
STATIC_DIR = os.path.join(BASE_DIR, "static")
DATA_DIR = os.path.join(BASE_DIR, "src", "data")

# Set environment defaults
os.environ.setdefault("SECRET_KEY", "secret")
os.environ.setdefault("SQLALCHEMY_DATABASE_URI", f"sqlite:///{os.path.join(INSTANCE_DIR, 'phonolab.db')}")


class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Caching
    CACHE_TYPE = os.getenv("CACHE_TYPE", "simple")
    CACHE_DEFAULT_TIMEOUT = int(os.getenv("CACHE_DEFAULT_TIMEOUT", 3600))
    CACHE_REDIS_HOST = os.getenv("CACHE_REDIS_HOST", "localhost")
    CACHE_REDIS_PORT = int(os.getenv("CACHE_REDIS_PORT", 6379))
    CACHE_REDIS_DB = int(os.getenv("CACHE_REDIS_DB", 0))
    CACHE_REDIS_URL = os.getenv("CACHE_REDIS_URL", "redis://localhost:6379/0")

    # Paths
    BASE_DIR = BASE_DIR
    INSTANCE_DIR = INSTANCE_DIR
    STATIC_DIR = STATIC_DIR
    DATA_DIR = DATA_DIR
    VOWEL_AUDIO_DIR = os.path.join(STATIC_DIR, "audio/vowels")
    WORD_EX_AUDIO_DIR = os.path.join(STATIC_DIR, "audio/word_examples")
    LIP_IMAGE_DIR = os.path.join(STATIC_DIR, "images/lip_shape")
    TONGUE_IMAGE_DIR = os.path.join(STATIC_DIR, "images/tongue_position")
    VOWEL_JSON_PATH = os.path.join(DATA_DIR, "lesson.json")
    TRICKY_PAIRS_PATH = os.path.join(DATA_DIR, "tricky_pairs.json")
    PHONEMES_PATH = os.path.join(DATA_DIR, "phonemes.json")
