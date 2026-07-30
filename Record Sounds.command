#!/bin/bash
# One-click sound-recording booth for Unicorn Reading Academy.
# Starts the local rig server and opens the recording page.
cd "$(dirname "$0")"
echo "Starting the recording booth..."
( sleep 1; open "http://localhost:8788/" ) &
exec python3 tools/record_server.py
