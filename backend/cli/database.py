# cli/database.py

import argparse
from cli.cli_runner import cli_runner
from src.app import create_app
from src.utils.format import success_response, error_response

# Import handlers from other modules
from cli.phoneme import handle_seed as seed_vowels, handle_clear as clear_vowels
from cli.lesson import handle_seed as seed_lessons, handle_clear as clear_lessons
from cli.quiz import handle_seed as seed_quizzes, handle_clear as clear_quizzes


def main():
    parser = argparse.ArgumentParser(description="Seed or clear the entire database")

    parser.add_argument("--seed-all", action="store_true", help="Seed all data (vowels, word examples, quizzes, lessons)")
    parser.add_argument("--clear-all", action="store_true", help="Delete all data")

    cli_runner(parser, async_main)


async def async_main(args, parser):
    if args.seed_all:
        return await handle_seed_all()
    elif args.clear_all:
        return await handle_clear_all()

    parser.print_help()
    return 0


async def handle_seed_all():
    print("[]Seeding vowels...")
    await seed_vowels()
    print("[] Seeding quizzes...")
    await seed_quizzes()
    print("[] Seeding lessons...")
    await seed_lessons()
    print(success_response("All data seeded."))
    return 0


async def handle_clear_all():
    print("[] Deleting quizzes...")
    await clear_quizzes()
    print("[] Deleting lessons...")
    await clear_lessons()
    print("[] Deleting vowels...")
    await clear_vowels()
    print(success_response("All data cleared."))
    return 0
