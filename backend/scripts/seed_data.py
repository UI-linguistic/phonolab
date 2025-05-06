
# backend/scripts/seed_data.py

import os
from pathlib import Path
import re
from typing import Dict, List

from colorama import Fore, Style
from models.phoneme import TrickyPair
from src.app import create_app
import json

app = create_app()

VOWEL_AUDIO_DIR = os.path.join(os.path.dirname(app.root_path), "static/audio/vowels")
WORD_EX_AUDIO_DIR = os.path.join(os.path.dirname(app.root_path), "static/audio/word_examples")
VOWEL_JSON_PATH = os.path.join(os.path.dirname(app.root_path), "src", "data", "lesson.json")
TRICKY_PAIRS_PATH = os.path.join(os.path.dirname(app.root_path), "src", "data", "tricky_pairs.json")
PHONEMES_PATH = os.path.join(os.path.dirname(app.root_path), "src", "data", "phonemes.json")

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

    return replacements.get(term, term)  # fallback to original if not found


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

        if ipa not in phase_1_vowel_dict:
            print(f"⚠️ IPA {raw_ipa} not found in Phase 1 data — creating fallback entry.")
            phase_1_vowel_dict[ipa] = {
                "id": id_str,
                "ipa": ipa,
                "lips": [],
                "tongue": [],
                "audio_url": [entry.get("audio_url")] if entry.get("audio_url") else [],
            }

        target = phase_1_vowel_dict[ipa]

        lesson_audio = entry.get("audio_url")
        if lesson_audio and lesson_audio not in target["audio_url"]:
            target["audio_url"].append(lesson_audio)

        lesson_lips = [normalize_term(s.strip()) for s in entry.get("lips", "").split(",") if s.strip()]
        for val in lesson_lips:
            if val not in target["lips"]:
                target["lips"].append(val)

        lesson_tongue = [normalize_term(s.strip()) for s in entry.get("tongue", "").split(",") if s.strip()]
        for val in lesson_tongue:
            if val not in target["tongue"]:
                target["tongue"].append(val)

        target["pronounced"] = entry.get("pronounced")
        target["common_spellings"] = entry.get("common_spellings", [])
        target["example_words"] = entry.get("example_words", [])
        target["mouth_image_url"] = entry.get("mouth_image_url")

    # Sort by integer value of the "id" field (v1 → 1, v2 → 2, ...)
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


def seed_vowels(audio_dir: str = VOWEL_AUDIO_DIR, 
                vowel_json_path: str = VOWEL_JSON_PATH,
                word_audio_dir: str = WORD_EX_AUDIO_DIR) -> None:
    """
    Runs Phase 1–3: extracts vowel info, merges lesson JSON, extracts word examples,
    and prints the combined result without saving to the database.
    """
    


def seed_tricky_pairs(
    json_path: str = TRICKY_PAIRS_PATH,
    phoneme_path: str = PHONEMES_PATH
) -> None:
    """
    Loads tricky pair data from a JSON file, syncs it with phoneme audio data from phonemes.json,
    and prints the result for inspection. No DB commit is made.

    Returns:
        dict[int, dict]: Index-keyed tricky pair objects as dictionaries
    """
    tricky_pairs_dict = load_tricky_pairs_from_json(json_path)
    synced_pairs = sync_tricky_pair_audio_from_phoneme_json(tricky_pairs_dict, phoneme_path)

    print("\n🔗 Synced tricky pair audio with phoneme examples.")
    export_tricky_pairs_to_json(
        synced_pairs,
        output_path=os.path.join(os.path.dirname(json_path), "minimal_pairs.json")
    )
    print_tricky_pairs_dict(synced_pairs)


def seed_phonic_trio_quiz(quiz_json_path: str) -> None:
    """Seed PhonicTrioQuiz from quiz.json"""
    # from src.models.quiz import QuizMode, PhonicTrioQuiz, PhonicTrioOption
    # from src.db import db

    # with open(quiz_json_path, "r", encoding="utf-8") as f:
    #     data = json.load(f)

    # if "quiz" not in data:
    #     print("⚠️ No 'quiz' key found in JSON.")
    #     return

    # # Ensure the quiz mode exists
    # mode = QuizMode.query.filter_by(name="phonic_trio").first()
    # if not mode:
    #     mode = QuizMode(name="phonic_trio", description="Pick 3 words with the same vowel")
    #     db.session.add(mode)
    #     db.session.commit()
    #     print("✅ Created 'phonic_trio' quiz mode.")

    # added_quizzes = 0
    # added_options = 0

    # for item in data["quiz"]:
    #     entry_id = item.get("id")
    #     existing = PhonicTrioQuiz.query.filter_by(source_id=entry_id).first()
    #     if existing:
    #         continue

    #     # Save only the first sample as primary prompt for now
    #     main_sample = item["samples"][0]
    #     prompt_samples = item["samples"]  # Save all for the field

    #     quiz = PhonicTrioQuiz(
    #         source_id=entry_id,
    #         prompt_word=main_sample["text"],
    #         prompt_ipa=main_sample["IPA"],
    #         prompt_audio_url=main_sample["audio"],
    #         prompt_samples=prompt_samples,  # list of dicts
    #         quiz_mode_id=mode.id
    #     )

    #     # Correct options
    #     for opt in item["options_pool"].get("correct_answers", []):
    #         option = PhonicTrioOption(
    #             word=opt["word"],
    #             ipa=opt["IPA"],
    #             audio_url=opt["audio"],
    #             is_correct=True,
    #             language=opt.get("language")
    #         )
    #         quiz.options.append(option)
    #         added_options += 1

    #     # Wrong options
    #     for opt in item["options_pool"].get("wrong_answers", []):
    #         option = PhonicTrioOption(
    #             word=opt["word"],
    #             ipa=opt["IPA"],
    #             audio_url=opt["audio"],
    #             is_correct=False,
    #             language=opt.get("language")
    #         )
    #         quiz.options.append(option)
    #         added_options += 1

    #     db.session.add(quiz)
    #     added_quizzes += 1

    # db.session.commit()
    # print(f"✅ Added {added_quizzes} PhonicTrioQuiz items with {added_options} options.")
    pass


def run_all_seeds():
    with app.app_context():
        print(f"{Fore.CYAN}Seeding vowels and word examples...{Style.RESET_ALL}")

        seed_vowels(
            vowel_json_path=VOWEL_JSON_PATH,
            audio_dir=VOWEL_AUDIO_DIR,
        )

        print(f"{Fore.CYAN}Seeding tricky vowel pairs...{Style.RESET_ALL}")
        seed_tricky_pairs(json_path=TRICKY_PAIRS_PATH, phoneme_path=PHONEMES_PATH)

        # print("Seeding Phonic Trio quiz...")
        # seed_phonic_trio_quiz(str(base_path / "src" / "data" / "quiz.json"))

        print("✅ All seeding operations completed.")

if __name__ == "__main__":
    run_all_seeds()
