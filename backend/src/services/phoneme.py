# src/services/phoneme.py
import os
import re
from typing import List, Optional, Tuple
from flask import json
from src.db import db
from src.models.phoneme import Vowel, WordExample


def get_all_vowels() -> List[Vowel]:
    """
    Retrieve all vowel phonemes from the database.

    Returns:
        List of Vowel objects
    """
    return Vowel.query.all()


def get_vowel_by_id(vowel_id: str) -> Optional[Vowel]:
    """
    Retrieve a vowel phoneme by its ID.

    Args:
        vowel_id: The ID of the vowel to retrieve

    Returns:
        Vowel object if found, None otherwise
    """
    return Vowel.query.get(vowel_id)


def get_vowel_by_phoneme(phoneme: str) -> Optional[Vowel]:
    """
    Retrieve a vowel phoneme by its phoneme symbol.

    Args:
        phoneme: The phoneme symbol to search for

    Returns:
        Vowel object if found, None otherwise
    """
    return Vowel.query.filter_by(phoneme=phoneme).first()


def get_vowel_by_name(name: str) -> Optional[Vowel]:
    """
    Retrieve a vowel phoneme by its name.

    Args:
        name: The name of the vowel

    Returns:
        Vowel object if found, None otherwise
    """
    return Vowel.query.filter_by(name=name).first()


def get_word_examples_by_vowel_id(vowel_id: str) -> List[WordExample]:
    """
    Retrieve all word examples for a specific vowel.

    Args:
        vowel_id: The ID of the vowel

    Returns:
        List of WordExample objects
    """
    return WordExample.query.filter_by(vowel_id=vowel_id).all()


def get_word_example_by_id(example_id: int) -> Optional[WordExample]:
    """
    Retrieve a word example by its ID.

    Args:
        example_id: The ID of the word example

    Returns:
        WordExample object if found, None otherwise
    """
    return WordExample.query.get(example_id)


def get_word_example_by_word(word: str) -> Optional[WordExample]:
    """
    Retrieve a word example by its word text.

    Args:
        word: The word to search for

    Returns:
        WordExample object if found, None otherwise
    """
    return WordExample.query.filter_by(word=word).first()


def create_vowel(
    vowel_id: str,
    phoneme: str,
    name: str,
    ipa_example: str,
    color_code: str,
    audio_url: str,
    description: str,
    pronounced: str = None,
    common_spellings: List[str] = None,
    lips: str = None,
    tongue: str = None,
    example_words: List[str] = None,
    mouth_image_url: str = None
) -> Vowel:
    """
    Create a new vowel phoneme.

    Args:
        vowel_id: Unique identifier for the vowel
        phoneme: The phoneme symbol
        name: Name of the vowel
        ipa_example: IPA example of the vowel
        color_code: Color code for visualization
        audio_url: URL to audio pronunciation
        description: Description of the vowel sound
        pronounced: How the vowel is pronounced (e.g., "ee")
        common_spellings: List of common spellings (e.g., ["ee", "ea"])
        lips: Description of lip position (e.g., "wide smile, unrounded")
        tongue: Description of tongue position (e.g., "high, front")
        example_words: List of example words (e.g., ["see", "beat", "team"])
        mouth_image_url: URL to mouth position image

    Returns:
        The created Vowel object
    """
    vowel = Vowel(
        id=vowel_id,
        phoneme=phoneme,
        name=name,
        ipa_example=ipa_example,
        color_code=color_code,
        audio_url=audio_url,
        description=description,
        pronounced=pronounced,
        common_spellings=common_spellings,
        lips=lips,
        tongue=tongue,
        example_words=example_words,
        mouth_image_url=mouth_image_url
    )
    db.session.add(vowel)
    db.session.commit()
    return vowel


def create_word_example(
        word: str,
        audio_url: str,
        vowel_id: str,
        ipa: str = None,
        example_sentence: str = None) -> WordExample:
    """
    Create a new word example for a vowel.

    Args:
        word: The example word
        audio_url: URL to audio pronunciation
        vowel_id: ID of the vowel this word exemplifies
        ipa: IPA transcription of the word (optional)
        example_sentence: Example sentence using the word (optional)

    Returns:
        The created WordExample object
    """
    example = WordExample(
        word=word,
        audio_url=audio_url,
        vowel_id=vowel_id,
        ipa=ipa,
        example_sentence=example_sentence
    )
    db.session.add(example)
    db.session.commit()
    return example


def create_phoneme_batch(data_loader) -> Optional[str]:
    """
    Batch create phoneme data from a JSON source.

    Args:
        data_loader: Function that loads the phoneme data

    Returns:
        Error message if any, None on success
    """
    try:
        data = data_loader()

        for vowel_data in data.get('vowels', []):
            vowel = create_vowel(
                vowel_id=vowel_data['id'],
                phoneme=vowel_data['phoneme'],
                name=vowel_data['name'],
                ipa_example=vowel_data['ipa_example'],
                color_code=vowel_data['color_code'],
                audio_url=vowel_data['audio_url'],
                description=vowel_data['description']
            )

            for example_data in vowel_data.get('word_examples', []):
                create_word_example(
                    word=example_data['word'],
                    audio_url=example_data['audio_url'],
                    vowel_id=vowel.id,
                    ipa=example_data.get('ipa'),
                    example_sentence=example_data.get('example_sentence')
                )

        return None
    except Exception as e:
        db.session.rollback()
        return str(e)


def update_vowel(vowel_id: str, **kwargs) -> Optional[Vowel]:
    """
    Update a vowel phoneme.

    Args:
        vowel_id: ID of the vowel to update
        **kwargs: Fields to update (phoneme, name, ipa_example, etc.)

    Returns:
        Updated Vowel object if found, None otherwise
    """
    vowel = get_vowel_by_id(vowel_id)
    if not vowel:
        return None

    for key, value in kwargs.items():
        if hasattr(vowel, key):
            setattr(vowel, key, value)

    db.session.commit()
    return vowel


def update_word_example(example_id: int, **kwargs) -> Optional[WordExample]:
    """
    Update a word example.

    Args:
        example_id: ID of the word example to update
        **kwargs: Fields to update (word, audio_url, ipa, example_sentence)

    Returns:
        Updated WordExample object if found, None otherwise
    """
    example = get_word_example_by_id(example_id)
    if not example:
        return None

    for key, value in kwargs.items():
        if hasattr(example, key):
            setattr(example, key, value)

    db.session.commit()
    return example


def delete_vowel(vowel_id: str) -> bool:
    """
    Delete a vowel phoneme and all its associated word examples.

    Args:
        vowel_id: ID of the vowel to delete

    Returns:
        True if deleted, False if not found
    """
    vowel = get_vowel_by_id(vowel_id)
    if not vowel:
        return False

    db.session.delete(vowel)
    db.session.commit()
    return True


def delete_word_example(example_id: int) -> bool:
    """
    Delete a word example.

    Args:
        example_id: ID of the word example to delete

    Returns:
        True if deleted, False if not found
    """
    example = get_word_example_by_id(example_id)
    if not example:
        return False

    db.session.delete(example)
    db.session.commit()
    return True


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
    pattern = r"(\d+)-([^_]+)_(.+)\.mp3"
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
    try:
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
        return count, None

    except Exception as e:
        db.session.rollback()
        return 0, str(e)


def seed_word_examples_from_audio_directory(
        examples_dir_path: str,
        clear_existing: bool = True,
        base_url: str = "/audio/word_examples/") -> Tuple[int, Optional[str]]:
    """
    Seed word examples by scanning a directory for audio files.

    Expected filename format: word_PHONEME.mp3

    Args:
        examples_dir_path: Path to the directory containing word example audio files
        clear_existing: Whether to clear existing word examples before seeding
        base_url: Base URL path for accessing the audio files

    Returns:
        Tuple of (count of examples added, error message if any)
    """
    try:
        if clear_existing:
            WordExample.query.delete()
            db.session.commit()

        count = 0

        vowels = {vowel.phoneme: vowel for vowel in Vowel.query.all()}

        audio_files = [f for f in os.listdir(examples_dir_path) if f.endswith('.mp3')]

        for audio_file in audio_files:
            parts = audio_file[:-4].split('_')

            if len(parts) < 2:
                print(f"Warning: Skipping file {audio_file} - doesn't match expected format word_PHONEME.mp3")
                continue

            word = parts[0]
            phoneme = parts[1]

            if phoneme not in vowels:
                print(f"Warning: Skipping file {audio_file} - phoneme {phoneme} not found in vowels")
                continue

            vowel = vowels[phoneme]

            existing_example = WordExample.query.filter_by(
                word=word,
                vowel_id=vowel.id
            ).first()

            if existing_example:
                existing_example.audio_url = f"{base_url}{audio_file}"
            else:
                example = WordExample(
                    word=word,
                    audio_url=f"{base_url}{audio_file}",
                    vowel_id=vowel.id,
                    ipa=None,
                    example_sentence=None
                )
                db.session.add(example)

            count += 1

        db.session.commit()
        return count, None

    except Exception as e:
        db.session.rollback()
        return 0, str(e)


def seed_from_json_file(json_file_path: str, clear_existing: bool = True) -> Tuple[int, int, Optional[str]]:
    """
    Seed vowels and word examples from a JSON file.
    Args:
        json_file_path: Path to the JSON file containing vowel and example data
        clear_existing: Whether to clear existing data before seeding
    Returns:
        Tuple of (vowel count, example count, error message if any)
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        vowels_data = []
        if isinstance(data, dict) and 'lesson' in data:
            vowels_data = data['lesson']
        elif isinstance(data, dict) and 'vowels' in data:
            vowels_data = data['vowels']
        elif isinstance(data, list):
            vowels_data = data

        if clear_existing:
            WordExample.query.delete()
            Vowel.query.delete()
            db.session.commit()

        vowel_count = 0
        example_count = 0

        for vowel_data in vowels_data:
            vowel_id = f"v{vowel_data['id']}"
            phoneme = vowel_data['target'].strip('/').replace('ː', '')
            name = phoneme
            description = f"Placeholder for {phoneme} vowel"

            existing_vowel = Vowel.query.get(vowel_id)
            if existing_vowel:
                existing_vowel.phoneme = phoneme
                existing_vowel.name = name
                existing_vowel.description = description
                existing_vowel.ipa_example = vowel_data.get('target', '')
                existing_vowel.audio_url = vowel_data.get('audio_url', '')
                
                # Add lesson card fields
                existing_vowel.pronounced = vowel_data.get('pronounced', '')
                existing_vowel.common_spellings = vowel_data.get('common_spellings', [])
                existing_vowel.lips = vowel_data.get('lips', '')
                existing_vowel.tongue = vowel_data.get('tongue', '')
                existing_vowel.example_words = vowel_data.get('example_words', [])
                existing_vowel.mouth_image_url = vowel_data.get('mouth_image_url', '')
                
                vowel = existing_vowel
            else:
                vowel = Vowel(
                    id=vowel_id,
                    phoneme=phoneme,
                    name=name,
                    description=description,
                    ipa_example=vowel_data.get('target', ''),
                    color_code="#CCCCCC",
                    audio_url=vowel_data.get('audio_url', ''),
                    
                    # Add lesson card fields
                    pronounced=vowel_data.get('pronounced', ''),
                    common_spellings=vowel_data.get('common_spellings', []),
                    lips=vowel_data.get('lips', ''),
                    tongue=vowel_data.get('tongue', ''),
                    example_words=vowel_data.get('example_words', []),
                    mouth_image_url=vowel_data.get('mouth_image_url', '')
                )
                db.session.add(vowel)

            vowel_count += 1

            example_words = vowel_data.get('example_words', [])
            for word in example_words:
                audio_url = f"/static/audio/word_examples/{vowel_count:02d}_{phoneme}_ref_{word}.mp3"

                existing_example = WordExample.query.filter_by(
                    word=word,
                    vowel_id=vowel_id
                ).first()

                if existing_example:
                    existing_example.audio_url = audio_url
                else:
                    # Create new example
                    example = WordExample(
                        word=word,
                        audio_url=audio_url,
                        vowel_id=vowel_id,
                        ipa="",
                        example_sentence=""
                    )
                    db.session.add(example)

                example_count += 1

        db.session.commit()
        return vowel_count, example_count, None
    except Exception as e:
        db.session.rollback()
        import traceback
        return 0, 0, f"{str(e)}\n{traceback.format_exc()}"



def get_word_examples():
    """
    Get all word examples from the database.

    Returns:
        List of WordExample objects
    """
    from src.models.phoneme import WordExample
    return WordExample.query.all()


def get_word_examples_by_vowel_id(vowel_id):
    """
    Get word examples for a specific vowel.

    Args:
        vowel_id: ID of the vowel

    Returns:
        List of WordExample objects for the specified vowel
    """
    from src.models.phoneme import WordExample
    return WordExample.query.filter_by(vowel_id=vowel_id).all()


# def seed_from_json_file(json_file_path: str, clear_existing: bool = True) -> Tuple[int, int, Optional[str]]:
#     """
#     Seed vowels and word examples from a JSON file.

#     Args:
#         json_file_path: Path to the JSON file containing vowel and example data
#         clear_existing: Whether to clear existing data before seeding

#     Returns:
#         Tuple of (vowel count, example count, error message if any)
#     """
#     try:
#         # Load the JSON data
#         with open(json_file_path, 'r', encoding='utf-8') as f:
#             data = json.load(f)

#         # Clear existing data if requested
#         if clear_existing:
#             WordExample.query.delete()
#             Vowel.query.delete()
#             db.session.commit()

#         vowel_count = 0
#         example_count = 0

#         # Process vowels
#         for vowel_data in data.get('vowels', []):
#             existing_vowel = Vowel.query.get(vowel_data['id'])

#             if existing_vowel:
#                 for key, value in vowel_data.items():
#                     if key != 'word_examples' and hasattr(existing_vowel, key):
#                         setattr(existing_vowel, key, value)
#                 vowel = existing_vowel
#             else:
#                 # Create new vowel
#                 vowel = Vowel(
#                     id=vowel_data['id'],
#                     phoneme=vowel_data['phoneme'],
#                     name=vowel_data['name'],
#                     ipa_example=vowel_data['ipa_example'],
#                     color_code=vowel_data.get('color_code', '#CCCCCC'),
#                     audio_url=vowel_data['audio_url'],
#                     description=vowel_data['description']
#                 )
#                 db.session.add(vowel)

#             vowel_count += 1

#             for example_data in vowel_data.get('word_examples', []):
#                 existing_example = WordExample.query.filter_by(
#                     word=example_data['word'],
#                     vowel_id=vowel_data['id']
#                 ).first()

#                 if existing_example:
#                     # Update existing example
#                     for key, value in example_data.items():
#                         if hasattr(existing_example, key):
#                             setattr(existing_example, key, value)
#                 else:
#                     # Create new example
#                     example = WordExample(
#                         word=example_data['word'],
#                         audio_url=example_data['audio_url'],
#                         vowel_id=vowel_data['id'],
#                         ipa=example_data.get('ipa'),
#                         example_sentence=example_data.get('example_sentence')
#                     )
#                     db.session.add(example)

#                 example_count += 1

#         db.session.commit()
#         return vowel_count, example_count, None

#     except Exception as e:
#         db.session.rollback()
#         return 0, 0, str(e)

# phase 2
# def get_vowel_by_phoneme(phoneme):
#     return Vowel.query.filter_by(phoneme=phoneme).first()

# def search_vowels_by_region(region):
#     return Vowel.query.join(ColorMapPosition).filter(ColorMapPosition.region == region).all()
