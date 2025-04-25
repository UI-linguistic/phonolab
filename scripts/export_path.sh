#!/usr/bin/env bash
set -e

# Validate args
OS="$1"
SHELL_NAME="$2"

if [[ -z "$OS" || -z "$SHELL_NAME" ]]; then
    echo "[] Usage: $0 <OS> <SHELL_NAME>" >&2
    exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="$PROJECT_ROOT/bin"

echo ""
echo "[] Setting up phonolab CLI (phonolab backsync)..."
export PATH="$BIN_DIR:$PATH"
echo "[] Temporary access granted for this terminal session."
echo ""

# -----------------------------
# Platform-Specific Instructions
# -----------------------------
case "$OS" in
  Linux | macOS)
    case "$SHELL_NAME" in
      bash|zsh)
        CONFIG_FILE="$HOME/.${SHELL_NAME}rc"
        echo "[] To make this permanent, add this to $CONFIG_FILE:"
        echo "    export PATH=\"$BIN_DIR:\$PATH\""
        ;;
      fish)
        echo "[] Fish shell detected. To persist, run:"
        echo "    set -Ux fish_user_paths \"$BIN_DIR\" \$fish_user_paths"
        ;;
      *)
        echo "[] Unrecognized shell. Manually add this to your shell config:"
        echo "    export PATH=\"$BIN_DIR:\$PATH\""
        ;;
    esac
    ;;
  Windows)
    echo "[] Windows (Git Bash) detected."
    echo "[] Add this to your ~/.bash_profile or ~/.bashrc:"
    echo "    export PATH=\"$BIN_DIR:\$PATH\""
    echo ""
    echo "[] If using PowerShell, run this:"
    echo "    \$env:Path = \"$BIN_DIR;\" + \$env:Path"
    echo "Or permanently add with:"
    echo "    [Environment]::SetEnvironmentVariable(\"Path\", \"$BIN_DIR;\" + \$env:Path, [System.EnvironmentVariableTarget]::User)"
    ;;
  *)
    echo "[] Unknown OS. Please manually add this to your shell config:"
    echo "    export PATH=\"$BIN_DIR:\$PATH\""
    ;;
esac

echo ""
echo "[] You can now run:"
echo "    phonolab backsync"
echo "[] Restart your shell or run \`source ~/.${SHELL_NAME}rc\` to apply changes."
echo ""
