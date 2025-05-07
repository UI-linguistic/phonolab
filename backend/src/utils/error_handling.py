"""Utility functions for standardized error handling."""

import logging
import traceback
from typing import Callable, Optional, Tuple, TypeVar
from sqlalchemy.exc import SQLAlchemyError
from src.db import db


T = TypeVar('T')  # Return type of wrapped function
R = TypeVar('R')  # Error return value type

def handle_db_operation(
    operation_name: str = "database operation"
) -> Callable:
    """
    Decorator for database operations with standardized error handling.
    
    Args:
        operation_name: Description of the operation for error messages
        
    Returns:
        Decorator function that wraps database operations
        
    Example:
        @handle_db_operation("create user")
        def create_user(username, email):
            user = User(username=username, email=email)
            db.session.add(user)
            db.session.commit()
            return user
    """
    def decorator(func: Callable[..., T]) -> Callable[..., Tuple[Optional[T], Optional[str], Optional[str]]]:
        def wrapper(*args, **kwargs) -> Tuple[Optional[T], Optional[str], Optional[str]]:
            try:
                # Call the original function
                result = func(*args, **kwargs)
                
                # If the result is None, treat as not found
                if result is None:
                    resource_id = kwargs.get('id') or args[0] if args else 'unknown'
                    return None, f"Resource not found for {operation_name}: {resource_id}", "not_found"
                
                return result, None, None
                
            except SQLAlchemyError as e:
                db.session.rollback()
                logging.error(f"Database error during {operation_name}: {str(e)}")
                return None, f"Database error during {operation_name}", "db_error"
                
            except (ValueError, TypeError) as e:
                db.session.rollback()
                logging.error(f"Value/Type error during {operation_name}: {str(e)}")
                return None, f"Invalid data for {operation_name}", "value_error"
                
            except KeyError as e:
                db.session.rollback()
                logging.error(f"Missing key during {operation_name}: {str(e)}")
                return None, f"Missing required data for {operation_name}", "key_error"
                
            except Exception as e:
                db.session.rollback()
                # Log unexpected errors with full traceback
                logging.exception(f"Unexpected error during {operation_name}")
                return None, f"An unexpected error occurred", "unexpected_error"
                
        return wrapper
    return decorator

def handle_file_operation(
    operation_name: str = "file operation"
) -> Callable:
    """
    Decorator for file operations with standardized error handling.
    
    Args:
        operation_name: Description of the operation for error messages
        
    Returns:
        Decorator function that wraps file operations
        
    Example:
        @handle_file_operation("read config")
        def read_config(filepath):
            with open(filepath, 'r') as f:
                return json.load(f)
    """
    def decorator(func: Callable[..., T]) -> Callable[..., Tuple[Optional[T], Optional[str], Optional[str]]]:
        def wrapper(*args, **kwargs) -> Tuple[Optional[T], Optional[str], Optional[str]]:
            try:
                # Call the original function
                result = func(*args, **kwargs)
                
                # If the result is None, treat as not found
                if result is None:
                    resource_id = kwargs.get('path') or args[0] if args else 'unknown'
                    return None, f"Resource not found for {operation_name}: {resource_id}", "not_found"
                
                return result, None, None
                
            except FileNotFoundError as e:
                logging.error(f"File not found during {operation_name}: {str(e)}")
                return None, f"File not found: {str(e)}", "file_not_found"
                
            except PermissionError as e:
                logging.error(f"Permission error during {operation_name}: {str(e)}")
                return None, f"Permission denied: {str(e)}", "permission_error"
                
            except (ValueError, TypeError, SyntaxError) as e:
                logging.error(f"Format error during {operation_name}: {str(e)}")
                return None, f"Invalid file format: {str(e)}", "format_error"
                
            except Exception as e:
                # Log unexpected errors with full traceback
                logging.exception(f"Unexpected error during {operation_name}")
                return None, f"An unexpected error occurred", "unexpected_error"
                
        return wrapper
    return decorator

def handle_service_errors(
    operation_name: str = "service operation"
) -> Callable:
    """
    Decorator for service functions to standardize error handling.
    
    Args:
        operation_name: Description of the operation for error messages
        
    Returns:
        Decorator function that wraps service methods
        
    Example:
        @handle_service_errors("get lesson")
        def get_lesson_by_id(lesson_id: int):
            # Function body that may raise exceptions
            return lesson_data
    """
    def decorator(func: Callable[..., T]) -> Callable[..., Tuple[Optional[T], Optional[str], Optional[str]]]:
        def wrapper(*args, **kwargs) -> Tuple[Optional[T], Optional[str], Optional[str]]:
            try:
                # Call the original function
                result = func(*args, **kwargs)
                
                # If the result is None, treat as not found
                if result is None:
                    resource_id = kwargs.get('id') or args[0] if args else 'unknown'
                    return None, f"Resource not found for {operation_name}: {resource_id}", "not_found"
                
                return result, None, None
                
            except SQLAlchemyError as e:
                logging.error(f"Database error during {operation_name}: {str(e)}")
                return None, f"Database error during {operation_name}", "db_error"
                
            except (ValueError, TypeError) as e:
                logging.error(f"Value/Type error during {operation_name}: {str(e)}")
                return None, f"Invalid data for {operation_name}", "value_error"
                
            except KeyError as e:
                logging.error(f"Missing key during {operation_name}: {str(e)}")
                return None, f"Missing required data for {operation_name}", "key_error"
                
            except FileNotFoundError as e:
                logging.error(f"File not found during {operation_name}: {str(e)}")
                return None, f"File not found: {str(e)}", "file_not_found"
                
            except Exception as e:
                # Log unexpected errors with full traceback
                logging.exception(f"Unexpected error during {operation_name}")
                return None, f"An unexpected error occurred", "unexpected_error"
                
        return wrapper
    return decorator

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
