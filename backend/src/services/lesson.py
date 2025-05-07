"""
Service functions for lesson-related operations.
"""
from src.models.lesson import LessonType
from src.database.lesson import (
    db_get_all_sections_for_lesson,
    db_get_section_by_id,
    db_get_section_cells
)
from utils.response import not_found_response, success_response



def get_all_sections_for_lesson_service(slug: str):
    """
    Gets all sections for a given lesson slug, formats, and returns them.
    """
    sections = db_get_all_sections_for_lesson(slug)
    if sections:
        return success_response(
            message=f"Sections for lesson '{slug}' retrieved successfully",
            data=[section_to_dict(section) for section in sections]
        )
    return not_found_response(resource_type="Lesson", resource_id=slug)


def get_section_by_id_service(section_id: int):
    """
    Gets a specific section by its ID, formats, and returns it, including vowels.
    """
    section = db_get_section_by_id(section_id)
    if section:
        # Fetch cells with vowels for this section
        cells = db_get_section_cells(section_id)
        
        # Now include cells with vowels in your response formatting
        return success_response(
            message=f"Section '{section.name}' retrieved successfully",
            data=section_to_dict(section, cells)
        )
    return not_found_response(resource_type="Section", resource_id=section_id)


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


def format_lesson_by_slug_response(lesson_type: LessonType | None) -> dict:
    if not lesson_type:
        return not_found_response(resource_type="Lesson", resource_id="slug")

    return success_response(
        message=f"Lesson '{lesson_type.name}' retrieved successfully",
        data=lesson_type_to_dict(lesson_type)
    )


def section_to_dict(section, cells):
    """
    Converts a section to a dict format for the response.
    Includes vowel details for each grid cell.
    """
    return {
        "id": section.id,
        "name": section.name,
        "slug": section.slug,
        "cells": [
            {
                "id": cell.id,
                "row": cell.row,
                "col": cell.col,
                "vowels": [
                    {
                        "id": vowel.id,
                        "ipa": vowel.ipa,
                        "audio_url": vowel.audio_url,
                        "lip_image_url": vowel.lip_image_url,
                        "tongue_image_url": vowel.tongue_image_url
                    }
                    for vowel in cell.vowels  # Only including vowels now, no word examples
                ]
            }
            for cell in cells  # Pass in the cells with eager-loaded vowels
        ]
    }


def lesson_type_to_dict(lesson_type: LessonType) -> dict:
    """
    Converts a LessonType instance into a dictionary for API response.
    Includes section and vowel details for each grid cell.
    """
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
