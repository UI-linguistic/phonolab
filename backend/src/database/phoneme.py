# # src/database/phoneme.py
import json
import os
from pathlib import Path
from sqlalchemy.orm.exc import DetachedInstanceError
from src.models.phoneme import MinimalPair, SeedingStats, Vowel, WordExample
from src.utils.decorators import safe_db_op
from src.db import db
from src.config import Config


def resolve_vowel_assets(vowel_data: dict) -> tuple[str, str, str, str]:
    """
    Resolve lips, tongue, lip_image_url, and tongue_image_url for a vowel entry.

    Returns a tuple: (lips, tongue, lip_image_url, tongue_image_url)
    """
    lips_raw = vowel_data.get("lips", [])
    lips = ", ".join(lips_raw) if isinstance(lips_raw, list) else lips_raw
    tongue = ", ".join(vowel_data.get("tongue", []))

    # Lip image logic
    lip_image_url = vowel_data.get("lip_image_url")
    if not lip_image_url:
        if isinstance(lips_raw, list) and any("rounded" in s.lower() for s in lips_raw):
            lip_image_url = "/images/lip_shape/rounded-lips.svg"
        else:
            lip_image_url = "/images/lip_shape/unrounded-lips.svg"

    # Tongue image logic
    tongue_image_url = vowel_data.get("tongue_image_url")
    if not tongue_image_url:
        ipa = vowel_data["ipa"]
        image_dir = Config.TONGUE_IMAGE_DIR
        for file in os.listdir(image_dir):
            if file.lower().startswith(ipa.lower()):
                tongue_image_url = f"/images/tongue_position/{file}"
                break

    return lips, tongue, lip_image_url, tongue_image_url


@safe_db_op(default=None, error_message="Failed to insert vowel")
def insert_vowel_if_not_exists(vowel_data: dict, stats: SeedingStats | None = None) -> Vowel:
    existing = Vowel.query.filter_by(id=vowel_data["id"]).first()
    if existing:
        if stats:
            stats.increment("skipped_vowels")
        return existing

    lips, tongue, lip_image_url, tongue_image_url = resolve_vowel_assets(vowel_data)

    vowel = Vowel(
        id=vowel_data["id"],
        ipa=vowel_data["ipa"],
        pronounced=vowel_data.get("pronounced"),
        common_spellings=vowel_data.get("common_spellings", []),
        length=vowel_data.get("length"),
        lips=lips,
        tongue=tongue,
        description=vowel_data.get("description"),
        audio_url=vowel_data.get("audio_url", []),
        mouth_image_url=vowel_data.get("mouth_image_url"),
        lip_image_url=lip_image_url,
        tongue_image_url=tongue_image_url,
    )
    db.session.add(vowel)
    db.session.flush()
    if stats:
        stats.increment("inserted_vowels")
    return vowel


@safe_db_op(default=None, error_message="Failed to insert word example")
def insert_word_example_if_not_exists(word_data: dict, vowel_id: str | None = None, stats: SeedingStats | None = None) -> WordExample | None:
    """Insert a WordExample only if it doesn't already exist (by word text)."""
    existing = WordExample.query.filter_by(word=word_data["word"]).first()
    if existing:
        if stats:
            stats.increment("skipped_words")
        return None

    word = WordExample(
        word=word_data["word"],
        ipa=word_data.get("ipa"),
        audio_url=word_data.get("audio_url", []),
        example_sentence=word_data.get("example_sentence"),
        vowel_id=vowel_id,
    )
    db.session.add(word)
    if stats:
        stats.increment("inserted_words")
    return word

def seed_vowel_with_examples(symbol: str, data: dict, stats: SeedingStats):
    vowel = insert_vowel_if_not_exists(data, stats)
    if not vowel:
        print(f"Skipping vowel '{symbol}' due to insert failure.")
        return

    for word_data in data.get("word_examples", []):
        insert_word_example_if_not_exists(word_data, vowel_id=vowel.id, stats=stats)


def validate_phoneme_data(phoneme_data: dict):
    if not isinstance(phoneme_data, dict):
        raise ValueError("Phoneme data must be a dictionary keyed by IPA symbol.")

    seen_words = set()
    required_vowel_fields = ["id", "ipa"]
    optional_str_fields = [
        "pronounced", "length", "lips", "tongue",
        "mouth_image_url", "lip_image_url", "tongue_image_url", "description"
    ]
    optional_list_fields = ["common_spellings", "audio_url"]

    for symbol, data in phoneme_data.items():
        if not isinstance(data, dict):
            raise ValueError(f"Entry for symbol '{symbol}' must be a dict.")

        # Validate required fields
        for field in required_vowel_fields:
            if field not in data or not isinstance(data[field], str):
                raise ValueError(f"Missing or invalid field '{field}' in vowel '{symbol}'")

        # Validate optional string fields
        for field in optional_str_fields:
            if field in data and not isinstance(data[field], str):
                raise ValueError(f"Field '{field}' in vowel '{symbol}' must be a string.")

        # Validate optional list fields
        for field in optional_list_fields:
            if field in data and not isinstance(data[field], list):
                raise ValueError(f"Field '{field}' in vowel '{symbol}' must be a list.")

        # Validate word examples
        if "word_examples" in data:
            if not isinstance(data["word_examples"], list):
                raise ValueError(f"'word_examples' for vowel '{symbol}' must be a list.")

            for word_data in data["word_examples"]:
                if not isinstance(word_data, dict):
                    raise ValueError(f"A word entry under vowel '{symbol}' is not a dict.")

                if "word" not in word_data or not isinstance(word_data["word"], str):
                    raise ValueError(f"Missing or invalid 'word' in one example under vowel '{symbol}'.")

                if word_data["word"] in seen_words:
                    raise ValueError(f"Duplicate word '{word_data['word']}' found under vowel '{symbol}'.")

                seen_words.add(word_data["word"])


def seed_all_phonemes_from_file(json_path: Path | str = "src/data/phonemes.json"):
    json_path = Path(json_path)
    if not json_path.exists():
        raise FileNotFoundError(f"Phoneme JSON file not found at: {json_path}")

    with json_path.open("r", encoding="utf-8") as f:
        phoneme_data = json.load(f)

    validate_phoneme_data(phoneme_data)

    stats = SeedingStats()

    for symbol, data in phoneme_data.items():
        try:
            seed_vowel_with_examples(symbol, data, stats)
        except Exception as e:
            print(f"Failed to seed vowel '{symbol}': {e}")

    db.session.commit()
    stats.log()


def check_word_vowel_relationship_integrity(verbose: bool = False, fail_fast: bool = False) -> bool:
    """
    Verify that every WordExample has a valid vowel relationship.
    Returns True if all are valid, False if any broken/missing links are found.
    If `fail_fast` is True, stops at the first issue.
    """
    broken = []

    for word in WordExample.query.all():
        if not word.vowel_id:
            msg = "Missing vowel_id"
        else:
            try:
                if word.vowel:
                    continue
                msg = f"No vowel relation for ID {word.vowel_id}"
            except DetachedInstanceError:
                msg = f"Detached relation for ID {word.vowel_id}"

        if verbose:
            print(f"   - '{word.word}': {msg}")
        if fail_fast:
            return False
        broken.append((word.word, msg))

    if broken:
        print(f"Found {len(broken)} WordExamples with invalid vowel links.")
        if verbose:
            for word, reason in broken:
                print(f"   - '{word}': {reason}")
        return False

    if verbose:
        print("All WordExamples have valid vowel relationships.")
    return True


@safe_db_op(default=None, error_message="Failed to insert minimal pair")
def insert_minimal_pair_if_not_exists(pair_data: dict, stats: SeedingStats | None = None) -> MinimalPair | None:
    exists = MinimalPair.query.filter_by(
        word_a=pair_data["word_a"],
        word_b=pair_data["word_b"]
    ).first()

    if exists:
        if stats:
            stats.increment("skipped_pairs")
        return None

    pair = MinimalPair(
        word_a=pair_data["word_a"],
        word_b=pair_data["word_b"],
        vowel_a=pair_data["vowel_a"],
        vowel_b=pair_data["vowel_b"],
        audio_a=pair_data.get("audio_a"),
        audio_b=pair_data.get("audio_b"),
        description=pair_data.get("description"),
        category=pair_data.get("category"),
    )

    db.session.add(pair)
    if stats:
        stats.increment("inserted_pairs")
    return pair


def validate_minimal_pair_data(data: list[dict]):
    """
    Validates the structure of minimal pair entries.

    Raises ValueError if:
    - The input is not a list of dictionaries
    - Required fields are missing or of the wrong type
    """
    if not isinstance(data, list):
        raise ValueError("Minimal pair data must be a list of dictionaries.")

    required_fields = ["word_a", "word_b", "vowel_a", "vowel_b"]

    seen_pairs = set()

    for entry in data:
        if not isinstance(entry, dict):
            raise ValueError(f"Each entry must be a dictionary. Found: {type(entry)}")

        for field in required_fields:
            if field not in entry:
                raise ValueError(f"Missing required field '{field}' in entry: {entry}")
            if not isinstance(entry[field], str):
                raise ValueError(f"Field '{field}' must be a string. Got: {type(entry[field])}")

        pair_key = tuple(sorted((entry["word_a"], entry["word_b"])))
        if pair_key in seen_pairs:
            raise ValueError(f"Duplicate minimal pair detected: {pair_key}")
        seen_pairs.add(pair_key)

        # Optional fields
        for optional_field in ["audio_a", "audio_b", "description", "category"]:
            if optional_field in entry and not isinstance(entry[optional_field], str):
                raise ValueError(
                    f"Optional field '{optional_field}' must be a string if present. Got: {type(entry[optional_field])}"
                )


def seed_minimal_pairs_from_file(json_path: Path | str = "src/data/minimal_pairs.json"):
    json_path = Path(json_path)
    if not json_path.exists():
        raise FileNotFoundError(f"Minimal pair JSON file not found at: {json_path}")

    with json_path.open("r", encoding="utf-8") as f:
        pair_data = json.load(f)

    validate_minimal_pair_data(pair_data)

    stats = SeedingStats()
    for entry in pair_data:
        insert_minimal_pair_if_not_exists(entry, stats=stats)

    db.session.commit()
    stats.log()


def check_minimal_pair_integrity(verbose: bool = False, fail_fast: bool = False) -> bool:
    """
    Check that all MinimalPair entries are logically valid:
    - word_a != word_b
    - vowel_a != vowel_b
    - no missing required fields
    """
    issues = []

    pairs = MinimalPair.query.all()
    for pair in pairs:
        if pair.word_a == pair.word_b:
            msg = f"Identical words: '{pair.word_a}' vs '{pair.word_b}'"
            if verbose:
                print(f"{msg}")
            if fail_fast:
                return False
            issues.append(msg)

        if pair.vowel_a == pair.vowel_b:
            msg = f"Identical vowels: '{pair.vowel_a}' in pair '{pair.word_a}' vs '{pair.word_b}'"
            if verbose:
                print(f"{msg}")
            if fail_fast:
                return False
            issues.append(msg)

        for field in ["word_a", "word_b", "vowel_a", "vowel_b"]:
            if not getattr(pair, field):
                msg = f"Missing field '{field}' in pair ID {pair.id}"
                if verbose:
                    print(f"{msg}")
                if fail_fast:
                    return False
                issues.append(msg)

    if issues:
        print(f"Found {len(issues)} issue(s) in minimal pair integrity.")
        return False

    if verbose:
        print("All MinimalPair entries passed integrity check.")
    return True
