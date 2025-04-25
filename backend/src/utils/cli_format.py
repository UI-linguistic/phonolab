# backend/src/utils/cli_format.py

from tabulate import tabulate
import json


def format_quiz_for_cli(quiz):
    return [
        quiz.id,
        quiz.prompt_word,
        quiz.prompt_ipa,
        quiz.prompt_audio_url
        # quiz.feedback_correct,
        # quiz.feedback_incorrect
    ]


def format_quiz_list(quizzes, show_all=False):
    if show_all:
        return json.dumps([q.to_dict() for q in quizzes], indent=2)
    else:
        # headers = ["ID", "Word", "IPA", "Audio URL", "Correct Feedback", "Incorrect Feedback"]
        headers = ["ID", "Word", "IPA", "Audio URL"]
        rows = [format_quiz_for_cli(q) for q in quizzes]
        return tabulate(rows, headers=headers, tablefmt="grid")


def format_single_quiz(quiz):
    """
    Pretty-print a single quiz item as CLI output.
    """
    return json.dumps(quiz.to_dict(), indent=2)
