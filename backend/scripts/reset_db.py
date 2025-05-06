import os
import shutil
import subprocess

DB_PATH = "instance/phonolab.db"
MIGRATIONS_DIR = "migrations/versions"

def run(cmd):
    print(f"💻 Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

def reset_database():
    if os.path.exists(DB_PATH):
        print("🗑️ Removing old database...")
        os.remove(DB_PATH)
    else:
        print("ℹ️ No existing database found.")

def clear_migrations():
    if os.path.exists(MIGRATIONS_DIR):
        print("🧹 Clearing migration history...")
        shutil.rmtree(MIGRATIONS_DIR)
        os.makedirs(MIGRATIONS_DIR)
        # Keep Alembic boilerplate files
        for f in ["README", "env.py", "script.py.mako"]:
            shutil.copy(f"migrations/{f}", f"{MIGRATIONS_DIR}/../{f}")
    else:
        print("ℹ️ No migration directory found.")

def recreate_migrations():
    print("📦 Generating fresh migration...")
    run("flask db revision --autogenerate -m 'Initial schema'")

def upgrade_db():
    print("⬆️ Applying migrations...")
    run("flask db upgrade")

def seed():
    print("🌱 Seeding database...")
    run("python scripts/seed_data.py")

if __name__ == "__main__":
    reset_database()
    clear_migrations()
    recreate_migrations()
    upgrade_db()
    seed()
