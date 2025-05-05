# # src/services/database.py
# import json
# import logging
# import os
# import re
# import traceback
# from json import JSONDecodeError
# from typing import List, Optional, Tuple

# from sqlalchemy.exc import SQLAlchemyError

# from models.lesson import Lesson
# from models.quiz import QuizItem, QuizOption
# from services.quiz import create_quiz_from_json_id
# from src.db import db
# from src.models.phoneme import Vowel, WordExample
# from src.utils.error_handling import handle_db_operation


def extract_vowel_info_from_filename(filename: str) -> Tuple[str, str, str, str]:
    """
    Extract vowel information from a filename.

    Expected format: "N-X_description.mp3" where:
    - N is a number (position)
    - X is the IPA symbol
    - description contains information about the vowel

    Args:
        filename: The audio filename

    Returns:
        Tuple of (vowel_id, phoneme, name, description)
    """
    # Regular expression to match the expected format
    pattern = r"(\d+)-([^_]+)_(.+)*\.mp3"
    match = re.match(pattern, filename)

    if not match:
        raise ValueError(f"Filename {filename} does not match expected format")

    position, phoneme, description = match.groups()
    vowel_id = f"v{position}"
    name = phoneme
    description = description.replace('_', ' ')

    return vowel_id, phoneme, name, description


def seed_vowels_from_audio_directory(
        audio_dir_path: str,
        clear_existing: bool = True,
        base_url: str = "/audio/vowels/") -> Tuple[int, Optional[str]]:
    """
    Seed the vowel table by scanning a directory for audio files.

    Args:
        audio_dir_path: Path to the directory containing vowel audio files
        clear_existing: Whether to clear existing vowels before seeding
        base_url: Base URL path for accessing the audio files

    Returns:
        Tuple of (count of vowels added, error message if any)
    """
    def _seed_vowels():
        # Clear existing vowels if requested
        if clear_existing:
            Vowel.query.delete()
            db.session.commit()

        count = 0

        # Get all mp3 files in the directory
        audio_files = [f for f in os.listdir(audio_dir_path) if f.endswith('.mp3')]

        for audio_file in audio_files:
            try:
                # Extract vowel information from filename
                vowel_id, phoneme, name, description = extract_vowel_info_from_filename(audio_file)
                existing_vowel = Vowel.query.get(vowel_id)
                if existing_vowel:
                    # Update existing vowel
                    existing_vowel.phoneme = phoneme
                    existing_vowel.name = name
                    existing_vowel.ipa_example = phoneme
                    existing_vowel.audio_url = f"{base_url}{audio_file}"
                    existing_vowel.description = description
                else:
                    # Create new vowel
                    vowel = Vowel(
                        id=vowel_id,
                        phoneme=phoneme,
                        name=name,
                        ipa_example=phoneme,
                        color_code="#CCCCCC",
                        audio_url=f"{base_url}{audio_file}",
                        description=description
                    )
                    db.session.add(vowel)

                count += 1

            except ValueError as e:
                print(f"Warning: Skipping file {audio_file} - {str(e)}")
                continue

        db.session.commit()
        return count

    return handle_db_operation(_seed_vowels, 0)


# def seed_from_json_file(json_file_path: str, clear_existing: bool = False, preserve_audio_urls: bool = True) -> Tuple[int, int, Optional[str]]:
#     """
#     Seed vowels and word examples from a JSON file.
#     Args:
#         json_file_path: Path to the JSON file containing vowel and example data
#         clear_existing: Whether to clear existing data before seeding
#     Returns:
#         Tuple of (vowel count, example count, error message if any)
#     """
#     try:
#         with open(json_file_path, 'r', encoding='utf-8') as f:
#             data = json.load(f)

#         vowels_data = []
#         if isinstance(data, dict) and 'lesson' in data:
#             vowels_data = data['lesson']
#         elif isinstance(data, dict) and 'vowels' in data:
#             vowels_data = data['vowels']
#         elif isinstance(data, list):
#             vowels_data = data

#         if clear_existing:
#             WordExample.query.delete()
#             Vowel.query.delete()
#             db.session.commit()

#         vowel_count = 0
#         example_count = 0

#         for vowel_data in vowels_data:
#             vowel_id = f"v{vowel_data['id']}"
#             phoneme = vowel_data['target'].strip('/').replace('ː', '')
#             name = phoneme
#             description = f"Placeholder for {phoneme} vowel"

#             existing_vowel = Vowel.query.get(vowel_id)
#             if existing_vowel:
#                 existing_vowel.phoneme = phoneme
#                 existing_vowel.name = name
#                 existing_vowel.description = description
#                 existing_vowel.ipa_example = vowel_data.get('target', '')
#                 if not preserve_audio_urls or not existing_vowel.audio_url:
#                     existing_vowel.audio_url = vowel_data.get('audio_url', '')

#                 existing_vowel.pronounced = vowel_data.get('pronounced', '')
#                 existing_vowel.common_spellings = vowel_data.get('common_spellings', [])
#                 existing_vowel.lips = vowel_data.get('lips', '')
#                 existing_vowel.tongue = vowel_data.get('tongue', '')
#                 existing_vowel.example_words = vowel_data.get('example_words', [])
#                 existing_vowel.mouth_image_url = vowel_data.get('mouth_image_url', '')

#                 vowel = existing_vowel
#             else:
#                 vowel = Vowel(
#                     id=vowel_id,
#                     phoneme=phoneme,
#                     name=name,
#                     description=description,
#                     ipa_example=vowel_data.get('target', ''),
#                     color_code="#CCCCCC",
#                     audio_url=vowel_data.get('audio_url', ''),

#                     pronounced=vowel_data.get('pronounced', ''),
#                     common_spellings=vowel_data.get('common_spellings', []),
#                     lips=vowel_data.get('lips', ''),
#                     tongue=vowel_data.get('tongue', ''),
#                     example_words=vowel_data.get('example_words', []),
#                     mouth_image_url=vowel_data.get('mouth_image_url', '')
#                 )
#                 db.session.add(vowel)

#             vowel_count += 1

#             example_words = vowel_data.get('example_words', [])
#             for word in example_words:
#                 audio_url = f"/static/audio/word_examples/{vowel_count:02d}_{phoneme}_ref_{word}.mp3"

#                 existing_example = WordExample.query.filter_by(
#                     word=word,
#                     vowel_id=vowel_id
#                 ).first()

#                 if existing_example:
#                     existing_example.audio_url = audio_url
#                 else:
#                     example = WordExample(
#                         word=word,
#                         audio_url=audio_url,
#                         vowel_id=vowel_id,
#                         ipa="",
#                         example_sentence=""
#                     )
#                     db.session.add(example)

#                 example_count += 1

#         db.session.commit()
#         return vowel_count, example_count, None
#     except JSONDecodeError as e:
#         db.session.rollback()
#         return 0, 0, f"Invalid JSON format: {str(e)}"
#     except (IOError, ValueError, TypeError) as e:
#         db.session.rollback()
#         return 0, 0, f"Data error: {str(e)}"
#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return 0, 0, f"Database error: {str(e)}"
#     except Exception as e:
#         db.session.rollback()
#         logging.exception("Unexpected error in seed_from_json_file")
#         return 0, 0, f"Unexpected error: {str(e)}\n{traceback.format_exc()}"


# def seed_lessons_from_data(vowel_ids: List[str], clear_existing: bool = False) -> Tuple[int, Optional[str]]:
#     """
#     Seed lessons from a list of vowel IDs.

#     Args:
#         vowel_ids (List[str]): List of vowel IDs to create lessons for
#         clear_existing (bool): Whether to clear existing lessons before seeding

#     Returns:
#         Tuple[int, Optional[str]]: (Number of lessons created, Error message)
#     """
#     try:
#         # Clear existing lessons if requested
#         if clear_existing:
#             Lesson.query.delete()
#             db.session.commit()

#         # Create new lessons
#         created_count = 0
#         for vowel_id in vowel_ids:
#             # Check if vowel exists
#             vowel = Vowel.query.get(vowel_id)
#             if not vowel:
#                 continue

#             # Skip if lesson already exists for this vowel and we're not clearing
#             if not clear_existing and Lesson.query.filter_by(vowel_id=vowel_id).first():
#                 continue

#             # Create the lesson
#             lesson = Lesson(vowel_id=vowel_id)
#             db.session.add(lesson)
#             created_count += 1

#         db.session.commit()
#         return created_count, None

#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return 0, f"Database error: {str(e)}"
#     except Exception as e:
#         db.session.rollback()
#         return 0, f"Error seeding lessons: {str(e)}"


# def seed_lessons_from_json_file(file_path: str, clear_existing: bool = False) -> Tuple[int, Optional[str]]:
#     """
#     Seed lessons from a JSON file.

#     Args:
#         file_path (str): Path to the JSON file
#         clear_existing (bool): Whether to clear existing lessons before seeding

#     Returns:
#         Tuple[int, Optional[str]]: (Number of lessons created, Error message)
#     """
#     try:
#         # Read the JSON file
#         with open(file_path, 'r', encoding='utf-8') as f:
#             lessons_data = json.load(f)

#         # Validate the data structure
#         if not isinstance(lessons_data, list):
#             return 0, "JSON file must contain a list of lesson data"

#         # Seed the lessons
#         return seed_lessons_from_data(lessons_data, clear_existing)

#     except FileNotFoundError:
#         return 0, f"File not found: {file_path}"
#     except json.JSONDecodeError:
#         return 0, f"Invalid JSON format in file: {file_path}"
#     except Exception as e:
#         return 0, f"Error reading JSON file: {str(e)}"


# def create_quiz_batch(data: dict):
#     """
#     Seeds the quiz database from quiz.json format.
#     """
#     if data is None:
#         data = _load_quiz_json()

#     QuizOption.query.delete()
#     QuizItem.query.delete()
#     db.session.commit()

#     for entry in data["quiz"]:
#         create_quiz_from_json_id(entry["id"], data)

# # import json
# # import os
# # from src.config import Config


# # def setup_tricky_vowel_pairs():
# #     """
# #     Set up the tricky vowel pairs in the database.
# #     This should be run once to establish the relationships.
# #     Loads pairs from the data/tricky_vowel_pairs.json file.
# #     """
# #     # Load tricky pairs from JSON file
# #     json_path = os.path.join(Config.BASE_DIR, 'data', 'tricky_vowel_pairs.json')

# #     try:
# #         with open(json_path, 'r', encoding='utf-8') as f:
# #             data = json.load(f)
# #             tricky_pairs = data.get('tricky_pairs', [])
# #     except (FileNotFoundError, json.JSONDecodeError) as e:
# #         print(f"Error loading tricky vowel pairs: {e}")
# #         return False

# #     # Clear existing pairs (optional)
# #     db.session.execute(tricky_vowel_pairs.delete())

# #     # Add each pair to the database
# #     for pair in tricky_pairs:
# #         vowel1 = Vowel.query.filter_by(phoneme=pair["vowels"][0]).first()
# #         vowel2 = Vowel.query.filter_by(phoneme=pair["vowels"][1]).first()

# #         if vowel1 and vowel2:
# #             # Check if this pair already exists
# #             stmt = db.select([tricky_vowel_pairs]).where(
# #                 db.and_(
# #                     tricky_vowel_pairs.c.vowel1_id == vowel1.id,
# #                     tricky_vowel_pairs.c.vowel2_id == vowel2.id
# #                 )
# #             )
# #             existing = db.session.execute(stmt).fetchone()

# #             if not existing:
# #                 # Insert the new pair
# #                 db.session.execute(
# #                     tricky_vowel_pairs.insert().values(
# #                         vowel1_id=vowel1.id,
# #                         vowel2_id=vowel2.id,
# #                         category=pair["category"],
# #                         description=pair["description"]
# #                     )
# #                 )

# #     db.session.commit()
# #     return True
