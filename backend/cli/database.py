# import argparse
# from cli.cli_runner import cli_runner
# from src.app import create_app
# from src.db import db
# from src.utils.cli_format import (
#     print_success,
#     print_error,
#     print_info,
#     print_warning,
#     print_header
# )

# def main():
#     parser = argparse.ArgumentParser(
#         description="Database management operations",
#         epilog="Examples:\n"
#                "  db seed                       # Seed all database tables\n"
#                "  db list                       # List entries from all tables\n"
#                "  db clean --confirm            # Remove all data from the database\n"
#                "  db reset --confirm            # Reset the entire database",
#         formatter_class=argparse.RawDescriptionHelpFormatter
#     )

#     subparsers = parser.add_subparsers(
#         dest="command",
#         title="commands",
#         description="valid commands",
#         help="Command to execute (use '<command> -h' for more help on a command)"
#     )

#     seed_parser = subparsers.add_parser(
#         "seed",
#         help="Seed the database with data",
#         description="Seed the database with data from JSON files"
#     )
#     seed_parser.add_argument(
#         "--target",
#         choices=["all", "phonemes", "lessons", "quizzes"],
#         default="all",
#         help="Which database tables to seed (default: all)"
#     )
#     seed_parser.add_argument(
#         "--keep-existing",
#         action="store_true",
#         help="Don't clear existing data before seeding"
#     )

#     list_parser = subparsers.add_parser(
#         "list",
#         help="List database entries",
#         description="List entries from database tables"
#     )
#     list_parser.add_argument(
#         "--target",
#         choices=["all", "phonemes", "lessons", "quizzes"],
#         default="all",
#         help="Which database tables to list (default: all)"
#     )

#     clean_parser = subparsers.add_parser(
#         "clean",
#         help="Clean the database",
#         description="Remove all data from the database while preserving the schema"
#     )
#     clean_parser.add_argument(
#         "--confirm",
#         action="store_true",
#         help="Confirm database clean (required)"
#     )
#     clean_parser.add_argument(
#         "--target",
#         choices=["all", "phonemes", "lessons", "quizzes"],
#         default="all",
#         help="Which database tables to clean (default: all)"
#     )

#     reset_parser = subparsers.add_parser(
#         "reset",
#         help="Reset the database",
#         description="Reset the database by dropping and recreating all tables"
#     )
#     reset_parser.add_argument(
#         "--confirm",
#         action="store_true",
#         help="Confirm database reset (required)"
#     )

#     cli_runner(parser, async_main)

# async def async_main(args, parser):
#     if not args.command:
#         parser.print_help()
#         return 0

#     app = create_app()
#     with app.app_context():
#         if args.command == "seed":
#             return await handle_seed(args)
#         elif args.command == "list":
#             return await handle_list(args)
#         elif args.command == "clean":
#             return await handle_clean(args)
#         elif args.command == "reset":
#             return await handle_reset(args)

#     parser.print_help()
#     return 0

# async def handle_seed(args):
#     try:
#         print_header("Seeding Database")

#         from cli.phoneme import handle_seed_from_json
#         from cli.lesson import handle_seed
#         from cli.quiz import handle_seed_all

#         # Seed the requested tables
#         if args.target in ["all", "phonemes"]:
#             print_info("Seeding phonemes...")

#             class PhonemeArgs:
#                 json = True
#                 audio = False
#                 json_file = None
#                 vowel_dir = None
#                 examples_dir = None
#                 keep_existing = args.keep_existing

#             await handle_seed_from_json(PhonemeArgs())

#         if args.target in ["all", "lessons"]:
#             print_info("Seeding lessons...")
#             await handle_seed()

#         if args.target in ["all", "quizzes"]:
#             print_info("Seeding quizzes...")
#             await handle_seed_all()

#         print_success("Database seeding completed")
#         return 0
#     except Exception as e:
#         print_error(f"Failed to seed database: {str(e)}")
#         return 1

# async def handle_list(args):
#     try:
#         print_header("Database Contents")

#         from cli.phoneme import handle_list_vowels
#         from cli.lesson import handle_list_lesson
#         from src.models.quiz import QuizItem
#         from src.utils.cli_format import print_quiz_list

#         class Args:
#             def __init__(self, **kwargs):
#                 for key, value in kwargs.items():
#                     setattr(self, key, value)

#         if args.target in ["all", "phonemes"]:
#             print_info("Phonemes:")
#             await handle_list_vowels()
#             print_info("")

#         if args.target in ["all", "lessons"]:
#             print_info("Lessons:")
#             lesson_args = Args(stats=False, json=False)
#             await handle_list_lesson(lesson_args)
#             print_info("")

#         if args.target in ["all", "quizzes"]:
#             print_info("Quizzes:")
#             app = create_app()
#             with app.app_context():
#                 quizzes = QuizItem.query.all()
#                 if quizzes:
#                     print_quiz_list(quizzes)
#                 else:
#                     print_info("No quizzes found.")
#             print_info("")

#         return 0
#     except Exception as e:
#         print_error(f"Failed to list database entries: {str(e)}")
#         import traceback
#         print_error(traceback.format_exc())
#         return 1


# async def handle_clean(args):
#     if not args.confirm:
#         print_warning("This will delete data from the database.")
#         print_warning("To confirm, run the command with --confirm")
#         return 1

#     try:
#         print_header("Cleaning Database")

#         if args.target in ["all", "quizzes"]:
#             print_info("Cleaning quizzes...")
#             from src.models.quiz import QuizOption, QuizItem
#             QuizOption.query.delete()
#             QuizItem.query.delete()
#             db.session.commit()
#             print_success("Quizzes cleaned")

#         if args.target in ["all", "lessons"]:
#             print_info("Cleaning lessons...")
#             from src.models.lesson import LessonInstruction, Lesson
#             LessonInstruction.query.delete()
#             Lesson.query.delete()
#             db.session.commit()
#             print_success("Lessons cleaned")

#         if args.target in ["all", "phonemes"]:
#             print_info("Cleaning phonemes...")
#             from src.models.phoneme import WordExample, Vowel
#             WordExample.query.delete()
#             Vowel.query.delete()
#             db.session.commit()
#             print_success("Phonemes cleaned")

#         print_success("Database cleaning completed")
#         return 0
#     except Exception as e:
#         print_error(f"Failed to clean database: {str(e)}")
#         db.session.rollback()
#         return 1

# async def handle_reset(args):
#     if not args.confirm:
#         print_warning("This will delete ALL data and reset the database schema.")
#         print_warning("To confirm, run the command with --confirm")
#         return 1

#     try:
#         print_warning("Dropping all tables...")
#         db.drop_all()
#         print_warning("Creating all tables...")
#         db.create_all()
#         print_success("Database reset successfully")
#         return 0
#     except Exception as e:
#         print_error(f"Failed to reset database: {str(e)}")
#         return 1
