#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"
cd ../backend

if [ ! -f "setup.py" ] || [ ! -d "src" ]; then
    echo "Error: This script must be run from the project root." 
    echo "'backend/' directory structure not found."
    exit 1
fi

# Step 1: Install dependencies
echo "Installing dependencies..."
pip install -e .[dev]

# Step 2: Setup Flask env
export FLASK_APP=src/app.py

# Step 3: Handle migrations
echo "Checking migrations..."
if [ ! -d "migrations" ]; then
    echo "No migration folder found. Initializing..."
    flask db init
fi

flask db migrate -m "Initial migration" || echo "Migration skipped (maybe already up to date)"
flask db upgrade

# Step 4: Seed the database
echo "🌱 Seeding database..."
phoneme --seed-all
