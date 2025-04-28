# cli/phoneme.py
import argparse
import os
import json
from cli.cli_runner import cli_runner
from src.utils.cli_format import (
    print_header, print_info, print_success, print_error,
    print_vowel_list, print_vowel_detail,
    print_word_list
)
from src.app import create_app
from src.services.phoneme import (
    get_all_vowels,
    get_vowel_by_id,
    seed_vowels_from_audio_directory,
    seed_word_examples_from_audio_directory
)

def main():
    parser = argparse.ArgumentParser(
        description="Manage phoneme entries in the database",
        epilog="Examples:\n"
               "  phoneme list --vowels                # List all vowels\n"
               "  phoneme get #                       # Get details for vowel 'index'\n"
               "  phoneme get # --examples            # Get vowel 'index' with word examples\n"
               "  phoneme seed --json                  # Seed database from default JSON file\n"
               "  phoneme seed --audio                 # Seed database from audio directories\n",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    subparsers = parser.add_subparsers(
        dest="command",
        title="commands",
        description="valid commands",
        help="Command to execute (use '<command> -h' for more help on a command)"
    )

    # Seed subcommand
    seed_parser = subparsers.add_parser("seed", help="Seed the database")
    seed_group = seed_parser.add_mutually_exclusive_group(required=True)
    seed_group.add_argument("--json", action="store_true", help="Seed from JSON file")
    seed_group.add_argument("--audio", action="store_true", help="Seed from audio directories")
    seed_parser.add_argument("--json-file", type=str, help="Path to JSON file (default: src/data/vowels.json)")
    seed_parser.add_argument("--vowel-dir", type=str, help="Directory with vowel audio files (default: static/audio/vowels)")
    seed_parser.add_argument("--examples-dir", type=str, help="Directory with word example audio files (default: static/audio/word_examples)")
    seed_parser.add_argument("--keep-existing", action="store_true", help="Don't clear existing data before seeding")

    # List subcommand
    list_parser = subparsers.add_parser(
        "list",
        help="List phonemes or word examples",
        description="List phonemes or word examples stored in the database"
    )
    list_group = list_parser.add_mutually_exclusive_group(required=True)
    list_group.add_argument(
        "--vowels",
        action="store_true",
        help="List all vowel phonemes"
    )
    list_group.add_argument(
        "--words",
        action="store_true",
        help="List all word examples"
    )
    list_parser.add_argument(
        "--vowel",
        type=str,
        help="Filter word examples by vowel ID (only with --words)"
    )

    # Get subcommand
    get_parser = subparsers.add_parser("get", help="Get phoneme details")
    get_parser.add_argument("vowel_id", type=str, help="Vowel ID to get details for")
    get_parser.add_argument("--examples", action="store_true", help="Show word examples for this vowel")

    cli_runner(parser, async_main)

async def async_main(args, parser):
    if not hasattr(args, "command") or args.command is None:
        parser.print_help()
        return 0

    if args.command == "seed":
        if args.json:
            return await handle_seed_from_json(args)
        elif args.audio:
            return await handle_seed_from_audio(args)
    elif args.command == "list":
        if args.vowels:
            return await handle_list_vowels()
        elif args.words:
            return await handle_list_words(args)
    elif args.command == "get":
        if args.examples:
            return await handle_get_vowel_with_examples(args.vowel_id)
        else:
            return await handle_get_vowel(args.vowel_id)
    return 0

async def handle_list_words(args) -> int:
    """List all word examples in the database."""
    from src.services.phoneme import get_word_examples, get_word_examples_by_vowel_id

    app = create_app()
    with app.app_context():
        vowel_id = args.vowel if hasattr(args, 'vowel') else None

        if vowel_id:
            examples = get_word_examples_by_vowel_id(vowel_id)
            print_info(f"Word examples for vowel {vowel_id}:")
        else:
            examples = get_word_examples()

        if examples:
            print_header("All Words")
            print_word_list(examples)
        else:
            print_info("No word examples found.")
    return 0


async def handle_seed_from_json(args) -> int:
    app = create_app()

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    default_path = os.path.join(project_root, "src/data/vowel.json")

    json_file = args.json_file or default_path

    print_info(f"Using JSON file: {json_file}")

    if not os.path.exists(json_file):
        print_error(f"JSON file not found: {json_file}")
        return 1

    with app.app_context():
        try:
            with open(json_file, 'r') as f:
                json_content = f.read()
                print_info(f"JSON file content length: {len(json_content)} bytes")

                import json
                vowel_data = json.loads(json_content)
                print_info(f"JSON contains {len(vowel_data)} top-level items")
                if isinstance(vowel_data, list):
                    print_info(f"First item keys: {list(vowel_data[0].keys()) if vowel_data else 'None'}")
                elif isinstance(vowel_data, dict):
                    print_info(f"Top-level keys: {list(vowel_data.keys())}")

            import inspect
            from src.services.phoneme import seed_from_json_file
            print_info(f"seed_from_json_file function: {inspect.signature(seed_from_json_file)}")

            print_info("Calling seed_from_json_file...")
            vowel_count, example_count, error = seed_from_json_file(
                json_file,
                clear_existing=not args.keep_existing
            )

            print_info(f"Function returned: vowel_count={vowel_count}, example_count={example_count}, error={error}")

            if error:
                print_error(f"Failed to seed from JSON: {error}")
                return 1

            print_success(f"Successfully seeded {vowel_count} vowels and {example_count} word examples from JSON")
            return 0
        except Exception as e:
            print_error(f"Exception during seeding: {str(e)}")
            import traceback
            print_error(traceback.format_exc())
            return 1

async def handle_seed_from_audio(args) -> int:
    app = create_app()

    vowel_dir = args.vowel_dir or os.path.join(os.path.dirname(__file__), "../static/audio/vowels")
    examples_dir = args.examples_dir or os.path.join(os.path.dirname(__file__), "../static/audio/word_examples")

    if not os.path.exists(vowel_dir):
        print_error(f"Vowel audio directory not found: {vowel_dir}")
        return 1

    with app.app_context():
        vowel_count, error = seed_vowels_from_audio_directory(
            vowel_dir,
            clear_existing=not args.keep_existing
        )

        if error:
            print_error(f"Failed to seed vowels from audio: {error}")
            return 1

        example_count = 0
        if os.path.exists(examples_dir):
            example_count, error = seed_word_examples_from_audio_directory(
                examples_dir,
                clear_existing=not args.keep_existing
            )

            if error:
                print_error(f"Failed to seed word examples from audio: {error}")
                return 1

        message = f"Successfully seeded {vowel_count} vowels"
        if example_count > 0:
            message += f" and {example_count} word examples"
        message += " from audio files"

        print_success(message)
        return 0

async def handle_list_vowels() -> int:
    app = create_app()
    with app.app_context():
        vowels = get_all_vowels()
        print_vowel_list(vowels)
    return 0

async def handle_get_vowel(vowel_id) -> int:
    app = create_app()
    with app.app_context():
        vowel = get_vowel_by_id(vowel_id)
        if not vowel:
            print_error(f"Vowel {vowel_id} not found")
            return 1

        print_vowel_detail(vowel)
    return 0

async def handle_get_vowel_with_examples(vowel_id) -> int:
    app = create_app()
    with app.app_context():
        vowel = get_vowel_by_id(vowel_id)
        return vowel


def _load_phoneme_json(path: str = None) -> dict:
    """
    Utility to load the .json file.

    Args:
        path: Path to the JSON file. If None, uses the default path.

    Returns:
        Dictionary containing the phoneme data
    """
    if path is None:
        here = os.path.dirname(__file__)
        path = os.path.join(here, "../data/vowel.json")

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
