#!/usr/bin/env python3
"""Stamp the Reading Star build id into index.html, sw.js and version.json.

Same self-healing update scheme as the classic app: the build id busts every
asset URL, renames the service worker cache, and version.json (never cached)
tells a stale client to reload itself once.

  python3 dev/stamp.py
"""
import datetime
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    sha = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'],
                         capture_output=True, text=True, cwd=ROOT).stdout.strip() or 'nogit'
    build = datetime.datetime.now().strftime('%Y%m%d-%H%M') + '-' + sha

    p = os.path.join(ROOT, 'index.html')
    s = open(p, encoding='utf-8').read()
    s = re.sub(r'(name="build" content=")[^"]*(")', r'\g<1>' + build + r'\2', s)
    s = re.sub(r'\?v=[A-Za-z0-9.-]+', '?v=' + build, s)
    open(p, 'w', encoding='utf-8').write(s)

    p = os.path.join(ROOT, 'sw.js')
    s = open(p, encoding='utf-8').read()
    s = re.sub(r"const CACHE = 'rs-[^']*'", "const CACHE = 'rs-" + build + "'", s)
    open(p, 'w', encoding='utf-8').write(s)

    open(os.path.join(ROOT, 'version.json'), 'w').write(
        '{"build": "%s"}\n' % build)
    print('build', build)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
