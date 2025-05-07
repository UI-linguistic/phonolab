import argparse
import json
from rich import print, inspect
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()

def main():
    parser = argparse.ArgumentParser(
        description="View lesson entries in the database",
        epilog="Examples:\n"
               "  lesson list                # List all lessons\n"
               "  lesson get 1               # Get details for lesson with ID 1\n"
               "  lesson get-vowel v1        # Get lesson for vowel 'v1'\n",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    subparsers = parser.add_subparsers(
        dest="command",
        title="commands",
        description="valid commands",
        help="Command to execute (use '<command> -h' for more help on a command)"
    )

    list_parser = subparsers.add_parser(
        "list",
        help="List lessons in the database",
        description="List lessons stored in the database"
    )
    list_parser.add_argument(
        "--rich",
        action="store_true",
        help="Use rich inspect for detailed output"
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
        "--rich",
        action="store_true",
        help="Use rich inspect for detailed output"
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
        "--rich",
        action="store_true",
        help="Use rich inspect for detailed output"
    )

    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 0
    
    try:
        if args.command == "list":
            handle_list_lesson(args)
        elif args.command == "get":
            handle_get(args)
        elif args.command == "get-vowel":
            handle_get_by_vowel(args)
        else:
            parser.print_help()
            
        return 0
    
    except Exception as e:
        console.print(f"[bold red]Error: {str(e)}[/bold red]")
        import traceback
        traceback.print_exc()
        return 1

def handle_list_lesson(args):
    """Handle the list command using the service function."""
    from flask import Flask
    from src.app import create_app
    from src.services.lesson import get_all_lessons
    
    app = create_app()
    
    with app.app_context():
        # Call the service function
        result = get_all_lessons()
        
        # Print the raw result for debugging
        console.print("[bold blue]Raw Result from get_all_lessons()[/bold blue]")
        inspect(result)
        
        # Handle the complex nested tuple structure
        if isinstance(result, tuple) and len(result) == 3:
            # First element might be another tuple with (data, error, error_type)
            if isinstance(result[0], tuple) and len(result[0]) == 3:
                inner_tuple = result[0]
                data, error, error_type = inner_tuple
            else:
                data, error, error_type = result
        else:
            console.print("[bold red]Unexpected result structure[/bold red]")
            return 1
        
        if error:
            console.print(f"[bold red]Error: {error} ({error_type})[/bold red]")
            return 1
        
        if data is None:
            console.print("[bold yellow]No lessons found[/bold yellow]")
            return 0
        
        if args.rich:
            inspect(data, title="All Lessons")
        else:
            table = Table(title="Lessons")
            table.add_column("ID", justify="right", style="cyan")
            table.add_column("Title", style="green")
            table.add_column("Type", style="magenta")
            table.add_column("Lesson Mode", style="yellow")
            
            for lesson in data:
                table.add_row(
                    str(lesson['id']),
                    lesson.get('title', 'N/A'),
                    lesson.get('type', 'N/A'),
                    lesson.get('lesson_mode', {}).get('name', 'N/A')
                )
            
            console.print(table)

def handle_get(args):
    """Handle the get command using the service function."""
    from flask import Flask
    from src.app import create_app
    from src.services.lesson import get_lesson_by_id
    
    app = create_app()
    
    with app.app_context():
        # Call the service function
        result = get_lesson_by_id(args.lesson_id)
        
        # Print the raw result for debugging
        console.print("[bold blue]Raw Result from get_lesson_by_id()[/bold blue]")
        inspect(result)
        
        # Check if result is an error response
        if isinstance(result, tuple) and len(result) == 2 and isinstance(result[0], dict) and "error" in result[0]:
            error_msg = result[0]["error"]
            status_code = result[1]
            console.print(f"[bold red]Error: {error_msg} (Status: {status_code})[/bold red]")
            return 1
        
        # Display the lesson
        if args.rich:
            inspect(result, title=f"Lesson {args.lesson_id}")
        else:
            console.print(f"[bold cyan]Lesson {args.lesson_id}[/bold cyan]")
            console.print(f"[bold]Title:[/bold] {result.get('title', 'N/A')}")
            console.print(f"[bold]Description:[/bold] {result.get('description', 'N/A')}")
            console.print(f"[bold]Type:[/bold] {result.get('type', 'N/A')}")
            
            if result.get('lesson_mode'):
                mode = result['lesson_mode']
                console.print("[bold]Lesson Mode:[/bold]")
                console.print(f"  [bold]Name:[/bold] {mode.get('name', 'N/A')}")
                console.print(f"  [bold]Slug:[/bold] {mode.get('slug', 'N/A')}")
                console.print(f"  [bold]Description:[/bold] {mode.get('description', 'N/A')}")
            
            if result.get('content'):
                console.print("[bold]Content:[/bold]")
                if isinstance(result['content'], dict):
                    console.print(Panel(json.dumps(result['content'], indent=2), title="Content"))
                else:
                    console.print(result['content'])



def handle_get_by_vowel(args):
    """Handle the get-vowel command."""
    from flask import Flask
    from src.app import create_app
    from src.services.lesson import get_lesson_by_vowel_id
    
    app = create_app()
    
    with app.app_context():
        # Call the service function
        result = get_lesson_by_vowel_id(args.vowel_id)
        
        # Print the raw result for debugging
        console.print("[bold blue]Raw Result from get_lesson_by_vowel_id()[/bold blue]")
        inspect(result)
        
        # Handle the complex nested tuple structure
        if isinstance(result, tuple) and len(result) == 3:
            # First element might be another tuple with (data, error, error_type)
            if isinstance(result[0], tuple) and len(result[0]) == 3:
                inner_tuple = result[0]
                data, error, error_type = inner_tuple
            else:
                data, error, error_type = result
        else:
            console.print("[bold red]Unexpected result structure[/bold red]")
            return 1
        
        if error:
            console.print(f"[bold red]Error: {error} ({error_type})[/bold red]")
            return 1
        
        if data is None:
            console.print(f"[bold red]Lesson for vowel {args.vowel_id} not found[/bold red]")
            return 1
        
        if args.rich:
            inspect(data, title=f"Lesson for vowel {args.vowel_id}")
        else:
            console.print(f"[bold cyan]Lesson for vowel {args.vowel_id}[/bold cyan]")
            console.print(f"[bold]Lesson ID:[/bold] {data.get('id', 'N/A')}")
            console.print(f"[bold]Title:[/bold] {data.get('title', 'N/A')}")
            console.print(f"[bold]Description:[/bold] {data.get('description', 'N/A')}")
            
            if data.get('vowel'):
                vowel = data['vowel']
                console.print("[bold]Vowel:[/bold]")
                console.print(f"  [bold]ID:[/bold] {vowel.get('id', 'N/A')}")
                console.print(f"  [bold]IPA:[/bold] {vowel.get('ipa', 'N/A')}")
                console.print(f"  [bold]Pronounced:[/bold] {vowel.get('pronounced', 'N/A')}")
            
            if data.get('content'):
                console.print("[bold]Content:[/bold]")
                if isinstance(data['content'], dict):
                    console.print(Panel(json.dumps(data['content'], indent=2), title="Content"))
                else:
                    console.print(data['content'])
