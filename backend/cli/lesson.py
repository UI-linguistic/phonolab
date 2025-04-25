# cli/lesson.py

import argparse
import os

from flask import json
from cli.cli_runner import cli_runner
import db
from src.app import create_app
from src.services.lesson import (
    get_all_lessons,
    get_lesson_by_id,
    get_lesson_by_vowel,
    create_lesson,
    update_lesson_instructions,
    delete_lesson,
)
from src.utils.format import success_response, error_response
from tabulate import tabulate


def main():
    parser = argparse.ArgumentParser(description="Manage lesson entries")

    parser.add_argument("--seed", action="store_true", help="Populates lesson database")
    parser.add_argument("--list", action="store_true", help="List all lessons")
    parser.add_argument("--get", type=int, metavar="LESSON_ID", help="Get lesson by ID")
    parser.add_argument("--get-by-vowel", metavar="VOWEL_ID", help="Get lesson by vowel ID")
    parser.add_argument("--create", nargs="+", metavar=("VOWEL_ID", "INSTRUCTION..."),
                        help="Create lesson with instructions")
    parser.add_argument("--update", nargs="+", metavar=("LESSON_ID", "INSTRUCTION..."),
                        help="Update instructions for a lesson")
    parser.add_argument("--delete", type=int, metavar="LESSON_ID", help="Delete a lesson")

    cli_runner(parser, async_main)


async def async_main(args, parser):
    if args.seed:
        return await handle_seed()
    elif args.list:
        return await handle_list()
    elif args.get:
        return await handle_get(args.get)
    elif args.get_by_vowel:
        return await handle_get_by_vowel(args.get_by_vowel)
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
    data_path = os.path.join(os.path.dirname(__file__), "../src/data/lesson.json")

    with app.app_context():
        try:
            with open(data_path, "r", encoding="utf-8") as f:
                lessons_data = json.load(f)

            # Clear existing lessons
            from src.models.lesson import LessonInstruction, Lesson
            LessonInstruction.query.delete()
            Lesson.query.delete()
            db.session.commit()

            # Insert new lessons
            for entry in lessons_data:
                create_lesson(entry["vowel_id"], entry["instructions"])

            print(success_response("All lessons seeded successfully."))
            return 0
        except Exception as e:
            print(error_response(f"Failed to seed lessons: {str(e)}"))
            return 1


async def handle_list():
    app = create_app()
    with app.app_context():
        lessons = get_all_lessons()
        if not lessons:
            print("No lessons found.")
            return 0

        rows = [[l.id, l.vowel_id, len(l.instructions)] for l in lessons]
        headers = ["Lesson ID", "Vowel ID", "# of Instructions"]
        print(tabulate(rows, headers=headers, tablefmt="grid"))
    return 0


async def handle_get(lesson_id):
    app = create_app()
    with app.app_context():
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            print(error_response(f"Lesson {lesson_id} not found."))
            return 0

        print(success_response("Lesson found", {
            "id": lesson.id,
            "vowel_id": lesson.vowel_id,
            "instructions": [i.text for i in lesson.instructions]
        }))
    return 0


async def handle_get_by_vowel(vowel_id):
    app = create_app()
    with app.app_context():
        lesson = get_lesson_by_vowel(vowel_id)
        if not lesson:
            print(error_response(f"No lesson found for vowel ID '{vowel_id}'"))
            return 0

        print(success_response("Lesson found", {
            "id": lesson.id,
            "instructions": [i.text for i in lesson.instructions]
        }))
    return 0


async def handle_create(args):
    vowel_id, *instructions = args
    app = create_app()
    with app.app_context():
        try:
            lesson = create_lesson(vowel_id, instructions)
            print(success_response("Lesson created", {"id": lesson.id}))
        except ValueError as e:
            print(error_response(str(e)))
    return 0


async def handle_update(args):
    lesson_id, *instructions = args
    lesson_id = int(lesson_id)

    app = create_app()
    with app.app_context():
        updated = update_lesson_instructions(lesson_id, instructions)
        if updated:
            print(success_response("Lesson instructions updated"))
        else:
            print(error_response(f"Lesson {lesson_id} not found"))
    return 0


async def handle_delete(lesson_id):
    app = create_app()
    with app.app_context():
        deleted = delete_lesson(lesson_id)
        if deleted:
            print(success_response(f"Lesson {lesson_id} deleted."))
        else:
            print(error_response(f"Lesson {lesson_id} not found"))
    return 0
