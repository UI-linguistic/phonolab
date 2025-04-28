"""Utility functions for error handling."""

import logging
import traceback
from typing import Callable, Optional, Tuple, TypeVar

from sqlalchemy.exc import SQLAlchemyError

from src.db import db

T = TypeVar('T')
R = TypeVar('R')


def handle_db_operation(
    operation: Callable[..., T],
    error_return_value: R,
    *args,
    **kwargs
) -> Tuple[Optional[T], Optional[R]]:
    """
    Execute a database operation with standardized error handling.

    Args:
        operation: The function to execute
        error_return_value: The value to return in case of error
        *args: Arguments to pass to the operation
        **kwargs: Keyword arguments to pass to the operation

    Returns:
        Tuple of (result, error_message)
        If successful, error_message will be None
        If error occurs, result will be error_return_value
    """
    try:
        result = operation(*args, **kwargs)
        return result, None
    except SQLAlchemyError as e:
        db.session.rollback()
        return error_return_value, f"Database error: {str(e)}"
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return error_return_value, f"Invalid data: {str(e)}"
    except Exception as e:
        db.session.rollback()
        logging.exception(f"Unexpected error in {operation.__name__}")
        return error_return_value, f"Unexpected error: {str(e)}"


def handle_file_operation(
    operation: Callable[..., T],
    error_return_value: R,
    *args,
    **kwargs
) -> Tuple[Optional[T], Optional[R]]:
    """
    Execute a file operation with standardized error handling.

    Args:
        operation: The function to execute
        error_return_value: The value to return in case of error
        *args: Arguments to pass to the operation
        **kwargs: Keyword arguments to pass to the operation

    Returns:
        Tuple of (result, error_message)
        If successful, error_message will be None
        If error occurs, result will be error_return_value
    """
    try:
        result = operation(*args, **kwargs)
        return result, None
    except FileNotFoundError as e:
        return error_return_value, f"File not found: {str(e)}"
    except (ValueError, TypeError) as e:
        return error_return_value, f"Invalid data: {str(e)}"
    except Exception as e:
        logging.exception(f"Unexpected error in {operation.__name__}")
        return error_return_value, f"Unexpected error: {str(e)}"


def log_exception(func_name: str, e: Exception) -> str:
    """
    Log an exception and return a formatted error message.

    Args:
        func_name: Name of the function where the exception occurred
        e: The exception that was caught

    Returns:
        Formatted error message
    """
    logging.exception(f"Error in {func_name}")
    return f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
