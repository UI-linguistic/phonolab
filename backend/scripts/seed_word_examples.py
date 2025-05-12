# backend/scripts/seed_word_examples_dynamic.py
import os
from src.app import create_app, db
from src.models.phoneme import WordExample

app = create_app()


AUDIO_DIR = os.path.join(os.path.dirname(app.root_path), "static/audio/word_examples")


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


def parse_filename(filename):
    """
    Extracts the IPA and word from a filename like '13_æ_ref_cat.mp3'.
    Returns (ipa, word, vowel_id).
    """
    parts = filename.split("_")
    if len(parts) < 4:
        return None

    ipa = parts[1]
    word = parts[3].replace(".mp3", "")
    vowel_id = IPA_TO_VOWEL_ID.get(ipa, None)

    return ipa, word, vowel_id

with app.app_context():
    added = []
    skipped = []

    for file in os.listdir(AUDIO_DIR):
        if not file.endswith(".mp3"):
            continue

        try:
            parts = file.split("_")
            ipa = parts[1]
            word = parts[3].replace(".mp3", "")
            vowel_id = IPA_TO_VOWEL_ID.get(ipa)

            if not vowel_id:
                skipped.append((file, "Unmapped IPA"))
                continue

            exists = WordExample.query.filter_by(word=word, vowel_id=vowel_id).first()
            if exists:
                skipped.append((file, "Already exists"))
                continue

            word_example = WordExample(
                word=word,
                ipa=ipa,
                audio_url=f"/audio/word_examples/{file}",
                vowel_id=vowel_id
            )
            db.session.add(word_example)
            added.append(word)
        except Exception as e:
            skipped.append((file, str(e)))

    db.session.commit()

    print(f"-> Added {len(added)} entries:")
    for w in added:
        print(f"  - {w}")
    print(f"\n Skipped {len(skipped)} entries:")
    for f, reason in skipped:
        print(f"  - {f}: {reason}")

# with app.app_context():
#     added = 0
#     for fname in os.listdir(AUDIO_DIR):
#         if not fname.endswith(".mp3"):
#             continue

#         parsed = parse_filename(fname)
#         if not parsed:
#             print(f"⚠ Skipping malformed filename: {fname}")
#             continue

#         ipa, word, vowel_id = parsed
#         if not vowel_id:
#             print(f"⚠ Unknown IPA '{ipa}' in file {fname}")
#             continue

#         audio_url = f"/audio/word_examples/{fname}"
#         example = WordExample(
#             word=word,
#             ipa=ipa,
#             audio_url=audio_url,
#             example_sentence=f"Example using the word '{word}'.",
#             vowel_id=vowel_id
#         )
#         db.session.add(example)
#         added += 1

#     db.session.commit()
#     print(f" -> Seeded {added} word examples.")
