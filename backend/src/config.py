# backend/config.py
import os

from dotenv import load_dotenv
from flask import app

load_dotenv()


class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
    os.makedirs(INSTANCE_DIR, exist_ok=True)

    os.environ.setdefault("SECRET_KEY", "secret")
    os.environ.setdefault(
        "SQLALCHEMY_DATABASE_URI", f"sqlite:///{os.path.join(INSTANCE_DIR, 'phonolab.db')}"
    )

    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # cache config
    CACHE_TYPE = os.getenv("CACHE_TYPE", "simple")
    CACHE_DEFAULT_TIMEOUT = int(os.getenv("CACHE_DEFAULT_TIMEOUT", 3600))

    # redis config
    CACHE_REDIS_HOST = os.getenv("CACHE_REDIS_HOST", "localhost")
    CACHE_REDIS_PORT = int(os.getenv("CACHE_REDIS_PORT", 6379))
    CACHE_REDIS_DB = int(os.getenv("CACHE_REDIS_DB", 0))
    CACHE_REDIS_URL = os.getenv("CACHE_REDIS_URL", "redis://localhost:6379/0")

    # Static file paths
    STATIC_DIR = os.path.join(BASE_DIR, "static")
    VOWEL_AUDIO_DIR = os.path.join(STATIC_DIR, "audio/vowels")
    WORD_EX_AUDIO_DIR = os.path.join(STATIC_DIR, "audio/word_examples")

    # Data file paths
    DATA_DIR = os.path.join(BASE_DIR, "src", "data")
    VOWEL_JSON_PATH = os.path.join(DATA_DIR, "lesson.json")
    TRICKY_PAIRS_PATH = os.path.join(DATA_DIR, "tricky_pairs.json")
    PHONEMES_PATH = os.path.join(DATA_DIR, "phonemes.json")

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# DATA_DIR = os.path.join(BASE_DIR, "data")
# AUDIO_DIR = os.path.join(DATA_DIR, "audio")
# EXCEL_INPUT = os.path.join(DATA_DIR, "vowels.xlsx")
# JSON_OUTPUT = os.path.join(DATA_DIR, "vowels.json")
# DEFAULT_LANGUAGE = "en"
