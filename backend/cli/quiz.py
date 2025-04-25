# cli/quiz.py

import argparse
import os

from flask import json
from cli.cli_runner import cli_runner
import db
from models.quiz import QuizItem, QuizOption
from src.app import create_app
from src.services.quiz import (
    get_quiz_by_id,
    get_all_quizzes,
    create_quiz,
    update_quiz,
    delete_quiz
)
from src.utils.format import success_response, error_response
from tabulate import tabulate


def main():
    parser = argparse.ArgumentParser(description="Manage quiz entries")

    parser.add_argument("--seed", action="store_true", help="Populate the quiz database")
    parser.add_argument("--list", action="store_true", help="List all quizzes")
    parser.add_argument("--get", type=int, metavar="QUIZ_ID", help="Get quiz by ID")
    parser.add_argument("--create", nargs=2, metavar=("TITLE", "DESCRIPTION"), help="Create a new quiz")
    parser.add_argument("--update", nargs=3, metavar=("QUIZ_ID", "NEW_TITLE", "NEW_DESCRIPTION"),
                        help="Update quiz title/description")
    parser.add_argument("--delete", type=int, metavar="QUIZ_ID", help="Delete quiz")

    cli_runner(parser, async_main)


async def async_main(args, parser):
    if args.seed:
        return await handle_seed()
    elif args.list:
        return await handle_list()
    elif args.get:
        return await handle_get(args.get)
    elif args.create:
        return await handle_create(args.create)
    elif args.update:
        return await handle_update(args.update)
    elif args.delete:
        return await handle_delete(args.delete)

    parser.print_help()
    return 0


async def handle_seed():
    app = create_app()
    data_path = os.path.join(os.path.dirname(__file__), "../src/data/quiz.json")

    with app.app_context():
        try:
            with open(data_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Clear old quiz data
            QuizOption.query.delete()
            QuizItem.query.delete()
            db.session.commit()

            for item in data["quiz"]:
                sample = item["samples"][0]

                quiz = QuizItem(
                    prompt_word=sample["text"],
                    prompt_ipa=sample["IPA"],
                    prompt_audio_url=sample["audio"],
                    feedback_correct=item["feedback"]["correct"],
                    feedback_incorrect=item["feedback"]["incorrect"]
                )

                for opt in item["options_pool"]["correct_answers"]:
                    quiz.options.append(QuizOption(
                        word=opt["word"],
                        ipa=opt["IPA"],
                        audio_url=opt["audio"],
                        is_correct=True,
                        language=opt["language"]
                    ))

                wrong = item["options_pool"]["wrong_answers"][0]
                quiz.options.append(QuizOption(
                    word=wrong["word"],
                    ipa=wrong["IPA"],
                    audio_url=wrong["audio"],
                    is_correct=False,
                    language=wrong["language"]
                ))

                db.session.add(quiz)

            db.session.commit()
            print(success_response("Quiz data seeded successfully."))
            return 0
        except Exception as e:
            print(error_response(f"Failed to seed quiz data: {str(e)}"))
            return 1

async def handle_list():
    app = create_app()
    with app.app_context():
        quizzes = get_all_quizzes()
        if not quizzes:
            print("No quizzes found.")
            return 0

        rows = [[q.id, q.title] for q in quizzes]
        headers = ["Quiz ID", "Title"]
        print(tabulate(rows, headers=headers, tablefmt="grid"))
    return 0


async def handle_get(quiz_id):
    app = create_app()
    with app.app_context():
        quiz = get_quiz_by_id(quiz_id)
        if not quiz:
            print(error_response(f"Quiz {quiz_id} not found"))
            return 0

        print(success_response("Quiz found", {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description
        }))
    return 0


async def handle_create(args):
    title, description = args
    app = create_app()
    with app.app_context():
        quiz = create_quiz(title, description)
        print(success_response("Quiz created", {"id": quiz.id}))
    return 0


async def handle_update(args):
    quiz_id, title, description = args
    quiz_id = int(quiz_id)
    app = create_app()
    with app.app_context():
        updated = update_quiz(quiz_id, title, description)
        if updated:
            print(success_response("Quiz updated"))
        else:
            print(error_response(f"Quiz {quiz_id} not found"))
    return 0


async def handle_delete(quiz_id):
    app = create_app()
    with app.app_context():
        deleted = delete_quiz(quiz_id)
        if deleted:
            print(success_response(f"Quiz {quiz_id} deleted."))
        else:
            print(error_response(f"Quiz {quiz_id} not found"))
    return 0
