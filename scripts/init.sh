#!/usr/bin/env bash

set -e

source scripts/detect_env.sh

PYENV_NAME="phonolab-env"
PYTHON_VERSION="3.13.2"

# Step 1: Check Python
if ! command -v python3 &>/dev/null; then
    echo "Python not found. Please install Python 3 first." >&2
    exit 1
fi

# Step 2: Check pyenv-virtualenv
if ! command -v pyenv &>/dev/null; then
    echo "pyenv not found. Please install pyenv and pyenv-virtualenv." >&2
    echo "OS-specific guide: https://github.com/pyenv/pyenv?tab=readme-ov-file#${OS_ID}" >&2
    echo "Shell-specific guide: https://github.com/pyenv/pyenv?tab=readme-ov-file#${SHELL_ID}" >&2
    exit 1
fi

cd backend

if [ ! -f "setup.py" ] || [ ! -d "src" ]; then
    echo "Error: This script must be run from the project root." 
    echo "'backend/' directory structure not found."
    exit 1
fi

# Step 3: Create virtualenv if needed
if ! pyenv versions --bare | grep -q "^$PYENV_NAME$"; then
    echo "Creating virtualenv $PYENV_NAME..."
    pyenv virtualenv "$PYTHON_VERSION" "$PYENV_NAME"
fi

# Step 4: Set local version
pyenv local "$PYENV_NAME"
echo "Virtualenv '$PYENV_NAME' set for this directory."

# Step 5: Activate environment (only if not already active)
if [[ -z "$VIRTUAL_ENV" || "$VIRTUAL_ENV" != *"$PYENV_NAME"* ]]; then
    echo "Activating environment '$PYENV_NAME'..."

    if [[ "$SHELL_ID" == "fish" ]]; then
        echo "Fish shell detected."
        echo "Read: https://github.com/pyenv/pyenv#fish"
        # pyenv activate "$PYENV_NAME" || {
        #     echo "Failed to activate with pyenv."
        #     echo "Try manually running: pyenv activate $PYENV_NAME"
        #     exit 1
        #     }
        exit 1
    else
        eval "$(pyenv init -)"
        eval "$(pyenv virtualenv-init -)"
        pyenv activate "$PYENV_NAME"
    fi
else
    echo "Environment '$PYENV_NAME' is already active."
fi
