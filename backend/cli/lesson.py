import argparse
import os
from flask import json
from cli.cli_runner import cli_runner
from src.app import create_app
from src.services.lesson import (
    get_all_lessons,
    get_lesson_by_id,
    get_lesson_by_vowel_id,
    delete_lesson,
    create_lesson_with_instructions,
    replace_lesson_instructions,
    seed_lessons_from_json_file,
    get_lesson_stats
)
from src.utils.cli_format import (
    print_success,
    print_error,
    print_info,
    print_warning,
    print_header,
    print_lesson_list,
    print_lesson_detail,
    print_lesson_with_vowel
)

def main():
    parser = argparse.ArgumentParser(
        description="Manage lesson entries in the database",
        epilog="Examples:\n"
               "  lesson list                                           # List all lessons\n"
               "  lesson get 1                                          # Get details for lesson with ID 1\n"
               "  lesson get-vowel #                                    # Get lesson for vowel 'index'\n"
               "  lesson create # 'Instruction 1' 'Instruction 2'       # Create a new lesson\n"
               "  lesson seed --json-file data/lessons.json             # Seed from JSON file",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    subparsers = parser.add_subparsers(
        dest="command", 
        title="commands",
        description="valid commands",
        help="Command to execute (use '<command> -h' for more help on a command)"
    )
    
    # Seed subcommand
    seed_parser = subparsers.add_parser(
        "seed", 
        help="Seed the database with lesson data",
        description="Seed the database with lesson data from a JSON file"
    )
    seed_parser.add_argument(
        "--json-file", 
        type=str, 
        help="Path to JSON file (default: src/data/lessons.json)"
    )
    seed_parser.add_argument(
        "--keep-existing", 
        action="store_true", 
        help="Don't clear existing data before seeding"
    )
    
    # List subcommand
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

    get_vowel_parser = subparsers.add_parser(
        "get-vowel", 
        help="Get lesson for a specific vowel",
        description="Get lesson information for a specific vowel by ID"
    )
    get_vowel_parser.add_argument(
        "vowel_id", 
        type=str, 
        help="Vowel ID to get lesson for (e.g., 'iy', 'aa', 'uh')"
    )
    get_vowel_parser.add_argument(
        "--json", 
        action="store_true", 
        help="Output in JSON format"
    )
    
    # Create subcommand
    create_parser = subparsers.add_parser(
        "create", 
        help="Create a new lesson",
        description="Create a new lesson with instructions for a vowel"
    )
    create_parser.add_argument(
        "vowel_id", 
        type=str, 
        help="Vowel ID for the lesson (e.g., 'iy', 'aa', 'uh')"
    )
    create_parser.add_argument(
        "instructions", 
        nargs="+", 
        help="Instruction texts for the lesson"
    )

    update_parser = subparsers.add_parser(
        "update", 
        help="Update a lesson",
        description="Update a lesson's instructions"
    )
    update_parser.add_argument(
        "lesson_id", 
        type=int, 
        help="Lesson ID to update"
    )
    update_parser.add_argument(
        "instructions", 
        nargs="+", 
        help="New instruction texts for the lesson"
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
            return await handle_list(args)
        elif args.command == "get":
            return await handle_get(args)
        elif args.command == "get-vowel":
            return await handle_get_by_vowel(args)
        elif args.command == "create":
            return await handle_create(args)
        elif args.command == "update":
            return await handle_update(args)
        elif args.command == "delete":
            return await handle_delete(args)
    
    parser.print_help()
    return 0

async def handle_seed(args):
    try:
        json_file = args.json_file or os.path.join(os.path.dirname(__file__), "../src/data/lessons.json")
        clear_existing = not args.keep_existing
        
        print_info(f"Seeding lessons from {json_file}")
        if clear_existing:
            print_warning("Clearing existing lessons...")
        
        count, error = seed_lessons_from_json_file(json_file, clear_existing)
        
        if error:
            print_error(f"Failed to seed lessons: {error}")
            return 1
            
        print_success(f"Successfully seeded {count} lessons")
        return 0
    except Exception as e:
        print_error(f"Failed to seed lessons: {str(e)}")
        return 1

async def handle_list(args):
    try:
        if args.stats:
            stats = get_lesson_stats()
            print_header("Lesson Statistics")
            for key, value in stats.items():
                if key == "vowels_without_lessons_ids":
                    print_info(f"Vowels without lessons: {', '.join(value)}")
                else:
                    print_info(f"{key.replace('_', ' ').title()}: {value}")
            return 0
        
        lessons = get_all_lessons()
        
        if not lessons:
            print_info("No lessons found.")
            return 0
            
        if args.json:
            print(json.dumps([l.to_dict() for l in lessons], indent=2))
        else:
            print_header("All Lessons")
            print_lesson_list(lessons)
            
        return 0
    except Exception as e:
        print_error(f"Failed to list lessons: {str(e)}")
        return 1

async def handle_get(args):
    try:
        lesson = get_lesson_by_id(args.lesson_id)
        
        if not lesson:
            print_error(f"Lesson with ID {args.lesson_id} not found")
            return 1
            
        if args.json:
            print(json.dumps(lesson.to_dict(), indent=2))
        else:
            print_header(f"Lesson {lesson.id} for Vowel {lesson.vowel_id}")
            print_lesson_with_vowel(lesson)
            
        return 0
    except Exception as e:
        print_error(f"Failed to get lesson: {str(e)}")
        return 1

async def handle_get_by_vowel(args):
    try:
        lesson = get_lesson_by_vowel_id(args.vowel_id)
        
        if not lesson:
            print_error(f"No lesson found for vowel '{args.vowel_id}'")
            return 1
            
        if args.json:
            print(json.dumps(lesson.to_dict(), indent=2))
        else:
            print_header(f"Lesson for Vowel {args.vowel_id}")
            print_lesson_with_vowel(lesson)
            
        return 0
    except Exception as e:
        print_error(f"Failed to get lesson: {str(e)}")
        return 1

async def handle_create(args):
    try:
        vowel_id = args.vowel_id
        instructions = args.instructions
        
        lesson, error = create_lesson_with_instructions(vowel_id, instructions)
        
        if error:
            print_error(f"Failed to create lesson: {error}")
            return 1
            
        print_success(f"Lesson created with ID {lesson.id}")
        print_lesson_detail(lesson)
        return 0
    except Exception as e:
        print_error(f"Failed to create lesson: {str(e)}")
        return 1

async def handle_update(args):
    try:
        lesson_id = args.lesson_id
        instructions = args.instructions
        
        lesson, error = replace_lesson_instructions(lesson_id, instructions)
        
        if error:
            print_error(f"Failed to update lesson: {error}")
            return 1
            
        print_success(f"Lesson {lesson_id} updated with {len(instructions)} instructions")
        print_lesson_detail(lesson)
        return 0
    except Exception as e:
        print_error(f"Failed to update lesson: {str(e)}")
        return 1

async def handle_delete(args):
    try:
        lesson_id = args.lesson_id

        if not args.force:
            lesson = get_lesson_by_id(lesson_id)
            if not lesson:
                print_error(f"Lesson with ID {lesson_id} not found")
                return 1
                
            print_warning(f"You are about to delete lesson {lesson_id} for vowel '{lesson.vowel_id}'")
            confirmation = input("Are you sure? (y/N): ")
            if confirmation.lower() != 'y':
                print_info("Deletion cancelled")
                return 0
        
        success, error = delete_lesson(lesson_id)
        
        if error:
            print_error(f"Failed to delete lesson: {error}")
            return 1
            
        print_success(f"Lesson {lesson_id} deleted successfully")
        return 0
    except Exception as e:
        print_error(f"Failed to delete lesson: {str(e)}")
        return 1
