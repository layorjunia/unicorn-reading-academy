#!/bin/bash
# Double-click to regenerate content.js from the word banks, sight-word lists
# and authored corpus, then audit it. Safe to run any time.
cd "$(dirname "$0")" || exit 1
echo "Rebuilding content…"
python3 dev/build_content.py .work/corpus.json
echo ""
echo "Auditing…"
python3 dev/audit_content.py
echo ""
echo "Done. Press any key to close."
read -n 1 -s
