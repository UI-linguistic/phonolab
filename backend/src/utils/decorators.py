"""Utility functions for standardized error handling."""

import functools
from typing import Callable, TypeVar


T = TypeVar('T')  # Return type of wrapped function
R = TypeVar('R')  # Error return value type


def safe_db_op(default: R = None, error_message: str = "DB operation failed"):
    """
    Wrap DB logic to catch and log errors gracefully.
    Returns `default` instead of throwing an exception.
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T | R]:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> T | R:
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(f"{error_message}: {e}")
                return default
        return wrapper
    return decorator