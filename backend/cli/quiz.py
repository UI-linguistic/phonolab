# cli/quiz.py

import argparse

from flask import json
from cli.cli_runner import cli_runner
from src.app import create_app
from src.services.quiz import (
    create_quiz_batch,
    get_all_quizzes, 
    get_quiz_by_id
)
from src.utils.format import success_response, error_response
from src.utils.cli_format import format_quiz_list, format_single_quiz


def main():
    parser = argparse.ArgumentParser(description="Manage quiz entries")

    parser.add_argument("--seed", action="store_true", help="Populate the quiz database")
    parser.add_argument("--list", action="store_true", help="List all quizzes")
    parser.add_argument("--get", type=int, metavar="QUIZ_ID", help="Get quiz by ID")
    # parser.add_argument("--create", nargs=2, metavar=("TITLE", "DESCRIPTION"), help="Create a new quiz")
    # parser.add_argument("--update", nargs=3, metavar=("QUIZ_ID", "NEW_TITLE", "NEW_DESCRIPTION"),
    #                     help="Update quiz title/description")
    # parser.add_argument("--delete", type=int, metavar="QUIZ_ID", help="Delete quiz")

    cli_runner(parser, async_main)


async def async_main(args, parser):
    if args.seed:
        return await handle_seed_all()
    elif args.list:
        return await handle_list()
    elif args.get:
        return await handle_get(args.get)
    # elif args.create:
    #     return await handle_create(args.create)
    # elif args.update:
    #     return await handle_update(args.update)
    # elif args.delete:
    #     return await handle_delete(args.delete)

    parser.print_help()
    return 0

async def handle_seed_all():
    app = create_app()
    with app.app_context():
        quizzes = create_quiz_batch(_load_quiz_json)
        if not quizzes:
            print(success_response("Quiz data seeded successfully."))
            return 0
        else:
            print(error_response(f"Failed to seed quiz data: {e}"))
            return 1

async def handle_list():
    app = create_app()
    with app.app_context():
        quizzes = get_all_quizzes()
        if not quizzes:
            print("No quizzes found.")
            return 0

        print(format_quiz_list(quizzes))
    return 0

async def handle_get(quiz_id):
    app = create_app()
    with app.app_context():
        quiz = get_quiz_by_id(quiz_id)
        if not quiz:
            print(error_response(f"Quiz {quiz_id} not found"))
            return 0

        print(format_single_quiz(quiz))
    return 0

def _load_quiz_json(path: str = None) -> dict:
    """Utility to load the quiz.json file."""
    if path is None:
        here = os.path.dirname(__file__)
        path = os.path.join(here, "../data/quiz.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

#@DeprecationWarning
# async def handle_create(args):
#     title, description = args
#     app = create_app()
#     with app.app_context():
#         quiz = create_quiz(title, description)
#         print(success_response("Quiz created", {"id": quiz.id}))
#     return 0


# async def handle_delete(quiz_id):
#     app = create_app()
#     with app.app_context():
#         deleted = delete_quiz(quiz_id)
#         if deleted:
#             print(success_response(f"Quiz {quiz_id} deleted."))
#         else:
#             print(error_response(f"Quiz {quiz_id} not found"))
#     return 0
