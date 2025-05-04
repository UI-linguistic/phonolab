import pytest
from src.db import db

# No imports from factories here to avoid circular imports
# We'll define the fixtures directly

@pytest.fixture
def sample_vowels(app):
    """Create sample vowels for testing."""
    from tests.factories import VowelFactory
    
    with app.app_context():
        vowels = [
            VowelFactory(
                id="i",
                phoneme="i",
                name="Close front unrounded vowel",
                description="The 'ee' sound in 'see'",
                audio_url="/audio/vowels/i.mp3",
                lips="unrounded",
                tongue="high-front",
                mouth_image_url="/images/mouth/i.png",
                ipa_example="i",
                color_code="#FF5733",
                pronounced="ee"
            ),
            VowelFactory(
                id="u",
                phoneme="u",
                name="Close back rounded vowel",
                description="The 'oo' sound in 'boot'",
                audio_url="/audio/vowels/u.mp3",
                lips="rounded",
                tongue="high-back",
                mouth_image_url="/images/mouth/u.png",
                ipa_example="u",
                color_code="#33FF57",
                pronounced="oo"
            ),
            VowelFactory(
                id="ɑ",
                phoneme="ɑ",
                name="Open back unrounded vowel",
                description="The 'a' sound in 'father'",
                audio_url="/audio/vowels/ɑ.mp3",
                lips="unrounded",
                tongue="low-back",
                mouth_image_url="/images/mouth/ɑ.png",
                ipa_example="ɑ",
                color_code="#5733FF",
                pronounced="ah"
            ),
            VowelFactory(
                id="e",
                phoneme="e",
                name="Close-mid front unrounded vowel",
                description="The 'e' sound in 'bed'",
                audio_url="/audio/vowels/e.mp3",
                lips="unrounded",
                tongue="mid-front",
                mouth_image_url="/images/mouth/e.png",
                ipa_example="e",
                color_code="#FF33A1",
                pronounced="eh"
            ),
            VowelFactory(
                id="o",
                phoneme="o",
                name="Close-mid back rounded vowel",
                description="The 'o' sound in 'go'",
                audio_url="/audio/vowels/o.mp3",
                lips="rounded",
                tongue="mid-back",
                mouth_image_url="/images/mouth/o.png",
                ipa_example="o",
                color_code="#33A1FF",
                pronounced="oh"
            ),
        ]
        
        yield vowels
        
        # Clean up
        for vowel in vowels:
            db.session.delete(vowel)
        db.session.commit()

@pytest.fixture
def sample_lessons(app, sample_vowels):
    """Create sample lessons for testing."""
    from tests.factories import LessonFactory
    from src.models.lesson import Lesson
    
    with app.app_context():
        lessons = []
        for vowel in sample_vowels:
            # Instead of using the vowel object directly, just use its ID
            lesson = Lesson(vowel_id=vowel.id)
            db.session.add(lesson)
        
        db.session.commit()
        
        # Fetch the lessons we just created
        lessons = Lesson.query.all()
        
        yield lessons
        
        # Clean up
        for lesson in lessons:
            db.session.delete(lesson)
        db.session.commit()
