
# backend/scripts/seed_data.py

from collections import namedtuple
import os
from pathlib import Path
import re
from typing import Dict, List

from colorama import Fore, Style
from models.lesson import LessonMode, VowelLesson
from models.phoneme import TrickyPair, Vowel, WordExample
from src.app import create_app
import json
from src.db import db

app = create_app()

VOWEL_AUDIO_DIR = os.path.join(os.path.dirname(app.root_path), "static/audio/vowels")
WORD_EX_AUDIO_DIR = os.path.join(os.path.dirname(app.root_path), "static/audio/word_examples")
VOWEL_JSON_PATH = os.path.join(os.path.dirname(app.root_path), "src", "data", "lesson.json")
TRICKY_PAIRS_PATH = os.path.join(os.path.dirname(app.root_path), "src", "data", "tricky_pairs.json")
PHONEMES_PATH = os.path.join(os.path.dirname(app.root_path), "src", "data", "phonemes.json")
DATA_DIR = PATH = os.path.join(os.path.dirname(app.root_path), "src", "data")

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

# IPA initialsto vowel_id (e.g., "i" → "v1")
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


def normalize_ipa(ipa: str) -> str:
    return IPA_NORMALIZATION_MAP.get(ipa, ipa)


def print_vowel_dictionary_colored(vowel_dict: dict) -> None:
    """
    Prints the vowel dictionary with color formatting to highlight each phoneme object and its contents.
    """
    for ipa, info in vowel_dict.items():
        print(f"{Fore.CYAN + Style.BRIGHT}🧩 Phoneme Object — /{ipa}/")
        print(f"  {Fore.YELLOW}ID: {Style.RESET_ALL}{info.get('id')}")
        
        print(f"  {Fore.YELLOW}Audio URLs:")
        for url in info.get("audio_url", []):
            print(f"    {Fore.GREEN}- {url}")

        print(f"  {Fore.YELLOW}Lips: {Style.RESET_ALL}{', '.join(info.get('lips', []))}")
        print(f"  {Fore.YELLOW}Tongue: {Style.RESET_ALL}{', '.join(info.get('tongue', []))}")
        print(f"  {Fore.YELLOW}Pronounced: {Style.RESET_ALL}{info.get('pronounced', '—')}")
        print(f"  {Fore.YELLOW}Common Spellings: {Style.RESET_ALL}{', '.join(info.get('common_spellings', []))}")
        print(f"  {Fore.YELLOW}Example Words:")

        for word in info.get("example_words", []):
            print(f"    {Fore.MAGENTA}- {word}")

        print(f"  {Fore.YELLOW}Mouth Image URL: {Style.RESET_ALL}{info.get('mouth_image_url', '—')}")
        print(f"{Fore.LIGHTBLACK_EX}{'-' * 60}{Style.RESET_ALL}")


def print_word_examples_dict(word_examples: dict) -> None:
    """
    Pretty prints the word examples dictionary.
    Each vowel ID section is printed with its word examples.
    """
    print(Fore.CYAN + "\n📚 Word Examples by Vowel ID:" + Style.RESET_ALL)

    for vowel_id in sorted(word_examples.keys(), key=lambda k: int(k[1:])):  # sort by v<number>
        print(Fore.MAGENTA + f"\n🔠 Vowel ID: {vowel_id}" + Style.RESET_ALL)

        for example in word_examples[vowel_id]:
            print(f"  {Fore.YELLOW}- Word: {example['word']}{Style.RESET_ALL}")
            print(f"    IPA: {example['ipa']}")
            print(f"    Audio: {example['audio_url']}")

    print(Fore.GREEN + "\n✅ Finished printing word examples.\n" + Style.RESET_ALL)


def print_vowel_with_word_examples(vowel_dict: dict):
    for ipa, data in vowel_dict.items():
        print(f"{Fore.CYAN}🧩 Phoneme Object — /{ipa}/")
        print(f"{Style.RESET_ALL}  ID: {data['id']}")
        
        print("  Audio URLs:")
        for url in data.get("audio_url", []):
            print(f"    - {url}")

        print("  Lips:", ", ".join(data.get("lips", [])))
        print("  Tongue:", ", ".join(data.get("tongue", [])))
        print("  Pronounced:", data.get("pronounced", "—"))
        print("  Common Spellings:", ", ".join(data.get("common_spellings", [])))
        print("  Example Words:")
        for word in data.get("example_words", []):
            print(f"    - {word}")
        print("  Mouth Image URL:", data.get("mouth_image_url", "—"))

        # Word examples (Phase 3 results)
        examples = data.get("word_examples", [])
        if examples:
            print(f"  {Fore.YELLOW}Word Examples:")
            for ex in examples:
                print(f"    - {ex['word']} ({ex['ipa']}) → {ex['audio_url'][0]}")
        print(Style.RESET_ALL + "-" * 60)


def print_extended_vowel_dictionary(vowel_dict: dict) -> None:
    """
    Prints the enriched vowel dictionary, including nested word examples.
    """
    for ipa, data in vowel_dict.items():
        print(f"{Fore.MAGENTA}🧩 Phoneme Object — /{ipa}/")
        print(f"{Fore.CYAN}  ID: {data['id']}")
        print(f"{Fore.YELLOW}  Audio URLs:")
        for url in data.get("audio_url", []):
            print(f"    - {url}")
        print(f"{Fore.GREEN}  Lips: {', '.join(data.get('lips', []))}")
        print(f"{Fore.BLUE}  Tongue: {', '.join(data.get('tongue', []))}")
        print(f"{Fore.LIGHTCYAN_EX}  Pronounced: {data.get('pronounced', '—')}")
        print(f"{Fore.LIGHTGREEN_EX}  Common Spellings: {', '.join(data.get('common_spellings', []))}")
        print(f"{Fore.LIGHTYELLOW_EX}  Mouth Image URL: {data.get('mouth_image_url', '—')}")

        if "word_examples" in data:
            print(f"{Fore.LIGHTMAGENTA_EX}  Word Examples:")
            for example in data["word_examples"]:
                print(f"    - Word: {example.get('word', '—')}")
                print(f"      IPA: {example.get('ipa', '—')}")
                audio_urls = example.get("audio_url")
                if isinstance(audio_urls, list):
                    for url in audio_urls:
                        print(f"      Audio URL: {url}")
                elif isinstance(audio_urls, str):
                    print(f"      Audio URL: {audio_urls}")
        print(f"{Style.RESET_ALL}{'-'*60}")

def print_tricky_pairs_dict(pairs: list) -> None:
    """
    Print a list of tricky vowel pairs in a readable format.
    """
    print(f"{Fore.MAGENTA}📂 Tricky Vowel Pairs:")
    for idx, pair in enumerate(pairs, start=1):
        print(f"{Fore.CYAN}#{idx}")
        print(f"{Fore.YELLOW}  Word A: {pair.word_a} ({pair.vowel_a})")
        print(f"{Fore.YELLOW}  Audio A: {pair.audio_a or '—'}")
        print(f"{Fore.GREEN}  Word B: {pair.word_b} ({pair.vowel_b})")
        print(f"{Fore.GREEN}  Audio B: {pair.audio_b or '—'}")
        print(f"{Fore.LIGHTMAGENTA_EX}  Description: {pair.description or '—'}")
        print(f"{Fore.LIGHTBLUE_EX}  Category: {pair.category or '—'}")
        print(f"{Style.RESET_ALL}{'-'*60}")
    print(f"{Fore.CYAN}✅ Total tricky pairs: {len(pairs)}{Style.RESET_ALL}\n")


# === Phase 1: Extract IPA, lips, tongue from filenames ===
def extract_vowel_info_mp3(filename):
    """
    Extracts IPA, lips, tongue info, and id from a filename like:
    '11-ʊ_near-close_near-back_rounded_vowel.mp3' or even minimal '12-ə_mid-central_vowel.mp3'

    Returns a dict or None if invalid format.
    """
    filename = re.sub(r"\.mp3\.mp3$", ".mp3", filename)

    pattern = r"(\d+)-(.+?)_([a-z-]+)(?:_([a-z-]+))?(?:_([a-z]+))?_vowel\.mp3$"
    match = re.match(pattern, filename)

    if not match:
        print(f"⚠️ Skipped {filename}: invalid format")
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


# === Phase 2: Extract remaining phoneme field from json ===
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


# def get_tongue_and_lip_features(ipa: str = None, tongue_raw: list[str] = None, lips_raw: str = None):
#     """
#     Derives the tongue and lip features either from IPA or raw descriptive terms.
#     Priority is given to IPA if available and found in the grid.
#     """

#     tongue = []
#     if ipa and ipa in TONGUE_POSITION_GRID:
#         tongue = TONGUE_POSITION_GRID[ipa]
#     elif tongue_raw:
#         tongue = [normalize_term(t) for t in tongue_raw if t.strip()]

#     lips = normalize_term(lips_raw) if lips_raw else None

#     return {
#         "tongue": tongue,
#         "lips": lips,
#     }
def get_tongue_and_lip_features(ipa: str = None, tongue_raw: list[str] = None, lips_raw: str = None):
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
                print(f"🔁 Normalized tongue term: '{clean}' → '{norm}'")
            normalized.append(norm)
        tongue = normalized

    lips = None
    if lips_raw:
        clean = lips_raw.strip()
        lips = normalize_term(clean)
        if lips != clean:
            print(f"🔁 Normalized lips term: '{clean}' → '{lips}'")

    return {
        "tongue": tongue,
        "lips": lips,
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
            print(f"⚠️ IPA {raw_ipa} not found in Phase 1 data — creating fallback entry.")
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
                print(f"🔁 Fixing length for /{ipa}/ → {correct_length}")
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


# === Phase 3 ===
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


# === Phase 4 ===
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


# === Phase 5 ===
def export_vowel_dict_to_json(vowel_dict: dict, base_data_dir: str) -> None:
    """
    Exports the final vowel dictionary to phonemes.json in the given base data directory.

    Parameters:
        vowel_dict (dict): The enriched vowel dictionary.
        base_data_dir (str): The directory where the output file will be stored.
    """
    output_path = os.path.join(base_data_dir, "phonemes.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(vowel_dict, f, ensure_ascii=False, indent=2)

    print(f"\n📝 Phase 5 complete — dictionary exported to {output_path}")


def build_phoneme_schemas(
    audio_dir: str = VOWEL_AUDIO_DIR,
    vowel_json_path: str = VOWEL_JSON_PATH,
    word_audio_dir: str = WORD_EX_AUDIO_DIR
) -> dict:
    """
    Runs Phases 1–5: extract vowel info, merge lesson JSON, extract word examples,
    attach them to vowels, and export the final dictionary to phonemes.json.

    Returns the final vowel dictionary.
    """
    print("🔍 PHASE 1: Extract from audio files...")
    vowel_dict = {}
    for filename in os.listdir(audio_dir):
        if filename.endswith(".mp3"):
            info = extract_vowel_info_mp3(filename)
            if info:
                ipa = info["ipa"]
                vowel_dict[ipa] = info
            else:
                print(f"⚠️ Skipped {filename}: invalid format")
    phase1_count = len(vowel_dict)
    print(f"\n✅ Phase 1 complete — extracted {phase1_count} vowel entries.\n")

    print("\n🔄 PHASE 2: Merge lesson JSON...")
    vowel_dict = merge_with_lesson_json(vowel_dict, vowel_json_path)
    phase2_total = len(vowel_dict)
    phase2_added = phase2_total - phase1_count
    print(f"\n✅ Phase 2 complete — added {phase2_added} new entries from lesson.json.")
    print(f"\n📊 Total vowel entries after merge: {phase2_total}\n")

    print("\n📦 FINAL Merged Vowel Dictionary:")
    print_vowel_dictionary_colored(vowel_dict)

    print("\n🎧 PHASE 3: Extract word examples...")
    word_examples_dict = extract_word_examples(word_audio_dir)
    print_word_examples_dict(word_examples_dict)

    print("\n📥 PHASE 4: Attach word examples to vowels...")
    merge_word_examples_to_vowels(vowel_dict, word_examples_dict)

    print("\n📦 FINAL Merged Vowel Dictionary:")
    print_extended_vowel_dictionary(vowel_dict)

    print("\n📝 PHASE 5: Export to JSON...")
    export_vowel_dict_to_json(vowel_dict, base_data_dir=os.path.dirname(vowel_json_path))

    return vowel_dict


def commit_phonemes(
    audio_dir: str = VOWEL_AUDIO_DIR,
    vowel_json_path: str = VOWEL_JSON_PATH,
    word_audio_dir: str = WORD_EX_AUDIO_DIR,
) -> None:
    """
    Commits vowels and word examples to the database using the full seeding pipeline (Phases 1–4).
    Skips JSON export. Commits data directly and prints each entry after insertion.
    """

    print("🔍 PHASE 1: Extract from audio files...")
    vowel_dict = {}
    for filename in os.listdir(audio_dir):
        if filename.endswith(".mp3"):
            info = extract_vowel_info_mp3(filename)
            if info:
                ipa = info["ipa"]
                vowel_dict[ipa] = info
            else:
                print(f"⚠️ Skipped {filename}: invalid format")
    phase1_count = len(vowel_dict)
    print(f"\n✅ Phase 1 complete — extracted {phase1_count} vowel entries.\n")

    print("\n🔄 PHASE 2: Merge lesson JSON...")
    vowel_dict = merge_with_lesson_json(vowel_dict, vowel_json_path)
    phase2_total = len(vowel_dict)
    phase2_added = phase2_total - phase1_count
    print(f"\n✅ Phase 2 complete — added {phase2_added} new entries from lesson.json.")
    print(f"\n📊 Total vowel entries after merge: {phase2_total}\n")

    print("\n🎧 PHASE 3: Extract word examples...")
    word_examples_dict = extract_word_examples(word_audio_dir)

    print("\n📥 PHASE 4: Attach word examples to vowels...")
    merge_word_examples_to_vowels(vowel_dict, word_examples_dict)

    print("\n🧱 PHASE 6: Commit to database...")
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
        print(f"✅ Committed Vowel: /{data['ipa']}/ ({data['id']})")

        for ex in data.get("word_examples", []):
            word_example_obj = WordExample(
                word=ex["word"],
                ipa=ex["ipa"],
                audio_url=ex["audio_url"],
                vowel_id=vowel_obj.id
            )
            db.session.add(word_example_obj)
        db.session.commit()
        print(f"   ↪️  {len(data.get('word_examples', []))} word examples committed for /{data['ipa']}/")

    print("\n✅ All vowels and word examples committed.")



def load_tricky_pairs_from_json(json_path: str) -> list[TrickyPair]:
    """
    Load tricky pair data from JSON and return a list of TrickyPair objects.
    """
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
    tricky_pairs_list: list,
    phoneme_json_path: str
) -> list:
    """
    For each tricky pair, verifies and replaces audio_a and audio_b fields
    using the canonical audio URLs from the phoneme JSON data.

    Returns the updated tricky_pairs_list.
    """
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

def export_tricky_pairs_to_json(
    tricky_pairs: List[TrickyPair], output_path: str
) -> None:
    """
    Exports the tricky pairs list into a JSON file at the specified path.
    Only includes essential fields in export schema.
    """
    data = []
    for pair in tricky_pairs:
        data.append({
            "word_a": pair.word_a,
            "word_b": pair.word_b,
            "vowel_a": pair.vowel_a,
            "vowel_b": pair.vowel_b,
            "audio_a": pair.audio_a,
            "audio_b": pair.audio_b,
            "description": pair.description,
            "category": pair.category,
        })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n📤 Exported minimal pairs to: {output_path}")


def build_pairs_schema(json_path: str, phoneme_path: str) -> List[Dict]:
    tricky_pairs_dict = load_tricky_pairs_from_json(json_path)
    synced_pairs = sync_tricky_pair_audio_from_phoneme_json(tricky_pairs_dict, phoneme_path)

    print("\n🔗 Synced tricky pair audio with phoneme examples.")
    export_tricky_pairs_to_json(
        synced_pairs,
        output_path=os.path.join(os.path.dirname(json_path), "minimal_pairs.json")
    )
    print_tricky_pairs_dict(synced_pairs)


def commit_pairs(pairs_list: List[TrickyPair]) -> None:
    """
    Commits a list of TrickyPair objects to the database.

    Parameters:
        pairs_list (List[TrickyPair]): List of tricky pair objects (not yet committed).
    """
    print("\n🧱 Committing tricky vowel pairs to the database...")

    for pair in pairs_list:
        # Check if the pair already exists (optional: avoids duplicates if rerun)
        exists = TrickyPair.query.filter_by(word_a=pair.word_a, word_b=pair.word_b).first()
        if exists:
            print(f"⚠️ Pair already exists: {pair.word_a} vs {pair.word_b} — skipping.")
            continue

        db.session.add(pair)
        db.session.commit()
        print(f"✅ Committed Tricky Pair: {pair.word_a} ({pair.vowel_a}) vs {pair.word_b} ({pair.vowel_b})")



def seed_vowels(
    audio_dir: str = VOWEL_AUDIO_DIR,
    vowel_json_path: str = VOWEL_JSON_PATH,
    word_audio_dir: str = WORD_EX_AUDIO_DIR
) -> None:
    """
    Calls the full vowel seeding pipeline that extracts, merges, attaches,
    and commits phoneme and word example data to the database.
    """
    commit_phonemes(
        audio_dir=audio_dir,
        vowel_json_path=vowel_json_path,
        word_audio_dir=word_audio_dir
    )


def seed_tricky_pairs(
    json_path: str = TRICKY_PAIRS_PATH,
    phoneme_path: str = PHONEMES_PATH
) -> None:
    """
    Loads tricky pair data from a JSON file, syncs it with phoneme audio data from phonemes.json,
    and commits it to the database.
    """
    tricky_pairs_list = load_tricky_pairs_from_json(json_path)
    synced_pairs = sync_tricky_pair_audio_from_phoneme_json(tricky_pairs_list, phoneme_path)

    print("\n🔗 Synced tricky pair audio with phoneme examples.")
    commit_pairs(synced_pairs)
    

#
# LESSON MODES
#

def commit_lesson_mode(map_variable: tuple[str, str, str]) -> LessonMode:
    name, slug, description = map_variable
    mode = LessonMode(name=name, slug=slug, description=description)
    db.session.add(mode)
    db.session.commit()
    print(f"🆕 Lesson Mode committed: {name} ({slug})")
    return mode

def lesson_mode_exists(slug_or_name: str) -> bool:
    return db.session.query(
        LessonMode.query.filter(
            (LessonMode.slug == slug_or_name) | (LessonMode.name == slug_or_name)
        ).exists()
    ).scalar()


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

LIP_SHAPE_GRID_LAYOUT = [
    ["i", "ɪ", "e", "ɛ"],
    ["æ", "ɑ", "ə", "ʌ"],
    ["ɔ", "o", "ʊ", "u"]
]

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


def export_preview_to_file(data: dict, slug: str, folder: str):
    """
    Saves a lesson preview to a JSON file under a given folder using the slug as filename.
    """
    os.makedirs(folder, exist_ok=True)
    filename = os.path.join(folder, f"{slug}_preview.json")
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"💾 Saved preview to: {filename}")
    


def preview_vowels_101_lesson(map_variable):
    """
    Simulates seeding the Vowels 101 lesson mode by printing out the structure.
    No database actions are performed.
    """
    name = map_variable.name
    slug = map_variable.slug

    # Simulate build
    print(f"🔧 Building lesson content for: {name} ({slug})\n")
    content = build_vowels_101_lesson_mode(map_variable)

    lesson_preview = {
        "title": name,
        "description": "Learn how vowels are categorized by tongue position, lip shape, and length.",
        "lesson_mode_slug": slug,
        "content": content,
        "type": "vowel_lesson"
    }

    print("📦 VowelLesson JSON Preview:\n")
    print(json.dumps(lesson_preview, indent=2, ensure_ascii=False))

    # Save to JSON file
    export_preview_to_file(lesson_preview, slug, DATA_DIR)

    print("\n✅ Preview complete — lesson not committed.\n")


def seed_vowels_101_lesson(map_variable: tuple[str, str, str]) -> LessonMode:
    """
    Seeds the Vowels 101 lesson mode and its associated VowelLesson.
    Commits to the database only if not already present.
    """
    name, slug, _ = map_variable

    # Check or commit the mode
    if lesson_mode_exists(slug):
        mode = LessonMode.query.filter(
            (LessonMode.slug == slug) | (LessonMode.name == name)
        ).first()
        print(f"🔁 Lesson mode already exists: {slug}")
    else:
        mode = commit_lesson_mode(map_variable)

    # Prevent duplicate lesson creation
    existing_lesson = VowelLesson.query.filter_by(lesson_mode_id=mode.id).first()
    if existing_lesson:
        print(f"⚠️ A VowelLesson already exists for mode '{slug}' — skipping.")
        return mode

    # Build and commit lesson
    content = build_vowels_101_lesson_mode(map_variable)
    lesson = VowelLesson(
        title="Vowels 101",
        description="Learn how vowels are categorized by tongue position, lip shape, and length.",
        lesson_mode_id=mode.id,
        content=content
    )
    db.session.add(lesson)
    db.session.commit()
    print(f"✅ VowelLesson created for mode: {slug}")

    return mode
    

def seed_map_vowel_space_lesson():
    pass

def seed_get_your_graphenes_right_lesson():
    pass

def seed_tackle_tricky_pairs_lesson(): 
    pass


#
# QUIZ MODES
#
def seed_vowel_shuffle_quiz():
    pass

def seed_spell_and_tell_quiz():
    pass

def seed_pair_play_quiz():
    pass

def seed_phonic_trio_quiz():
    pass



def run_all_seeds():
    with app.app_context():
        # print(f"{Fore.CYAN}Seeding vowels and word examples...{Style.RESET_ALL}")

        # seed_vowels(
        #     vowel_json_path=VOWEL_JSON_PATH,
        #     audio_dir=VOWEL_AUDIO_DIR,
        # )

        # print(f"{Fore.CYAN}Seeding tricky vowel pairs...{Style.RESET_ALL}")
        # seed_tricky_pairs(json_path=TRICKY_PAIRS_PATH, phoneme_path=PHONEMES_PATH)

        print(f"{Fore.MAGENTA}📦 Previewing Vowels 101 lesson...{Style.RESET_ALL}")
        seed_vowels_101_lesson(LESSON_MODE_MAP["VOWELS_101"])

        print("✅ All seeding operations completed.")

if __name__ == "__main__":
    run_all_seeds()
