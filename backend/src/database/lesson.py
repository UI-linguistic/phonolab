# src/database/lesson.py

import json
from pathlib import Path
from src.db import db
from src.models.lesson import LessonType, Vowels101Section, VowelGridCell
from src.models.phoneme import Vowel
from src.utils.decorators import safe_db_op


def db_get_all_lesson_types() -> list[LessonType]:
    """Returns all LessonType entries from the database."""
    return LessonType.query.all()


def db_get_lesson_type_by_id(lesson_type_id: int) -> LessonType | None:
    """Returns a single LessonType by its ID, or None if not found."""
    return LessonType.query.get(lesson_type_id)

def db_get_lesson_type_by_slug(slug: str) -> LessonType | None:
    """
    Retrieve a LessonType by its slug.
    Returns None if not found.
    """
    return LessonType.query.filter_by(slug=slug).first()


def validate_vowels101_tongue_json(data: dict):
    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary.")

    for field in ["title", "grid"]:
        if field not in data:
            raise ValueError(f"Missing required field '{field}' in JSON.")

    allowed_heights = {"High", "Mid", "Low"}
    allowed_columns = {"Front", "Central", "Back"}

    for row in data["grid"]:
        if "row" not in row or "columns" not in row:
            raise ValueError("Each grid row must have 'row' and 'columns' keys.")

        if not isinstance(row["row"], str):
            raise ValueError(f"'row' must be a string (e.g. 'High'). Got: {type(row['row'])}")
        if row["row"] not in allowed_heights:
            raise ValueError(f"Unknown row label '{row['row']}'. Expected one of {sorted(allowed_heights)}.")

        columns = row["columns"]
        if not isinstance(columns, dict):
            raise ValueError(f"'columns' must be a dict in row: {row}")

        for col_name, ipa_list in columns.items():
            if col_name not in allowed_columns:
                raise ValueError(f"Unknown column '{col_name}'. Expected one of {sorted(allowed_columns)}.")

            if not isinstance(ipa_list, list):
                raise ValueError(f"'{col_name}' in row '{row['row']}' must be a list.")
            for ipa in ipa_list:
                if not isinstance(ipa, str):
                    raise ValueError(f"IPA value '{ipa}' in column '{col_name}' must be a string.")


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

    all_ipa = set()
    for row in data["grid"]:
        for ipa_list in row["columns"].values():
            all_ipa.update(ipa_list)

    missing = [ipa for ipa in all_ipa if not Vowel.query.filter_by(ipa=ipa).first()]
    if missing:
        raise ValueError(f"Missing IPA symbols in database: {', '.join(missing)}")

    lesson_type = get_or_create_lesson_type(
        slug="vowels-101",
        name="Vowels 101",
        description="Master those slippery English vowels"
    )

    section = insert_vowels101_section(name="Tongue Position", slug="tongue", lesson_type_id=lesson_type.id)

    col_map = ["Front", "Central", "Back"]
    height_order = ["High", "Mid", "Low"]

    for row_data in data["grid"]:
        row_label = row_data["row"]
        if row_label not in height_order:
            raise ValueError(f"Unknown row label: '{row_label}' (expected one of {height_order})")
        row_idx = height_order.index(row_label)

        for col_idx, col_name in enumerate(col_map):
            ipa_values = row_data["columns"].get(col_name, [])
            if ipa_values:
                insert_vowel_grid_cell(section_id=section.id, row=row_idx, col=col_idx, vowel_ids=ipa_values)
        db.session.commit()
    print("Tongue Position section seeded successfully.")


def validate_vowels101_lip_json(data: dict):
    if not isinstance(data, dict):
        raise ValueError("Lip shape data must be a dictionary.")

    for field in ["title", "grid"]:
        if field not in data:
            raise ValueError(f"Missing required field '{field}'.")

    grid = data["grid"]
    if not isinstance(grid, dict):
        raise ValueError("'grid' must be a dictionary with keys like 'Rounded' and 'Unrounded'.")

    for category, ipa_list in grid.items():
        if not isinstance(ipa_list, list):
            raise ValueError(f"'{category}' must map to a list.")
        for ipa in ipa_list:
            if not isinstance(ipa, str):
                raise ValueError(f"IPA '{ipa}' under '{category}' must be a string.")


def seed_vowels101_lip_section_from_file(json_path: Path | str = "src/data/lip_shape.json"):
    json_path = Path(json_path)
    if not json_path.exists():
        raise FileNotFoundError(f"Lip shape JSON not found at: {json_path}")

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    validate_vowels101_lip_json(data)

    all_ipa = set()
    for ipa_list in data["grid"].values():
        all_ipa.update(ipa_list)

    missing = [ipa for ipa in all_ipa if not Vowel.query.filter_by(ipa=ipa).first()]
    if missing:
        raise ValueError(f"Missing IPA symbols in database: {', '.join(missing)}")

    lesson_type = get_or_create_lesson_type(
        slug="vowels-101",
        name="Vowels 101",
        description="Master those slippery English vowels"
    )

    section = insert_vowels101_section(name="Lip Shape", slug="lip", lesson_type_id=lesson_type.id)

    for col_idx, category in enumerate(["Unrounded", "Rounded"]):  # left-to-right: unrounded, rounded
        ipa_list = data["grid"].get(category, [])
        insert_vowel_grid_cell(
            section_id=section.id,
            row=0,
            col=col_idx,
            vowel_ids=ipa_list
        )

    db.session.commit()
    print("Lip Shape section seeded successfully.")


def check_lip_shape_section_integrity(verbose: bool = True) -> bool:
    """
    Ensures the Lip Shape section is seeded correctly.
    Returns True if valid, False otherwise.
    """
    success = True
    expected_slug = "lip"
    expected_categories = ["Unrounded", "Rounded"]

    section = Vowels101Section.query.filter_by(slug=expected_slug).first()
    if not section:
        if verbose:
            print(f"Section with slug '{expected_slug}' not found.")
        return False

    if verbose:
        print(f"Found section '{section.name}' (slug='{section.slug}')")

    cells = section.cells
    if len(cells) != 2:
        print(f"Expected 2 grid cells (1 row, 2 cols), found {len(cells)}")
        success = False

    for cell in cells:
        col_label = expected_categories[cell.col] if cell.col < len(expected_categories) else f"col {cell.col}"
        if verbose:
            print(f"Cell col={cell.col} ({col_label}) has {len(cell.vowels)} vowels")
            for v in cell.vowels:
                print(f"    - {v.ipa} ({v.id})")

    return success


def validate_vowels101_length_json(data: dict):
    """Validate the structure of the Length section JSON file."""
    if not isinstance(data, dict):
        raise ValueError("Length JSON must be a dictionary.")

    for field in ["title", "grid"]:
        if field not in data:
            raise ValueError(f"Missing required field '{field}' in JSON.")

    if not isinstance(data["grid"], dict):
        raise ValueError("'grid' must be a dictionary.")

    for key, ipa_list in data["grid"].items():
        if not isinstance(ipa_list, list):
            raise ValueError(f"Grid entry for '{key}' must be a list.")
        for ipa in ipa_list:
            if not isinstance(ipa, str):
                raise ValueError(f"IPA value '{ipa}' in '{key}' must be a string.")


def seed_vowels101_length_section_from_file(json_path: Path | str = "src/data/vowels101_length.json"):
    json_path = Path(json_path)
    if not json_path.exists():
        raise FileNotFoundError(f"Length section JSON file not found at: {json_path}")

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    validate_vowels101_length_json(data)

    all_ipa = set()
    for ipa_list in data["grid"].values():
        all_ipa.update(ipa_list)

    missing = [ipa for ipa in all_ipa if not Vowel.query.filter_by(ipa=ipa).first()]
    if missing:
        raise ValueError(f"Missing IPA symbols in database: {', '.join(missing)}")

    lesson_type = get_or_create_lesson_type(
        slug="vowels-101",
        name="Vowels 101",
        description="Master those slippery English vowels"
    )

    section = insert_vowels101_section(name="Length", slug="length", lesson_type_id=lesson_type.id)

    type_map = {
        "Tense": 0,
        "Lax": 1,
        "Neither": 2
    }

    for length_type, ipa_list in data["grid"].items():
        col_idx = type_map.get(length_type)
        if col_idx is None:
            raise ValueError(f"Unexpected length type: {length_type}")
        insert_vowel_grid_cell(section_id=section.id, row=0, col=col_idx, vowel_ids=ipa_list)

    db.session.commit()
    print("Length section seeded successfully.")


def check_vowels101_length_section_integrity(verbose: bool = True) -> bool:
    """
    Ensures the Length section is seeded correctly.
    Returns True if valid, False otherwise.
    """
    success = True
    expected_slug = "length"
    expected_categories = ["Tense", "Lax", "Neither"]

    section = Vowels101Section.query.filter_by(slug=expected_slug).first()
    if not section:
        if verbose:
            print(f"Section with slug '{expected_slug}' not found.")
        return False

    if verbose:
        print(f"Found section '{section.name}' (slug='{section.slug}')")

    cells = section.cells
    if len(cells) != 3:
        print(f"Expected 3 grid cells (1 row, 3 cols), found {len(cells)}")
        success = False

    for cell in cells:
        col_label = expected_categories[cell.col] if cell.col < len(expected_categories) else f"col {cell.col}"
        if verbose:
            print(f"Cell col={cell.col} ({col_label}) has {len(cell.vowels)} vowels")
            for v in cell.vowels:
                print(f"    - {v.ipa} ({v.id})")

    return success
