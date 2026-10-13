#!/bin/sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
cd "$SCRIPT_DIR"
{ cat part1.html; echo '<script>'; grep -v "^if(typeof module" session-scoring.js; grep -v "^if(typeof module" questions.js; cat app.js; echo '</script>'; echo '</body>'; echo '</html>'; } > "$ROOT_DIR/index.html"
