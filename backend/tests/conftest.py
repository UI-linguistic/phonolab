import sys
from pathlib import Path
import pytest

from server import app as flask_app

from src.models.phoneme import db

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

@pytest.fixture(scope="module")
def app():
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()
