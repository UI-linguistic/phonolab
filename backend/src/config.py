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


# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# DATA_DIR = os.path.join(BASE_DIR, "data")
# AUDIO_DIR = os.path.join(DATA_DIR, "audio")
# EXCEL_INPUT = os.path.join(DATA_DIR, "vowels.xlsx")
# JSON_OUTPUT = os.path.join(DATA_DIR, "vowels.json")
# DEFAULT_LANGUAGE = "en"
