# backend/config.py
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(BASE_DIR, "data")
AUDIO_DIR = os.path.join(DATA_DIR, "audio")
EXCEL_INPUT = os.path.join(DATA_DIR, "vowels.xlsx")
JSON_OUTPUT = os.path.join(DATA_DIR, "vowels.json")
DEFAULT_LANGUAGE = "en"
