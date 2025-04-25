## Backend Dev Guide

Core application logic for handling phonetic data, quizzes, and language models. It uses Flask, SQLAlchemy, and Alembic for migrations.

### Quick Start
---
For a complete automated setup:

```bash
make bootstrap
```

This will:
1. Set up the Python environment
2. Install dependencies
3. Initialize the database
4. Configure the CLI tool

After bootstrap completes, if needed, run:

```bash
phonolab backsync
```

### Manual Setup
---
If you prefer step-by-step setup:

```bash
make setup
```

This performs the same steps as bootstrap but with more visibility into each step.


### Available Commands
---
<details>
<summary><b>Environment Setup</b></summary>

| Command | Description |
|---------|-------------|
| `make bootstrap` | One-liner: Full automated setup |
| `make setup` | Step-by-step: Environment + CLI helper |
| `make setup-cli` | CLI setup only |
| `make venv` | Create Python virtual environment |
| `make install` | Install dependencies |
</details>

<details>
<summary><b>Database Management</b></summary>

| Command | Description |
|---------|-------------|
| `make db-init` | Create migration folder |
| `make migrate` | Apply database migrations |
| `make seed` | Seed the database with test data |
| `make clean` | Remove database and migration folder |
| `make reset-db` | Full clean + setup (fresh start) |
</details>

<details>
<summary><b>Development</b></summary>

| Command | Description |
|---------|-------------|
| `make run` | Run backend development server |
| `make backsync` | Sync backend changes (after git pull) |
| `make help` | Show available commands |
</details>

<!-- ### CLI Tool
---
The `phonolab` CLI tool is installed during setup and provides commands for managing the application:

```bash
# List all database entities
phonolab db list

# List phonemes
phonolab phoneme list

# List word examples
phonolab phoneme list --words

# List quizzes
phonolab quiz list

# List lessons
phonolab lesson list
``` -->

### Project Structure
---
<details>
<summary><b>Directory Structure</b></summary>

```
phonolab/
├── backend/
│   ├── migrations/           # Alembic migration files
│   ├── scripts/              # Seed and utility scripts
│   ├── instance/             # SQLite DB and instance configs
│   ├── src/                  # Backend source code
│   │   ├── api/              # Flask routes
│   │   ├── app.py            # Application entry point
│   │   ├── config.py         # App config
│   │   ├── models/           # SQLAlchemy models
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helpers and formatting
│   ├── server.py             # Flask server entry point
│   ├── requirements.txt      # Project dependencies
│   ├── setup.py              # Editable install
│   └── setup.cfg             # Linting and formatting rules
```
</details>

### Environment Requirements
---
- Python 3.13.2
- pyenv with pyenv-virtualenv
- pip

### Troubleshooting
---
<details>
<summary><b>Common Issues and Solutions</b></summary>

If you encounter issues with the setup:

1. Ensure pyenv and pyenv-virtualenv are properly installed
2. Check that your shell initialization files are correctly configured
3. Try running the individual scripts in the `scripts/` directory manually

For persistent issues, run:

```bash
make clean
make bootstrap
```
</details>

### Development Workflow
---
<details>
<summary><b>Adding New Models</b></summary>

1. Create the model in `src/models/`
2. Write logic in `services/` if needed
3. Add routes under `api/`
4. Create tests under `tests/`
</details>

<details>
<summary><b>Git Workflow</b></summary>

1. Branch off `dev`
2. Use descriptive names like `feature/quiz-api`
3. Open PRs into `dev`
4. Tag teammates for review
5. Merge into `main` when stable
</details>

<details>
<summary><b>Pull Request Template</b></summary>

```
## What does this PR do?
<!-- Description -->

## How to test?
<!-- Steps -->
```
</details>

### API Documentation
---
See [API_DOCS.md](backend/API_DOCS.md) for detailed API documentation.

### Contributors
---
- Phonolab Team
