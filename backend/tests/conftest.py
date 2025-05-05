import sys
from pathlib import Path
import pytest
import warnings

from server import app as flask_app
from src.models.phoneme import db

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


@pytest.fixture(scope="function")
def app():
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })

    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture(autouse=True)
def capture_warnings():
    with warnings.catch_warnings(record=True) as recorded_warnings:
        warnings.simplefilter("always")  # Show all warnings
        yield
        if recorded_warnings:
            print("\n\n=== WARNINGS ===")
            for i, warning in enumerate(recorded_warnings):
                print(f"\nWarning {i + 1}:")
                print(f"  Message: {warning.message}")
                print(f"  Category: {warning.category.__name__}")
                print(f"  File: {warning.filename}")
                print(f"  Line: {warning.lineno}")
            print("=== END WARNINGS ===\n")
