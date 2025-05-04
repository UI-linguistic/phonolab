# backend/config.py
import os

from dotenv import load_dotenv

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


# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# DATA_DIR = os.path.join(BASE_DIR, "data")
# AUDIO_DIR = os.path.join(DATA_DIR, "audio")
# EXCEL_INPUT = os.path.join(DATA_DIR, "vowels.xlsx")
# JSON_OUTPUT = os.path.join(DATA_DIR, "vowels.json")
# DEFAULT_LANGUAGE = "en"
