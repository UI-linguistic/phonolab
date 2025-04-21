# app.py
from flask import Flask
from .api.blueprints import all_blueprints

app = Flask(__name__)

for bp in all_blueprints:
    app.register_blueprint(bp)
