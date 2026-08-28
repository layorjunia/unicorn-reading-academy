#!/bin/bash
# Double-click to preview Reading Star locally and open it in your browser.
# Ctrl-C in this window (or just close it) stops the server.
cd "$(dirname "$0")" || exit 1

PORT=8777
# If something is already on the port, reuse it rather than failing.
if ! curl -s -o /dev/null "http://localhost:$PORT/index.html"; then
  python3 -m http.server "$PORT" >/dev/null 2>&1 &
  SERVER=$!
  trap 'kill $SERVER 2>/dev/null' EXIT
  sleep 1
fi

echo ""
echo "  Reading Star  →  http://localhost:$PORT/"
echo "  Unicorn Island →  http://localhost:$PORT/classic/"
echo ""
echo "  Note: the microphone needs HTTPS or localhost — localhost is fine,"
echo "  so listening works here. Close this window to stop."
echo ""
open "http://localhost:$PORT/"
wait
