PYENV_NAME := phonolab-env
PYTHON_VERSION := 3.13.2

export FLASK_APP := server:create_app
export FLASK_ENV := development

.PHONY: setup setup-cli venv install db-init migrate seed run clean reset-db \
        cli-path backsync help bootstrap

# ----------------------------
#  Bootstrap (Full Auto Setup)
# ----------------------------

bootstrap:
	@echo "[] Running full bootstrap..."
	@bash scripts/init.sh
	@bash scripts/install.sh
	@read -r OS SHELL_ID <<< "$$(bash scripts/detect_env.sh | awk '{ print $$2 }')"; \
	bash scripts/export_path.sh "$$OS" "$$SHELL_ID"
	@echo "[] Bootstrap finished! Run: phonolab backsync"

# ----------------------------
#  Main Setup & CLI (Manual)
# ----------------------------

setup: cli-path venv install db-init migrate seed
	@echo ""
	@echo "[] Setup complete!"
	@echo "[] To sync backend updates, run:"
	@echo "    phonolab backsync"
	@echo ""

cli-path:
	@bash scripts/export_path.sh "$$(bash scripts/detect_env.sh | awk '/^OS_ID/ {print $$2}')" \
	                             "$$(bash scripts/detect_env.sh | awk '/^SHELL_ID/ {print $$2}')"

setup-cli: cli-path

backsync:
	bin/phonolab backsync

help:
	@echo ""
	@echo "Available commands:"
	@echo "  make bootstrap      # One-liner: Full automated setup"
	@echo "  make setup          # Step-by-step: Env + CLI helper"
	@echo "  make setup-cli      # CLI setup only"
	@echo "  make backsync       # Run 'phonolab backsync'"
	@echo "  make run            # Run backend dev server"
	@echo "  make clean          # Remove DB and migration folder"
	@echo "  make reset-db       # Full clean + setup"
	@echo "  make db-init        # Create migration folder"
	@echo "  make migrate        # Apply DB migrations"
	@echo "  make seed           # Seed the DB with test data"

# ----------------------------
#  Python Environment & Backend Tasks
# ----------------------------

venv:
	@echo "🌀 Creating virtual environment..."
	cd backend && pyenv virtualenv $(PYTHON_VERSION) $(PYENV_NAME) || true
	cd backend && pyenv local $(PYENV_NAME)

install:
	@echo "📦 Installing requirements..."
	cd backend && pip install --upgrade pip && pip install -e .[dev]

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
