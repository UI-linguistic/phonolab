# # src/database/lesson.py
import os
import json
import sqlite3
import logging
from typing import Dict, Optional, Tuple, Any

from src.config import Config
from utils.decorators import handle_file_operation, handle_service_errors


@handle_file_operation("load lesson from JSON")
def load_lesson_from_json(json_path: Optional[str] = None) -> Dict:
    """
    Load lesson data from a JSON file.
    
    Args:
        json_path: Path to the lesson JSON file. If not provided,
                  will use the default vowels-101_preview.json path.
    
    Returns:
        Dictionary containing the lesson data from the JSON file
    """
    # Use provided path or default
    lesson_path = json_path or os.path.join(Config.BASE_DIR, "src", "data", "vowels-101_preview.json")
    
    logging.info(f"Loading lesson from {lesson_path}")
    
    with open(lesson_path, 'r', encoding='utf-8') as f:
        lesson_data = json.load(f)
        
    logging.info(f"Successfully loaded lesson: {lesson_data.get('title', 'Unknown')}")
    return lesson_data

def get_db_connection() -> sqlite3.Connection:
    """
    Get a direct SQLite connection to the database.
    
    Returns:
        SQLite connection object
    """
    # Extract the SQLite file path from the URI
    db_uri = Config.SQLALCHEMY_DATABASE_URI
    if db_uri.startswith('sqlite:///'):
        db_path = db_uri[10:]  # Remove 'sqlite:///'
        logging.info(f"Connecting to SQLite database at: {db_path}")
        return sqlite3.connect(db_path)
    else:
        logging.error(f"Unsupported database URI: {db_uri}")
        raise ValueError(f"Unsupported database URI: {db_uri}")

def ensure_lesson_tables_exist(conn: sqlite3.Connection) -> None:
    """
    Ensure that the necessary tables for lessons exist in the database.
    
    Args:
        conn: SQLite connection object
    """
    cursor = conn.cursor()
    
    # Create lesson_modes table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS lesson_modes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT
    )
    ''')
    
    # Create lessons table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        lesson_mode_id INTEGER,
        FOREIGN KEY (lesson_mode_id) REFERENCES lesson_modes (id)
    )
    ''')
    
    # Create vowels_101_lessons table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vowels_101_lessons (
        id INTEGER NOT NULL,
        content JSON,
        PRIMARY KEY (id),
        FOREIGN KEY(id) REFERENCES lessons (id)
    )
    ''')
    
    conn.commit()
    logging.info("Lesson tables verified")

def seed_lesson_mode_sql(conn: sqlite3.Connection, lesson_data: Dict) -> Tuple[int, str]:
    """
    Seed lesson mode directly using SQL.
    
    Args:
        conn: SQLite connection object
        lesson_data: Dictionary containing lesson data
        
    Returns:
        Tuple of (lesson_mode_id, lesson_mode_slug)
    """
    cursor = conn.cursor()
    
    # Extract lesson mode data
    slug = lesson_data.get('lesson_mode_slug')
    title = lesson_data.get('title')
    description = lesson_data.get('description')
    
    if not slug:
        logging.warning("No lesson_mode_slug found in lesson data, using default")
        slug = "default-mode"
    
    # Check if lesson mode already exists
    cursor.execute("SELECT id FROM lesson_modes WHERE slug = ?", (slug,))
    existing = cursor.fetchone()
    
    if existing:
        logging.info(f"Lesson mode '{slug}' already exists, using existing")
        lesson_mode_id = existing[0]
    else:
        # Insert lesson mode
        cursor.execute('''
        INSERT INTO lesson_modes (name, slug, description)
        VALUES (?, ?, ?)
        ''', (title, slug, description))
        
        lesson_mode_id = cursor.lastrowid
        logging.info(f"Created new lesson mode: {slug} (ID: {lesson_mode_id})")
    
    conn.commit()
    return lesson_mode_id, slug

def seed_lesson_sql(conn: sqlite3.Connection, lesson_data: Dict, lesson_mode_id: int) -> int:
    """
    Seed lesson directly using SQL.
    
    Args:
        conn: SQLite connection object
        lesson_data: Dictionary containing lesson data
        lesson_mode_id: ID of the lesson mode
        
    Returns:
        ID of the created or updated lesson
    """
    cursor = conn.cursor()
    
    # Extract lesson data
    title = lesson_data.get('title')
    description = lesson_data.get('description')
    lesson_type = lesson_data.get('type', 'vowels_101_lesson')
    content = lesson_data.get('content', {})
    
    # Check if lesson already exists for this mode
    cursor.execute(
        "SELECT id FROM lessons WHERE title = ? AND lesson_mode_id = ?", 
        (title, lesson_mode_id)
    )
    existing = cursor.fetchone()
    
    if existing:
        # Update existing lesson
        lesson_id = existing[0]
        cursor.execute('''
        UPDATE lessons 
        SET description = ?, type = ?
        WHERE id = ?
        ''', (description, lesson_type, lesson_id))
        
        logging.info(f"Updated existing lesson: {title} (ID: {lesson_id})")
    else:
        # Insert new lesson
        cursor.execute('''
        INSERT INTO lessons (title, description, type, lesson_mode_id)
        VALUES (?, ?, ?, ?)
        ''', (title, description, lesson_type, lesson_mode_id))
        
        lesson_id = cursor.lastrowid
        logging.info(f"Created new lesson: {title} (ID: {lesson_id})")
    
    # Store content in vowels_101_lessons table if it's a vowel lesson
    if lesson_type == 'vowel_lesson':
        # Check if entry exists in vowels_101_lessons
        cursor.execute("SELECT id FROM vowels_101_lessons WHERE id = ?", (lesson_id,))
        vowel_lesson_exists = cursor.fetchone() is not None
        
        if vowel_lesson_exists:
            # Update existing vowel lesson
            cursor.execute('''
            UPDATE vowels_101_lessons
            SET content = ?
            WHERE id = ?
            ''', (json.dumps(content), lesson_id))
            logging.info(f"Updated vowel lesson content for lesson ID: {lesson_id}")
        else:
            # Insert new vowel lesson
            cursor.execute('''
            INSERT INTO vowels_101_lessons (id, content)
            VALUES (?, ?)
            ''', (lesson_id, json.dumps(content)))
            logging.info(f"Created vowel lesson content for lesson ID: {lesson_id}")
    
    conn.commit()
    return lesson_id



def verify_lesson_sql(conn: sqlite3.Connection, lesson_id: int, lesson_mode_slug: str) -> Dict:
    """
    Verify the lesson was properly created or updated.
    
    Args:
        conn: SQLite connection object
        lesson_id: ID of the lesson
        lesson_mode_slug: Slug of the lesson mode
        
    Returns:
        Dictionary with verification results
    """
    cursor = conn.cursor()
    
    # Verify lesson exists
    cursor.execute("SELECT id, title, type FROM lessons WHERE id = ?", (lesson_id,))
    lesson = cursor.fetchone()
    
    if not lesson:
        return {"success": False, "error": f"Lesson with ID {lesson_id} not found"}
    
    # Verify lesson mode exists
    cursor.execute("SELECT id, name FROM lesson_modes WHERE slug = ?", (lesson_mode_slug,))
    mode = cursor.fetchone()
    
    if not mode:
        return {"success": False, "error": f"Lesson mode with slug '{lesson_mode_slug}' not found"}
    
    # Verify relationship
    cursor.execute(
        "SELECT COUNT(*) FROM lessons WHERE id = ? AND lesson_mode_id = ?", 
        (lesson_id, mode[0])
    )
    related = cursor.fetchone()[0] > 0
    
    # Verify vowel lesson content
    cursor.execute("SELECT content FROM vowels_101_lessons WHERE id = ?", (lesson_id,))
    content_row = cursor.fetchone()
    has_content = content_row is not None
    
    return {
        "success": True,
        "lesson_id": lesson_id,
        "lesson_title": lesson[1],
        "lesson_type": lesson[2],
        "mode_id": mode[0],
        "mode_name": mode[1],
        "mode_slug": lesson_mode_slug,
        "properly_related": related,
        "has_content": has_content
    }

@handle_service_errors("seed lesson with SQL")
def seed_lesson_with_sql(json_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Process a lesson JSON file and commit it to the database using direct SQL.
    
    Args:
        json_path: Optional path to the lesson JSON file
        
    Returns:
        Dictionary with summary of operations
    """
    try:
        # Load lesson data from JSON
        lesson_data_result, error_msg, error_code = load_lesson_from_json(json_path)
        
        if error_msg:
            return None, error_msg, error_code
        
        lesson_data = lesson_data_result
        
        # Get database connection
        conn = get_db_connection()
        
        # Ensure tables exist
        ensure_lesson_tables_exist(conn)
        
        # Seed lesson mode
        logging.info("Seeding lesson mode...")
        lesson_mode_id, lesson_mode_slug = seed_lesson_mode_sql(conn, lesson_data)
        
        # Seed lesson
        logging.info("Seeding lesson...")
        lesson_id = seed_lesson_sql(conn, lesson_data, lesson_mode_id)
        
        # Verify lesson
        logging.info("Verifying lesson...")
        verification = verify_lesson_sql(conn, lesson_id, lesson_mode_slug)
        
        if verification.get("success"):
            logging.info(f"Lesson verification successful: {verification}")
        else:
            logging.error(f"Lesson verification failed: {verification}")
        
        # Close connection
        conn.close()
        
        return {
            "lesson_id": lesson_id,
            "lesson_mode_id": lesson_mode_id,
            "lesson_mode_slug": lesson_mode_slug,
            "title": lesson_data.get('title'),
            "type": lesson_data.get('type'),
            "verification": verification
        }
    
    except Exception as e:
        logging.exception(f"Error in seed_lesson_with_sql: {str(e)}")
        if 'conn' in locals() and conn:
            conn.close()
        raise

@handle_service_errors("seed vowels-101 lesson")
def seed_vowels_101_lesson() -> Dict[str, Any]:
    """
    Seed the Vowels 101 lesson from the default JSON file.
    This is a convenience function specifically for the vowels-101 lesson.
    
    Returns:
        Dictionary with summary of operations
    """
    logging.info("Starting Vowels 101 lesson seeding process...")
    
    # Use the default vowels-101_preview.json path
    json_path = os.path.join(Config.BASE_DIR, "src", "data", "vowels-101_preview.json")
    
    result, error_msg, error_code = seed_lesson_with_sql(json_path)
    
    if error_msg:
        logging.error(f"Error seeding Vowels 101 lesson: {error_msg}")
        return None, error_msg, error_code
    
    logging.info("Vowels 101 lesson seeding completed successfully!")
    logging.info(f"Lesson ID: {result.get('lesson_id')}")
    logging.info(f"Lesson Mode: {result.get('lesson_mode_slug')} (ID: {result.get('lesson_mode_id')})")
    
    return result


# from collections import namedtuple
# from typing import Dict, List, Optional, Tuple

# from src.db import db
# from models.lesson import LessonMode, VowelLesson
# from models.phoneme import TrickyPair, Vowel
# from utils.error_handling import handle_db_operation


# LessonModeMeta = namedtuple("LessonModeMeta", ["name", "slug", "description"])

# LESSON_MODE_MAP = {
#     "VOWELS_101": LessonModeMeta(
#         name="Vowels 101",
#         slug="vowels-101",
#         description="Learn about tongue position, lip shape, and vowel length."
#     ),
#     "MAP_VOWEL_SPACE": LessonModeMeta(
#         name="Map the Vowel Space",
#         slug="map-vowel-space",
#         description="Explore vowels on a visual vowel chart to understand tongue height and backness."
#     ),
#     "GET_YOUR_GRAPHEMES_RIGHT": LessonModeMeta(
#         name="Get Your Graphemes Right",
#         slug="get-your-graphemes-right",
#         description="Match spelling patterns to their corresponding vowel sounds."
#     ),
#     "TACKLE_TRICKY_PAIRS": LessonModeMeta(
#         name="Tackle Tricky Pairs",
#         slug="tackle-tricky-pairs",
#         description="Practice distinguishing between similar-sounding vowels."
#     )
# }


# def lesson_mode_exists(slug_or_name: str) -> bool:
#     """
#     Check if a lesson mode with the given slug or name exists in the database.

#     Args:
#         slug_or_name: The slug or name to check

#     Returns:
#         True if the lesson mode exists, False otherwise
#     """
#     return db.session.query(
#         LessonMode.query.filter(
#             (LessonMode.slug == slug_or_name) | (LessonMode.name == slug_or_name)
#         ).exists()
#     ).scalar()


# @handle_db_operation("commit lesson mode")
# def commit_lesson_mode(map_variable: Tuple[str, str, str]) -> LessonMode:
#     """
#     Create and commit a new LessonMode to the database.

#     Args:
#         map_variable: Tuple containing (name, slug, description)

#     Returns:
#         The created LessonMode object
#     """
#     name, slug, description = map_variable
#     mode = LessonMode(name=name, slug=slug, description=description)
#     db.session.add(mode)
#     db.session.commit()
#     print(f"Lesson Mode committed: {name} ({slug})")
#     return mode


# @handle_db_operation("seed Vowels 101 lesson")
# def seed_vowels_101_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
#     """
#     Seeds the Vowels 101 lesson mode and its associated VowelLesson.
#     Commits to the database only if not already present.

#     Args:
#         map_variable: Tuple containing (name, slug, description)

#     Returns:
#         The LessonMode object (either existing or newly created)
#     """
#     name, slug, _ = map_variable

#     # Check or commit the mode
#     if lesson_mode_exists(slug):
#         mode = LessonMode.query.filter(
#             (LessonMode.slug == slug) | (LessonMode.name == name)
#         ).first()
#         print(f"Lesson mode already exists: {slug}")
#     else:
#         mode = commit_lesson_mode(map_variable)

#     # Prevent duplicate lesson creation
#     existing_lesson = VowelLesson.query.filter_by(lesson_mode_id=mode.id).first()
#     if existing_lesson:
#         print(f"A VowelLesson already exists for mode '{slug}' — skipping.")
#         return mode

#     # Build and commit lesson
#     content = build_vowels_101_lesson_content()
#     lesson = VowelLesson(
#         title="Vowels 101",
#         description="Learn how vowels are categorized by tongue position, lip shape, and length.",
#         lesson_mode_id=mode.id,
#         content=content
#     )
#     db.session.add(lesson)
#     db.session.commit()
#     print(f"VowelLesson created for mode: {slug}")

#     return mode


# def build_tongue_position_content() -> Dict:
#     """
#     Builds a 3x3 tongue position matrix based on the original IPA grid layout.
#     Each tile in the matrix may contain one or more vowel objects (as dicts).

#     Returns:
#         Dict containing the matrix grid and a caption
#     """
#     IPA_GROUPS = {
#         (0, 0): ["i", "ɪ"],   # High front
#         (0, 1): [],           # High central (empty)
#         (0, 2): ["u", "ʊ"],   # High back
#         (1, 0): ["e", "ɛ"],   # Mid front
#         (1, 1): ["ə", "ʌ"],   # Mid central
#         (1, 2): ["o", "ɔ"],   # Mid back
#         (2, 0): ["æ"],        # Low front
#         (2, 1): [],           # Low central (empty)
#         (2, 2): ["ɑ"],        # Low back
#     }

#     grid = [[[] for _ in range(3)] for _ in range(3)]

#     for (row, col), ipa_list in IPA_GROUPS.items():
#         vowels = Vowel.query.filter(Vowel.ipa.in_(ipa_list)).all()
#         grid[row][col] = [
#             {
#                 "ipa": v.ipa,
#                 "id": v.id,
#                 "pronounced": v.pronounced,
#                 "audio_url": v.audio_url,
#                 "mouth_image_url": v.mouth_image_url,
#             }
#             for v in vowels
#         ]

#     return {
#         "title": "Tongue Position",
#         "caption": "Explore how vowels are produced with different tongue heights and placements.",
#         "grid": grid
#     }


# LIP_SHAPE_GRID_LAYOUT = [
#     ["i", "ɪ", "e", "ɛ"],
#     ["æ", "ɑ", "ə", "ʌ"],
#     ["ɔ", "o", "ʊ", "u"]
# ]


# def build_lip_shape_vowel_table() -> List[List[Optional[Dict]]]:
#     """
#     Constructs a static 3x4 vowel grid containing vowel objects with ID, IPA, and audio.
#     Used for the lip shape interaction page.

#     Returns:
#         A 2D grid (list of lists) containing vowel objects or None for missing vowels
#     """
#     grid = []

#     for row in LIP_SHAPE_GRID_LAYOUT:
#         grid_row = []
#         for ipa in row:
#             vowel = Vowel.query.filter_by(ipa=ipa).first()
#             if not vowel:
#                 print(f"⚠️ Vowel not found for IPA '{ipa}' — skipping.")
#                 grid_row.append(None)
#                 continue

#             grid_row.append({
#                 "id": vowel.id,
#                 "ipa": vowel.ipa,
#                 "audio_url": vowel.audio_url
#             })
#         grid.append(grid_row)

#     return grid


# def build_lip_shape_content() -> Dict:
#     """
#     Builds the lip shape lesson content including:
#     - a vowel grid (3x4) with vowel objects
#     - static lip shape illustrations
#     - instructions for interaction

#     Returns:
#         Dict containing the lip shape content structure
#     """
#     return {
#         "title": "Lip Shape",
#         "caption": "Click a lip to highlight the matching vowels and hear their sounds.",
#         "lip_shape_table": build_lip_shape_vowel_table(),
#         "lip_shape_images": {
#             "unrounded": "/static/images/lips/unrounded.png",
#             "rounded": "/static/images/lips/rounded.png"
#         }
#     }


# def build_length_content() -> Dict:
#     """
#     Builds the length-based vowel lesson content.
#     Groups vowels into 'tense', 'lax', and 'neutral' columns based on their length field.

#     Returns:
#         Dict structured for lesson content rendering
#     """
#     categories = {
#         "tense": [],
#         "lax": [],
#         "neutral": [],
#     }

#     vowels = Vowel.query.all()

#     for v in vowels:
#         length_type = v.length or "neutral"
#         if length_type not in categories:
#             print(f"Unknown length '{length_type}' for IPA '{v.ipa}' — defaulting to 'neutral'.")
#             length_type = "neutral"

#         categories[length_type].append({
#             "id": v.id,
#             "ipa": v.ipa,
#             "audio_url": v.audio_url,
#         })

#     return {
#         "title": "Length",
#         "caption": "Click to hear the sound! Grouped by tense (long), lax (short), or neutral.",
#         "columns": {
#             "tense": categories["tense"],
#             "lax": categories["lax"],
#             "neutral": categories["neutral"],
#         }
#     }


# def build_vowels_101_lesson_content() -> Dict:
#     """
#     Builds the complete content structure for the Vowels 101 lesson.

#     Returns:
#         Dict containing all content sections for the lesson
#     """
#     return {
#         "tongue_position": build_tongue_position_content(),
#         "lip_shape": build_lip_shape_content(),
#         "length": build_length_content(),
#     }


# def build_tricky_pairs_lesson_content() -> Dict:
#     """
#     Builds the Tricky Pairs lesson content focusing only on the 'fill' vs 'feel' pair.

#     Returns:
#         Dict containing the tricky pairs content structure
#     """
#     pair = TrickyPair.query.filter_by(word_a="fill", word_b="feel").first()

#     if not pair:
#         print("Could not find tricky pair: 'fill' vs 'feel'.")
#         return {}

#     return {
#         "title": "Tricky Minimal Pairs",
#         "caption": "Some vowel sounds are easily confused. Let's learn the difference!",
#         "pairs": [
#             {
#                 "word_a": pair.word_a,
#                 "word_b": pair.word_b,
#                 "vowel_a": pair.vowel_a,
#                 "vowel_b": pair.vowel_b,
#                 "audio_a": pair.audio_a,
#                 "audio_b": pair.audio_b,
#                 "tip": pair.description or "These vowels differ in tongue height and tenseness.",
#                 "category": pair.category or "tense vs lax"
#             }
#         ]
#     }


# @handle_db_operation("seed Tackle Tricky Pairs lesson")
# def seed_tackle_tricky_pairs_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
#     """
#     Seeds the Tackle Tricky Pairs lesson mode and its associated lesson content.

#     Args:
#         map_variable: Tuple containing (name, slug, description)

#     Returns:
#         The LessonMode object (either existing or newly created)
#     """
#     name, slug, _ = map_variable

#     if lesson_mode_exists(slug):
#         mode = LessonMode.query.filter(
#             (LessonMode.slug == slug) | (LessonMode.name == name)
#         ).first()
#         print(f"Lesson mode already exists: {slug}")
#     else:
#         mode = commit_lesson_mode(map_variable)

#     # prevent duplicate lesson creation
#     existing_lesson = VowelLesson.query.filter_by(lesson_mode_id=mode.id).first()
#     if existing_lesson:
#         print(f"A VowelLesson already exists for mode '{slug}' — skipping.")
#         return mode

#     content = build_tricky_pairs_lesson_content()
#     lesson = VowelLesson(
#         title="Tackle Tricky Pairs",
#         description="Practice distinguishing between similar-sounding vowels.",
#         lesson_mode_id=mode.id,
#         content=content
#     )
#     db.session.add(lesson)
#     db.session.commit()
#     print(f"VowelLesson created for mode: {slug}")

#     return mode


# @handle_db_operation("seed Map Vowel Space lesson")
# def seed_map_vowel_space_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
#     """
#     Seeds the Map Vowel Space lesson mode and its associated lesson content.

#     Args:
#         map_variable: Tuple containing (name, slug, description)

#     Returns:
#         The LessonMode object (either existing or newly created)
#     """
#     name, slug, _ = map_variable

#     if lesson_mode_exists(slug):
#         mode = LessonMode.query.filter(
#             (LessonMode.slug == slug) | (LessonMode.name == name)
#         ).first()
#         print(f"Lesson mode already exists: {slug}")
#     else:
#         mode = commit_lesson_mode(map_variable)

#     # TODO: Implement lesson content building and commit
#     print(f"Map Vowel Space lesson not yet implemented for mode: {slug}")

#     return mode


# @handle_db_operation("seed Get Your Graphemes Right lesson")
# def seed_get_your_graphemes_right_lesson(map_variable: Tuple[str, str, str]) -> LessonMode:
#     """
#     Seeds the Get Your Graphemes Right lesson mode and its associated lesson content.

#     Args:
#         map_variable: Tuple containing (name, slug, description)

#     Returns:
#         The LessonMode object (either existing or newly created)
#     """
#     name, slug, _ = map_variable

#     if lesson_mode_exists(slug):
#         mode = LessonMode.query.filter(
#             (LessonMode.slug == slug) | (LessonMode.name == name)
#         ).first()
#         print(f"Lesson mode already exists: {slug}")
#     else:
#         mode = commit_lesson_mode(map_variable)

#     # TODO: Implement lesson content building and commit
#     print(f"Get Your Graphemes Right lesson not yet implemented for mode: {slug}")

#     return mode


# def get_lesson_mode_by_slug(slug: str) -> Optional[LessonMode]:
#     """
#     Retrieve a lesson mode by its slug.

#     Args:
#         slug: The slug of the lesson mode to retrieve

#     Returns:
#         The LessonMode object or None if not found
#     """
#     return LessonMode.query.filter_by(slug=slug).first()


# def get_lesson_mode_by_name(name: str) -> Optional[LessonMode]:
#     """
#     Retrieve a lesson mode by its name.

#     Args:
#         name: The name of the lesson mode to retrieve

#     Returns:
#         The LessonMode object or None if not found
#     """
#     return LessonMode.query.filter_by(name=name).first()


# def get_all_lesson_modes() -> List[LessonMode]:
#     """
#     Retrieve all lesson modes from the database.

#     Returns:
#         List of all LessonMode objects
#     """
#     return LessonMode.query.all()


# def get_vowel_lesson_by_mode_id(mode_id: int) -> Optional[VowelLesson]:
#     """
#     Retrieve a vowel lesson by its associated lesson mode ID.

#     Args:
#         mode_id: The ID of the lesson mode

#     Returns:
#         The VowelLesson object or None if not found
#     """
#     return VowelLesson.query.filter_by(lesson_mode_id=mode_id).first()


# def get_vowel_lesson_by_mode_slug(slug: str) -> Optional[VowelLesson]:
#     """
#     Retrieve a vowel lesson by the slug of its associated lesson mode.

#     Args:
#         slug: The slug of the lesson mode

#     Returns:
#         The VowelLesson object or None if not found
#     """
#     mode = get_lesson_mode_by_slug(slug)
#     if not mode:
#         return None
#     return get_vowel_lesson_by_mode_id(mode.id)


# @handle_db_operation("seed all lesson modes")
# def seed_all_lesson_modes() -> Dict[str, LessonMode]:
#     """
#     Seeds all lesson modes defined in LESSON_MODE_MAP.

#     Returns:
#         Dictionary mapping lesson mode keys to their corresponding LessonMode objects
#     """
#     result = {}
#     result["VOWELS_101"] = seed_vowels_101_lesson(LESSON_MODE_MAP["VOWELS_101"])
#     result["TACKLE_TRICKY_PAIRS"] = seed_tackle_tricky_pairs_lesson(LESSON_MODE_MAP["TACKLE_TRICKY_PAIRS"])
#     result["MAP_VOWEL_SPACE"] = seed_map_vowel_space_lesson(LESSON_MODE_MAP["MAP_VOWEL_SPACE"])
#     result["GET_YOUR_GRAPHEMES_RIGHT"] = seed_get_your_graphemes_right_lesson(LESSON_MODE_MAP["GET_YOUR_GRAPHEMES_RIGHT"])

#     return result
