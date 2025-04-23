PYENV_NAME := phonolab-env
PYTHON_VERSION := 3.13.2

export FLASK_APP := server:create_app
export FLASK_ENV := development

.PHONY: setup venv install db-init migrate seed run clean reset-db

setup: venv install db-init migrate seed

venv:
	@echo "🌀 Creating virtual environment..."
	pyenv virtualenv $(PYTHON_VERSION) $(PYENV_NAME) || true
	pyenv local $(PYENV_NAME)

install:
	@echo "📦 Installing requirements..."
	pip install --upgrade pip
	pip install -r backend/requirements.txt

db-init:
	@echo "📁 Ensuring migrations folder exists..."
	cd backend && test -d migrations || flask db init

migrate:
	@echo "🗃️  Applying migrations..."
	cd backend && flask db upgrade

seed:
	@echo "🌱 Seeding database..."
	python backend/scripts/seed_vowels.py
	python backend/scripts/seed_word_examples.py
	python backend/scripts/seed_quiz.py

run:
	@echo "🚀 Running dev server..."
	python backend/server.py

clean:
	@echo "🧹 Cleaning database and migrations..."
	rm -f backend/instance/phonolab.db
	rm -rf backend/migrations

reset-db: clean setup
