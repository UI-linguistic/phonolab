# src/database/lesson.py
from collections import namedtuple
from typing import Dict, List, Optional, Tuple

from src.db import db
from models.lesson import LessonMode, VowelLesson
from models.phoneme import TrickyPair, Vowel
from utils.error_handling import handle_db_operation


LessonModeMeta = namedtuple("LessonModeMeta", ["name", "slug", "description"])

LESSON_MODE_MAP = {
    "VOWELS_101": LessonModeMeta(
        name="Vowels 101",
        slug="vowels-101",
        description="Learn about tongue position, lip shape, and vowel length."
    ),
    "MAP_VOWEL_SPACE": LessonModeMeta(
        name="Map the Vowel Space",
        slug="map-vowel-space",
        description="Explore vowels on a visual vowel chart to understand tongue height and backness."
    ),
    "GET_YOUR_GRAPHEMES_RIGHT": LessonModeMeta(
        name="Get Your Graphemes Right",
        slug="get-your-graphemes-right",
        description="Match spelling patterns to their corresponding vowel sounds."
    ),
    "TACKLE_TRICKY_PAIRS": LessonModeMeta(
        name="Tackle Tricky Pairs",
        slug="tackle-tricky-pairs",
        description="Practice distinguishing between similar-sounding vowels."
    )
}


def lesson_mode_exists(slug_or_name: str) -> bool:
    """
    Check if a lesson mode with the given slug or name exists in the database.
    
    Args:
        slug_or_name: The slug or name to check
        
    Returns:
        True if the lesson mode exists, False otherwise
    """
    return db.session.query(
        LessonMode.query.filter(
            (LessonMode.slug == slug_or_name) | (LessonMode.name == slug_or_name)
        ).exists()
    ).scalar()


@handle_db_operation("commit lesson mode")
def commit_lesson_mode(map_variable: Tuple[str, str, str]) -> LessonMode:
    """
    Create and commit a new LessonMode to the database.
    
    Args:
        map_variable: Tuple containing (name, slug, description)
        
    Returns:
        The created LessonMode object
    """
    name, slug, description = map_variable
    mode = LessonMode(name=name, slug=slug, description=description)
    db.session.add(mode)
    db.session.commit()
    print(f"Lesson Mode committed: {name} ({slug})")
    return mode


@handle_db_operation("seed Vowels 101 lesson")
def seed_vowels_101_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
    """
    Seeds the Vowels 101 lesson mode and its associated VowelLesson.
    Commits to the database only if not already present.
    
    Args:
        map_variable: Tuple containing (name, slug, description)
        
    Returns:
        The LessonMode object (either existing or newly created)
    """
    name, slug, _ = map_variable

    # Check or commit the mode
    if lesson_mode_exists(slug):
        mode = LessonMode.query.filter(
            (LessonMode.slug == slug) | (LessonMode.name == name)
        ).first()
        print(f"Lesson mode already exists: {slug}")
    else:
        mode = commit_lesson_mode(map_variable)

    # Prevent duplicate lesson creation
    existing_lesson = VowelLesson.query.filter_by(lesson_mode_id=mode.id).first()
    if existing_lesson:
        print(f"A VowelLesson already exists for mode '{slug}' — skipping.")
        return mode

    # Build and commit lesson
    content = build_vowels_101_lesson_content()
    lesson = VowelLesson(
        title="Vowels 101",
        description="Learn how vowels are categorized by tongue position, lip shape, and length.",
        lesson_mode_id=mode.id,
        content=content
    )
    db.session.add(lesson)
    db.session.commit()
    print(f"VowelLesson created for mode: {slug}")

    return mode


def build_tongue_position_content() -> Dict:
    """
    Builds a 3x3 tongue position matrix based on the original IPA grid layout.
    Each tile in the matrix may contain one or more vowel objects (as dicts).
    
    Returns:
        Dict containing the matrix grid and a caption
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


LIP_SHAPE_GRID_LAYOUT = [
    ["i", "ɪ", "e", "ɛ"],
    ["æ", "ɑ", "ə", "ʌ"],
    ["ɔ", "o", "ʊ", "u"]
]


def build_lip_shape_vowel_table() -> List[List[Optional[Dict]]]:
    """
    Constructs a static 3x4 vowel grid containing vowel objects with ID, IPA, and audio.
    Used for the lip shape interaction page.
    
    Returns:
        A 2D grid (list of lists) containing vowel objects or None for missing vowels
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


def build_lip_shape_content() -> Dict:
    """
    Builds the lip shape lesson content including:
    - a vowel grid (3x4) with vowel objects
    - static lip shape illustrations
    - instructions for interaction
    
    Returns:
        Dict containing the lip shape content structure
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


def build_length_content() -> Dict:
    """
    Builds the length-based vowel lesson content.
    Groups vowels into 'tense', 'lax', and 'neutral' columns based on their length field.
    
    Returns:
        Dict structured for lesson content rendering
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
            print(f"Unknown length '{length_type}' for IPA '{v.ipa}' — defaulting to 'neutral'.")
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


def build_vowels_101_lesson_content() -> Dict:
    """
    Builds the complete content structure for the Vowels 101 lesson.
    
    Returns:
        Dict containing all content sections for the lesson
    """
    return {
        "tongue_position": build_tongue_position_content(),
        "lip_shape": build_lip_shape_content(),
        "length": build_length_content(),
    }


def build_tricky_pairs_lesson_content() -> Dict:
    """
    Builds the Tricky Pairs lesson content focusing only on the 'fill' vs 'feel' pair.
    
    Returns:
        Dict containing the tricky pairs content structure
    """
    pair = TrickyPair.query.filter_by(word_a="fill", word_b="feel").first()

    if not pair:
        print("Could not find tricky pair: 'fill' vs 'feel'.")
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


@handle_db_operation("seed Tackle Tricky Pairs lesson")
def seed_tackle_tricky_pairs_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
    """
    Seeds the Tackle Tricky Pairs lesson mode and its associated lesson content.
    
    Args:
        map_variable: Tuple containing (name, slug, description)
        
    Returns:
        The LessonMode object (either existing or newly created)
    """
    name, slug, _ = map_variable

    if lesson_mode_exists(slug):
        mode = LessonMode.query.filter(
            (LessonMode.slug == slug) | (LessonMode.name == name)
        ).first()
        print(f"Lesson mode already exists: {slug}")
    else:
        mode = commit_lesson_mode(map_variable)

    # prevent duplicate lesson creation
    existing_lesson = VowelLesson.query.filter_by(lesson_mode_id=mode.id).first()
    if existing_lesson:
        print(f"A VowelLesson already exists for mode '{slug}' — skipping.")
        return mode

    content = build_tricky_pairs_lesson_content()
    lesson = VowelLesson(
        title="Tackle Tricky Pairs",
        description="Practice distinguishing between similar-sounding vowels.",
        lesson_mode_id=mode.id,
        content=content
    )
    db.session.add(lesson)
    db.session.commit()
    print(f"VowelLesson created for mode: {slug}")

    return mode


@handle_db_operation("seed Map Vowel Space lesson")
def seed_map_vowel_space_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
    """
    Seeds the Map Vowel Space lesson mode and its associated lesson content.
    
    Args:
        map_variable: Tuple containing (name, slug, description)
        
    Returns:
        The LessonMode object (either existing or newly created)
    """
    name, slug, _ = map_variable

    if lesson_mode_exists(slug):
        mode = LessonMode.query.filter(
            (LessonMode.slug == slug) | (LessonMode.name == name)
        ).first()
        print(f"Lesson mode already exists: {slug}")
    else:
        mode = commit_lesson_mode(map_variable)

    # TODO: Implement lesson content building and commit
    print(f"Map Vowel Space lesson not yet implemented for mode: {slug}")
    
    return mode


@handle_db_operation("seed Get Your Graphemes Right lesson")
def seed_get_your_graphemes_right_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
    """
    Seeds the Get Your Graphemes Right lesson mode and its associated lesson content.
    
    Args:
        map_variable: Tuple containing (name, slug, description)
        
    Returns:
        The LessonMode object (either existing or newly created)
    """
    name, slug, _ = map_variable

    if lesson_mode_exists(slug):
        mode = LessonMode.query.filter(
            (LessonMode.slug == slug) | (LessonMode.name == name)
        ).first()
        print(f"Lesson mode already exists: {slug}")
    else:
        mode = commit_lesson_mode(map_variable)

    # TODO: Implement lesson content building and commit
    print(f"Get Your Graphemes Right lesson not yet implemented for mode: {slug}")
    
    return mode


def get_lesson_mode_by_slug(slug: str) -> Optional[LessonMode]:
    """
    Retrieve a lesson mode by its slug.
    
    Args:
        slug: The slug of the lesson mode to retrieve
        
    Returns:
        The LessonMode object or None if not found
    """
    return LessonMode.query.filter_by(slug=slug).first()


def get_lesson_mode_by_name(name: str) -> Optional[LessonMode]:
    """
    Retrieve a lesson mode by its name.
    
    Args:
        name: The name of the lesson mode to retrieve
        
    Returns:
        The LessonMode object or None if not found
    """
    return LessonMode.query.filter_by(name=name).first()


def get_all_lesson_modes() -> List[LessonMode]:
    """
    Retrieve all lesson modes from the database.
    
    Returns:
        List of all LessonMode objects
    """
    return LessonMode.query.all()


def get_vowel_lesson_by_mode_id(mode_id: int) -> Optional[VowelLesson]:
    """
    Retrieve a vowel lesson by its associated lesson mode ID.
    
    Args:
        mode_id: The ID of the lesson mode
        
    Returns:
        The VowelLesson object or None if not found
    """
    return VowelLesson.query.filter_by(lesson_mode_id=mode_id).first()


def get_vowel_lesson_by_mode_slug(slug: str) -> Optional[VowelLesson]:
    """
    Retrieve a vowel lesson by the slug of its associated lesson mode.
    
    Args:
        slug: The slug of the lesson mode
        
    Returns:
        The VowelLesson object or None if not found
    """
    mode = get_lesson_mode_by_slug(slug)
    if not mode:
        return None
    return get_vowel_lesson_by_mode_id(mode.id)


@handle_db_operation("seed all lesson modes")
def seed_all_lesson_modes() -> Dict[str, LessonMode]:
    """
    Seeds all lesson modes defined in LESSON_MODE_MAP.
    
    Returns:
        Dictionary mapping lesson mode keys to their corresponding LessonMode objects
    """
    result = {}
    result["VOWELS_101"] = seed_vowels_101_lesson(LESSON_MODE_MAP["VOWELS_101"])
    result["TACKLE_TRICKY_PAIRS"] = seed_tackle_tricky_pairs_lesson(LESSON_MODE_MAP["TACKLE_TRICKY_PAIRS"])
    result["MAP_VOWEL_SPACE"] = seed_map_vowel_space_lesson(LESSON_MODE_MAP["MAP_VOWEL_SPACE"])
    result["GET_YOUR_GRAPHEMES_RIGHT"] = seed_get_your_graphemes_right_lesson(LESSON_MODE_MAP["GET_YOUR_GRAPHEMES_RIGHT"])
    
    return result