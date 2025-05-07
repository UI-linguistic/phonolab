# src/database/lesson.py

import json
from pathlib import Path
from src.db import db
from src.models.lesson import LessonType, Vowels101Section, VowelGridCell
from src.models.phoneme import Vowel
from src.utils.decorators import safe_db_op


def get_all_lesson_types() -> list[LessonType]:
    """Returns all LessonType entries from the database."""
    return LessonType.query.all()


def get_lesson_type_by_id(lesson_type_id: int) -> LessonType | None:
    """Returns a single LessonType by its ID, or None if not found."""
    return LessonType.query.get(lesson_type_id)


def validate_vowels101_tongue_json(data: dict):
    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary.")

    for field in ["title", "grid"]:
        if field not in data:
            raise ValueError(f"Missing required field '{field}' in JSON.")

    for row in data["grid"]:
        if "row" not in row or "columns" not in row:
            raise ValueError("Each grid row must have 'row' and 'columns' keys.")

        if not isinstance(row["columns"], dict):
            raise ValueError(f"'columns' must be a dict in row: {row}")


@safe_db_op(default=None, error_message="Failed to get or create LessonType")
def get_or_create_lesson_type(slug: str, name: str, description: str = "") -> LessonType:
    existing = LessonType.query.filter_by(slug=slug).first()
    if existing:
        return existing

    lesson_type = LessonType(slug=slug, name=name, description=description)
    db.session.add(lesson_type)
    db.session.flush()
    return lesson_type


@safe_db_op(default=None, error_message="Failed to insert Vowels101Section")
def insert_vowels101_section(name: str, slug: str, lesson_type_id: int) -> Vowels101Section:
    section = Vowels101Section.query.filter_by(slug=slug, lesson_type_id=lesson_type_id).first()
    if section:
        return section

    section = Vowels101Section(name=name, slug=slug, lesson_type_id=lesson_type_id)
    db.session.add(section)
    db.session.flush()
    return section


@safe_db_op(default=None, error_message="Failed to insert VowelGridCell")
def insert_vowel_grid_cell(section_id: int, row: int, col: int, vowel_ids: list[str]):
    cell = VowelGridCell(section_id=section_id, row=row, col=col)
    db.session.add(cell)

    for vid in vowel_ids:
        vowel = Vowel.query.filter_by(ipa=vid).first()
        if vowel:
            cell.vowels.append(vowel)
        else:
            print(f"Vowel IPA '{vid}' not found in DB.")

    return cell


def seed_vowels101_tongue_section_from_file(json_path: Path | str = "src/data/vowels101_tongue.json"):
    json_path = Path(json_path)
    if not json_path.exists():
        raise FileNotFoundError(f"Tongue section JSON file not found at: {json_path}")

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    validate_vowels101_tongue_json(data)

    lesson_type = get_or_create_lesson_type(
        slug="vowels-101",
        name="Vowels 101",
        description="Master those slippery English vowels"
    )

    section = insert_vowels101_section(name="Tongue Position", slug="tongue", lesson_type_id=lesson_type.id)

    col_map = ["Front", "Central", "Back"]
    for row_idx, row_data in enumerate(data["grid"]):
        for col_idx, col_name in enumerate(col_map):
            ipa_values = row_data["columns"].get(col_name, [])
            if ipa_values:
                insert_vowel_grid_cell(section_id=section.id, row=row_idx, col=col_idx, vowel_ids=ipa_values)

    db.session.commit()
    print("Tongue Position section seeded successfully.")
