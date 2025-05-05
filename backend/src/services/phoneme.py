# src/services/phoneme.py
import logging
from typing import List, Optional

from sqlalchemy.exc import SQLAlchemyError

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
    description: str
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
        description=description
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
    except (KeyError, ValueError, TypeError) as e:
        db.session.rollback()
        return f"Data error: {str(e)}"
    except SQLAlchemyError as e:
        db.session.rollback()
        return f"Database error: {str(e)}"
    except Exception as e:
        db.session.rollback()
        logging.exception("Unexpected error in create_phoneme_batch")
        return f"Unexpected error: {str(e)}"


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


def get_word_examples() -> List[WordExample]:
    """
    Get all word examples from the database.

    Returns:
        List of WordExample objects
    """
    return WordExample.query.all()
