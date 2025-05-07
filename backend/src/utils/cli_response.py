from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from typing import Optional, Any

console = Console()


def cli_success(message: str, data: Optional[Any] = None):
    """Print a success message with optional data."""
    console.print(Panel(Text(message, style="bold green"), title="✔ SUCCESS", border_style="green"))
    if data is not None:
        console.print(data)


def cli_error(message: str, details: Optional[str] = None):
    """Print an error message with optional details."""
    console.print(Panel(Text(message, style="bold red"), title="✖ ERROR", border_style="red"))
    if details:
        console.print(f"[red]{details}[/red]")


def cli_info(message: str):
    """Print an informational message."""
    console.print(Panel(Text(message, style="bold blue"), title="ℹ INFO", border_style="blue"))


def cli_warning(message: str):
    """Print a warning message."""
    console.print(Panel(Text(message, style="bold yellow"), title="⚠ WARNING", border_style="yellow"))
