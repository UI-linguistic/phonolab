# scripts/seed_vowels.py
from src.app import create_app, db
from src.models.phoneme import Vowel

app = create_app()

vowel_data = [
    ("v1", "i", "i", "i", "1-i_close_front_unrounded_vowel.mp3"),
    ("v2", "ɪ", "ɪ", "ɪ", "2-ɪ_near-close_near-front_unrounded_vowel.mp3"),
    ("v3", "e", "e", "e", "3-e_close-mid_front_unrounded_vowel.mp3"),
    ("v4", "ɛ", "ɛ", "ɛ", "4-ɛ_near-close_near-front_unrounded_vowel.mp3"),
    ("v5", "æ", "æ", "æ", "5-æ_near-open_front_unrounded_vowel.mp3"),
    ("v6", "ɑ", "ɑ", "ɑ", "6-ɑ_open_back_unrounded_vowel.mp3"),
    ("v7", "ʌ", "ʌ", "ʌ", "7-ʌ_open-mid_back_unrounded_vowel.mp3"),
    ("v8", "ɔ", "ɔ", "ɔ", "8-ɔ_open-mid_back_rounded_vowel.mp3"),
    ("v9", "o", "o", "o", "9-o_close-mid_back_rounded_vowel.mp3"),
    ("v10", "u", "u", "u", "10-u_close_back_rounded_vowel.mp3"),
    ("v11", "ʊ", "ʊ", "ʊ", "11-ʊ_near-close_near-back_rounded_vowel.mp3"),
    ("v12", "ə", "ə", "ə", "12-ə_mid-central_vowel.mp3"),
]

with app.app_context():
    Vowel.query.delete()
    db.session.commit()

    for vid, phoneme, name, ipa, audio_file in vowel_data:
        if not Vowel.query.get(vid):
            vowel = Vowel(
                id=vid,
                phoneme=phoneme,
                name=name,
                ipa_example=ipa,
                color_code="#CCCCCC",
                audio_url=f"/audio/vowels/{audio_file}",
                description=f"Placeholder for {phoneme} vowel"
            )
            db.session.add(vowel)

    db.session.commit()
    print(" -> Seeded all 12 vowel entries.")
