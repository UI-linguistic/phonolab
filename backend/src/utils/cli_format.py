# backend/src/utils/cli_format.py
import json
from typing import Any, List

from colorama import Fore, init
from rich import box
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from tabulate import tabulate
from rich.console import Console

init()


console = Console()

def success_response(message: str) -> None:
    """Print a styled success message."""
    console.print(f"[bold green]✔ {message}[/bold green]")

def error_response(message: str) -> None:
    """Print a styled error message."""
    console.print(f"[bold red]✖ {message}[/bold red]")

def warn_response(message: str) -> None:
    """Print a styled warning message in yellow."""
    console.print(f"[bold yellow]⚠ {message}[/bold yellow]")


def green(text: str) -> str:
    """Green text."""
    return f"{Fore.GREEN}{text}{Fore.RESET}"


def red(text: str) -> str:
    """Red text."""
    return f"{Fore.RED}{text}{Fore.RESET}"


def yellow(text: str) -> str:
    """Yellow text."""
    return f"{Fore.YELLOW}{text}{Fore.RESET}"


def blue(text: str) -> str:
    """Blue text."""
    return f"{Fore.BLUE}{text}{Fore.RESET}"

# Simple message formatting for non-rich contexts


def format_success(message: str) -> str:
    """Format a success message."""
    return f"{green('✓')} {message}"


def format_error(message: str) -> str:
    """Format an error message."""
    return f"{red('✗')} {message}"


def format_warning(message: str) -> str:
    """Format a warning message."""
    return f"{yellow('!')} {message}"


def format_info(message: str) -> str:
    """Format an info message."""
    return f"{blue('i')} {message}"

# Rich-based formatters


def print_success(message: str) -> None:
    """Print a success message using Rich."""
    console.print(f"[green]✓[/green] {message}")


def print_error(message: str) -> None:
    """Print an error message using Rich."""
    console.print(f"[red]✗[/red] {message}")


def print_warning(message: str) -> None:
    """Print a warning message using Rich."""
    console.print(f"[yellow]![/yellow] {message}")


def print_info(message: str) -> None:
    """Print an info message using Rich."""
    console.print(f"[blue]i[/blue] {message}")


def print_header(title: str) -> None:
    """Print a header using Rich."""
    console.print()
    console.rule(f"[bold]{title}[/bold]")
    console.print()


def print_model_detail(model: Any, title: str = None, exclude_attrs: List[str] = None) -> None:
    """
    Print detailed information about a model using Rich.

    Args:
        model: The model instance to format
        title: Optional title (defaults to model class name)
        exclude_attrs: List of attribute names to exclude
    """
    if model is None:
        print_error("Model not found")
        return

    if title is None:
        title = model.__class__.__name__

    table = Table(box=box.ROUNDED)
    table.add_column("Attribute", style="cyan")
    table.add_column("Value")

    if hasattr(model, '__table__'):
        # For SQLAlchemy models
        attrs = [column.name for column in model.__table__.columns]
    else:
        # For other objects
        attrs = [attr for attr in dir(model)
                 if not attr.startswith('_') and not callable(getattr(model, attr))]

    if exclude_attrs:
        attrs = [attr for attr in attrs if attr not in exclude_attrs]

    for attr in attrs:
        value = getattr(model, attr)

        if isinstance(value, (list, tuple)):
            formatted_value = f"{len(value)} items"
        elif value is None:
            formatted_value = "[italic]None[/italic]"
        else:
            formatted_value = str(value)

            if isinstance(value, str) and ('url' in attr.lower() or 'path' in attr.lower()):
                formatted_value = f"[blue]{formatted_value}[/blue]"

        table.add_row(attr, formatted_value)

    console.print(Panel(table, title=title, border_style="blue"))


def print_model_list(models: List[Any], title: str = None, columns: List[str] = None) -> None:
    """
    Print a list of models as a table using Rich.

    Args:
        models: List of model instances
        title: Optional title for the table
        columns: List of column names to include (defaults to all columns)
    """
    if not models:
        print_info("No items found.")
        return

    if title is None:
        title = f"{models[0].__class__.__name__} List"

    # Create a table
    table = Table(title=title, box=box.ROUNDED)

    if not columns:
        if hasattr(models[0], '__table__'):
            # For SQLAlchemy models
            columns = [column.name for column in models[0].__table__.columns]
        else:

            columns = [attr for attr in dir(models[0])
                       if not attr.startswith('_') and not callable(getattr(models[0], attr))]

    # Add columns to the table
    for column in columns:
        table.add_column(column.replace('_', ' ').title(), style="cyan")

    # Add rows for each model
    for model in models:
        row_values = []
        for column in columns:
            value = getattr(model, column, "")

            if isinstance(value, (list, tuple)):
                formatted_value = f"{len(value)}"
            elif value is None:
                formatted_value = ""
            else:
                formatted_value = str(value)

            row_values.append(formatted_value)

        table.add_row(*row_values)

    console.print(table)


def print_model_with_relations(model: Any, relation_name: str,
                               title: str = None, relation_columns: List[str] = None) -> None:
    """
    Print a model with its related models using Rich.

    Args:
        model: The model instance
        relation_name: Name of the relation attribute
        title: Optional title (defaults to model class name)
        relation_columns: List of column names to include for related models
    """
    if model is None:
        print_error("Model not found")
        return

    # Print the main model details
    print_model_detail(model, title=title)

    # Get the related models
    if hasattr(model, relation_name):
        related_models = getattr(model, relation_name)

        if related_models:
            # Format the relation title
            relation_title = relation_name.replace('_', ' ').title()

            # Print the related models
            print_model_list(
                related_models,
                title=f"{relation_title} ({len(related_models)})",
                columns=relation_columns
            )
        else:
            print_info(f"No {relation_name.replace('_', ' ')} found.")


def print_vowel_list(vowels: List[Any]) -> None:
    """Print a list of vowels using Rich."""
    print_model_list(
        vowels,
        title="Available Vowel Phonemes",
        columns=['id', 'phoneme', 'name', 'description']
    )


def print_vowel_detail(vowel: Any) -> None:
    """Print detailed vowel information using Rich."""
    print_model_detail(vowel, title=f"Vowel: {vowel.phoneme} ({vowel.name})")


def print_vowel_with_examples(vowel: Any) -> None:
    """Print vowel with its word examples using Rich."""
    print_model_with_relations(
        vowel,
        relation_name='word_examples',
        title=f"Vowel: {vowel.phoneme} ({vowel.name})",
        relation_columns=['word', 'ipa', 'audio_url', 'example_sentence']
    )


def print_lesson_list(lessons: List[Any]) -> None:
    """Print a list of lessons using Rich."""
    print_model_list(
        lessons,
        title="Available Lessons",
        columns=['id', 'vowel_id']
    )


def print_lesson_detail(lesson: Any) -> None:
    """Print detailed lesson information using Rich."""
    if not lesson:
        print_error("Lesson not found")
        return

    # Create a table for the lesson details
    table = Table(box=box.ROUNDED)
    table.add_column("Attribute", style="cyan")
    table.add_column("Value")

    # Add basic lesson info
    table.add_row("ID", str(lesson.id))
    table.add_row("Vowel ID", lesson.vowel_id)

    if lesson.vowel:
        vowel_info = f"{lesson.vowel.phoneme} ({lesson.vowel.name})"
        table.add_row("Vowel", vowel_info)

    console.print(Panel(table, title=f"Lesson for {lesson.vowel_id}", border_style="blue"))

    # Display lesson card if available
    if lesson.vowel and hasattr(lesson.vowel, 'pronounced') and lesson.vowel.pronounced:
        card_table = Table(title="Lesson Card", box=box.ROUNDED)
        card_table.add_column("Attribute", style="cyan")
        card_table.add_column("Value")

        if lesson.vowel.pronounced:
            card_table.add_row("Pronounced", lesson.vowel.pronounced)

        if lesson.vowel.common_spellings:
            spellings = ", ".join(lesson.vowel.common_spellings)
            card_table.add_row("Common Spellings", spellings)

        if lesson.vowel.lips:
            card_table.add_row("Lips", lesson.vowel.lips)

        if lesson.vowel.tongue:
            card_table.add_row("Tongue", lesson.vowel.tongue)

        if lesson.vowel.example_words:
            examples = ", ".join(lesson.vowel.example_words)
            card_table.add_row("Example Words", examples)

        if lesson.vowel.mouth_image_url:
            card_table.add_row("Mouth Image", f"[blue]{lesson.vowel.mouth_image_url}[/blue]")

        console.print(card_table)


def print_lesson_with_vowel(lesson: Any) -> None:
    """Print lesson with its vowel details using Rich."""
    if not lesson:
        print_error("Lesson not found")
        return

    print_lesson_detail(lesson)

    if lesson.vowel:
        vowel_table = Table(title=f"Vowel: {lesson.vowel.phoneme}", box=box.ROUNDED)
        vowel_table.add_column("Attribute", style="cyan")
        vowel_table.add_column("Value")

        vowel_attrs = ['id', 'phoneme', 'name', 'description', 'ipa_example', 'color_code', 'audio_url']

        for attr in vowel_attrs:
            value = getattr(lesson.vowel, attr, None)
            if value is not None:
                formatted_value = str(value)
                if attr in ['audio_url']:
                    formatted_value = f"[blue]{formatted_value}[/blue]"
                vowel_table.add_row(attr.replace('_', ' ').title(), formatted_value)

        console.print(vowel_table)


def format_lesson_for_cli(lesson):
    """Format a lesson for CLI display."""
    vowel_info = f"{lesson.vowel.phoneme} ({lesson.vowel.name})" if lesson.vowel else "N/A"

    has_lesson_card = lesson.vowel and hasattr(lesson.vowel, 'pronounced') and lesson.vowel.pronounced is not None
    lesson_card_info = "Available" if has_lesson_card else "Not available"

    return [
        lesson.id,
        lesson.vowel_id,
        vowel_info,
        lesson_card_info
    ]


def format_lesson_list(lessons, show_all=False):
    """Format a list of lessons for CLI display."""
    if show_all:
        return json.dumps([lesson.to_dict() for lesson in lessons], indent=2)
    else:
        headers = ["ID", "Vowel ID", "Vowel", "Lesson Card"]
        rows = [format_lesson_for_cli(lesson) for lesson in lessons]
        return tabulate(rows, headers=headers, tablefmt="grid")


def format_lesson_list(lessons, show_all=False):
    """Format a list of lessons for CLI display."""
    if show_all:
        return json.dumps([lesson.to_dict() for lesson in lessons], indent=2)
    else:
        headers = ["ID", "Vowel ID", "Vowel", "Instructions"]
        rows = [format_lesson_for_cli(lesson) for lesson in lessons]
        return tabulate(rows, headers=headers, tablefmt="grid")


def format_single_lesson(lesson):
    """Pretty-print a single lesson item as CLI output."""
    return json.dumps(lesson.to_dict(), indent=2)

# Updated function for quiz list display with Rich


def print_quiz_list(quizzes: List[Any]) -> None:
    """Print a list of quizzes using Rich."""
    print_model_list(
        quizzes,
        title="Available Quizzes",
        columns=['id', 'prompt_word', 'prompt_ipa', 'vowel_id']
    )


def print_quiz_detail(quiz: Any) -> None:
    """Print detailed quiz information using Rich."""
    if not quiz:
        print_error("Quiz not found")
        return

    table = Table(box=box.ROUNDED)
    table.add_column("Attribute", style="cyan")
    table.add_column("Value")

    table.add_row("ID", str(quiz.id))
    table.add_row("Prompt Word", quiz.prompt_word)
    table.add_row("Prompt IPA", quiz.prompt_ipa)
    table.add_row("Audio URL", f"[blue]{quiz.prompt_audio_url}[/blue]")

    if hasattr(quiz, 'vowel_id') and quiz.vowel_id:
        table.add_row("Vowel ID", quiz.vowel_id)

    option_count = len(quiz.options) if quiz.options else 0
    table.add_row("Options", f"{option_count} items")

    if hasattr(quiz, 'feedback_correct') and quiz.feedback_correct:
        table.add_row("Correct Feedback", quiz.feedback_correct)
    if hasattr(quiz, 'feedback_incorrect') and quiz.feedback_incorrect:
        table.add_row("Incorrect Feedback", quiz.feedback_incorrect)

    console.print(Panel(table, title=f"Quiz: {quiz.prompt_word}", border_style="blue"))

    if quiz.options:
        option_table = Table(title="Quiz Options", box=box.ROUNDED)
        option_table.add_column("ID", style="dim")
        option_table.add_column("Word", style="cyan")
        option_table.add_column("IPA")
        option_table.add_column("Is Correct")

        for option in quiz.options:
            is_correct = "[green]Yes[/green]" if option.is_correct else "[red]No[/red]"
            option_table.add_row(str(option.id), option.word, option.ipa, is_correct)

        console.print(option_table)


def print_quiz_with_options(quiz: Any) -> None:
    """Print quiz with its options using Rich."""
    if not quiz:
        print_error("Quiz not found")
        return

    print_quiz_detail(quiz)


def print_quiz_option_list(options: List[Any]) -> None:
    """Print a list of quiz options using Rich."""
    print_model_list(
        options,
        title="Quiz Options",
        columns=['id', 'quiz_item_id', 'word', 'ipa', 'is_correct']
    )


def print_word_list(examples) -> None:
    """Print a list of word examples using Rich."""
    from src.utils.cli_format import print_model_list

    print_model_list(
        examples,
        title="Word Examples",
        columns=['id', 'word', 'vowel_id', 'ipa', 'audio_url']
    )


def format_quiz_for_cli(quiz):
    """Format a quiz for CLI display."""
    option_count = len(quiz.options) if quiz.options else 0
    correct_option = next((opt.word for opt in quiz.options if opt.is_correct), "N/A") if quiz.options else "N/A"

    return [
        quiz.id,
        quiz.prompt_word,
        quiz.prompt_ipa,
        quiz.prompt_audio_url,
        correct_option,
        option_count
    ]


def format_quiz_list(quizzes, show_all=False):
    """Format a list of quizzes for CLI display."""
    if show_all:
        return json.dumps([quiz.to_dict() for quiz in quizzes], indent=2)
    else:
        headers = ["ID", "Word", "IPA", "Audio URL", "Correct Option", "Options Count"]
        rows = [format_quiz_for_cli(quiz) for quiz in quizzes]
        return tabulate(rows, headers=headers, tablefmt="grid")


def format_quiz_for_cli(quiz):
    """Format a quiz for CLI display."""
    option_count = len(quiz.options) if quiz.options else 0
    correct_option = next((opt.word for opt in quiz.options if opt.is_correct), "N/A") if quiz.options else "N/A"

    return [
        quiz.id,
        quiz.prompt_word,
        quiz.prompt_ipa,
        quiz.prompt_audio_url,
        correct_option,
        option_count
    ]


def format_quiz_list(quizzes, show_all=False):
    """Format a list of quizzes for CLI display."""
    if show_all:
        return json.dumps([quiz.to_dict() for quiz in quizzes], indent=2)
    else:
        headers = ["ID", "Word", "IPA", "Audio URL", "Correct Vowel", "Options"]
        rows = [format_quiz_for_cli(quiz) for quiz in quizzes]
        return tabulate(rows, headers=headers, tablefmt="grid")


def format_single_quiz(quiz):
    """Pretty-print a single quiz item as CLI output."""
    quiz_dict = quiz.to_dict()
    return json.dumps(quiz_dict, indent=2)
