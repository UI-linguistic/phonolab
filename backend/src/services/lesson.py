# src/services/lesson.py
from typing import Dict, List, Optional, Tuple
from models.phoneme import TrickyPair, Vowel
from src.models.lesson import LessonMode, VowelLesson
from utils.error_handling import handle_service_errors
from utils.format import format_lesson_modes_response, format_lesson_response
from models.lesson import Lesson


LIP_SHAPE_GRID_LAYOUT = [
    ["i", "ɪ", "e", "ɛ"],
    ["æ", "ɑ", "ə", "ʌ"],
    ["ɔ", "o", "ʊ", "u"]
]


@handle_service_errors("get all lesson modes")
def get_all_lesson_modes() -> List[Dict]:
    """
    Get all lesson modes with proper formatting.
    
    Returns:
        List of formatted lesson mode dictionaries
    """
    lesson_modes = LessonMode.query.all()
    return format_lesson_modes_response(lesson_modes)


@handle_service_errors("get lesson by slug")
def get_lesson_by_slug(slug: str) -> Dict:
    """
    Get a lesson by its slug.
    
    Args:
        slug: The lesson mode slug to look up
        
    Returns:
        Formatted lesson dictionary
    """
    lesson_mode = LessonMode.query.filter_by(slug=slug).first()
    if not lesson_mode:
        return None
    
    lesson = VowelLesson.query.filter_by(lesson_mode_id=lesson_mode.id).first()
    if not lesson:
        return None
    
    return format_lesson_response(lesson)


@handle_service_errors("get lesson by ID")
def get_lesson_by_id(lesson_id: int) -> Tuple[Optional[Dict], Optional[str], Optional[str]]:
    """
    Get any type of lesson by its ID with minimal processing.
    
    Args:
        lesson_id: The numeric ID of the lesson
        
    Returns:
        Tuple of (lesson_data, error_message, error_type)
    """
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return None
    return lesson_to_dict(lesson)


def lesson_to_dict(lesson):
    """
    Convert a lesson object to a dictionary, handling SQLAlchemy relationships.
    This is a minimal conversion that preserves the structure already in the database.
    """

    result = {
        'id': lesson.id,
        'title': lesson.title,
        'description': lesson.description,
        'type': lesson.type,
        'content': lesson.content
    }

    if lesson.lesson_mode:
        result['lesson_mode'] = {
            'id': lesson.lesson_mode.id,
            'name': lesson.lesson_mode.name,
            'slug': lesson.lesson_mode.slug,
            'description': lesson.lesson_mode.description
        }
    
    return result


def build_tongue_position_content():
    """
    Builds a 3x3 tongue position matrix based on the original IPA grid layout.
    Each tile in the matrix may contain one or more vowel objects (as dicts).
    Returns a dict containing the matrix grid and a caption.
    """
    IPA_GROUPS = {
        (0, 0): ["i", "ɪ"],   # High front
        (0, 1): [],           # High central (empty)
        (0, 2): ["u", "ʊ"],   # High back
        (1, 0): ["e", "ɛ"],   # Mid front
        (1, 1): ["ə", "ʌ"],   # Mid central
        (1, 2): ["o", "ɔ"],   # Mid back
        (2, 0): ["æ"],        # Low front
        (2, 1): [],           # Low central (empty)
        (2, 2): ["ɑ"],        # Low back
    }

    grid = [[[] for _ in range(3)] for _ in range(3)]

    for (row, col), ipa_list in IPA_GROUPS.items():
        vowels = Vowel.query.filter(Vowel.ipa.in_(ipa_list)).all()
        grid[row][col] = [
            {
                "ipa": v.ipa,
                "id": v.id,
                "pronounced": v.pronounced,
                "audio_url": v.audio_url,
                "mouth_image_url": v.mouth_image_url,
            }
            for v in vowels
        ]

    return {
        "title": "Tongue Position",
        "caption": "Explore how vowels are produced with different tongue heights and placements.",
        "grid": grid
    }


def build_lip_shape_vowel_table():
    """
    Constructs a static 3x4 vowel grid containing vowel objects with ID, IPA, and audio.
    Used for the lip shape interaction page.
    """
    grid = []

    for row in LIP_SHAPE_GRID_LAYOUT:
        grid_row = []
        for ipa in row:
            vowel = Vowel.query.filter_by(ipa=ipa).first()
            if not vowel:
                print(f"⚠️ Vowel not found for IPA '{ipa}' — skipping.")
                grid_row.append(None)
                continue

            grid_row.append({
                "id": vowel.id,
                "ipa": vowel.ipa,
                "audio_url": vowel.audio_url
            })
        grid.append(grid_row)

    return grid


def build_lip_shape_content():
    """
    Builds the lip shape lesson content including:
    - a vowel grid (3x4) with vowel objects
    - static lip shape illustrations
    - instructions for interaction
    """
    return {
        "title": "Lip Shape",
        "caption": "Click a lip to highlight the matching vowels and hear their sounds.",
        "lip_shape_table": build_lip_shape_vowel_table(),
        "lip_shape_images": {
            "unrounded": "/static/images/lips/unrounded.png",
            "rounded": "/static/images/lips/rounded.png"
        }
    }


def build_length_content():
    """
    Builds the length-based vowel lesson content.
    Groups vowels into 'tense', 'lax', and 'neutral' columns based on their length field.
    Returns a dict structured for lesson content rendering.
    """
    categories = {
        "tense": [],
        "lax": [],
        "neutral": [],
    }

    vowels = Vowel.query.all()

    for v in vowels:
        length_type = v.length or "neutral"
        if length_type not in categories:
            print(f"⚠️ Unknown length '{length_type}' for IPA '{v.ipa}' — defaulting to 'neutral'.")
            length_type = "neutral"

        categories[length_type].append({
            "id": v.id,
            "ipa": v.ipa,
            "audio_url": v.audio_url,
        })

    return {
        "title": "Length",
        "caption": "Click to hear the sound! Grouped by tense (long), lax (short), or neutral.",
        "columns": {
            "tense": categories["tense"],
            "lax": categories["lax"],
            "neutral": categories["neutral"],
        }
    }


def build_vowels_101_lesson_mode(map_variable: tuple[str, str, str]) -> LessonMode:
    """
    Builds and returns the content structure for the Vowels 101 lesson.
    Does not interact with the database.
    """
    return {
        "tongue_position": build_tongue_position_content(),
        "lip_shape": build_lip_shape_content(),
        "length": build_length_content(),
    }


def build_tricky_pairs_lesson_content() -> dict:
    """
    Builds the Tricky Pairs lesson content focusing only on the 'fill' vs 'feel' pair.
    """
    pair = TrickyPair.query.filter_by(word_a="fill", word_b="feel").first()

    if not pair:
        print("⚠️ Could not find tricky pair: 'fill' vs 'feel'.")
        return {}

    return {
        "title": "Tricky Minimal Pairs",
        "caption": "Some vowel sounds are easily confused. Let's learn the difference!",
        "pairs": [
            {
                "word_a": pair.word_a,
                "word_b": pair.word_b,
                "vowel_a": pair.vowel_a,
                "vowel_b": pair.vowel_b,
                "audio_a": pair.audio_a,
                "audio_b": pair.audio_b,
                "tip": pair.description or "These vowels differ in tongue height and tenseness.",
                "category": pair.category or "tense vs lax"
            }
        ]
    }
