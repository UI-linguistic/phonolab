# src/database/phoneme.py
import os
import re
import json
from typing import Dict, List, Optional
from src.config import Config
from src.db import db
from models.phoneme import TrickyPair, Vowel, WordExample
from utils.error_handling import handle_db_operation


IPA_NORMALIZATION_MAP = {
    "iː": "i",
    "ɪ": "ɪ",
    "e": "e",
    "ɛ": "ɛ",
    "æ": "æ",
    "ə": "ə",
    "ʌ": "ʌ",
    "ɑ": "ɑ",
    "ɑː": "ɑ",
    "ɔ": "ɔ",
    "ɔː": "ɔ",
    "o": "o",
    "oʊ": "o",
    "ʊ": "ʊ",
    "u": "u",
    "uː": "u",
}

# IPA initials to vowel_id (e.g., "i" → "v1")
IPA_TO_VOWEL_ID = {
    "i": "v1",     # see, beat, team
    "ɪ": "v2",     # sit, bit, ship
    "e": "v3",     # say, rain, game
    "ɛ": "v4",     # bed, get, head
    "æ": "v5",     # cat, bat, ham
    "ə": "v12",    # the, to, alone
    "ʌ": "v7",     # strut, mud, cup
    "ɑ": "v6",     # spa, bra, car
    "ɔ": "v8",     # saw, law, paw
    "o": "v9",     # go, boat, show
    "ʊ": "v11",    # foot, book, could
    "u": "v10",    # boot, food, two
}

TONGUE_POSITION_GRID = {
    "i":  ["high", "front"],
    "ɪ":  ["high", "central"],
    "ʊ":  ["high", "back"],
    "u":  ["high", "back"],

    "e":  ["mid", "front"],
    "ɛ":  ["mid", "front"],
    "ʌ":  ["mid", "central"],
    "ə":  ["mid", "central"],
    "o":  ["mid", "back"],
    "ɔ":  ["mid", "back"],

    "æ":  ["low", "front"],
    "ɑ":  ["low", "back"],
}

LIP_SHAPE_MAP = {
    "i": "unrounded",
    "ɪ": "unrounded",
    "e": "unrounded",
    "ɛ": "unrounded",
    "æ": "unrounded",
    "ʌ": "unrounded",
    "ə": "unrounded",
    "ɑ": "unrounded",
    "u": "rounded",
    "ʊ": "rounded",
    "o": "rounded",
    "ɔ": "rounded"
}

LENGTH_MAP = {
    "i": "tense",
    "e": "tense",
    "u": "tense",
    "o": "tense",
    "ɪ": "lax",
    "ɛ": "lax",
    "ʊ": "lax",
    "ɔ": "lax",
    "æ": "neutral",
    "ɑ": "neutral",
    "ʌ": "neutral",
    "ə": "neutral"
}

def normalize_term(term: str) -> str:
    """
    Standardizes various descriptions for lips and tongue features into canonical terms.
    """
    term = term.lower().strip()

    replacements = {
        # Tongue height
        "close": "high",
        "near-close": "near high",
        "close-mid": "mid high",
        "mid": "mid",
        "centre": "mid",
        "center": "mid",
        "middle": "mid",
        "open-mid": "mid low",
        "near-open": "near low",
        "open": "low",

        # Tongue backness
        "front": "front",
        "near-front": "near front",
        "central": "central",
        "mid-central": "central",
        "back": "back",
        "near-back": "near back",

        # Lips
        "unrounded": "unrounded",
        "not rounded": "unrounded",
        "rounded": "rounded",
    }

    return replacements.get(term, term)


def get_tongue_and_lip_features(ipa: str = None, tongue_raw: list = None, lips_raw: str = None):
    """
    Derives the tongue and lip features either from IPA or raw descriptive terms.
    Priority is given to IPA if available and found in the grid.
    Prints any normalization changes for traceability.
    """
    tongue = []
    if ipa and ipa in TONGUE_POSITION_GRID:
        tongue = TONGUE_POSITION_GRID[ipa]
    elif tongue_raw:
        normalized = []
        for t in tongue_raw:
            clean = t.strip()
            norm = normalize_term(clean)
            if norm != clean:
                print(f"Normalized tongue term: '{clean}' → '{norm}'")
            normalized.append(norm)
        tongue = normalized

    lips = None
    if lips_raw:
        clean = lips_raw.strip()
        lips = normalize_term(clean)
        if lips != clean:
            print(f"Normalized lips term: '{clean}' → '{lips}'")

    return {
        "tongue": tongue,
        "lips": lips,
    }


def normalize_ipa(ipa: str) -> str:
    return IPA_NORMALIZATION_MAP.get(ipa, ipa)


def extract_vowel_info_mp3(filename: str) -> Optional[Dict]:
    """
    Extracts IPA, lips, tongue info, and id from a filename like:
    '11-ʊ_near-close_near-back_rounded_vowel.mp3'
    
    Returns a dict or None if invalid format.
    """
    filename = re.sub(r"\.mp3\.mp3$", ".mp3", filename)

    pattern = r"(\d+)-(.+?)_([a-z-]+)(?:_([a-z-]+))?(?:_([a-z]+))?_vowel\.mp3$"
    match = re.match(pattern, filename)

    if not match:
        return None

    num, ipa, height, backness, roundedness = match.groups()

    lips = [roundedness] if roundedness else []
    tongue = [height.replace("-", " ")] if height else []
    if backness:
        tongue.append(backness.replace("-", " "))

    return {
        "id": f"v{num}",
        "ipa": ipa,
        "lips": lips,
        "tongue": tongue,
        "audio_url": [f"/audio/vowels/{filename}"]
    }


def merge_with_lesson_json(phase_1_vowel_dict: dict, lesson_json_path: str) -> dict:
    """
    Merge additional vowel data from lesson.json into the existing dictionary and return the result.
    If an IPA from the lesson.json is not found in phase 1, create a minimal entry.
    Sort the final dictionary by the integer in the 'id' field (e.g., v1, v2, ..., v12).
    """
    with open(lesson_json_path, "r", encoding="utf-8") as f:
        lesson_data = json.load(f)

    for entry in lesson_data.get("lesson", []):
        raw_ipa = entry["target"].strip("/")
        ipa = normalize_ipa(raw_ipa)
        id_str = f"v{entry['id']}"

        # If IPA wasn't extracted from audio filenames, create fallback entry
        if ipa not in phase_1_vowel_dict:
            print(f"IPA {raw_ipa} not found in Phase 1 data — creating fallback entry.")
            phase_1_vowel_dict[ipa] = {
                "id": id_str,
                "ipa": ipa,
                "lips": [],
                "tongue": [],
                "audio_url": [entry.get("audio_url")] if entry.get("audio_url") else [],
                "length": None,
            }

        target = phase_1_vowel_dict[ipa]

        # Audio URL merging
        lesson_audio = entry.get("audio_url")
        if lesson_audio and lesson_audio not in target["audio_url"]:
            target["audio_url"].append(lesson_audio)

        # Normalize tongue/lips
        features = get_tongue_and_lip_features(
            ipa=ipa,
            tongue_raw=entry.get("tongue", "").split(","),
            lips_raw=entry.get("lips", "")
        )
        target["tongue"] = features["tongue"]
        target["lips"] = features["lips"]

        # Enforce canonical vowel length
        correct_length = LENGTH_MAP.get(ipa)
        if correct_length:
            if target.get("length") != correct_length:
                print(f"Fixing length for /{ipa}/ → {correct_length}")
            target["length"] = correct_length

        # Other enrichments
        target["pronounced"] = entry.get("pronounced")
        target["common_spellings"] = entry.get("common_spellings", [])
        target["example_words"] = entry.get("example_words", [])
        target["mouth_image_url"] = entry.get("mouth_image_url")

    # Sort by integer in "v1" -> 1, etc.
    sorted_dict = dict(
        sorted(phase_1_vowel_dict.items(), key=lambda item: int(item[1]["id"][1:]))
    )

    return sorted_dict


def extract_word_examples(audio_dir: str) -> Dict[str, List[dict]]:
    """
    Extract word examples from audio filenames in the directory.

    Returns a dictionary:
    {
        "v1": [
            {
                "word": "see",
                "ipa": "i",
                "audio_url": ["/audio/word_examples/01_i_ref_see.mp3"]
            },
            ...
        ],
        ...
    }
    """
    word_examples = {}

    for filename in os.listdir(audio_dir):
        if not filename.endswith(".mp3"):
            continue

        parts = filename.replace(".mp3", "").split("_")
        if len(parts) < 4:
            continue  # invalid format

        _, ipa, _, word = parts
        vowel_id = IPA_TO_VOWEL_ID.get(ipa)
        if not vowel_id:
            continue

        entry = {
            "word": word,
            "ipa": ipa,
            "audio_url": [f"/audio/word_examples/{filename}"]
        }

        if vowel_id not in word_examples:
            word_examples[vowel_id] = []

        word_examples[vowel_id].append(entry)

    return word_examples


def merge_word_examples_to_vowels(
    vowel_dict: Dict[str, dict],
    word_examples: Dict[str, List[dict]]
) -> None:
    """
    Transfers string-based example_words into detailed word_examples objects
    by matching vowel IDs from word_examples. Removes example_words field.

    This modifies vowel_dict in place.
    """
    for ipa, phoneme_data in vowel_dict.items():
        vowel_id = phoneme_data.get("id")
        phoneme_data["word_examples"] = []
        examples_from_audio = word_examples.get(vowel_id, [])
        example_word_texts = phoneme_data.get("example_words", [])

        for word_text in example_word_texts:
            matched = next(
                (ex for ex in examples_from_audio if ex["word"].lower() == word_text.lower()),
                None
            )
            if matched:
                if isinstance(matched["audio_url"], str):
                    matched["audio_url"] = [matched["audio_url"]]
                phoneme_data["word_examples"].append(matched)
            else:
                phoneme_data["word_examples"].append({
                    "word": word_text,
                    "ipa": ipa,
                    "audio_url": []
                })

        phoneme_data.pop("example_words", None)


# ===== Database Operations =====

@handle_db_operation("commit phonemes to database")
def commit_phonemes(
    audio_dir: str = None,
    vowel_json_path: str = None,
    word_audio_dir: str = None,
) -> Dict:
    """
    Commits vowels and word examples to the database using the full seeding pipeline.
    
    Args:
        audio_dir: Optional override for vowel audio directory
        vowel_json_path: Optional override for vowel JSON path
        word_audio_dir: Optional override for word examples audio directory
        
    Returns:
        Dictionary with summary of operations
    """
    # Use Config values with optional overrides
    audio_dir = audio_dir or Config.VOWEL_AUDIO_DIR
    vowel_json_path = vowel_json_path or Config.VOWEL_JSON_PATH
    word_audio_dir = word_audio_dir or Config.WORD_EX_AUDIO_DIR
    
    # Phase 1: Extract from audio files
    vowel_dict = {}
    for filename in os.listdir(audio_dir):
        if filename.endswith(".mp3"):
            info = extract_vowel_info_mp3(filename)
            if info:
                ipa = info["ipa"]
                vowel_dict[ipa] = info
    phase1_count = len(vowel_dict)
    
    # Phase 2: Merge lesson JSON
    vowel_dict = merge_with_lesson_json(vowel_dict, vowel_json_path)
    phase2_total = len(vowel_dict)
    
    # Phase 3: Extract word examples
    word_examples_dict = extract_word_examples(word_audio_dir)
    
    # Phase 4: Attach word examples to vowels
    merge_word_examples_to_vowels(vowel_dict, word_examples_dict)
    
    # Phase 5: Commit to database
    vowels_committed = 0
    examples_committed = 0
    
    for ipa, data in vowel_dict.items():
        vowel_obj = Vowel(
            id=data["id"],
            ipa=data["ipa"],
            lips=", ".join(data.get("lips", [])),
            tongue=", ".join(data.get("tongue", [])),
            pronounced=data.get("pronounced"),
            common_spellings=data.get("common_spellings", []),
            mouth_image_url=data.get("mouth_image_url"),
            audio_url=data.get("audio_url", [])
        )
        db.session.add(vowel_obj)
        db.session.commit()
        vowels_committed += 1
        
        word_examples = data.get("word_examples", [])
        for ex in word_examples:
            word_example_obj = WordExample(
                word=ex["word"],
                ipa=ex["ipa"],
                audio_url=ex["audio_url"],
                vowel_id=vowel_obj.id
            )
            db.session.add(word_example_obj)
            examples_committed += 1
        
        db.session.commit()
    
    return {
        "vowels_committed": vowels_committed,
        "examples_committed": examples_committed,
        "total_entries": phase2_total
    }


@handle_db_operation("load tricky pairs from JSON")
def load_tricky_pairs_from_json(json_path: str = None) -> List[TrickyPair]:
    """
    Load tricky pair data from JSON and return a list of TrickyPair objects.
    
    Args:
        json_path: Optional override for tricky pairs JSON path
    """
    json_path = json_path or Config.TRICKY_PAIRS_PATH
    tricky_pairs = []

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        pair = TrickyPair(
            word_a=item["word_a"],
            word_b=item["word_b"],
            vowel_a=item["vowel_a"],
            vowel_b=item["vowel_b"],
            audio_a=item.get("audio_a"),
            audio_b=item.get("audio_b"),
            description=item.get("description"),
            category=item.get("category"),
        )
        tricky_pairs.append(pair)

    return tricky_pairs

def sync_tricky_pair_audio_from_phoneme_json(
    tricky_pairs_list: List[TrickyPair],
    phoneme_json_path: str = None
) -> List[TrickyPair]:
    """
    For each tricky pair, verifies and replaces audio_a and audio_b fields
    using the canonical audio URLs from the phoneme JSON data.
    
    Args:
        tricky_pairs_list: List of TrickyPair objects to update
        phoneme_json_path: Optional override for phonemes JSON path
        
    Returns:
        The updated tricky_pairs_list
    """
    phoneme_json_path = phoneme_json_path or Config.PHONEMES_PATH
    
    with open(phoneme_json_path, "r", encoding="utf-8") as f:
        phoneme_data = json.load(f)

    word_to_audio_map = {}
    for phoneme in phoneme_data.values():
        for word_obj in phoneme.get("word_examples", []):
            word = word_obj.get("word", "").lower()
            audio_url = word_obj.get("audio_url")
            if word and audio_url:
                if isinstance(audio_url, list) and audio_url:
                    word_to_audio_map[word] = audio_url[0]
                elif isinstance(audio_url, str):
                    word_to_audio_map[word] = audio_url

    for pair in tricky_pairs_list:
        word_a = pair.word_a.lower()
        word_b = pair.word_b.lower()

        if word_a in word_to_audio_map:
            pair.audio_a = word_to_audio_map[word_a]
        if word_b in word_to_audio_map:
            pair.audio_b = word_to_audio_map[word_b]

    return tricky_pairs_list

@handle_db_operation("commit tricky pairs to database")
def commit_pairs(pairs_list: List[TrickyPair] = None) -> Dict:
    """
    Commits a list of TrickyPair objects to the database.
    If no list is provided, loads from the default JSON file.
    
    Args:
        pairs_list: Optional list of TrickyPair objects
        
    Returns:
        Dictionary with summary of operations
    """
    if pairs_list is None:
        pairs_list = load_tricky_pairs_from_json()
        pairs_list = sync_tricky_pair_audio_from_phoneme_json(pairs_list)
    
    pairs_committed = 0
    
    for pair in pairs_list:
        exists = TrickyPair.query.filter_by(word_a=pair.word_a, word_b=pair.word_b).first()
        if exists:
            continue

        db.session.add(pair)
        pairs_committed += 1
    
    db.session.commit()
    
    return {
        "pairs_committed": pairs_committed,
        "total_pairs": len(pairs_list)
    }

def get_vowel_by_id(vowel_id: str) -> Optional[Vowel]:
    """
    Retrieve a vowel by its ID.
    
    Args:
        vowel_id: The ID of the vowel to retrieve (e.g., "v1")
        
    Returns:
        The Vowel object or None if not found
    """
    return Vowel.query.filter_by(id=vowel_id).first()

def get_vowel_by_ipa(ipa: str) -> Optional[Vowel]:
    """
    Retrieve a vowel by its IPA symbol.
    
    Args:
        ipa: The IPA symbol of the vowel to retrieve (e.g., "i")
        
    Returns:
        The Vowel object or None if not found
    """
    return Vowel.query.filter_by(ipa=ipa).first()

def get_all_vowels() -> List[Vowel]:
    """
    Retrieve all vowels from the database.
    
    Returns:
        List of all Vowel objects
    """
    return Vowel.query.all()

def get_word_examples_for_vowel(vowel_id: str) -> List[WordExample]:
    """
    Retrieve all word examples for a specific vowel.
    
    Args:
        vowel_id: The ID of the vowel (e.g., "v1")
        
    Returns:
        List of WordExample objects
    """
    return WordExample.query.filter_by(vowel_id=vowel_id).all()

def get_tricky_pairs_by_vowel(vowel_ipa: str) -> List[TrickyPair]:
    """
    Retrieve all tricky pairs that involve a specific vowel.
    
    Args:
        vowel_ipa: The IPA symbol of the vowel (e.g., "i")
        
    Returns:
        List of TrickyPair objects
    """
    return TrickyPair.query.filter(
        (TrickyPair.vowel_a == vowel_ipa) | (TrickyPair.vowel_b == vowel_ipa)
    ).all()
