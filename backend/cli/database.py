import argparse
import os
from pathlib import Path

from cli.cli_runner import cli_runner
from src.database.lesson import seed_vowels101_tongue_section_from_file
from src.app import create_app
from src.app import Config
from src.database.phoneme import (
    check_minimal_pair_integrity, 
    seed_all_phonemes_from_file, 
    seed_minimal_pairs_from_file
)
from src.utils.cli_response import cli_success, cli_error, cli_info, cli_warning
from src.database.phoneme import check_word_vowel_relationship_integrity


def main():
    parser = argparse.ArgumentParser(
        description="Database seeding and maintenance CLI",
        epilog="Examples:\n"
               "  database seed                                # Seed using default JSON\n"
               "  database seed --json src/data/phonemes.json  # Seed with custom path\n",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.set_defaults(command=None)

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

    seed_minimal_parser = subparsers.add_parser(
        "seed-minimal-pairs",
        help="Seed minimal pair entries from a JSON file",
        description="Insert minimal pairs like 'pit' vs 'pet' from structured data"
    )
    seed_minimal_parser.add_argument(
        "--json",
        type=str,
        default="src/data/minimal_pairs.json",
        help="Path to minimal pair JSON file"
    )

    seed_tongue_parser = subparsers.add_parser(
        "seed-tongue",
        help="Seed the Vowels 101 - Tongue Position section",
        description="Creates the Vowels101Section and VowelGridCells for the tongue position lesson"
    )
    seed_tongue_parser.add_argument(
        "--json",
        type=str,
        default="src/data/vowels101_tongue.json",
        help="Path to the tongue position JSON grid file"
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

    check_minimal_parser = subparsers.add_parser(
        "check-minimal-pairs",
        help="Check that all MinimalPairs are valid and logically consistent",
        description="Validate minimal pair entries for internal consistency"
    )
    check_minimal_parser.add_argument("--fail-fast", action="store_true")
    check_minimal_parser.add_argument("--silent", action="store_true")

    reset_parser = subparsers.add_parser(
        "reset-db",
        help="Delete the entire database file",
        description="⚠ Destroys the SQLite DB file completely. Use with caution."
    )

    cli_runner(parser, async_main)


async def async_main(args, parser) -> int:
    if args.command == "seed":
        return await handle_seed(args)
    elif args.command == "check-relations":
        return await handle_check_relations(args)
    elif args.command == "check-minimal-pairs":
        return await handle_check_minimal_pairs(args)
    elif args.command == "seed-minimal-pairs":
        return await handle_seed_minimal_pairs(args)
    elif args.command == "seed-tongue":
        return await handle_seed_tongue(args)
    elif args.command == "reset-db":
        return await handle_reset_db(args)

    parser.print_help()
    return 0


async def handle_seed(args):
    app = create_app()
    json_path = Path(args.json)

    with app.app_context():
        try:
            seed_all_phonemes_from_file(json_path)
            cli_success("Database seeded successfully.")
        except Exception as e:
            cli_error("Seeding failed", details=str(e))
            return 1

    return 0


async def handle_seed_minimal_pairs(args):
    app = create_app()
    json_path = Path(args.json)

    with app.app_context():
        try:
            seed_minimal_pairs_from_file(json_path)
            cli_success("Minimal pairs seeded successfully.")
        except Exception as e:
            cli_error("Failed to seed minimal pairs", details=str(e))
            return 1

    return 0


async def handle_seed_tongue(args):
    app = create_app()
    with app.app_context():
        try:
            seed_vowels101_tongue_section_from_file(args.json)
            cli_success("Tongue Position section seeded successfully.")
        except FileNotFoundError as e:
            cli_error("File not found", details=str(e))
            return 1
        except ValueError as ve:
            cli_error("Validation failed", details=str(ve))
            return 1
        except Exception as e:
            cli_error("Failed to seed tongue section", details=str(e))
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


async def handle_check_minimal_pairs(args):
    app = create_app()
    with app.app_context():
        result = check_minimal_pair_integrity(
            verbose=not args.silent,
            fail_fast=args.fail_fast
        )
        return 0 if result else 1


async def handle_reset_db(args):
    """Deletes the current database file to allow a fresh start."""
    db_path = os.path.join(Config.INSTANCE_DIR, "phonolab.db")

    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            cli_success(f"Deleted database at: {db_path}")
            return 0
        except Exception as e:
            cli_error("Failed to delete database", details=str(e))
            return 1
    else:
        cli_warning(f"Database not found at: {db_path}")
        return 1