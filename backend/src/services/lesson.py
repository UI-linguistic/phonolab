# from typing import Any, Dict, List, Optional, Tuple
# from sqlalchemy.exc import SQLAlchemyError
# from src.cache import cache
# from src.db import db
# from src.utils.error_handling import handle_db_operation
# from src.models.user import CompletedLesson
# from src.models.lesson import Lesson, LessonInteraction, LessonType


# # --- Lesson CRUD Operations ---
# def get_all_lessons() -> List[Lesson]:
#     """
#     Get all lessons from the database.

#     Returns:
#         List[Lesson]: List of all lessons
#     """
#     return Lesson.query.all()


# def get_lessons_by_type(lesson_type):
#     """Get all lessons of a specific type."""
#     return Lesson.query.filter_by(lesson_type=lesson_type).all()


# def get_lesson_by_id(lesson_id: int) -> Optional[Lesson]:
#     """
#     Get a lesson by its ID.

#     Args:
#         lesson_id (int): The ID of the lesson to retrieve

#     Returns:
#         Optional[Lesson]: The lesson if found, None otherwise
#     """
#     return Lesson.query.get(lesson_id)


# def get_lesson_by_vowel_id(vowel_id: str) -> Optional[Lesson]:
#     """
#     Get a lesson by its associated vowel ID.

#     Args:
#         vowel_id (str): The ID of the vowel associated with the lesson

#     Returns:
#         Optional[Lesson]: The lesson if found, None otherwise
#     """
#     return Lesson.query.filter_by(vowel_id=vowel_id).first()


# def create_lesson(vowel_id: str) -> Tuple[Optional[Lesson], Optional[str]]:
#     """
#     Create a new lesson for a vowel.

#     Args:
#         vowel_id (str): ID of the vowel for this lesson

#     Returns:
#         Tuple[Optional[Lesson], Optional[str]]: (Created lesson, Error message)
#     """
#     try:
#         vowel = Vowel.query.get(vowel_id)
#         if not vowel:
#             return None, f"Vowel with ID {vowel_id} not found"

#         existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
#         if existing_lesson:
#             return existing_lesson, None  # Return existing lesson without error

#         lesson = Lesson(vowel_id=vowel_id)
#         db.session.add(lesson)
#         db.session.commit()
#         return lesson, None

#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return None, f"Database error: {str(e)}"
#     except Exception as e:
#         db.session.rollback()
#         return None, f"Error creating lesson: {str(e)}"


# def update_lesson(lesson_id: int, vowel_id: str) -> Tuple[Optional[Lesson], Optional[str]]:
#     """
#     Update an existing lesson.

#     Args:
#         lesson_id (int): ID of the lesson to update
#         vowel_id (str): ID of the vowel for this lesson

#     Returns:
#         Tuple[Optional[Lesson], Optional[str]]: (Updated lesson, Error message)
#     """
#     try:
#         lesson = Lesson.query.get(lesson_id)
#         if not lesson:
#             return None, f"Lesson with ID {lesson_id} not found"

#         vowel = Vowel.query.get(vowel_id)
#         if not vowel:
#             return None, f"Vowel with ID {vowel_id} not found"

#         # Check if another lesson already uses this vowel
#         existing_lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
#         if existing_lesson and existing_lesson.id != lesson_id:
#             return None, f"Another lesson already exists for vowel {vowel_id}"

#         lesson.vowel_id = vowel_id
#         db.session.commit()
#         return lesson, None

#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return None, f"Database error: {str(e)}"
#     except Exception as e:
#         db.session.rollback()
#         return None, f"Error updating lesson: {str(e)}"


# def delete_lesson(lesson_id: int) -> Tuple[bool, Optional[str]]:
#     """
#     Delete a lesson by its ID.

#     Args:
#         lesson_id (int): ID of the lesson to delete

#     Returns:
#         Tuple[bool, Optional[str]]: (Success status, Error message)
#     """
#     try:
#         lesson = Lesson.query.get(lesson_id)
#         if not lesson:
#             return False, f"Lesson with ID {lesson_id} not found"

#         db.session.delete(lesson)
#         db.session.commit()
#         return True, None

#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return False, f"Database error: {str(e)}"
#     except Exception as e:
#         db.session.rollback()
#         return False, f"Error deleting lesson: {str(e)}"

# # --- Lesson Card CRUD Operations ---


# def get_lesson_by_vowel_id_with_details(vowel_id: str) -> Optional[Dict[str, Any]]:
#     """
#     Get a lesson by vowel ID with detailed vowel information and lesson card.

#     Args:
#         vowel_id (str): The ID of the vowel

#     Returns:
#         Optional[Dict[str, Any]]: Dictionary with lesson, vowel details, and lesson card, or None if not found
#     """
#     lesson = Lesson.query.filter_by(vowel_id=vowel_id).first()
#     if not lesson:
#         return None

#     vowel = lesson.vowel

#     # Get lesson card data from vowel
#     lesson_card = {}
#     if vowel:
#         lesson_card = {
#             "pronounced": vowel.pronounced,
#             "common_spellings": vowel.common_spellings,
#             "lips": vowel.lips,
#             "tongue": vowel.tongue,
#             "example_words": vowel.example_words
#         }

#     return {
#         "lesson_id": lesson.id,
#         "vowel": vowel.to_dict() if vowel else None,
#         "lesson_card": lesson_card
#     }


# def get_lesson_with_vowel_details(lesson_id: int) -> Optional[Dict[str, Any]]:
#     """
#     Get a lesson with detailed vowel information and lesson card.

#     Args:
#         lesson_id (int): The ID of the lesson

#     Returns:
#         Optional[Dict[str, Any]]: Dictionary with lesson, vowel details, and lesson card, or None if not found
#     """
#     lesson = Lesson.query.get(lesson_id)
#     if not lesson:
#         return None

#     vowel = lesson.vowel

#     # Get lesson card data from vowel
#     lesson_card = {}
#     if vowel:
#         lesson_card = {
#             "pronounced": vowel.pronounced,
#             "common_spellings": vowel.common_spellings,
#             "lips": vowel.lips,
#             "tongue": vowel.tongue,
#             "example_words": vowel.example_words
#         }

#     return {
#         "lesson_id": lesson.id,
#         "vowel": vowel.to_dict() if vowel else None,
#         "lesson_card": lesson_card
#     }


# def create_lessons_for_all_vowels() -> Tuple[int, Optional[str]]:
#     """
#     Create lessons for all vowels that don't have lessons yet.

#     Returns:
#         Tuple[int, Optional[str]]: (Number of lessons created, Error message)
#     """
#     def _create_lessons():
#         # Get all vowels
#         vowels = Vowel.query.all()

#         # Count created lessons
#         created_count = 0

#         for vowel in vowels:
#             # Check if lesson exists
#             existing_lesson = Lesson.query.filter_by(vowel_id=vowel.id).first()
#             if not existing_lesson:
#                 # Create new lesson
#                 lesson = Lesson(vowel_id=vowel.id)
#                 db.session.add(lesson)
#                 created_count += 1

#         db.session.commit()
#         return created_count

#     return handle_db_operation(_create_lessons, 0)


# # user functions

# def get_all_lesson_ids():
#     """Get a list of all lesson IDs"""
#     lessons = Lesson.query.all()
#     return [lesson.id for lesson in lessons]


# def get_completed_lessons(session_id):
#     """Get all lessons completed by a user"""
#     completed = CompletedLesson.query.filter_by(session_id=session_id).all()
#     return [lesson.lesson_id for lesson in completed]


# def get_remaining_lessons(session_id):
#     """Get all lessons not yet completed by a user"""
#     all_lessons = get_all_lesson_ids()
#     completed = get_completed_lessons(session_id)
#     return [lid for lid in all_lessons if lid not in completed]


# def get_lesson_progress(session_id):
#     """Get lesson progress statistics"""
#     completed = get_completed_lessons(session_id)
#     all_lessons = get_all_lesson_ids()

#     return {
#         "completed": len(completed),
#         "total": len(all_lessons),
#         "percentage": (len(completed) / len(all_lessons) * 100) if all_lessons else 0,
#         "completed_lessons": completed,
#         "remaining_lessons": get_remaining_lessons(session_id)
#     }


# def get_latest_completed_lesson(session_id):
#     """Get the most recently completed lesson"""
#     latest = CompletedLesson.query.filter_by(session_id=session_id)\
#         .order_by(CompletedLesson.completed_at.desc()).first()

#     if not latest:
#         return None

#     return {
#         "lesson_id": latest.lesson_id,
#         "completed_at": latest.completed_at.isoformat()
#     }


# @cache.memoize(timeout=86400)
# def build_vowel_tongue_position_matrix() -> List:
#     """
#     Build a 3x3 matrix of vowels for the tongue position interaction.

#     The matrix follows this structure:
#     [ i I, null, ʊ u]
#     [ e ɛ, ʌ ə, o ɔ]
#     [æ, null, ɑ]

#     Each vowel in the matrix contains only essential fields:
#     id, phoneme, name, audio_url, lips, tongue, mouth_image_url

#     Returns:
#         list: A 3x3 matrix with vowel objects or null values
#     """
#     matrix_structure = [
#         [["i", "ɪ"], None, ["ʊ", "u"]],
#         [["e", "ɛ"], ["ʌ", "ə"], ["o", "ɔ"]],
#         [["æ"], None, ["ɑ"]]
#     ]

#     all_vowels = Vowel.query.all()
#     vowel_dict = {vowel.phoneme: vowel for vowel in all_vowels}

#     result_matrix = []

#     for row in matrix_structure:
#         result_row = []

#         for cell in row:
#             if cell is None:
#                 result_row.append(None)
#             else:
#                 # Cell can be a list of vowel IDs or a single vowel ID
#                 if isinstance(cell, list):
#                     cell_vowels = []
#                     for vowel_id in cell:
#                         vowel = vowel_dict.get(vowel_id)
#                         if vowel:
#                             cell_vowels.append({
#                                 "id": vowel.id,
#                                 "phoneme": vowel.phoneme,
#                                 "name": vowel.name,
#                                 "audio_url": vowel.audio_url,
#                                 "lips": vowel.lips,
#                                 "tongue": vowel.tongue,
#                                 "mouth_image_url": vowel.mouth_image_url
#                             })
#                     result_row.append(cell_vowels if cell_vowels else None)
#                 else:
#                     vowel = vowel_dict.get(cell)
#                     if vowel:
#                         result_row.append({
#                             "id": vowel.id,
#                             "phoneme": vowel.phoneme,
#                             "name": vowel.name,
#                             "audio_url": vowel.audio_url,
#                             "lips": vowel.lips,
#                             "tongue": vowel.tongue,
#                             "mouth_image_url": vowel.mouth_image_url
#                         })
#                     else:
#                         result_row.append(None)

#         result_matrix.append(result_row)

#     return result_matrix


# @cache.memoize(timeout=86400)
# def build_vowel_lip_shape_config() -> dict:
#     """
#     Build the lip shape configuration for the Vowels 101 lesson.

#     This includes:
#     1. Two lip shape images (rounded and unrounded)
#     2. A 4x3 table of individual vowels

#     Returns:
#         dict: Configuration for the lip shape interaction
#     """
#     all_vowels = Vowel.query.all()
#     vowel_dict = {vowel.phoneme: vowel for vowel in all_vowels}

#     # 4x3 table structure with vowel IDs
#     table_structure = [
#         ["i", "ɪ", "e", "ɛ"],
#         ["æ", "ɑ", "ʌ", "ɔ"],
#         ["u", "ʊ", "oʊ", "ə"]
#     ]

#     vowel_table = []

#     for row in table_structure:
#         table_row = []
#         for vowel_id in row:
#             vowel = vowel_dict.get(vowel_id)
#             if vowel:
#                 table_row.append({
#                     "id": vowel.id,
#                     "phoneme": vowel.phoneme,
#                     "name": vowel.name,
#                     "audio_url": vowel.audio_url,
#                     "lips": vowel.lips,
#                     "tongue": vowel.tongue,
#                     "mouth_image_url": vowel.mouth_image_url
#                 })
#             else:
#                 table_row.append(None)
#         vowel_table.append(table_row)

#     # lip shape option
#     lip_shape_config = {
#         "lip_shapes": [
#             {
#                 "id": "unrounded",
#                 "name": "Unrounded Lips",
#                 "description": "Lips are spread or in a neutral position.",
#                 "image_url": "/images/lips/unrounded.png"
#             },
#             {
#                 "id": "rounded",
#                 "name": "Rounded Lips",
#                 "description": "Lips are rounded and pushed forward.",
#                 "image_url": "/images/lips/rounded.png"
#             }
#         ],
#         "vowel_table": vowel_table
#     }

#     return lip_shape_config


# def create_vowels_101_lesson(title=None, description=None) -> Lesson:
#     """
#     Create a Vowels 101 lesson with the appropriate tongue position matrix and lip shapes.

#     Returns:
#         Lesson: A new Vowels 101 lesson
#     """
#     # Create the base lesson
#     lesson = Lesson(
#         title=title or "Vowels 101",
#         description=description or "Learn the basics of vowel sounds and how they're produced.",
#         lesson_type=LessonType.VOWELS_101.value,
#         content={
#             "introduction": "Vowels are sounds produced with an open vocal tract. They are classified based on tongue position and lip shape."
#         }
#     )

#     tongue_position_config = {
#         "matrix": build_vowel_tongue_position_matrix(),
#         "labels": {
#             "rows": ["High", "Mid", "Low"],
#             "columns": ["Front", "Central", "Back"]
#         }
#     }

#     tongue_position = LessonInteraction(
#         interaction_type="tongue_position",
#         config=tongue_position_config
#     )

#     lip_shape = LessonInteraction(
#         interaction_type="lip_shape",
#         config=build_vowel_lip_shape_config()
#     )

#     lesson.interactions.append(tongue_position)
#     lesson.interactions.append(lip_shape)

#     return lesson


# # TRICKY PAIRS

# def find_minimal_pairs(vowel1, vowel2):
#     """
#     Find or create a minimal pair for two vowels.

#     Args:
#         vowel1: First vowel object
#         vowel2: Second vowel object

#     Returns:
#         dict: Minimal pair data with word template and options
#     """
#     # Get examples for each vowel
#     examples1 = vowel1.get_word_examples(limit=5)
#     examples2 = vowel2.get_word_examples(limit=5)

#     if examples1 and examples2:
#         example1 = examples1[0]
#         example2 = examples2[0]

#         word = example1.word
#         template = word.replace(vowel1.phoneme, "_")

#         return {
#             "word_template": template,
#             "options": [
#                 {
#                     "vowel_id": vowel1.id,
#                     "phoneme": vowel1.phoneme,
#                     "audio_url": vowel1.audio_url,
#                     "word": example1.word,
#                     "word_audio": example1.audio_url,
#                     "ipa": example1.ipa
#                 },
#                 {
#                     "vowel_id": vowel2.id,
#                     "phoneme": vowel2.phoneme,
#                     "audio_url": vowel2.audio_url,
#                     "word": example2.word,
#                     "word_audio": example2.audio_url,
#                     "ipa": example2.ipa
#                 }
#             ]
#         }

#     # no examples found
#     return None


# def get_tricky_pairs_data():
#     """
#     Retrieve all tricky vowel pairs from the database and organize them as minimal pairs.

#     Returns:
#         list: List of minimal pairs with their categories
#     """
#     pairs_query = db.session.query(
#         tricky_pairs.c.vowel1_id,
#         tricky_pairs.c.vowel2_id,
#         tricky_pairs.c.category
#     ).all()

#     pairs = []
#     for vowel1_id, vowel2_id, category in pairs_query:
#         vowel1 = db.session.get(Vowel, vowel1_id)
#         vowel2 = db.session.get(Vowel, vowel2_id)

#         if vowel1 and vowel2:
#             minimal_pair = find_minimal_pairs(vowel1, vowel2)

#             if minimal_pair:
#                 pairs.append({
#                     "category": category,
#                     "minimal_pair": minimal_pair
#                 })

#     return pairs


# def build_tricky_pairs_lesson_card(title, description, pairs):
#     """
#     Build the lesson card content for tricky vowel pairs with minimal pairs.

#     Args:
#         title (str): The lesson title
#         description (str): The lesson description
#         pairs (list): List of minimal pairs with their categories

#     Returns:
#         dict: The structured lesson card content
#     """
#     return {
#         "title": title,
#         "description": description,
#         "pairs": pairs
#     }


# def create_tricky_pairs_lesson(title=None, description=None):
#     """
#     Create a lesson focused on tricky vowel pairs using minimal pairs.

#     Args:
#         title (str, optional): Custom title for the lesson
#         description (str, optional): Custom description for the lesson

#     Returns:
#         Lesson: The created lesson object
#     """

#     if not title:
#         title = "Tricky Vowel Pairs"

#     if not description:
#         description = "Learn to distinguish between commonly confused vowel pairs in English."

#     pairs = get_tricky_pairs_data()
#     lesson_card = build_tricky_pairs_lesson_card(title, description, pairs)

#     lesson = Lesson(
#         title=title,
#         description=description,
#         lesson_type="tricky_pairs",
#         content=lesson_card
#     )

#     db.session.add(lesson)
#     db.session.commit()

#     return lesson


# def get_vowel_by_tongue_position():
#     """
#     Retrieve all vowels from the database and organize them by tongue position.

#     Returns:
#         dict: Vowels organized by tongue position (front, central, back)
#     """

#     vowels = Vowel.query.all()
#     vowel_groups = {
#         "front": [],
#         "central": [],
#         "back": []
#     }

#     for vowel in vowels:
#         tongue_position = vowel.tongue.lower() if vowel.tongue else ""

#         if "front" in tongue_position:
#             group = "front"
#         elif "central" in tongue_position:
#             group = "central"
#         elif "back" in tongue_position:
#             group = "back"
#         else:
#             group = "central"

#         examples = vowel.get_word_examples(limit=2)

#         vowel_data = {
#             "id": vowel.id,
#             "phoneme": vowel.phoneme,
#             "audio_url": vowel.audio_url,
#             "examples": [
#                 {
#                     "word": ex.word,
#                     "audio_url": ex.audio_url,
#                     "ipa": ex.ipa
#                 }
#                 for ex in examples
#             ]
#         }

#         vowel_groups[group].append(vowel_data)

#     return vowel_groups


# def build_train_your_ear_lesson_card(title, description, vowel_groups):
#     """
#     Build the lesson card content for the Train Your Ear lesson.

#     Args:
#         title (str): The lesson title
#         description (str): The lesson description
#         vowel_groups (dict): Vowels organized by tongue position

#     Returns:
#         dict: The structured lesson card content
#     """
#     return {
#         "title": title,
#         "description": description,
#         "vowel_groups": [
#             {
#                 "name": "Front Vowels",
#                 "vowels": vowel_groups["front"]
#             },
#             {
#                 "name": "Central Vowels",
#                 "vowels": vowel_groups["central"]
#             },
#             {
#                 "name": "Back Vowels",
#                 "vowels": vowel_groups["back"]
#             }
#         ]
#     }


# def create_train_your_ear_lesson(title=None, description=None):
#     """
#     Create a 'Train Your Ear' lesson that allows users to glide between vowel sounds.

#     Args:
#         title (str, optional): Custom title for the lesson
#         description (str, optional): Custom description for the lesson

#     Returns:
#         Lesson: The created lesson object
#     """
#     from src.models.lesson import Lesson

#     if not title:
#         title = "Train Your Ear"

#     if not description:
#         description = "Use the slider to glide between vowel sounds and train your ear to recognize subtle differences."

#     vowel_groups = get_vowel_by_tongue_position()
#     lesson_card = build_train_your_ear_lesson_card(title, description, vowel_groups)

#     lesson = Lesson(
#         title=title,
#         description=description,
#         lesson_type="train_your_ear",
#         content=lesson_card
#     )

#     db.session.add(lesson)
#     db.session.commit()

#     return lesson
