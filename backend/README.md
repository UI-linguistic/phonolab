# Phonolab Backend

The Phonolab backend provides the core functionality applicaiton logic and handling phonetic data.


## Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <repo-url>
cd phonolab/backend
```

### 2. Create a Virtual Environment

```bash
pyenv virtualenv 3.13.2 phonolab-env
```
```bash
pyenv local phonolab-env
```
### 3. Install Dependencies

```bash
pip install -e .
```

## Sample Backend Structure

```
backend/
├── src/                  # Source code
│   ├── models/           # Data models
│   │   ├── phoneme.py    # Phoneme schema
│   │   ├── quiz.py       
│   │   └── dataset.py    
│   ├── app.py            # Application entry point
│   └── config.py         # Configuration
├── tests/                # Test suite
│   ├── conftest.py       # Test configuration
│   └── test_phoneme.py   # Phoneme tests
└── requirements.txt      # Project dependencies
```

## Usage

### Running the Application

```bash
# TBD
```

### Running Tests
Run all tests
```bash
pytest
```
Run tests with coverage
```bash
pytest --cov=src tests/
```
Generate HTML coverage report
```bash
pytest --cov=src --cov-report=html tests/
```

## Development

### Adding New Models

1. Create a new model file in the `src/models/` directory
2. Add test fixtures in `tests/fixtures.py`
3. Create tests in the `tests/` directory only

### Git Workflow
1. Always create feature branches from `dev`
2. Name branches with corresponding feature: `login-page`
3. Create a PR to merge back to `dev`
4. Request reviews
5. Merge to `main` only feature is stable

### Pull Requests
Sample PR description:

```
## What does this PR do?

<!-- Brief description of changes -->

## How to test?

<!-- Steps to test the changes (if applicable) -->
```

### Code Style
- PEP 8 guidelines
- Run linting before submitting PRs:
    ```bash
    pylint src/
    pycodestyle src/
    ```

### CI
- Tests run automatically on PRs to `main` and `develop`
- PRs cannot be merged if tests fail

<br>

## Contributors

- Phonolab Team