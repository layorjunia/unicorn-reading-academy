#!/usr/bin/env python3
"""Local server for the sound-recording rig.

Serves the project (so the rig can play the app's real word clips as
pronunciation anchors) and accepts recordings:

  GET  /                          -> redirects to the rig
  GET  /tools/record-sounds.html  -> the rig UI
  GET  /rig-status                -> {raw: [ids on disk], imported: [ids in manifest]}
  POST /save?item=<id>            -> body is a WAV; written to recordings/raw/<id>.wav

Recordings land in recordings/raw/ as plain WAVs. Nothing touches the app's
audio/ directory until tools/import_sounds.py validates and imports them.

  python3 tools/record_server.py            # http://localhost:8788
"""
import json
import os
import re
import sys
import tempfile
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

RAW = os.path.join(ROOT, 'recordings', 'raw')
os.makedirs(RAW, exist_ok=True)

PORT = 8788
SAFE_ID = re.compile(r'^[a-z0-9-]{1,40}$')


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        pass  # keep the terminal quiet during a recording session

    def _json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/':
            self.send_response(302)
            self.send_header('Location', '/tools/record-sounds.html')
            self.end_headers()
            return
        if self.path == '/rig-status':
            raw = sorted(f[:-4] for f in os.listdir(RAW) if f.endswith('.wav'))
            imported = []
            mp = os.path.join(ROOT, 'audio', 'manifest.json')
            if os.path.exists(mp):
                m = json.load(open(mp))
                imported = sorted((m.get('snd') or {}).keys())
            return self._json({'raw': raw, 'imported': imported})
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith('/save'):
            return self._json({'error': 'unknown endpoint'}, 404)
        # Only the rig itself may save. A no-preflight cross-origin POST from
        # any random page in any browser on this machine would otherwise be
        # able to overwrite recordings while the booth is running.
        origin = self.headers.get('Origin', '')
        if origin and origin not in (f'http://localhost:{PORT}',
                                     f'http://127.0.0.1:{PORT}'):
            return self._json({'error': 'forbidden origin'}, 403)
        m = re.search(r'[?&]item=([^&]+)', self.path)
        item = m.group(1) if m else ''
        if not SAFE_ID.match(item):
            return self._json({'error': 'bad item id'}, 400)
        n = int(self.headers.get('Content-Length', 0))
        if not 44 < n < 50_000_000:
            return self._json({'error': 'bad size'}, 400)
        data = self.rfile.read(n)
        if data[:4] != b'RIFF':
            return self._json({'error': 'not a WAV'}, 400)
        path = os.path.join(RAW, item + '.wav')
        # atomic: a half-written file must never sit at the final path where
        # a concurrent import could read it
        tmp = path + '.part'
        with open(tmp, 'wb') as f:
            f.write(data)
        os.replace(tmp, path)
        self._json({'saved': os.path.relpath(path, ROOT), 'bytes': n})


def main():
    srv = HTTPServer(('127.0.0.1', PORT), Handler)
    print(f'Recording rig: http://localhost:{PORT}/')
    print(f'Recordings save to {os.path.relpath(RAW, ROOT)}/ — Ctrl+C to stop.')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == '__main__':
    sys.exit(main())
