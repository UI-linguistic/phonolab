# src/app.py
from flask import Flask
from flask_migrate import Migrate

from .api.blueprints import all_blueprints
from .config import Config
from .db import db
from .cache import cache


migrate = Migrate()


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)

    with app.app_context():
        db.create_all()

    for bp in all_blueprints:
        app.register_blueprint(bp)

    return app
