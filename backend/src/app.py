# src/app.py
import os
from flask import Flask
from flask_migrate import Migrate
from src.config import Config
from src.db import db
from src.cache import cache


migrate = Migrate()


def create_app():
    """App factory pattern for creating Flask app instances."""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    os.makedirs(app.config["INSTANCE_DIR"], exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)

    with app.app_context():
        db.create_all()

        # Deferred import to avoid circular 
        # dependency with lesson/models
        from .api.blueprints import all_blueprints
        for bp in all_blueprints:
            app.register_blueprint(bp)

    return app
