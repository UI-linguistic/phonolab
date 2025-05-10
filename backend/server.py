# backend/server.py

from flask_cors import CORS
from src.app import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.shell_context_processor
def make_shell_context():
    return {"db": db}

if __name__ == "__main__":
    app.run(debug=True, port=5001)
