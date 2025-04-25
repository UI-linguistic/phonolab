#!/usr/bin/env bash

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)   OS="Linux" ;;
    Darwin*)  OS="macOS" ;;
    CYGWIN*|MINGW*|MSYS*) OS="Windows" ;;
    *)        OS="Unknown" ;;
esac

# Detect current shell
SHELL_ID=$(basename "$SHELL")
case "$SHELL_ID" in
    bash) SHELL_ID="bash" ;;
    zsh)  SHELL_ID="zsh" ;;
    fish) SHELL_ID="fish" ;;
    *)    SHELL_ID="unknown" ;;
esac

export OS
export SHELL_NAME
