# cli/phoneme.py

import argparse
from src.app import create_app, db
from src.models.phoneme import Vowel
from src.utils.format import success_response, error_response
from tabulate import tabulate
from cli.cli_runner import cli_runner


def main():
    parser = argparse.ArgumentParser(description="Manage vowel data")

    parser.add_argument("--seed", action="store_true", help="Seed the database with default vowels")
    parser.add_argument("--clear", action="store_true", help="Delete all vowels from the database")
    parser.add_argument("--list", action="store_true", help="List all vowels in the database")

    cli_runner(parser, async_main)


async def async_main(args, parser) -> int:
    if args.seed:
        return await handle_seed()
    elif args.clear:
        return await handle_clear()
    elif args.list:
        return await handle_list()

    parser.print_help()
    return 0


async def handle_seed():
    # TODO: load audio contents dinamically
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
        print(success_response("Seeded all 12 vowels."))
    return 0


async def handle_clear():
    app = create_app()
    with app.app_context():
        Vowel.query.delete()
        db.session.commit()
        print(success_response("All vowels deleted."))
    return 0


async def handle_list():
    app = create_app()
    with app.app_context():
        vowels = Vowel.query.all()
        if not vowels:
            print("No vowels in the database.")
            return 0

        table = [[v.id, v.phoneme, v.ipa_example, v.audio_url] for v in vowels]
        headers = ["ID", "Phoneme", "IPA", "Audio Path"]
        print(tabulate(table, headers=headers, tablefmt="grid"))
    return 0
