# scripts/clear_all_data.py
from src.app import create_app, db
from src.models.phoneme import Vowel, WordExample
from src.models.lesson import Lesson, LessonInstruction
from src.models.quiz import QuizItem, QuizOption

app = create_app()

with app.app_context():
    print("→ Clearing database content...")

    QuizOption.query.delete()
    QuizItem.query.delete()
    LessonInstruction.query.delete()
    Lesson.query.delete()
    WordExample.query.delete()
    Vowel.query.delete()

    db.session.commit()
    print("→ All data wiped. Tables remain intact.")
