import argparse
import os
from pathlib import Path

from cli.cli_runner import cli_runner
from src.app import create_app
from src.database.phoneme import seed_all_phonemes_from_file
from src.utils.cli_format import success_response, error_response
from src.database.phoneme import check_word_vowel_relationship_integrity


def main():
    parser = argparse.ArgumentParser(
        description="Database seeding and maintenance CLI",
        epilog="Examples:\n"
               "  database seed                                # Seed using default JSON\n"
               "  database seed --json src/data/phonemes.json  # Seed with custom path\n",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    subparsers = parser.add_subparsers(
        dest="command",
        title="commands",
        description="Valid commands",
        help="Command to execute (use '<command> -h' for more help)"
    )

    seed_parser = subparsers.add_parser(
        "seed",
        help="Seed vowel and word data into the database",
        description="Seeds vowels and their word examples"
    )
    seed_parser.add_argument(
        "--json",
        type=str,
        default="src/data/phonemes.json",
        help="Path to phoneme JSON file"
    )

    check_parser = subparsers.add_parser(
        "check-relations",
        help="Check that all WordExamples are linked to valid Vowel entries",
        description="Validates referential integrity between WordExample and Vowel"
    )
    check_parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="Stop on first error instead of continuing"
    )
    check_parser.add_argument(
        "--silent",
        action="store_true",
        help="Suppress verbose output"
    )


    cli_runner(parser, async_main)


async def async_main(args, parser) -> int:
    if args.command == "seed":
        return await handle_seed(args)
    elif args.command == "check-relations":
        return await handle_check_relations(args)

    parser.print_help()
    return 0


async def handle_seed(args):
    app = create_app()
    json_path = Path(args.json)

    with app.app_context():
        try:
            seed_all_phonemes_from_file(json_path)
            print(success_response("Database seeded successfully."))
        except Exception as e:
            print(error_response(f"Seeding failed: {e}"))
            return 1

    return 0


async def handle_check_relations(args):
    app = create_app()
    with app.app_context():
        result = check_word_vowel_relationship_integrity(
            verbose=not args.silent,
            fail_fast=args.fail_fast
        )
        return 0 if result else 1

