import argparse
from flask import json
from cli.cli_runner import cli_runner
from src.app import create_app
from src.services.lesson import (
    get_lesson_by_id,
    get_all_lessons,
    create_lesson,
    create_lessons_for_all_vowels,
    get_lesson_by_vowel_id,
    delete_lesson,
    get_lesson_stats
)
from src.utils.cli_format import (
    print_success,
    print_error,
    print_info,
    print_lesson_detail,
    format_single_lesson,
    print_lesson_with_vowel,
    format_lesson_list, 
    print_lesson_list,
    format_single_lesson
)


def main():
    parser = argparse.ArgumentParser(
    description="Manage lesson entries in the database",
    epilog="Examples:\n"
           "  lesson list                                # List all lessons\n"
           "  lesson get 1                               # Get details for lesson with ID 1\n"
           "  lesson get-vowel v1                        # Get lesson for vowel 'v1'\n"
           "  lesson create v1                           # Create a new lesson for vowel 'v1'\n"
           "  lesson seed                                # Create lessons for all vowels\n"
           "  lesson delete 1                            # Delete lesson with ID 1",
    formatter_class=argparse.RawDescriptionHelpFormatter
)

    subparsers = parser.add_subparsers(
        dest="command",
        title="commands",
        description="valid commands",
        help="Command to execute (use '<command> -h' for more help on a command)"
    )

    seed_parser = subparsers.add_parser(
        "seed",
        help="Seed lessons for all vowels",
        description="Create lessons for all vowels that don't have lessons yet"
    )
    seed_parser.add_argument(
        "--keep-existing",
        action="store_true",
        help="Don't clear existing lessons before seeding"
    )

    list_parser = subparsers.add_parser(
        "list",
        help="List lessons in the database",
        description="List lessons stored in the database"
    )
    list_parser.add_argument(
        "--json",
        action="store_true",
        help="Output in JSON format"
    )
    list_parser.add_argument(
        "--stats",
        action="store_true",
        help="Show lesson statistics"
    )

    get_parser = subparsers.add_parser(
        "get",
        help="Get details for a specific lesson by ID",
        description="Get detailed information about a specific lesson by ID"
    )
    get_parser.add_argument(
        "lesson_id",
        type=int,
        help="Lesson ID to get details for"
    )
    get_parser.add_argument(
        "--json",
        action="store_true",
        help="Output in JSON format"
    )
    get_parser.add_argument(
        "--with-vowel",
        action="store_true",
        help="Include detailed vowel information"
    )

    get_vowel_parser = subparsers.add_parser(
        "get-vowel",
        help="Get lesson for a specific vowel",
        description="Get lesson information for a specific vowel by ID"
    )
    get_vowel_parser.add_argument(
        "vowel_id",
        type=str,
        help="Vowel ID to get lesson for (e.g., 'v1', 'v2')"
    )
    get_vowel_parser.add_argument(
        "--json",
        action="store_true",
        help="Output in JSON format"
    )

    create_parser = subparsers.add_parser(
        "create",
        help="Create a new lesson",
        description="Create a new lesson for a vowel"
    )
    create_parser.add_argument(
        "vowel_id",
        type=str,
        help="Vowel ID for the lesson (e.g., 'v1', 'v2')"
    )

    delete_parser = subparsers.add_parser(
        "delete",
        help="Delete a lesson",
        description="Delete a lesson by ID"
    )
    delete_parser.add_argument(
        "lesson_id",
        type=int,
        help="Lesson ID to delete"
    )
    delete_parser.add_argument(
        "--force",
        action="store_true",
        help="Force deletion without confirmation"
    )
    
    cli_runner(parser, async_main)


async def async_main(args, parser):
    if not args.command:
        parser.print_help()
        return 0
        
    app = create_app()
    with app.app_context():
        if args.command == "seed":
            return await handle_seed(args)
        elif args.command == "list":
            return await handle_list_lesson(args)
        elif args.command == "get":
            return await handle_get(args)
        elif args.command == "get-vowel":
            return await handle_get_by_vowel(args)
        elif args.command == "create":
            return await handle_create(args)
        elif args.command == "delete":
            return await handle_delete(args)
    
    parser.print_help()
    return 0

async def handle_seed(args):
    """Handle the seed command."""
    try:
        count, error = create_lessons_for_all_vowels()
        
        if error:
            print_error(f"Error seeding lessons: {error}")
            return 1
        
        print_success(f"Successfully seeded {count} lessons for vowels")
        return 0
    except Exception as e:
        print_error(f"Error seeding lessons: {str(e)}")
        return 1

async def handle_list_lesson(args):
    """Handle the list command."""    
    try:
        lessons = get_all_lessons()
        
        if args.stats:
            stats = get_lesson_stats()
            print(json.dumps(stats, indent=2))
            return 0
        
        if args.json:
            print(format_lesson_list(lessons, show_all=True))
        else:
            print_lesson_list(lessons)
        
        return 0
    except Exception as e:
        print_error(f"Error listing lessons: {str(e)}")
        return 1

async def handle_get(args):
    """Handle the get command.""" 
    try:
        lesson = get_lesson_by_id(args.lesson_id)
        
        if not lesson:
            print_error(f"Lesson with ID {args.lesson_id} not found")
            return 1
        
        if args.json:
            print(format_single_lesson(lesson))
        else:
            if args.with_vowel:
                print_lesson_with_vowel(lesson)
            else:
                print_lesson_detail(lesson)
        
        return 0
    except Exception as e:
        print_error(f"Error getting lesson: {str(e)}")
        return 1

async def handle_get_by_vowel(args):
    """Handle the get-vowel command."""
    try:
        lesson = get_lesson_by_vowel_id(args.vowel_id)
        
        if not lesson:
            print_error(f"Lesson for vowel {args.vowel_id} not found")
            return 1
        
        if args.json:
            print(format_single_lesson(lesson))
        else:
            print_lesson_with_vowel(lesson)
        
        return 0
    except Exception as e:
        print_error(f"Error getting lesson: {str(e)}")
        return 1

async def handle_create(args):
    """Handle the create command.""" 
    try:
        lesson, error = create_lesson(args.vowel_id)
        
        if error:
            print_error(f"Error creating lesson: {error}")
            return 1
        
        print_success(f"Successfully created lesson for vowel {args.vowel_id}")
        print_lesson_detail(lesson)
        return 0
    except Exception as e:
        print_error(f"Error creating lesson: {str(e)}")
        return 1

async def handle_delete(args):
    """Handle the delete command.""" 
    try:
        lesson = get_lesson_by_id(args.lesson_id)
        
        if not lesson:
            print_error(f"Lesson with ID {args.lesson_id} not found")
            return 1
        
        if not args.force:
            print_lesson_detail(lesson)
            confirm = input("Are you sure you want to delete this lesson? (y/N): ")
            if confirm.lower() != 'y':
                print_info("Deletion cancelled")
                return 0
        
        success, error = delete_lesson(args.lesson_id)
        
        if error:
            print_error(f"Error deleting lesson: {error}")
            return 1
        
        print_success(f"Successfully deleted lesson {args.lesson_id}")
        return 0
    except Exception as e:
        print_error(f"Error deleting lesson: {str(e)}")
        return 1
