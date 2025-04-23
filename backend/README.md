## Phonolab Backend

The **Phonolab backend** provides core application logic for handling phonetic data, quizzes, and language models. It uses Flask, SQLAlchemy, and Alembic for migrations.

---

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone <repo-url>
cd phonolab
```

#### 2. Create and Activate Virtual Environment

```bash
pyenv virtualenv 3.13.2 phonolab-env
pyenv local phonolab-env
```

> **Note:** This project uses [pyenv](https://github.com/pyenv/pyenv) + [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv). Ensure both are installed.

---

#### 3. [EASY INSTALL]

Use the Makefile on phonolab directory for a smooth setup:

```bash
make setup
```

This will:
- Create the virtual environment (if needed)
- Install dependencies from `backend/requirements.txt`
- Apply database migrations
- Seed the database with phonemes, word examples, and quiz data

---

### 🗂️ Project Structure

```
phonolab/
├── backend/
│   ├── migrations/           # Alembic migration files
│   ├── scripts/              # Seed and utility scripts
│   ├── instance/             # SQLite DB and instance configs
│   ├── src/                  # Backend source code
│   │   ├── api/              # Flask routes
│   │   ├── app.py                # Application entry point
│   │   ├── config.py         # App config
│   │   ├── models/           # SQLAlchemy models
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helpers and formatting
│   ├── server.py             # Flask server entry point
│   ├── requirements.txt      # Project dependencies
│   ├── setup.py              # Editable install
│   └── setup.cfg             # Linting and formatting rules
```

---

### Usage

#### Running the Dev Server

```bash
python backend/server.py
```

---

### Testing

Run all tests:

```bash
pytest
```

Run tests with coverage:

```bash
pytest --cov=src tests/
```

Generate HTML coverage report:

```bash
pytest --cov=src --cov-report=html tests/
```

---

### Development Workflow

#### Adding New Models

1. Create the model in `src/models/`
2. Write logic in `services/` if needed
3. Add routes under `api/`
4. Create tests under `tests/`

#### Git Workflow

1. Branch off `dev`
2. Use descriptive names like `feature/quiz-api`
3. Open PRs into `dev`
4. Tag teammates for review
5. Merge into `main` when stable

---

### Pull Request Template

```
## What does this PR do?

<!-- Description -->

## How to test?

<!-- Steps -->
```



## Contributors

- Phonolab Team
