# src/models/lesson.py

from src.db import db


if "vowel_cell_map" not in db.metadata.tables:
    vowel_cell_map = db.Table(
        "vowel_cell_map",
        db.Column("vowel_id", db.String, db.ForeignKey("vowels.id"), primary_key=True),
        db.Column("cell_id", db.Integer, db.ForeignKey("vowel_grid_cells.id"), primary_key=True),
    )
else:
    vowel_cell_map = db.metadata.tables["vowel_cell_map"]


class LessonType(db.Model):
    __tablename__ = "lesson_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False, unique=True)
    slug = db.Column(db.String(64), nullable=False, unique=True)
    description = db.Column(db.String(256))

    sections = db.relationship("Vowels101Section", back_populates="lesson_type", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<LessonType '{self.name}'>"


class Vowels101Section(db.Model):
    __tablename__ = "vowels101_sections"

    id = db.Column(db.Integer, primary_key=True)
    lesson_type_id = db.Column(db.Integer, db.ForeignKey("lesson_types.id"), nullable=False)
    name = db.Column(db.String(32), nullable=False)  # e.g. 'tongue', 'lip', 'length'
    slug = db.Column(db.String(64), nullable=False)

    lesson_type = db.relationship("LessonType", back_populates="sections")
    cells = db.relationship("VowelGridCell", back_populates="section", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Vowels101Section '{self.name}'>"


class VowelGridCell(db.Model):
    __tablename__ = "vowel_grid_cells"

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey("vowels101_sections.id"), nullable=False)

    row = db.Column(db.Integer, nullable=False)
    col = db.Column(db.Integer, nullable=False)

    lip_type = db.Column(db.String(16))     # Optional: 'rounded', 'unrounded'
    length_type = db.Column(db.String(16))  # Optional: 'tense', 'lax', 'neither'

    section = db.relationship("Vowels101Section", back_populates="cells")
    vowels = db.relationship("Vowel", secondary=vowel_cell_map, back_populates="grid_cells")

    def __repr__(self):
        return f"<VowelGridCell section={self.section_id} row={self.row} col={self.col}>"
