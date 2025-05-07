"""
Service functions for lesson-related operations.
"""
from typing import Optional
from src.models.lesson import LessonType
from src.database.lesson import (
    get_all_lesson_types as db_get_all_lesson_types,
    get_lesson_type_by_id as db_get_lesson_type_by_id
)
from utils.response import not_found_response, success_response


def get_all_lesson_types() -> list:
    """Fetch all lesson types from the database."""
    return db_get_all_lesson_types()


def get_lesson_type_by_id(lesson_type_id: int) -> LessonType:
    """Fetch a single lesson type by its ID."""
    return db_get_lesson_type_by_id(lesson_type_id)


def get_lesson_type_by_slug(slug: str) -> Optional[LessonType]:
    """Fetch a single lesson type by its slug."""
    return get_lesson_type_by_slug(slug)


def lesson_type_to_dict(lesson_type: LessonType) -> dict:
    return {
        "id": lesson_type.id,
        "name": lesson_type.name,
        "slug": lesson_type.slug,
        "description": lesson_type.description,
        "sections": [
            {
                "id": section.id,
                "name": section.name,
                "slug": section.slug,
                "cells": [
                    {
                        "id": cell.id,
                        "row": cell.row,
                        "col": cell.col,
                        "lip_type": cell.lip_type,
                        "length_type": cell.length_type,
                        "vowels": [
                            {
                                "id": v.id,
                                "ipa": v.ipa,
                                "audio_url": v.audio_url,
                                "lip_image_url": v.lip_image_url,
                                "tongue_image_url": v.tongue_image_url,
                            } for v in cell.vowels
                        ]
                    } for cell in section.cells
                ]
            } for section in lesson_type.sections
        ]
    }


def format_all_lessons_response(lesson_types: list) -> dict:
    return success_response(
        message="Lessons retrieved successfully",
        data={"lessons": [lesson_type_to_dict(lt) for lt in lesson_types]}
    )


def format_lesson_by_id_response(lesson_type) -> dict:
    return success_response(
        message=f"Lesson '{lesson_type.name}' retrieved successfully",
        data=lesson_type_to_dict(lesson_type)
    )

def format_lesson_by_slug_response(lesson_type: LessonType | None):
    if not lesson_type:
        return not_found_response(resource_type="Lesson", resource_id="slug")

    return success_response(
        message=f"Lesson '{lesson_type.name}' retrieved successfully",
        data=lesson_type_to_dict(lesson_type)
    )