# scripts/clear_vowels.py
from src.app import create_app, db
from src.models.phoneme import Vowel

app = create_app()

with app.app_context():
    deleted = Vowel.query.delete()
    db.session.commit()
    print(f" -> Cleared {deleted} vowel entries.")
